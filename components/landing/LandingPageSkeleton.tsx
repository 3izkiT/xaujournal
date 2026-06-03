export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-xau-app pt-20">
      <div className="mx-auto max-w-6xl space-y-4 px-6">
        <div className="h-4 w-48 rounded bg-xau-border" />
        <div className="h-12 w-full max-w-lg rounded bg-xau-border" />
        <div className="h-4 w-full max-w-md rounded bg-xau-border" />
        <div className="mt-8 h-64 rounded-2xl bg-xau-border" />
      </div>
    </div>
  );
}
