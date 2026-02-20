import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="rounded-full bg-muted p-4">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to PantyHub
        </Link>
      </div>
    </div>
  );
}
