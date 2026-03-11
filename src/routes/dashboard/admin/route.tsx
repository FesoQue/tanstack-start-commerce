import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebarComponent } from "./_components/sidebar";
import { NotFound } from "#/components/global/NotFound";

export const Route = createFileRoute("/dashboard/admin")({
  component: LayoutComponent,
  // beforeLoad: async () => {
  // https://tanstack.com/start/latest/docs/framework/react/examples/start-supabase-basic?path=examples%2Freact%2Fstart-supabase-basic%2Fsrc%2Froutes%2F__root.tsx
  //   if (typeof window === "undefined") {
  //     return { user: null };
  //   }

  //   const stored = window.localStorage.getItem("user");
  //   const user = stored ? JSON.parse(stored) : null;

  //   return { user };
  // },
  notFoundComponent: () => <NotFound />,
});

function LayoutComponent() {
  const [user, setUser] = useState<null | { id: string; name: string }>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    setUser(parsed);
  }, []);

  // console.log(user);

  return (
    <div className="flex items-start">
      <AdminSidebarComponent />
      <div className="p-10">
        <Outlet />
      </div>
    </div>
  );
}
