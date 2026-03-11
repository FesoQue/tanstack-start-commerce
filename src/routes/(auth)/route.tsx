import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="py-3">
      <Outlet />
    </div>
  );
}
