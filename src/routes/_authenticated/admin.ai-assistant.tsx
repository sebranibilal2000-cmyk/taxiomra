import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { aiChat, listAiConversations, getAiConversation } from "@/lib/ai-assistant.functions";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/ai-assistant")({ component: AiAssistantPage });

type Msg = { role: "user" | "assistant" | "tool" | "system"; content: any; created_at: string };

function AiAssistantPage() {
  const qc = useQueryClient();
  const chatFn = useServerFn(aiChat);
  const listFn = useServerFn(listAiConversations);
  const getFn = useServerFn(getAiConversation);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const convs = useQuery({ queryKey: ["ai-convs"], queryFn: () => listFn() });
  const messages = useQuery({
    queryKey: ["ai-conv", activeId],
    queryFn: () => activeId ? getFn({ data: { id: activeId } }) : Promise.resolve([]),
    enabled: !!activeId,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.data, activeId]);

  const send = useMutation({
    mutationFn: async (message: string) => chatFn({ data: { conversation_id: activeId, message } }),
    onSuccess: (res) => {
      setActiveId(res.conversation_id);
      qc.invalidateQueries({ queryKey: ["ai-convs"] });
      qc.invalidateQueries({ queryKey: ["ai-conv", res.conversation_id] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Chat failed"),
  });

  const submit = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    send.mutate(text);
  };

  const visible: Msg[] = (messages.data ?? []).filter((m: any) => m.role === "user" || m.role === "assistant") as Msg[];

  return (
    <div>
      <PageHeader title="AI Assistant" description="Read-only operations copilot. Ask about bookings, customers, drivers, revenue, and conflicts." />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        <aside className="border rounded-lg p-3 flex flex-col overflow-hidden">
          <Button size="sm" variant="outline" className="mb-3" onClick={() => setActiveId(undefined)}>
            <Plus className="h-4 w-4 me-1" /> New chat
          </Button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {(convs.data ?? []).map((c: any) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn("w-full text-start px-3 py-2 rounded text-sm hover:bg-muted", activeId === c.id && "bg-muted font-medium")}
              >
                <div className="truncate">{c.title || "Untitled"}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(c.updated_at).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </aside>
        <section className="border rounded-lg flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {visible.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>Ask me things like:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>"Show today's activity"</li>
                  <li>"Any scheduling conflicts this week?"</li>
                  <li>"Find bookings for +9665… "</li>
                  <li>"Revenue this month"</li>
                  <li>"Which drivers are available now?"</li>
                </ul>
              </div>
            )}
            {visible.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                <div className={cn("h-8 w-8 rounded-full grid place-items-center shrink-0", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn("rounded-lg px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {typeof m.content === "string" ? m.content : m.content?.text ?? ""}
                </div>
              </div>
            ))}
            {send.isPending && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full grid place-items-center bg-muted"><Bot className="h-4 w-4" /></div>
                <div className="rounded-lg px-4 py-2 bg-muted text-sm"><Loader2 className="h-4 w-4 animate-spin inline me-2" /> Thinking…</div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="border-t p-3 flex gap-2 bg-background">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Ask about bookings, customers, revenue…"
              rows={2}
              className="resize-none"
              disabled={send.isPending}
            />
            <Button type="submit" disabled={send.isPending || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </section>
      </div>
    </div>
  );
}
