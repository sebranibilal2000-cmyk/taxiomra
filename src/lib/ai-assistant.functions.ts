// AI staff assistant — server functions.
// Uses Lovable AI Gateway (OpenAI-compatible chat completions) with tool
// calling. Tools query the DB via the caller's authenticated Supabase client
// so RLS is respected — the AI can never see rows the operator can't.
// The AI never mutates data; all tools are read-only.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Types ----------
type ChatMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: any[] }
  | { role: "tool"; tool_call_id: string; content: string };

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash"; // fast, tool-capable, low cost

const SYSTEM_PROMPT = `You are the internal operations assistant for a chauffeur/taxi company's admin dashboard.
You help staff (dispatchers, managers, accountants) find bookings, customers, drivers, vehicles, and understand today's activity and revenue.

Rules:
- ALWAYS use the provided tools to answer questions about live data. Never fabricate booking codes, names, or numbers.
- If a tool returns no results, say so plainly.
- Format prices with the currency returned by the tool.
- Keep answers concise; use short bullet points for lists.
- You NEVER modify data. If a user asks you to "create", "cancel", "assign" or "delete" — reply that you can only search and analyze, and suggest they perform the action in the admin UI.
- Today's date is ${new Date().toISOString().slice(0, 10)}.`;

// ---------- Tool schemas exposed to the model ----------
const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_bookings",
      description: "Search bookings by free text (code, pickup, dropoff, customer name/phone), status, or date range. Returns up to 15 rows.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Free-text match (booking code, pickup/dropoff, name, phone)." },
          status: { type: "string", description: "Optional booking status filter" },
          from_date: { type: "string", description: "ISO date lower bound for pickup_at" },
          to_date: { type: "string", description: "ISO date upper bound for pickup_at" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_customer",
      description: "Find customers by name, phone, or email. Returns up to 10 rows with lifetime value and last booking.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_driver",
      description: "Find drivers by name, phone, or license. Returns status, current shift, ratings.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "todays_activity",
      description: "Summarise today's bookings, revenue, on-trip drivers, cancellations. Takes no arguments.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "revenue_summary",
      description: "Revenue, invoice, and payment totals for a period. Defaults to current month.",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", enum: ["today", "week", "month", "year"] },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "available_drivers",
      description: "List drivers that are currently available or off-duty and could be assigned. Optionally filter by vehicle category.",
      parameters: {
        type: "object",
        properties: { category_id: { type: "string" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "detect_conflicts",
      description: "Detect scheduling conflicts (same driver or vehicle booked at overlapping times) in the next N days (default 3).",
      parameters: {
        type: "object",
        properties: { days: { type: "number" } },
      },
    },
  },
] as const;

// ---------- Tool implementations (RLS-scoped) ----------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;

async function toolSearchBookings(sb: Supa, args: any) {
  let q = sb.from("bookings")
    .select("id,code,status,pickup_at,pickup_location,dropoff_location,total_fare,currency,customer:customers(name,phone),driver:drivers(name)")
    .order("pickup_at", { ascending: false })
    .limit(15);
  if (args.status) q = q.eq("status", args.status);
  if (args.from_date) q = q.gte("pickup_at", args.from_date);
  if (args.to_date) q = q.lte("pickup_at", args.to_date);
  if (args.query) {
    const s = String(args.query);
    q = q.or(`code.ilike.%${s}%,pickup_location.ilike.%${s}%,dropoff_location.ilike.%${s}%`);
  }
  const { data, error } = await q;
  if (error) return { error: error.message };
  return { count: data?.length ?? 0, rows: data ?? [] };
}

async function toolFindCustomer(sb: Supa, args: any) {
  const s = String(args.query ?? "");
  const { data, error } = await sb.from("customers")
    .select("id,name,phone,email,tier,total_trips,total_spent,last_booking_at")
    .or(`name.ilike.%${s}%,phone.ilike.%${s}%,email.ilike.%${s}%`)
    .limit(10);
  if (error) return { error: error.message };
  return { count: data?.length ?? 0, rows: data ?? [] };
}

async function toolFindDriver(sb: Supa, args: any) {
  const s = String(args.query ?? "");
  const { data, error } = await sb.from("drivers")
    .select("id,name,phone,license_number,status,rating,total_trips,completed_trips")
    .or(`name.ilike.%${s}%,phone.ilike.%${s}%,license_number.ilike.%${s}%`)
    .limit(10);
  if (error) return { error: error.message };
  return { count: data?.length ?? 0, rows: data ?? [] };
}

async function toolTodaysActivity(sb: Supa) {
  const today = new Date(); today.setHours(0,0,0,0);
  const iso = today.toISOString();
  const [{ data: bookings }, { data: onTrip }, { data: cancelled }] = await Promise.all([
    sb.from("bookings").select("total_fare,currency,status").gte("pickup_at", iso),
    sb.from("bookings").select("id").in("status", ["on_trip","picked_up","assigned","started"]).gte("pickup_at", iso),
    sb.from("bookings").select("id").eq("status", "cancelled").gte("pickup_at", iso),
  ]);
  const total = (bookings ?? []).length;
  const completed = (bookings ?? []).filter((b: any) => b.status === "completed");
  const revenue = completed.reduce((s: number, b: any) => s + Number(b.total_fare || 0), 0);
  const currency = (completed[0] as any)?.currency ?? "SAR";
  return {
    total_bookings: total,
    completed: completed.length,
    on_trip: (onTrip ?? []).length,
    cancelled: (cancelled ?? []).length,
    revenue,
    currency,
  };
}

async function toolRevenueSummary(sb: Supa, args: any) {
  const now = new Date();
  const from = new Date(now);
  const period = args.period ?? "month";
  if (period === "today") from.setHours(0,0,0,0);
  else if (period === "week") from.setDate(now.getDate() - 7);
  else if (period === "year") from.setMonth(0, 1);
  else from.setDate(1); // month
  from.setHours(0,0,0,0);

  const [{ data: paid }, { data: invoices }] = await Promise.all([
    sb.from("payments").select("amount,paid_amount,currency,status").gte("created_at", from.toISOString()),
    sb.from("invoices").select("total_amount,status").gte("created_at", from.toISOString()),
  ]);
  const collected = (paid ?? []).filter((p: any) => p.status === "paid").reduce((s: number, p: any) => s + Number(p.paid_amount || p.amount || 0), 0);
  const outstanding = (invoices ?? []).filter((i: any) => i.status !== "paid" && i.status !== "cancelled").reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0);
  return {
    period,
    from: from.toISOString().slice(0, 10),
    collected,
    outstanding,
    invoices_issued: (invoices ?? []).length,
    currency: (paid?.[0] as any)?.currency ?? "SAR",
  };
}

