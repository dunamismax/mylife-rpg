'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    );
  }

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">MyLife RPG</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            {session ? (
                <>
                    <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                        Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="text-sm font-medium hover:underline underline-offset-4">
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link href="/signin" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                        Login
                    </Link>
                    <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                        Register
                    </Link>
                </>
            )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Transform Your Life into an Epic Adventure
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    MyLife RPG is a gamified habit tracker that helps you build good habits, break bad ones, and achieve
                    your goals. Level up your life, one quest at a time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href={session ? "/dashboard" : "/register"}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    {session ? "Go to Dashboard" : "Start Your Quest"}
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700">
        <p className="text-xs text-gray-500">&copy; 2025 MyLife RPG. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}