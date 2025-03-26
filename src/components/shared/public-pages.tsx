import { ReactNode } from "react";

export default function PublicPage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="h-20 rounded-lg bg-blue-500 p-4 md:h-25"></div>
      <div className="mt-4 flex flex-col gap-4 md:flex-row">{children}</div>
    </main>
  );
}
