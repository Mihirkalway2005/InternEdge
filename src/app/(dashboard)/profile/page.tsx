"use client"

// ---------------- Profile form ----------------

// ---------------- Skills ----------------

// ---------------- Projects ----------------

// ---------------- Experiences ----------------

// ---------------- Shared ----------------

import React, { useState } from "react"
import { api, useApi } from "@/lib/api-client"
import type { Experience, Profile, Project, Skill } from "@/types"
import {
  UserRound,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
  X,
} from "lucide-react"

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition"

export default function ProfilePage() {
  const {
    data: profile,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useApi<Profile>("/api/profile")
  const {
    data: skills,
    loading: skillsLoading,
    refetch: refetchSkills,
  } = useApi<Skill[]>("/api/skills")
  const {
    data: projects,
    loading: projectsLoading,
    refetch: refetchProjects,
  } = useApi<Project[]>("/api/projects")
  const {
    data: experiences,
    loading: expLoading,
    refetch: refetchExp,
  } = useApi<Experience[]>("/api/experiences")

  if (profileLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    )

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Unified Student Profile{" "}
          <UserRound className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Everything here feeds matching, roadmaps and your readiness score
        </p>
      </div>

      <ProfileForm
        profile={
          profile ??
          null
        }
        onSaved={refetchProfile}
      />

      <SkillsSection
        skills={
          skills ??
          []
        }
        loading={skillsLoading}
        onChanged={refetchSkills}
      />
      <ProjectsSection
        projects={
          projects ??
          []
        }
        loading={projectsLoading}
        onChanged={refetchProjects}
      />
      <ExperiencesSection
        experiences={
          experiences ??
          []
        }
        loading={expLoading}
        onChanged={refetchExp}
      />
    </div>
  )
}

function ProfileForm({
  profile,
  onSaved,
}: {
  profile: Profile | null
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    headline:
      profile?.headline ??
      "",
    university:
      profile?.university ??
      "",
    degree:
      profile?.degree ??
      "",
    branch:
      profile?.branch ??
      "",
    graduationYear:
      profile?.graduationYear?.toString() ??
      "",
    bio:
      profile?.bio ??
      "",
    careerGoal:
      profile?.careerGoal ??
      "",
    github:
      profile?.github ??
      "",
    linkedin:
      profile?.linkedin ??
      "",
  })
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      await api("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          headline:
            form.headline ||
            null,
          university:
            form.university ||
            null,
          degree:
            form.degree ||
            null,
          branch:
            form.branch ||
            null,
          graduationYear:
            Number(form.graduationYear) ||
            null,
          bio:
            form.bio ||
            null,
          careerGoal:
            form.careerGoal ||
            null,
          github:
            form.github ||
            null,
          linkedin:
            form.linkedin ||
            null,
        }),
      })
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
      onSaved()
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Failed to save",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
      <h3 className="text-base font-bold text-white">Basics & Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Labeled label="Headline">
          <input
            value={form.headline}
            onChange={set("headline")}
            placeholder="Aspiring Full-Stack Engineer"
            className={inputCls}
          />
        </Labeled>
        <Labeled label="University">
          <input
            value={form.university}
            onChange={set("university")}
            placeholder="Your college"
            className={inputCls}
          />
        </Labeled>
        <Labeled label="Degree">
          <input
            value={form.degree}
            onChange={set("degree")}
            placeholder="B.S. Computer Science"
            className={inputCls}
          />
        </Labeled>
        <Labeled label="Branch">
          <input
            value={form.branch}
            onChange={set("branch")}
            placeholder="AI & Systems"
            className={inputCls}
          />
        </Labeled>
        <Labeled label="Graduation Year">
          <input
            value={form.graduationYear}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                graduationYear: e.target.value.replace(/\D/g, "").slice(0, 4),
              }))
            }
            placeholder="2027"
            inputMode="numeric"
            className={inputCls}
          />
        </Labeled>
        <Labeled label="GitHub">
          <input
            value={form.github}
            onChange={set("github")}
            placeholder="https://github.com/you"
            className={inputCls}
          />
        </Labeled>
        <Labeled label="LinkedIn">
          <input
            value={form.linkedin}
            onChange={set("linkedin")}
            placeholder="https://linkedin.com/in/you"
            className={inputCls}
          />
        </Labeled>
      </div>
      <Labeled label="Bio">
        <textarea
          value={form.bio}
          onChange={set("bio")}
          rows={2}
          placeholder="A short intro shown on your portfolio…"
          className={`${inputCls} resize-none`}
        />
      </Labeled>
      <Labeled label="Career Goal">
        <textarea
          value={form.careerGoal}
          onChange={set("careerGoal")}
          rows={2}
          placeholder="What do you want to achieve this year?"
          className={`${inputCls} resize-none`}
        />
      </Labeled>

      {error && (
        <p className="text-xs text-red-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      <button
        onClick={save}
        disabled={saving}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold text-xs flex items-center gap-2 hover:opacity-95 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : savedFlash ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {savedFlash ? "Saved!" : "Save Profile"}
      </button>
    </div>
  )
}

