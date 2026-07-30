"use client"

// Step 1: Education State

// Step 2: Target Roles State

// Step 3: Skills State

// Step 4: Resume & Social Links State

// Step 1 Validation

// Step 2 Role Toggle
// Keep at least one

// Step 3 Skill Helpers

// Step 4 File Dropzone Simulation
/* Background Lighting */ /* Wizard Header */ /* Wizard Card Shell */ /* STEP 1: Academic Background */ /* University Preset Chips */ /* STEP 2: Career Target Roles */ /* STEP 3: Technical Skills & 1-5 Sliders */ /* Category Filter Pills */ /* Add Custom Skill Form */ /* Skills Sliders List */ /* STEP 4: Resume PDF & Social Links */ /* File Dropzone */ /* Social Links */

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { InternEdgeLogo } from "@/components/brand/InternEdgeLogo"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Target,
  Code,
  FileText,
  Upload,
  Plus,
  X,
  Sparkles,
  AlertCircle,
  FileCheck,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SkillItem {
  name: string
  category: "frontend" | "backend" | "ai_ml" | "devops" | "database" | "other"
  level: number
}

const PRESET_UNIVERSITIES = [
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "UC Berkeley",
  "Carnegie Mellon University (CMU)",
  "Harvard University",
  "IIT Bombay",
  "Oxford University",
]

const CAREER_ROLES = [
  { id: "fullstack", title: "Full-Stack Engineer", icon: "⚡" },
  { id: "ai_ml", title: "AI/ML Systems Specialist", icon: "🤖" },
  { id: "backend", title: "Backend Infrastructure", icon: "⚙️" },
  { id: "frontend", title: "Frontend Engineering (Next.js)", icon: "🎨" },
  { id: "cloud", title: "DevOps & Cloud Systems", icon: "☁️" },
  { id: "mobile", title: "Mobile Engineer (iOS/Android)", icon: "📱" },
  { id: "quant", title: "Quant & Low-Latency Systems", icon: "📊" },
  { id: "security", title: "Cybersecurity & Kernel", icon: "🛡️" },
]

const INITIAL_SKILLS: SkillItem[] = [
  { name: "TypeScript", category: "frontend", level: 4 },
  { name: "React 19 & Next.js", category: "frontend", level: 4 },
  { name: "Tailwind CSS v4", category: "frontend", level: 5 },
  { name: "Convex DB", category: "backend", level: 4 },
  { name: "Python & PyTorch", category: "ai_ml", level: 3 },
  { name: "PostgreSQL", category: "database", level: 3 },
]

