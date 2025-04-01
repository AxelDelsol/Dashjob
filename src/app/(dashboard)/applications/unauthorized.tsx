import { Angry } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Angry className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">401 Unauthorized</h2>
      <p>Vous n&apos;êtes pas autorisés à voir cette page.</p>
      <Link
        href="/dashboard/applications"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Retourner aux candidatures
      </Link>
    </main>
  );
}
