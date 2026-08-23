import { prisma } from "@/lib/db"
import Link from "next/link"
import type { Metadata } from "next"
import type { PortfolioData } from "@/types"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    select: { isPublic: true, data: true },
  })
  if (!portfolio?.isPublic) return { title: "Portfolio not found" }
  const data = portfolio.data as unknown as PortfolioData
  return {
    title: `${data.name} — ${data.headline}`,
    description: data.bio ?? `${data.name}'s portfolio`,
    openGraph: { title: `${data.name} — ${data.headline}`, type: "profile" },
  }
}

export default async function PublicPortfolioPage({ params }: Params) {
  const { slug } = await params
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    select: { isPublic: true, data: true, publishedAt: true },
  })

  // Private/missing portfolios are indistinguishable.
  if (!portfolio || !portfolio.isPublic) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-white">Portfolio not found</h1>
          <p className="text-sm text-zinc-500">
            This portfolio doesn&apos;t exist or isn&apos;t published.
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-sky-400 hover:underline mt-2"
          >
            ← Back to InternEdge
          </Link>
        </div>
      </main>
    )
  }

  const data = portfolio.data as unknown as PortfolioData

  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Hero */}
        <header className="space-y-4 border-b border-white/10 pb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
            {data.graduationYear
              ? `Class of ${data.graduationYear}`
              : "Student"}
            {data.university ? ` · ${data.university}` : ""}
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight">
            {data.name}
          </h1>
          <p className="text-lg font-semibold text-sky-400">{data.headline}</p>
          {data.bio && (
            <p className="text-base text-zinc-400 max-w-2xl leading-relaxed">
              {data.bio}
            </p>
          )}
          <div className="flex flex-wrap gap-5 pt-2 text-sm text-zinc-400">
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                GitHub ↗
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                LinkedIn ↗
              </a>
            )}
            {data.externalPortfolio && (
              <a
                href={data.externalPortfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Website ↗
              </a>
            )}
          </div>
        </header>

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.projects.map((p) => (
                <article
                  key={p.id}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                >
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(p.techStack ?? []).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {(p.github || p.liveDemo) && (
                    <div className="flex gap-4 text-xs pt-1">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-white"
                        >
                          Source ↗
                        </a>
                      )}
                      {p.liveDemo && (
                        <a
                          href={p.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((e) => (
                <div
                  key={e.id}
                  className="border-l-2 border-sky-500/40 pl-5 py-1"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold">
                      {e.role} ·{" "}
                      <span className="text-sky-400">{e.company}</span>
                    </h3>
                    <span className="text-xs text-zinc-600">
                      {e.startDate}
                      {e.endDate ? ` – ${e.endDate}` : " – Present"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    {e.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="pt-8 border-t border-white/10 text-xs text-zinc-600 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} {data.name}
          </span>
          <Link href="/" className="hover:text-zinc-400 transition">
            Built with InternEdge
          </Link>
        </footer>
      </div>
    </main>
  )
}