async function toolAvailableDrivers(sb: Supa, args: any) {
  let q = sb.from("drivers")
    .select("id,name,phone,status,rating,total_trips")
    .in("status", ["available", "off_duty"])
    .order("rating", { ascending: false })
    .limit(15);
  if (args.category_id) q = q.eq("preferred_category_id", args.category_id);
  const { data, error } = await q;
  if (error) return { error: error.message };
  return { count: data?.length ?? 0, drivers: data ?? [] };
}

async function toolDetectConflicts(sb: Supa, args: any) {
  const days = Math.min(30, Math.max(1, Number(args.days ?? 3)));
  const now = new Date();
  const until = new Date(now.getTime() + days * 86400_000);
  const { data, error } = await sb.from("bookings")
    .select("id,code,pickup_at,driver_id,vehicle_id,customer:customers(name)")
    .gte("pickup_at", now.toISOString())
    .lte("pickup_at", until.toISOString())
    .not("driver_id", "is", null)
    .order("pickup_at");
  if (error) return { error: error.message };
  const rows = data ?? [];
  const conflicts: any[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a: any = rows[i], b: any = rows[j];
      const gap = Math.abs(new Date(a.pickup_at).getTime() - new Date(b.pickup_at).getTime());
      if (gap > 2 * 3600_000) continue;
      if (a.driver_id === b.driver_id || (a.vehicle_id && a.vehicle_id === b.vehicle_id)) {
        conflicts.push({ a: a.code, b: b.code, same: a.driver_id === b.driver_id ? "driver" : "vehicle", gap_minutes: Math.round(gap / 60000) });
      }
    }
  }
  return { conflicts: conflicts.slice(0, 20), scanned: rows.length };
}

