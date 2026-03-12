import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: StackPage,
})

function StackPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <section className="panel rise-in grid gap-6 rounded-[2rem] px-6 py-8 md:px-8">
        <div>
          <p className="kicker mb-3">Rewrite profile</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-5xl">
            QuestLog is now a typed monorepo instead of a Django side project.
          </h1>
        </div>
        <p className="max-w-3xl text-base leading-8 text-[color:var(--muted)]">
          The rewrite keeps the product narrow: quests, recurring habits, one
          daily check-in, and lightweight XP. The implementation is the part
          that changed completely.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['Runtime', 'Bun execution with pnpm workspace orchestration.'],
          ['App', 'TanStack Start + Router + Query on React 19.'],
          [
            'Domain',
            'Effect-driven server services with Effect Schema contracts.',
          ],
          [
            'Data',
            'PostgreSQL with Drizzle models and generated Better Auth tables.',
          ],
          [
            'AI',
            'TanStack AI chat surface backed by a Mastra coaching workflow.',
          ],
          [
            'Ops',
            'OpenTelemetry bootstrap and Biome/Vitest workspace tooling.',
          ],
        ].map(([title, copy]) => (
          <article key={title} className="panel rounded-[1.6rem] px-5 py-5">
            <p className="kicker mb-2">{title}</p>
            <p className="text-lg font-semibold text-[color:var(--ink)]">
              {copy}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
