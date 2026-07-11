import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-bold">مشروع جديد</h1>
        <p className="mt-2 text-muted-foreground">ابدأ ببناء تطبيقك من هنا.</p>
      </div>
    </main>
  );
}
