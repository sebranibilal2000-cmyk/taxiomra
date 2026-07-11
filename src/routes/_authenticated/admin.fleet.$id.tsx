import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ExpiryPill, daysUntil } from "@/components/ExpiryPill";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Upload, Download, Trash2, Save, Wrench, ShieldAlert, Gauge, Fuel, Cog, Car } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/fleet/$id")({ component: VehicleProfile });

const VEHICLE_STATUSES = ["active","assigned","on_trip","reserved","maintenance","out_of_service","retired"];
const VEHICLE_DOC_KINDS = ["registration","insurance","permit","inspection","other"] as const;
const MAINT_KINDS = ["oil_change","tire","brake","battery","inspection","repair","service","other"] as const;

function VehicleProfile() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => (await supabase.from("vehicles").select("*, category:vehicle_categories(code, name_en)").eq("id", id).maybeSingle()).data,
  });
  const maint = useQuery({
    queryKey: ["vehicle-maint", id],
    queryFn: async () => (await supabase.from("vehicle_maintenance").select("*").eq("vehicle_id", id).order("performed_at", { ascending: false })).data ?? [],
  });
  const docs = useQuery({
    queryKey: ["vehicle-docs", id],
    queryFn: async () => (await supabase.from("vehicle_documents").select("*").eq("vehicle_id", id).order("expires_on", { ascending: true, nullsFirst: false })).data ?? [],
  });
  const assignments = useQuery({
    queryKey: ["vehicle-assignments", id],
    queryFn: async () => (await supabase.from("driver_vehicle_assignments").select("*, driver:drivers(id, full_name)").eq("vehicle_id", id).order("started_at", { ascending: false }).limit(50)).data ?? [],
  });
  const trips = useQuery({
    queryKey: ["vehicle-trips", id],
    queryFn: async () => (await supabase.from("bookings").select("id, code, status, total_fare, pickup_at, pickup_location, dropoff_location, driver:drivers(full_name)").eq("vehicle_id", id).order("pickup_at", { ascending: false }).limit(100)).data ?? [],
  });

  if (q.isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  if (!q.data) return <div className="p-8"><Button variant="outline" onClick={() => navigate({ to: "/admin/fleet" })}><ArrowLeft className="h-4 w-4 me-2" />Back</Button><div className="mt-4">Vehicle not found</div></div>;

  const v = q.data as any;
  const expiring = [
    { key: "Registration", date: v.registration_expiry },
    { key: "Insurance", date: v.insurance_expiry },
    { key: "Inspection", date: v.inspection_expiry },
    ...(docs.data ?? []).map((x: any) => ({ key: x.title || x.kind, date: x.expires_on })),
  ].filter((x) => x.date && daysUntil(x.date)! <= 30);

  const maintDue = v.next_maintenance_at && daysUntil(v.next_maintenance_at)! <= 14;
  const totalMaintCost = (maint.data ?? []).reduce((s: number, m: any) => s + Number(m.cost ?? 0), 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link to="/admin/fleet"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 me-1" />Fleet</Button></Link>
      </div>

      <PageHeader
        eyebrow="Vehicle profile"
        title={`${v.plate_number} · ${v.make ?? ""} ${v.model ?? ""}`}
        description={v.internal_code ? `Internal ${v.internal_code}${v.vin ? " · VIN " + v.vin : ""}` : v.vin ? `VIN ${v.vin}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge value={v.status} />
            <EditVehicleDialog vehicle={v} onSaved={() => qc.invalidateQueries({ queryKey: ["vehicle", id] })} />
          </div>
        }
      />

      {(expiring.length > 0 || maintDue) && (
        <Card className="mb-6 border-warning/40 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-warning-foreground mt-0.5" />
            <div className="min-w-0 flex-1 space-y-2">
              {maintDue && <div className="text-sm">Next maintenance due <ExpiryPill date={v.next_maintenance_at} /></div>}
              {expiring.length > 0 && (
                <div>
                  <div className="text-sm font-medium">Expiring documents</div>
                  <div className="mt-2 flex flex-wrap gap-2">{expiring.map((e, i) => <ExpiryPill key={i} date={e.date} label={e.key} />)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6 mb-6">
        <StatCard label="Category" value={v.category?.code ?? "—"} icon={Car} />
        <StatCard label="Seats" value={v.seats ?? 4} icon={Car} />
        <StatCard label="Fuel" value={v.fuel_type ?? "—"} icon={Fuel} />
        <StatCard label="Transmission" value={v.transmission ?? "—"} icon={Cog} />
        <StatCard label="Mileage" value={v.current_mileage ? Number(v.current_mileage).toLocaleString() : "—"} icon={Gauge} />
        <StatCard label="Maint. cost" value={totalMaintCost.toFixed(2)} icon={Wrench} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assignments">Drivers</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4 md:grid-cols-2">
          <Card><CardContent className="p-4 space-y-2 text-sm">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Vehicle details</div>
            <Row k="Plate" v={v.plate_number} />
            <Row k="Internal code" v={v.internal_code} />
            <Row k="VIN" v={v.vin} />
            <Row k="Make / Model" v={`${v.make ?? ""} ${v.model ?? ""}`.trim() || null} />
            <Row k="Year" v={v.year} />
            <Row k="Color" v={v.color} />
            <Row k="Seats" v={v.seats} />
            <Row k="Fuel" v={v.fuel_type} />
            <Row k="Transmission" v={v.transmission} />
          </CardContent></Card>
          <Card><CardContent className="p-4 space-y-2 text-sm">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Compliance</div>
            <div className="flex justify-between items-center py-1 border-b border-border/40"><span className="text-muted-foreground">Registration</span><ExpiryPill date={v.registration_expiry} /></div>
            <div className="flex justify-between items-center py-1 border-b border-border/40"><span className="text-muted-foreground">Insurance</span><ExpiryPill date={v.insurance_expiry} /></div>
            <div className="flex justify-between items-center py-1 border-b border-border/40"><span className="text-muted-foreground">Inspection</span><ExpiryPill date={v.inspection_expiry} /></div>
            <Row k="Current mileage" v={v.current_mileage ? Number(v.current_mileage).toLocaleString() + " km" : null} />
            <Row k="Next maint. km" v={v.next_maintenance_km ? Number(v.next_maintenance_km).toLocaleString() + " km" : null} />
            <div className="flex justify-between items-center py-1"><span className="text-muted-foreground">Next maintenance</span><ExpiryPill date={v.next_maintenance_at} /></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <MaintenancePanel vehicleId={id} rows={maint.data ?? []} onChange={() => { qc.invalidateQueries({ queryKey: ["vehicle-maint", id] }); qc.invalidateQueries({ queryKey: ["vehicle", id] }); }} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <VehicleDocsPanel vehicleId={id} docs={docs.data ?? []} onChange={() => qc.invalidateQueries({ queryKey: ["vehicle-docs", id] })} />
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <Card><CardContent className="p-0">
            {(assignments.data ?? []).length === 0 && <div className="p-6 text-sm text-muted-foreground">No driver history.</div>}
            <div className="divide-y">
              {(assignments.data ?? []).map((a: any) => (
                <div key={a.id} className="p-3 flex items-center justify-between">
                  <div>
                    <Link to={"/admin/drivers/$id" as any} params={{ id: a.driver?.id } as any} className="text-sm font-medium hover:text-gold">{a.driver?.full_name ?? "—"}</Link>
                    <div className="text-xs text-muted-foreground">{new Date(a.started_at).toLocaleString()} → {a.ended_at ? new Date(a.ended_at).toLocaleString() : "current"}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="trips" className="mt-4">
          <Card><CardContent className="p-0">
            {(trips.data ?? []).length === 0 && <div className="p-6 text-sm text-muted-foreground">No trips.</div>}
            <div className="divide-y">
              {(trips.data ?? []).map((b: any) => (
                <div key={b.id} className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-mono">{b.code ?? b.id.slice(0,8)}</div>
                    <div className="text-xs text-muted-foreground truncate">{b.pickup_location} → {b.dropoff_location}</div>
                    {b.driver?.full_name && <div className="text-xs">{b.driver.full_name}</div>}
                  </div>
                  <div className="text-end shrink-0">
                    <StatusBadge value={b.status} />
                    <div className="text-xs text-muted-foreground mt-1">{b.pickup_at ? new Date(b.pickup_at).toLocaleString() : "—"}</div>
                    <div className="text-xs">{Number(b.total_fare ?? 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card><CardContent className="p-4">
            <ActivityTimeline entityType="vehicle" entityId={id} />
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ k, v }: { k: string; v: any }) {
  return <div className="flex justify-between gap-3 py-1 border-b border-border/40 last:border-0"><span className="text-muted-foreground">{k}</span><span className="truncate max-w-[60%] text-end">{v || "—"}</span></div>;
}

function MaintenancePanel({ vehicleId, rows, onChange }: { vehicleId: string; rows: any[]; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ kind: "service", title: "", performed_at: new Date().toISOString().slice(0,10), mileage: "", cost: "", vendor: "", next_service_at: "", next_service_km: "", notes: "" });

  const save = async () => {
    const { error } = await supabase.from("vehicle_maintenance").insert({
      vehicle_id: vehicleId,
      kind: f.kind as any,
      title: f.title || null,
      performed_at: f.performed_at || null,
      mileage: f.mileage ? Number(f.mileage) : null,
      cost: f.cost ? Number(f.cost) : null,
      vendor: f.vendor || null,
      next_service_at: f.next_service_at || null,
      next_service_km: f.next_service_km ? Number(f.next_service_km) : null,
      notes: f.notes || null,
    });
    if (error) return toast.error(error.message);
    // Update vehicle mileage + next maintenance
    const patch: any = {};
    if (f.mileage) patch.current_mileage = Number(f.mileage);
    if (f.next_service_at) patch.next_maintenance_at = f.next_service_at;
    if (f.next_service_km) patch.next_maintenance_km = Number(f.next_service_km);
    if (Object.keys(patch).length) await supabase.from("vehicles").update(patch).eq("id", vehicleId);
    toast.success("Recorded");
    setOpen(false);
    setF({ kind: "service", title: "", performed_at: new Date().toISOString().slice(0,10), mileage: "", cost: "", vendor: "", next_service_at: "", next_service_km: "", notes: "" });
    onChange();
  };

  const del = async (rowId: string) => {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from("vehicle_maintenance").delete().eq("id", rowId);
    if (error) return toast.error(error.message);
    onChange();
  };

  return (
    <Card><CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Maintenance history</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Wrench className="h-3.5 w-3.5 me-1" />Log service</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log maintenance</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Kind</Label>
                <Select value={f.kind} onValueChange={(v) => setF({ ...f, kind: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MAINT_KINDS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Performed on</Label><Input type="date" value={f.performed_at} onChange={(e) => setF({ ...f, performed_at: e.target.value })} /></div>
              <div className="col-span-2"><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
              <div><Label>Mileage (km)</Label><Input type="number" value={f.mileage} onChange={(e) => setF({ ...f, mileage: e.target.value })} /></div>
              <div><Label>Cost</Label><Input type="number" step="0.01" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} /></div>
              <div className="col-span-2"><Label>Vendor</Label><Input value={f.vendor} onChange={(e) => setF({ ...f, vendor: e.target.value })} /></div>
              <div><Label>Next service date</Label><Input type="date" value={f.next_service_at} onChange={(e) => setF({ ...f, next_service_at: e.target.value })} /></div>
              <div><Label>Next service km</Label><Input type="number" value={f.next_service_km} onChange={(e) => setF({ ...f, next_service_km: e.target.value })} /></div>
              <div className="col-span-2"><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}><Save className="h-4 w-4 me-1" />Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {rows.length === 0 ? <div className="text-sm text-muted-foreground py-3">No maintenance records yet.</div> :
        <div className="divide-y">
          {rows.map((m) => (
            <div key={m.id} className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{m.title || m.kind} <span className="text-muted-foreground text-xs">· {m.kind}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(m.performed_at).toLocaleDateString()} {m.vendor ? `· ${m.vendor}` : ""} {m.mileage ? `· ${Number(m.mileage).toLocaleString()} km` : ""}</div>
                {m.notes && <div className="text-xs mt-1">{m.notes}</div>}
              </div>
              <div className="text-end shrink-0">
                <div className="text-sm tabular-nums">{Number(m.cost ?? 0).toFixed(2)}</div>
                <Button variant="ghost" size="icon" onClick={() => del(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      }
    </CardContent></Card>
  );
}

function VehicleDocsPanel({ vehicleId, docs, onChange }: { vehicleId: string; docs: any[]; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ kind: "registration", title: "", document_number: "", issued_on: "", expires_on: "", notes: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    setUploading(true);
    try {
      let file_path: string | null = null;
      if (file) {
        const path = `vehicles/${vehicleId}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("fleet-documents").upload(path, file);
        if (error) throw error;
        file_path = path;
      }
      const { error } = await supabase.from("vehicle_documents").insert({
        vehicle_id: vehicleId,
        kind: f.kind as any,
        title: f.title || null,
        document_number: f.document_number || null,
        issued_on: f.issued_on || null,
        expires_on: f.expires_on || null,
        notes: f.notes || null,
        file_path,
      });
      if (error) throw error;
      toast.success("Document added");
      setOpen(false); setFile(null);
      setF({ kind: "registration", title: "", document_number: "", issued_on: "", expires_on: "", notes: "" });
      onChange();
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const download = async (path: string) => {
    const { data, error } = await supabase.storage.from("fleet-documents").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    window.open(data.signedUrl, "_blank");
  };
  const del = async (docId: string, path: string | null) => {
    if (!confirm("Delete this document?")) return;
    if (path) await supabase.storage.from("fleet-documents").remove([path]);
    const { error } = await supabase.from("vehicle_documents").delete().eq("id", docId);
    if (error) return toast.error(error.message);
    onChange();
  };

  return (
    <Card><CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Documents</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Upload className="h-3.5 w-3.5 me-1" />Add document</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New document</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Kind</Label>
                <Select value={f.kind} onValueChange={(v) => setF({ ...f, kind: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{VEHICLE_DOC_KINDS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
              <div><Label>Document #</Label><Input value={f.document_number} onChange={(e) => setF({ ...f, document_number: e.target.value })} /></div>
              <div><Label>Issued on</Label><Input type="date" value={f.issued_on} onChange={(e) => setF({ ...f, issued_on: e.target.value })} /></div>
              <div><Label>Expires on</Label><Input type="date" value={f.expires_on} onChange={(e) => setF({ ...f, expires_on: e.target.value })} /></div>
              <div className="col-span-2"><Label>Notes</Label><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={2} /></div>
              <div className="col-span-2"><Label>File</Label><Input type="file" ref={fileRef} onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={uploading} onClick={save}><Save className="h-4 w-4 me-1" />Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {docs.length === 0 ? <div className="text-sm text-muted-foreground py-3">No documents.</div> :
        <div className="divide-y">
          {docs.map((doc: any) => (
            <div key={doc.id} className="py-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{doc.title || doc.kind} <span className="text-muted-foreground text-xs">· {doc.kind}</span></div>
                <div className="text-xs text-muted-foreground">{doc.document_number ?? ""}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ExpiryPill date={doc.expires_on} />
                {doc.file_path && <Button variant="ghost" size="icon" onClick={() => download(doc.file_path)}><Download className="h-4 w-4" /></Button>}
                <Button variant="ghost" size="icon" onClick={() => del(doc.id, doc.file_path)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      }
    </CardContent></Card>
  );
}

function EditVehicleDialog({ vehicle, onSaved }: { vehicle: any; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<any>({ ...vehicle });
  const cats = useQuery({ queryKey: ["cats"], queryFn: async () => (await supabase.from("vehicle_categories").select("id, code").order("sort_order")).data ?? [] });

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        plate_number: f.plate_number, internal_code: f.internal_code || null, vin: f.vin || null,
        make: f.make || null, model: f.model || null, year: f.year ? Number(f.year) : null,
        color: f.color || null, seats: Number(f.seats || 4),
        fuel_type: f.fuel_type || null, transmission: f.transmission || null,
        category_id: f.category_id || null, status: f.status,
        registration_expiry: f.registration_expiry || null,
        insurance_expiry: f.insurance_expiry || null,
        inspection_expiry: f.inspection_expiry || null,
        current_mileage: f.current_mileage ? Number(f.current_mileage) : null,
        next_maintenance_at: f.next_maintenance_at || null,
        next_maintenance_km: f.next_maintenance_km ? Number(f.next_maintenance_km) : null,
        notes: f.notes || null,
      };
      const { error } = await supabase.from("vehicles").update(payload).eq("id", vehicle.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); setOpen(false); onSaved(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit vehicle</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Plate #</Label><Input value={f.plate_number ?? ""} onChange={(e) => setF({ ...f, plate_number: e.target.value })} /></div>
          <div><Label>Internal code</Label><Input value={f.internal_code ?? ""} onChange={(e) => setF({ ...f, internal_code: e.target.value })} /></div>
          <div className="col-span-2"><Label>VIN</Label><Input value={f.vin ?? ""} onChange={(e) => setF({ ...f, vin: e.target.value })} /></div>
          <div><Label>Make</Label><Input value={f.make ?? ""} onChange={(e) => setF({ ...f, make: e.target.value })} /></div>
          <div><Label>Model</Label><Input value={f.model ?? ""} onChange={(e) => setF({ ...f, model: e.target.value })} /></div>
          <div><Label>Year</Label><Input type="number" value={f.year ?? ""} onChange={(e) => setF({ ...f, year: e.target.value })} /></div>
          <div><Label>Color</Label><Input value={f.color ?? ""} onChange={(e) => setF({ ...f, color: e.target.value })} /></div>
          <div><Label>Seats</Label><Input type="number" value={f.seats ?? 4} onChange={(e) => setF({ ...f, seats: e.target.value })} /></div>
          <div><Label>Fuel</Label>
            <Select value={f.fuel_type ?? ""} onValueChange={(v) => setF({ ...f, fuel_type: v })}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{["petrol","diesel","hybrid","electric","lpg","cng"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Transmission</Label>
            <Select value={f.transmission ?? ""} onValueChange={(v) => setF({ ...f, transmission: v })}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{["automatic","manual"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-2"><Label>Category</Label>
            <Select value={f.category_id ?? ""} onValueChange={(v) => setF({ ...f, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{(cats.data ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Status</Label>
            <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{VEHICLE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Current mileage (km)</Label><Input type="number" value={f.current_mileage ?? ""} onChange={(e) => setF({ ...f, current_mileage: e.target.value })} /></div>
          <div><Label>Registration expiry</Label><Input type="date" value={f.registration_expiry ?? ""} onChange={(e) => setF({ ...f, registration_expiry: e.target.value })} /></div>
          <div><Label>Insurance expiry</Label><Input type="date" value={f.insurance_expiry ?? ""} onChange={(e) => setF({ ...f, insurance_expiry: e.target.value })} /></div>
          <div><Label>Inspection expiry</Label><Input type="date" value={f.inspection_expiry ?? ""} onChange={(e) => setF({ ...f, inspection_expiry: e.target.value })} /></div>
          <div><Label>Next maintenance</Label><Input type="date" value={f.next_maintenance_at ?? ""} onChange={(e) => setF({ ...f, next_maintenance_at: e.target.value })} /></div>
          <div><Label>Next maintenance km</Label><Input type="number" value={f.next_maintenance_km ?? ""} onChange={(e) => setF({ ...f, next_maintenance_km: e.target.value })} /></div>
          <div className="col-span-2"><Label>Notes</Label><Textarea rows={3} value={f.notes ?? ""} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={save.isPending} onClick={() => save.mutate()}><Save className="h-4 w-4 me-1" />Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
