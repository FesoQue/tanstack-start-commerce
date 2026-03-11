import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/_components/sidebar")({
  component: AdminSidebarComponent,
});

export function AdminSidebarComponent() {
  return (
    <aside className="h-screen w-[250px] border-r border-r-gray-500"></aside>
  );
}
