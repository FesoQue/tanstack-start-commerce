import { useSession } from "#/lib/auth-client";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.navigate({ to: "/" });
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-3">
      <Outlet />
    </div>
  );
}
