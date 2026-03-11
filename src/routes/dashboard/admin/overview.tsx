import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/overview")({
  component: OverviewComponent,
});

function OverviewComponent() {
  return (
    <div>
      <h1>Overview Page</h1>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque dolorum
      quidem sit voluptatibus culpa ut iusto quae consectetur architecto optio
      quisquam quam, eligendi, deserunt magnam. Deleniti ab maiores sint est?
    </div>
  );
}