function SkillsSection({
  skills,
  loading,
  onChanged,
}: {
  skills: Skill[]
  loading: boolean
  onChanged: () => void
}) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("other")
  const [level, setLevel] = useState("beginner")
  const [busy, setBusy] = useState(false)

  const add = async () => {
    if (!name.trim()) return
    setBusy(true)
    try {
      await api("/api/skills", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), category, level }),
      })
      setName("")
      onChanged()
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    try {
      await api(`/api/skills/${id}`, { method: "DELETE" })
      onChanged()
    } catch (err) {
      console.error(err)
    }
  }

  const changeLevel = async (id: string, newLevel: string) => {
    try {
      await api(`/api/skills/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ level: newLevel }),
      })
      onChanged()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Section title="Skills" count={skills.length}>
      <AddRow>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key ===
              "Enter" &&
            void add()
          }
          placeholder="Skill name…"
          className={inputCls}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputCls} [&>option]:bg-zinc-900`}
        >
          {[
            "frontend",
            "backend",
            "database",
            "devops",
            "ai_ml",
            "soft_skill",
            "other",
          ].map((c) => (
            <option key={c} value={c}>
              {c.replace("_", "/").toUpperCase()}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className={`${inputCls} [&>option]:bg-zinc-900`}
        >
          {["beginner", "intermediate", "advanced", "expert"].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={add}
          disabled={
            busy ||
            !name.trim()
          }
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 shrink-0"
        >
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}{" "}
          Add
        </button>
      </AddRow>

      {!loading &&
        skills.length ===
          0 && (
          <Empty text="No skills yet — add what you know (be honest about levels)." />
        )}
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s.id}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2"
          >
            {s.name}
            <select
              value={s.level}
              onChange={(e) => changeLevel(s.id, e.target.value)}
              className="bg-transparent text-[10px] text-sky-300 focus:outline-none cursor-pointer [&>option]:bg-zinc-900"
            >
              {["beginner", "intermediate", "advanced", "expert"].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <button
              onClick={() => remove(s.id)}
              className="text-zinc-600 hover:text-red-400"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </Section>
  )
}

function ProjectsSection({
  projects,
  loading,
  onChanged,
}: {
  projects: Project[]
  loading: boolean
  onChanged: () => void
}) {
  const [showForm, setShowForm] = useState(false)

  const remove = async (id: string) => {
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" })
      onChanged()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Section
      title="Projects"
      count={projects.length}
      action={
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-[11px] font-bold text-sky-300 hover:bg-sky-500/20 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      }
    >
      {!loading &&
        projects.length ===
          0 && (
          <Empty text="Projects power your portfolio and readiness score." />
        )}

      {showForm && (
        <ProjectForm onClose={() => setShowForm(false)} onSaved={onChanged} />
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 group relative"
          >
            <button
              onClick={() => remove(p.id)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm font-bold text-white pr-8">{p.title}</p>
            <p className="text-xs text-zinc-400 line-clamp-2">
              {p.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(
                p.techStack ??
                []
              )
                .slice(0, 8)
                .map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function ProjectForm({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [techStack, setTechStack] = useState("")
  const [github, setGithub] = useState("")
  const [liveDemo, setLiveDemo] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await api("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          techStack: techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          github:
            github ||
            null,
          liveDemo:
            liveDemo ||
            null,
          startDate: new Date().toISOString().slice(0, 10),
        }),
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Failed to add project",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="New project" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Labeled label="Title *">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="Vector Search Engine"
          />
        </Labeled>
        <Labeled label="Description *">
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="What it does + impact…"
          />
        </Labeled>
        <Labeled label="Tech stack (comma-separated)">
          <input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className={inputCls}
            placeholder="Python, FastAPI, PostgreSQL"
          />
        </Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="GitHub URL">
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className={inputCls}
              placeholder="https://github.com/…"
            />
          </Labeled>
          <Labeled label="Live demo URL">
            <input
              value={liveDemo}
              onChange={(e) => setLiveDemo(e.target.value)}
              className={inputCls}
              placeholder="https://…"
            />
          </Labeled>
        </div>
        {error && <p className="text-xs text-red-300">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2 rounded-xl bg-sky-500 text-black font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Add
            Project
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ExperiencesSection({
  experiences,
  loading,
  onChanged,
}: {
  experiences: Experience[]
  loading: boolean
  onChanged: () => void
}) {
  const [showForm, setShowForm] = useState(false)

  const remove = async (id: string) => {
    try {
      await api(`/api/experiences/${id}`, { method: "DELETE" })
      onChanged()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Section
      title="Experience"
      count={experiences.length}
      action={
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      }
    >
      {!loading &&
        experiences.length ===
          0 && <Empty text="Internships, jobs or research roles go here." />}

      {showForm && (
        <ExperienceForm
          onClose={() => setShowForm(false)}
          onSaved={onChanged}
        />
      )}

      <div className="space-y-3">
        {experiences.map((e) => (
          <div
            key={e.id}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 group relative"
          >
            <button
              onClick={() => remove(e.id)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm font-bold text-white pr-8">
              {e.role} · <span className="text-sky-300">{e.company}</span>
            </p>
            <p className="text-[10px] text-zinc-500">
              {e.startDate}
              {e.endDate ? ` – ${e.endDate}` : " – Present"}
            </p>
            <p className="text-xs text-zinc-400">{e.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function ExperienceForm({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await api("/api/experiences", {
        method: "POST",
        body: JSON.stringify({
          company,
          role,
          description,
          startDate,
          endDate:
            endDate ||
            null,
        }),
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Failed to add experience",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="New experience" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Company *">
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputCls}
            />
          </Labeled>
          <Labeled label="Role *">
            <input
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputCls}
            />
          </Labeled>
        </div>
        <Labeled label="What did you do? *">
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Impact-focused summary…"
          />
        </Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Start *">
            <input
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Jun 2026"
              className={inputCls}
            />
          </Labeled>
          <Labeled label="End (blank = present)">
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Aug 2026"
              className={inputCls}
            />
          </Labeled>
        </div>
        {error && <p className="text-xs text-red-300">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Add
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Section({
  title,
  count,
  action,
  children,
}: {
  title: string
  count?: number
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">
          {title}
          {count != null && (
            <span className="ml-2 text-[11px] font-mono text-zinc-500">
              {count}
            </span>
          )}
        </h3>
        {action}
      </div>
      {children}
    </div>
  )
}

function Labeled({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-bold text-zinc-400">{label}</span>
      {children}
    </label>
  )
}

function AddRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2">
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs text-zinc-500 py-3 text-center">{text}</p>
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="material-glass p-6 rounded-3xl border border-white/10 max-w-md w-full space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
