import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Hi Welcome,</h1>
        <p className="text-gray-600 text-sm">
          This is where i share my reflections
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => {
          return (
            <div
              key={i}
              className="w-full h-[300px] bg-gray-100 rounded border border-gray-300"
            >
              <Link
                to="/post/$postId"
                params={{ postId: (i + 1).toString() }}
                className="w-full h-full flex items-center justify-center"
              >
                <p className="text-lg font-semibold">{i + 1}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
