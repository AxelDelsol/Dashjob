import { MoveRight } from 'lucide-react';
import { Lusitana } from "next/font/google";
import Image from 'next/image';
import Link from "next/link";

const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700']
})

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="h-20 rounded-lg bg-blue-500 p-4 md:h-25">
      </div>
      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Bienvenue sur Dashjob.</strong>
            <br />
            L&apos;application qui vous aide à organiser votre recherche d&apos;emploi.
          </p>
          <Link
            href="/login"
            className="flex gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Se connecter</span> <MoveRight className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="w-full md:w-3/5 md:px-12">
          <Image
            src="/home_sankey.svg"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto"
            priority
            alt="Screenshots of the dashboard project"
          />
        </div>
      </div>
    </main>
  );
}
