import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <Image
          src="/ucsc-logo.png"
          alt="UCSC Logo"
          width={150}
          height={150}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold leading-10 tracking-tight text-black dark:text-zinc-50">
            Riddle Run
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            UCSC IEEE Monthly Meetup November - Treasure Hunt Game
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link
            href="/register?teamID=1&password=e0b43c55dc84e15496a758d9246e5ece"
            className="flex h-12 w-full items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Register
          </Link>
          <Link
            href="/leaderboard"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            View Leaderboard
          </Link>
        </div>
      </main>
    </div>
  );
}