async function runTool(sb: Supa, name: string, args: any) {
  try {
    if (name === "search_bookings") return await toolSearchBookings(sb, args);
    if (name === "find_customer") return await toolFindCustomer(sb, args);
    if (name === "find_driver") return await toolFindDriver(sb, args);
    if (name === "todays_activity") return await toolTodaysActivity(sb);
    if (name === "revenue_summary") return await toolRevenueSummary(sb, args);
    if (name === "available_drivers") return await toolAvailableDrivers(sb, args);
    if (name === "detect_conflicts") return await toolDetectConflicts(sb, args);
    return { error: `Unknown tool ${name}` };
  } catch (e: any) {
    return { error: e?.message ?? "tool_failed" };
  }
}

// ---------- Server function: send a message ----------
const SendInput = z.object({
  conversation_id: z.string().uuid().optional(),
  message: z.string().min(1).max(4000),
});

export const aiChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SendInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    // Ensure conversation exists
    let conversationId = data.conversation_id;
    if (!conversationId) {
      const { data: conv, error } = await supabase
        .from("ai_conversations")
        .insert({ user_id: userId, title: data.message.slice(0, 60) })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      conversationId = conv.id;
    }

    // Load prior history
    const { data: history } = await supabase
      .from("ai_messages")
      .select("role,content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(40);

    // Persist user turn
    await supabase.from("ai_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: { text: data.message },
    });

    // Build model messages
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...((history ?? []).map((m: any) => {
        if (m.role === "assistant") {
          return { role: "assistant", content: m.content?.text ?? "", tool_calls: m.content?.tool_calls } as ChatMessage;
        }
        if (m.role === "tool") {
          return { role: "tool", tool_call_id: m.content?.tool_call_id ?? "", content: JSON.stringify(m.content?.result ?? m.content) } as ChatMessage;
        }
        return { role: m.role as "user" | "system", content: m.content?.text ?? "" } as ChatMessage;
      })),
      { role: "user", content: data.message },
    ];

    // Multi-step tool loop (max 6 steps)
    for (let step = 0; step < 6; step++) {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          tools: TOOLS,
          tool_choice: "auto",
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        if (res.status === 429) throw new Error("AI rate limit — try again shortly.");
        if (res.status === 402) throw new Error("AI credits exhausted — add credits in workspace billing.");
        throw new Error(`AI gateway ${res.status}: ${body.slice(0, 300)}`);
      }
      const json = await res.json() as any;
      const choice = json.choices?.[0]?.message;
      if (!choice) throw new Error("AI returned no message");

      const toolCalls = choice.tool_calls as any[] | undefined;

      if (toolCalls && toolCalls.length > 0) {
        // Persist assistant tool-call turn
        await supabase.from("ai_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: { text: choice.content ?? "", tool_calls: toolCalls },
        });
        messages.push({ role: "assistant", content: choice.content ?? null, tool_calls: toolCalls });

        for (const call of toolCalls) {
          const name = call.function?.name;
          let args: any = {};
          try { args = call.function?.arguments ? JSON.parse(call.function.arguments) : {}; } catch { args = {}; }
          const result = await runTool(supabase, name, args);
          const resultStr = JSON.stringify(result).slice(0, 8000);
          await supabase.from("ai_messages").insert({
            conversation_id: conversationId,
            role: "tool",
            content: { tool_call_id: call.id, name, args, result },
          });
          messages.push({ role: "tool", tool_call_id: call.id, content: resultStr });
        }
        continue; // let model use tool results
      }

      // Final assistant answer
      const text = String(choice.content ?? "");
      await supabase.from("ai_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: { text },
      });
      await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
      return { conversation_id: conversationId, reply: text };
    }

    throw new Error("AI tool loop exceeded step budget");
  });

export const listAiConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("ai_conversations")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .limit(30);
    return data ?? [];
  });

export const getAiConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows } = await context.supabase
      .from("ai_messages")
      .select("role,content,created_at")
      .eq("conversation_id", data.id)
      .order("created_at", { ascending: true });
    return rows ?? [];
  });