const SKILL_LEVEL_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { completeOnboarding, user } = useAuth()
  const [college, setCollege] = useState("Stanford University")
  const [degree, setDegree] = useState("B.S. Computer Science")
  const [branch, setBranch] = useState("Artificial Intelligence & Systems")
  const [gradYear, setGradYear] = useState("2026")
  const [step1Error, setStep1Error] = useState<string | null>(null)
  const [targetRoles, setTargetRoles] = useState<string[]>([
    "Full-Stack Engineer",
    "AI/ML Systems Specialist",
  ])
  const [primaryRole, setPrimaryRole] = useState("Full-Stack Engineer")
  const [skillsList, setSkillsList] = useState<SkillItem[]>(INITIAL_SKILLS)
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("all")
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] =
    useState<SkillItem["category"]>("frontend")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [github, setGithub] = useState("https://github.com/alexrivera")
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/alexrivera")
  const [portfolio, setPortfolio] = useState("https://alexrivera.dev")
  const validateStep1 = () => {
    if (!college.trim()) {
      setStep1Error("Please enter or select your university.")
      return false
    }
    if (!degree.trim()) {
      setStep1Error("Please enter your degree and major.")
      return false
    }
    if (!gradYear.trim() || isNaN(Number(gradYear))) {
      setStep1Error("Please enter a valid graduation year.")
      return false
    }
    setStep1Error(null)
    return true
  }

  const handleNextStep1 = () => {
    if (validateStep1()) setStep(2)
  }
  const toggleRole = (roleTitle: string) => {
    setTargetRoles((prev) => {
      if (prev.includes(roleTitle)) {
        if (prev.length === 1) return prev
        const updated = prev.filter((r) => r !== roleTitle)
        if (primaryRole === roleTitle) setPrimaryRole(updated[0])
        return updated
      } else {
        return [...prev, roleTitle]
      }
    })
  }
  const handleUpdateSkillLevel = (name: string, level: number) => {
    setSkillsList((prev) =>
      prev.map((item) => (item.name === name ? { ...item, level } : item)),
    )
  }

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    if (
      skillsList.some(
        (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase(),
      )
    ) {
      setNewSkillName("")
      return
    }
    setSkillsList((prev) => [
      ...prev,
      { name: newSkillName.trim(), category: newSkillCategory, level: 3 },
    ])
    setNewSkillName("")
  }

  const handleRemoveSkill = (name: string) => {
    setSkillsList((prev) => prev.filter((s) => s.name !== name))
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setIsParsingResume(true)
      setTimeout(() => setIsParsingResume(false), 1200)
    }
  }

  const handleFinish = () => {
    completeOnboarding({
      isOnboarded: true,
      name: user?.name || "Alex Rivera",
    })
    router.push("/dashboard")
  }

  const filteredSkills =
    activeCategoryFilter === "all"
      ? skillsList
      : skillsList.filter((s) => s.category === activeCategoryFilter)

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {}
        <div className="flex items-center justify-between mb-8">
          <InternEdgeLogo size="sm" variant="liquid-glass" />
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === step
                      ? "w-8 bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-500/30"
                      : i < step
                        ? "w-4 bg-sky-500/60"
                        : "w-4 bg-white/10"
                  }`}
                />
              </div>
            ))}
            <span className="text-xs font-mono text-zinc-400 ml-2">
              Step {step} of 4
            </span>
          </div>
        </div>

        {}
        <div className="material-glass p-8 rounded-3xl border border-white/10 shadow-2xl relative backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Education & Academic Background
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Specify your university and major to personalize
                      internship matching algorithms
                    </p>
                  </div>
                </div>

                {step1Error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{step1Error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      University / Institution
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => {
                        setCollege(e.target.value)
                        if (step1Error) setStep1Error(null)
                      }}
                      placeholder="e.g. Stanford University"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400 transition"
                    />
                    {}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {PRESET_UNIVERSITIES.slice(0, 4).map((uni) => (
                        <button
                          key={uni}
                          type="button"
                          onClick={() => setCollege(uni)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                            college === uni
                              ? "bg-sky-500/20 border-sky-400/50 text-sky-300"
                              : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                          }`}
                        >
                          {uni}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Degree & Major
                      </label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="B.S. Computer Science"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        placeholder="2026"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Branch / Concentration
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="Artificial Intelligence & Systems"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-sm text-white hover:opacity-95 transition flex items-center justify-center gap-2 mt-6 shadow-lg shadow-sky-500/20"
                >
                  Continue to Career Target Roles{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Target Roles & Career Focus
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Select roles you are targeting for upcoming application
                        cycles
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {targetRoles.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {CAREER_ROLES.map((role) => {
                    const isSelected = targetRoles.includes(role.title)
                    const isPrimary = primaryRole === role.title
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.title)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition relative flex items-center justify-between ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/5"
                            : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{role.icon}</span>
                          <div>
                            <div>{role.title}</div>
                            {isPrimary && (
                              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">
                                Primary Target
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-sm text-zinc-300 transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-sm text-black hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    Configure Skill Vector <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Code className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Technical Skills & Proficiency
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Adjust 1-5 proficiency sliders to seed your AI Skill Gap
                        Matrix
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {skillsList.length} Skills
                  </span>
                </div>

                {}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: "all", label: "All Skills" },
                    { id: "frontend", label: "Frontend" },
                    { id: "backend", label: "Backend" },
                    { id: "ai_ml", label: "AI/ML" },
                    { id: "database", label: "Database" },
                    { id: "devops", label: "DevOps" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition shrink-0 ${
                        activeCategoryFilter === cat.id
                          ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-semibold"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Add custom skill (e.g. Rust, CUDA, GraphQL)..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={(e) =>
                      setNewSkillCategory(
                        e.target.value as SkillItem["category"],
                      )
                    }
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="frontend" className="bg-[#121212]">
                      Frontend
                    </option>
                    <option value="backend" className="bg-[#121212]">
                      Backend
                    </option>
                    <option value="ai_ml" className="bg-[#121212]">
                      AI/ML
                    </option>
                    <option value="database" className="bg-[#121212]">
                      Database
                    </option>
                    <option value="devops" className="bg-[#121212]">
                      DevOps
                    </option>
                    <option value="other" className="bg-[#121212]">
                      Other
                    </option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </form>

                {}
                <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 relative group"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {skill.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 uppercase font-mono">
                            {skill.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-mono font-semibold">
                            Level {skill.level}/5 (
                            {SKILL_LEVEL_LABELS[skill.level]})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill.name)}
                            className="text-zinc-500 hover:text-red-400 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={skill.level}
                        onChange={(e) =>
                          handleUpdateSkillLevel(
                            skill.name,
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-sm text-zinc-300 transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 font-semibold text-sm text-black hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    Upload Resume & Links <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Resume Upload & Online Profiles
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Upload your PDF resume to trigger automatic ATS keyword
                      score parsing
                    </p>
                  </div>
                </div>

                {}
                <label className="block border-2 border-dashed border-white/15 hover:border-purple-400/50 rounded-2xl p-6 text-center bg-white/[0.02] cursor-pointer transition relative group">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center space-y-2">
                      <FileCheck className="w-8 h-8 text-emerald-400 animate-bounce" />
                      <p className="text-sm font-semibold text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •
                        Ready for ATS Analysis
                      </p>
                      {isParsingResume && (
                        <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />{" "}
                          Parsing keywords & ATS score...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                      <p className="text-xs font-semibold text-white">
                        Drop your PDF Resume here or click to browse
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Supports PDF, DOCX up to 10MB
                      </p>
                    </div>
                  )}
                </label>

                {}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Portfolio / Personal Site URL
                    </label>
                    <input
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://yourname.dev"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-sm text-zinc-300 transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-sky-500 hover:opacity-95 font-semibold text-sm text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    Complete Profile & Launch Dashboard{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
