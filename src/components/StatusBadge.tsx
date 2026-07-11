import { Badge } from "@/components/ui/badge";

const map: Record<string, { label: string; variant: any; className?: string }> = {
  // Booking statuses
  new: { label: "New", variant: "secondary", className: "bg-muted text-foreground border-border" },
  pending: { label: "Pending", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  confirmed: { label: "Confirmed", variant: "secondary", className: "bg-chart-2/15 text-chart-2 border-chart-2/30" },
  assigned: { label: "Assigned", variant: "secondary", className: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  picked_up: { label: "Picked up", variant: "secondary", className: "bg-primary/25 text-primary border-primary/40" },
  en_route: { label: "En route", variant: "secondary", className: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  on_trip: { label: "On trip", variant: "secondary", className: "bg-primary/20 text-primary border-primary/30" },
  completed: { label: "Completed", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  no_show: { label: "No show", variant: "destructive" },
  // Driver statuses
  available: { label: "Available", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  busy: { label: "Busy", variant: "secondary", className: "bg-primary/20 text-primary border-primary/30" },
  offline: { label: "Offline", variant: "secondary" },
  on_break: { label: "On break", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  waiting: { label: "Waiting", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  vacation: { label: "Vacation", variant: "secondary", className: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  suspended: { label: "Suspended", variant: "destructive" },
  // Vehicle statuses
  active: { label: "Active", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  maintenance: { label: "Maintenance", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  out_of_service: { label: "Out of service", variant: "destructive" },
  reserved: { label: "Reserved", variant: "secondary", className: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  retired: { label: "Retired", variant: "secondary" },
  inactive: { label: "Inactive", variant: "secondary" },
  // Employment statuses
  probation: { label: "Probation", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  terminated: { label: "Terminated", variant: "destructive" },
  // Payment
  paid: { label: "Paid", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  partially_paid: { label: "Partially paid", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  refunded: { label: "Refunded", variant: "secondary", className: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
  failed: { label: "Failed", variant: "destructive" },
  // Invoice
  draft: { label: "Draft", variant: "secondary" },
  issued: { label: "Issued", variant: "secondary", className: "bg-chart-2/15 text-chart-2 border-chart-2/30" },
  overdue: { label: "Overdue", variant: "destructive" },
  // Payroll
  approved: { label: "Approved", variant: "secondary", className: "bg-chart-2/15 text-chart-2 border-chart-2/30" },
};

export function StatusBadge({ value }: { value: string | null | undefined }) {
  if (!value) return <Badge variant="outline">—</Badge>;
  const m = map[value] ?? { label: value, variant: "secondary" };
  return <Badge variant={m.variant} className={m.className}>{m.label}</Badge>;
}
