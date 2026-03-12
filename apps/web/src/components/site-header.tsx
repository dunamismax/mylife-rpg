import { Link, useRouterState } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

export function SiteHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { data: session, isPending } = authClient.useSession()

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:rgba(244,239,226,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 no-underline transition hover:opacity-80"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] text-lg font-semibold text-[color:var(--olive)] shadow-[0_12px_24px_rgba(91,88,55,0.08)]">
              Q
            </span>
            <div>
              <p className="kicker">Quest journal</p>
              <p className="text-base font-semibold tracking-[-0.04em] text-[color:var(--ink)]">
                QuestLog
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:rgba(255,249,236,0.7)] p-1 md:flex">
            <Link
              to="/"
              className={`nav-pill ${pathname === '/' ? 'nav-pill-active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className={`nav-pill ${pathname === '/about' ? 'nav-pill-active' : ''}`}
            >
              Stack
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-[color:rgba(73,84,66,0.12)]" />
          ) : session?.user ? (
            <>
              <div className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-2 text-right sm:block">
                <p className="kicker text-[11px]">Signed in</p>
                <p className="text-sm font-medium text-[color:var(--ink)]">
                  {session.user.name}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-[color:var(--line-strong)] bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] transition hover:-translate-y-0.5 hover:bg-[color:var(--olive)]"
                onClick={() => {
                  void authClient.signOut()
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-2 text-sm text-[color:var(--muted)]">
              Email/password auth enabled
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
