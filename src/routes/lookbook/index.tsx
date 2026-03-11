import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { productQueries } from "#/lib/api/products";
import { LookbookSkeleton } from "#/components/lookbook/lookbook.skeleton";
import { LookbookError } from "#/components/lookbook/lookbook.error";
import { LookbookContent } from "#/components/lookbook/lookbook.content";

export const Route = createFileRoute("/lookbook/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(productQueries.all()),
  component: LookBookComponent,
  pendingComponent: LookbookSkeleton,
  errorComponent: LookbookError,
});

function LookBookComponent() {
  return (
    <Suspense fallback={<LookbookSkeleton />}>
      <LookbookContent />
    </Suspense>
  );
}
