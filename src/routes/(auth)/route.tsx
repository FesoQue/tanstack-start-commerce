import { useSession } from "#/lib/auth-client";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

const isBrowser = typeof window !== "undefined";

export const Route = createFileRoute("/(auth)")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.navigate({ to: "/" });
    }
  }, [session]);

  return (
    <div className="py-3">
      <Outlet />
    </div>
  );
}
