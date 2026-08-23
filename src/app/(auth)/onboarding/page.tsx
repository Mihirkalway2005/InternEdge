"use client"

// Step 1 — education & goals

// Step 2 — skills

// Step 3 — links

// Step 3 → finish

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { api } from "@/lib/api-client"
import {
  GraduationCap,
  Target,
  Link2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react"

const SKILL_CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Database" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "ai_ml", label: "AI/ML" },
  { value: "soft_skill", label: "Soft Skills" },
  { value: "other", label: "Other" },
] as const

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
  "Git",
  "Machine Learning",
  "PyTorch",
  "TensorFlow",
]

type SkillDraft = { name: string; category: string; level: string }

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [university, setUniversity] = useState("")
  const [degree, setDegree] = useState("")
  const [branch, setBranch] = useState("")
  const [gradYear, setGradYear] = useState("")
  const [targetRoles, setTargetRoles] = useState<string[]>([])
  const [targetRoleInput, setTargetRoleInput] = useState("")
  const [preferredLocations, setPreferredLocations] = useState<string[]>([])
  const [locationInput, setLocationInput] = useState("")
  const [preferredWorkType, setPreferredWorkType] = useState("")
  const [skills, setSkills] = useState<SkillDraft[]>([])
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState<string>("other")
  const [newSkillLevel, setNewSkillLevel] = useState<string>("beginner")
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [portfolioUrl, setPortfolioUrl] = useState("")

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  const saveProfile = async (complete: boolean) => {
    const body: Record<string, unknown> = {
      university:
        university ||
        null,
      degree:
        degree ||
        null,
      branch:
        branch ||
        null,
      graduationYear:
        Number(gradYear) ||
        null,
      targetRoles,
      targetRole:
        targetRoles[0] ??
        null,
      preferredLocations,
      preferredWorkType:
        preferredWorkType ||
        null,
      github:
        github ||
        null,
      linkedin:
        linkedin ||
        null,
      portfolio:
        portfolioUrl ||
        null,
    }
    if (complete) body.completeOnboarding = true

    await api("/api/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  const handleNext = async () => {
    setStepError(null)
    if (
      step ===
      1
    ) {
      if (!university.trim())
        return setStepError("Please enter your college/university")
      if (!gradYear.trim() || !/^\d{4}$/.test(gradYear)) {
        return setStepError("Enter a valid graduation year (e.g. 2027)")
      }
      setSaving(true)
      try {
        await saveProfile(false)
        setStep(2)
      } catch (err) {
        setStepError(
          err instanceof
            Error
            ? err.message
            : "Failed to save",
        )
      } finally {
        setSaving(false)
      }
      return
    }

    if (
      step ===
      2
    ) {
      setSaving(true)
      try {
        for (const skill of skills) {
          await api("/api/skills", {
            method: "POST",
            body: JSON.stringify(skill),
          })
        }
        setStep(3)
      } catch (err) {
        setStepError(
          err instanceof
            Error
            ? err.message
            : "Failed to save skills",
        )
      } finally {
        setSaving(false)
      }
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveProfile(true)
      router.push("/dashboard")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete onboarding",
      )
    } finally {
      setSaving(false)
    }
  }

  const addSkill = (name: string) => {
    const trimmed = name.trim()
    if (
      !trimmed ||
      skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    )
      return
    setSkills((prev) => [
      ...prev,
      { name: trimmed, category: newSkillCategory, level: newSkillLevel },
    ])
  }

  const addChip = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
    setValue: (v: string) => void,
    max: number,
  ) => {
    const v = value.trim().replace(/,$/, "")
    if (!v || list.length >= max || list.includes(v)) return setValue("")
    setList([...list, v])
    setValue("")
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""} —
            let&apos;s build your profile
          </h1>
          <p className="text-sm text-zinc-400">
            Your unified student profile powers matching, roadmaps and your
            readiness score. Everything is saved as you go.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                  s < step
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : s === step
                      ? "bg-sky-500 border-sky-400 text-black"
                      : "bg-white/5 border-white/10 text-zinc-500"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-px w-12 ${
                    s < step ? "bg-emerald-500/50" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-5">
          {step === 1 && (
            <>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" /> Education & Career Goals
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="College / University *">
                  <input
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. MIT"
                    className={inputCls}
                  />
                </Field>
                <Field label="Degree">
                  <input
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.S. Computer Science"
                    className={inputCls}
                  />
                </Field>
                <Field label="Branch / Major">
                  <input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. AI & Systems"
                    className={inputCls}
                  />
                </Field>
                <Field label="Graduation Year *">
                  <input
                    value={gradYear}
                    onChange={(e) =>
                      setGradYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="e.g. 2027"
                    inputMode="numeric"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Target Roles (press Enter to add)">
                <ChipInput
                  values={targetRoles}
                  onAdd={() =>
                    addChip(
                      targetRoles,
                      setTargetRoles,
                      targetRoleInput,
                      setTargetRoleInput,
                      5,
                    )
                  }
                  inputValue={targetRoleInput}
                  onInputValueChange={setTargetRoleInput}
                  placeholder="e.g. Frontend Engineer"
                />
              </Field>
              <Field label="Preferred Locations">
                <ChipInput
                  values={preferredLocations}
                  onAdd={() =>
                    addChip(
                      preferredLocations,
                      setPreferredLocations,
                      locationInput,
                      setLocationInput,
                      8,
                    )
                  }
                  inputValue={locationInput}
                  onInputValueChange={setLocationInput}
                  placeholder="e.g. Remote, Bengaluru"
                />
              </Field>
              <Field label="Preferred Work Mode">
                <div className="flex gap-2">
                  {["remote", "hybrid", "onsite"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreferredWorkType(mode)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                        preferredWorkType === mode
                          ? "bg-sky-500 text-black"
                          : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4" /> Your Skills
              </div>
              <p className="text-xs text-zinc-500 -mt-3">
                Rate honestly — this drives your match scores and roadmap.
              </p>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.name}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2"
                    >
                      {s.name}
                      <span className="text-zinc-500 capitalize">
                        · {s.level}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSkills(skills.filter((x) => x.name !== s.name))
                        }
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addSkill(newSkillName),
                    setNewSkillName(""))
                  }
                  placeholder="Add a skill…"
                  className={inputCls}
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className={selectCls}
                >
                  {SKILL_CATEGORIES.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      className="bg-zinc-900"
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className={selectCls}
                >
                  {["beginner", "intermediate", "advanced", "expert"].map(
                    (l) => (
                      <option key={l} value={l} className="bg-zinc-900">
                        {l}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  addSkill(newSkillName)
                  setNewSkillName("")
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
              >
                + Add Skill
              </button>

              <div className="pt-2 space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  Quick add
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SKILLS.filter(
                    (cs) =>
                      !skills.some(
                        (s) => s.name.toLowerCase() === cs.toLowerCase(),
                      ),
                  ).map((cs) => (
                    <button
                      key={cs}
                      type="button"
                      onClick={() => addSkill(cs)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] text-zinc-400 hover:text-white hover:border-sky-500/40 transition"
                    >
                      + {cs}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Link2 className="w-4 h-4" /> Links & Finish
              </div>
              <Field label="GitHub">
                <input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/you"
                  className={inputCls}
                />
              </Field>
              <Field label="LinkedIn">
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/you"
                  className={inputCls}
                />
              </Field>
              <Field label="Existing Portfolio (optional)">
                <input
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://you.dev"
                  className={inputCls}
                />
              </Field>

              <div className="rounded-2xl bg-sky-500/10 border border-sky-500/20 p-4 space-y-1">
                <p className="text-xs font-bold text-sky-200">
                  Next up after onboarding
                </p>
                <p className="text-xs text-zinc-400">
                  Upload your resume for AI analysis, then explore internships
                  matched to this profile. You can update everything later from
                  the Profile page.
                </p>
              </div>
            </>
          )}

          {(stepError || error) && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{" "}
              {stepError ?? error}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button
              onClick={() =>
                step === 1 ? router.push("/login") : setStep(step - 1)
              }
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 disabled:opacity-50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-xs text-white hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {step === 3 ? "Finish & Open Dashboard" : "Continue"}{" "}
              {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition"
const selectCls = `${inputCls} appearance-none [&>option]:bg-zinc-900`

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-zinc-300">{label}</span>
      {children}
    </label>
  )
}

function ChipInput({
  values,
  onAdd,
  inputValue,
  onInputValueChange,
  placeholder,
}: {
  values: string[]
  onAdd: () => void
  inputValue: string
  onInputValueChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <input
        value={inputValue}
        onChange={(e) => onInputValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            onAdd()
          }
        }}
        onBlur={() => values.length > 0 && inputValue.trim() && onAdd()}
        placeholder={placeholder}
        className={inputCls}
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-sky-200"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
