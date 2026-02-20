import { MobileShell } from "@/components/layout/mobile-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r border-border bg-card">
        <Sidebar />
      </aside>

      {/* Mobile: shell manages sidebar toggle state */}
      <MobileShell sidebar={<Sidebar />}>
        {children}
      </MobileShell>
    </div>
  );
}
