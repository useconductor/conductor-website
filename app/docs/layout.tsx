import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DocsSidebar />
      <div className="min-w-0 flex-1 px-6 py-8 md:px-12 md:py-12">
        <div className="mx-auto max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
