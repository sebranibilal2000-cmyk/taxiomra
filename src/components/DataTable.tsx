import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";

export type Column<T> = { key: string; header: string; render?: (row: T) => ReactNode; className?: string };

export function DataTable<T extends { id: string | number }>({
  data, columns, loading, empty, actions,
}: { data: T[]; columns: Column<T>[]; loading?: boolean; empty?: string; actions?: (row: T) => ReactNode }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={c.key} className={c.className}>{c.header}</TableHead>)}
              {actions && <TableHead className="text-end">{t("actions")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-muted-foreground">{t("loading")}</TableCell></TableRow>
            )}
            {!loading && data.length === 0 && (
              <TableRow><TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-muted-foreground">{empty ?? t("no_data")}</TableCell></TableRow>
            )}
            {!loading && data.map((row) => (
              <TableRow key={String(row.id)}>
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </TableCell>
                ))}
                {actions && <TableCell className="text-end">{actions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
