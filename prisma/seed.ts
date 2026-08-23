import { loadEnvFile } from "node:process"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

/**
 * InternEdge Extensive & Production-Grade Seed Data Pipeline
 * Populates 20 Top-Tier Tech Companies & AI Unicorns, 40+ Realistic Internships,
 * 4 Student Profiles, Skills, Projects, Work Experiences, Resumes with ATS Scorecards,
 * 3 Career Roadmaps & Granular Tasks, Application Tracker Items across all 7 statuses,
 * 5 Mock Interview Scorecards with Q&A Transcripts, Activity Feeds, and Notifications.
 */

try {
  loadEnvFile()
} catch {}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Check if companies already exist
  const existingCompanies = await prisma.company.count()
  if (existingCompanies > 0) {
    console.log("Database already seeded!")
    return
  }

  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  // ==========================================
  // 1. SEED 20 TOP TECH COMPANIES & AI UNICORNS
  // ==========================================
  const googleId = await prisma.company.create({
    data: {
      name: "Google",
      description:
        "Organizing the world's information and making it universally accessible through Search, Cloud, Android, and Gemini AI.",
      website: "https://google.com",
      industry: "Technology & Cloud Systems",
      logo: "https://www.google.com/favicon.ico",
      logoUrl: "https://www.google.com/favicon.ico",
      size: "100,000+ employees",
    },
  })

  const microsoftId = await prisma.company.create({
    data: {
      name: "Microsoft",
      description:
        "Empowering every person and organization on the planet to achieve more through Azure cloud, Copilot AI, Windows, and Developer Tools.",
      website: "https://microsoft.com",
      industry: "Software & Cloud Computing",
      logo: "https://www.microsoft.com/favicon.ico",
      logoUrl: "https://www.microsoft.com/favicon.ico",
      size: "100,000+ employees",
    },
  })

  const openaiId = await prisma.company.create({
    data: {
      name: "OpenAI",
      description:
        "Building safe and beneficial artificial general intelligence through frontier LLM research (GPT-4o, o1, Sora).",
      website: "https://openai.com",
      industry: "Artificial Intelligence",
      logo: "https://openai.com/favicon.ico",
      logoUrl: "https://openai.com/favicon.ico",
      size: "1,000-5,000 employees",
    },
  })

  const anthropicId = await prisma.company.create({
    data: {
      name: "Anthropic",
      description:
        "AI research and safety company building reliable, interpretable, and steerable AI systems (Claude 3.5 Sonnet).",
      website: "https://anthropic.com",
      industry: "Artificial Intelligence & Safety",
      logo: "https://anthropic.com/favicon.ico",
      logoUrl: "https://anthropic.com/favicon.ico",
      size: "500-1,000 employees",
    },
  })

  const nvidiaId = await prisma.company.create({
    data: {
      name: "NVIDIA",
      description:
        "Pioneering accelerated computing, GPU hardware, CUDA software, and Blackwell AI supercomputing infrastructure.",
      website: "https://nvidia.com",
      industry: "Semiconductors & AI Hardware",
      logo: "https://www.nvidia.com/favicon.ico",
      logoUrl: "https://www.nvidia.com/favicon.ico",
      size: "25,000-50,000 employees",
    },
  })

  const scaleAiId = await prisma.company.create({
    data: {
      name: "Scale AI",
      description:
        "Providing high-quality data infrastructure and RLHF human feedback to power frontier AI foundation models.",
      website: "https://scale.com",
      industry: "AI Data & Data Infrastructure",
      logo: "https://scale.com/favicon.ico",
      logoUrl: "https://scale.com/favicon.ico",
      size: "1,000-5,000 employees",
    },
  })

  const vercelId = await prisma.company.create({
    data: {
      name: "Vercel",
      description:
        "Frontend cloud platform for Next.js, React, serverless runtimes, and AI SDK developer tooling.",
      website: "https://vercel.com",
      industry: "Cloud & Developer Tools",
      logo: "https://vercel.com/favicon.ico",
      logoUrl: "https://vercel.com/favicon.ico",
      size: "500-1,000 employees",
    },
  })

  const stripeId = await prisma.company.create({
    data: {
      name: "Stripe",
      description:
        "Financial infrastructure for the internet, powering global online payments, billing, and risk mitigation.",
      website: "https://stripe.com",
      industry: "Fintech & Payments",
      logo: "https://stripe.com/favicon.ico",
      logoUrl: "https://stripe.com/favicon.ico",
      size: "5,000-10,000 employees",
    },
  })

  const figmaId = await prisma.company.create({
    data: {
      name: "Figma",
      description:
        "Collaborative interface design and product development platform for global design and software teams.",
      website: "https://figma.com",
      industry: "Design & Software Engineering",
      logo: "https://figma.com/favicon.ico",
      logoUrl: "https://figma.com/favicon.ico",
      size: "1,000-5,000 employees",
    },
  })

  const appleId = await prisma.company.create({
    data: {
      name: "Apple",
      description:
        "Designing world-class hardware, iOS/macOS operating systems, Apple Silicon chips, and Apple Intelligence.",
      website: "https://apple.com",
      industry: "Consumer Electronics & OS",
      logo: "https://www.apple.com/favicon.ico",
      logoUrl: "https://www.apple.com/favicon.ico",
      size: "100,000+ employees",
    },
  })

  const metaId = await prisma.company.create({
    data: {
      name: "Meta",
      description:
        "Building technologies that help people connect, featuring PyTorch, Llama 3, Meta Quest, and Threads.",
      website: "https://meta.com",
      industry: "Social Media & Spatial AI",
      logo: "https://www.meta.com/favicon.ico",
      logoUrl: "https://www.meta.com/favicon.ico",
      size: "50,000-100,000 employees",
    },
  })

  const amazonId = await prisma.company.create({
    data: {
      name: "Amazon",
      description:
        "Global leader in AWS cloud infrastructure, e-commerce, digital streaming, and autonomous supply chain systems.",
      website: "https://amazon.com",
      industry: "Cloud (AWS) & E-Commerce",
      logo: "https://www.amazon.com/favicon.ico",
      logoUrl: "https://www.amazon.com/favicon.ico",
      size: "100,000+ employees",
    },
  })

  const netflixId = await prisma.company.create({
    data: {
      name: "Netflix",
      description:
        "Reinventing digital entertainment streaming and personalized recommendation systems for 270+ million members.",
      website: "https://netflix.com",
      industry: "Digital Media & Streaming",
      logo: "https://www.netflix.com/favicon.ico",
      logoUrl: "https://www.netflix.com/favicon.ico",
      size: "10,000+ employees",
    },
  })

  const datadogId = await prisma.company.create({
    data: {
      name: "Datadog",
      description:
        "Essential cloud observability, APM distributed tracing, and security monitoring platform.",
      website: "https://datadoghq.com",
      industry: "DevOps & Cloud Observability",
      logo: "https://www.datadoghq.com/favicon.ico",
      logoUrl: "https://www.datadoghq.com/favicon.ico",
      size: "5,000-10,000 employees",
    },
  })

  const airbnbId = await prisma.company.create({
    data: {
      name: "Airbnb",
      description:
        "Global community marketplace connecting travelers with unique accommodations and host experiences.",
      website: "https://airbnb.com",
      industry: "Travel & Online Marketplaces",
      logo: "https://www.airbnb.com/favicon.ico",
      logoUrl: "https://www.airbnb.com/favicon.ico",
      size: "5,000-10,000 employees",
    },
  })

  const uberId = await prisma.company.create({
    data: {
      name: "Uber",
      description:
        "Reinventing urban mobility, logistics, and delivery with real-time dispatching and routing algorithms.",
      website: "https://uber.com",
      industry: "Transportation & Logistics Tech",
      logo: "https://www.uber.com/favicon.ico",
      logoUrl: "https://www.uber.com/favicon.ico",
      size: "25,000-50,000 employees",
    },
  })

  const snowflakeId = await prisma.company.create({
    data: {
      name: "Snowflake",
      description:
        "Cloud Data Platform enabling data warehousing, data engineering, and multi-cloud data sharing.",
      website: "https://snowflake.com",
      industry: "Cloud Data Warehousing",
      logo: "https://www.snowflake.com/favicon.ico",
      logoUrl: "https://www.snowflake.com/favicon.ico",
      size: "5,000-10,000 employees",
    },
  })

  const cloudflareId = await prisma.company.create({
    data: {
      name: "Cloudflare",
      description:
        "Global connectivity cloud powering web security, DDoS protection, edge workers, and DNS infrastructure.",
      website: "https://cloudflare.com",
      industry: "Edge Cloud & Cyber Security",
      logo: "https://www.cloudflare.com/favicon.ico",
      logoUrl: "https://www.cloudflare.com/favicon.ico",
      size: "1,000-5,000 employees",
    },
  })

  const palantirId = await prisma.company.create({
    data: {
      name: "Palantir",
      description:
        "Building enterprise software platforms (Foundry, AIP) for data integration, AI decision-making, and defense.",
      website: "https://palantir.com",
      industry: "Enterprise AI & Big Data",
      logo: "https://www.palantir.com/favicon.ico",
      logoUrl: "https://www.palantir.com/favicon.ico",
      size: "1,000-5,000 employees",
    },
  })

  const coinbaseId = await prisma.company.create({
    data: {
      name: "Coinbase",
      description:
        "Building the cryptoeconomy—a more fair, accessible, efficient, and transparent financial system.",
      website: "https://coinbase.com",
      industry: "Crypto & Blockchain Infrastructure",
      logo: "https://www.coinbase.com/favicon.ico",
      logoUrl: "https://www.coinbase.com/favicon.ico",
      size: "1,000-5,000 employees",
    },
  })

  // ==========================================
  // 2. SEED 40+ HIGHLY DETAILED REALISTIC INTERNSHIPS
  // ==========================================
  const internshipsList = [
    // OpenAI (2)
    {
      companyId: openaiId.id,
      title: "AI Research & Systems Engineering Intern",
      description:
        "Work alongside leading AI researchers on LLM alignment, high-throughput vLLM inference engines, and distributed GPU cluster training infrastructure.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$65 - $80 / hr",
      deadline: new Date(now + 30 * day),
      requiredSkills: [
        "Python",
        "PyTorch",
        "CUDA",
        "Distributed Systems",
        "LLMs",
      ],
      applicationUrl: "https://openai.com/careers",
    },
    {
      companyId: openaiId.id,
      title: "Machine Learning Alignment & Safety Intern",
      description:
        "Investigate mathematical guarantees and empirical evaluations for frontier AI model safety, mechanistic interpretability, and RLHF fine-tuning pipelines.",
      location: "San Francisco, CA",
      workType: "remote",
      salary: "$70 - $85 / hr",
      deadline: new Date(now + 25 * day),
      requiredSkills: [
        "Python",
        "RLHF",
        "Transformer Models",
        "PyTorch",
        "Interpretability",
      ],
      applicationUrl: "https://openai.com/careers",
    },
    // Anthropic (2)
    {
      companyId: anthropicId.id,
      title: "Claude Core AI Safety Research Intern",
      description:
        "Develop novel scalable oversight methods, constitutional AI evaluation frameworks, and Mechanistic Interpretability tools for Claude models.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$68 - $82 / hr",
      deadline: new Date(now + 28 * day),
      requiredSkills: [
        "Python",
        "PyTorch",
        "Mechanistic Interpretability",
        "Transformers",
        "Jax",
      ],
      applicationUrl: "https://anthropic.com/careers",
    },
    {
      companyId: anthropicId.id,
      title: "Distributed Infrastructure & GPU Systems Intern",
      description:
        "Architect high-speed Infiniband collective communication libraries and Triton GPU kernel fusion for thousands of H100/B200 accelerators.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$72 - $88 / hr",
      deadline: new Date(now + 22 * day),
      requiredSkills: [
        "C++",
        "CUDA",
        "Triton",
        "Infiniband",
        "Distributed Training",
      ],
      applicationUrl: "https://anthropic.com/careers",
    },
    // NVIDIA (2)
    {
      companyId: nvidiaId.id,
      title: "CUDA Compiler & Tensor Core Architect Intern",
      description:
        "Design Next-Gen LLVM CUDA compiler passes optimizing matrix multiplication micro-kernels on Blackwell GPU architectures.",
      location: "Santa Clara, CA",
      workType: "onsite",
      salary: "$60 - $75 / hr",
      deadline: new Date(now + 35 * day),
      requiredSkills: [
        "C++",
        "CUDA",
        "LLVM",
        "GPU Microarchitecture",
        "Parallel Algorithms",
      ],
      applicationUrl: "https://nvidia.com/careers",
    },
    {
      companyId: nvidiaId.id,
      title: "Omniverse & Ray Tracing Engine Intern",
      description:
        "Implement real-time path tracing shaders and OptiX ray tracing extensions for industrial digital twin simulations.",
      location: "Santa Clara, CA",
      workType: "hybrid",
      salary: "$58 - $72 / hr",
      deadline: new Date(now + 40 * day),
      requiredSkills: [
        "C++",
        "OptiX",
        "Vulkan",
        "HLSL/GLSL",
        "Computer Graphics",
      ],
      applicationUrl: "https://nvidia.com/careers",
    },
    // Scale AI (2)
    {
      companyId: scaleAiId.id,
      title: "RLHF Data Pipeline Engineering Intern",
      description:
        "Build automated data cleaning, automated red-teaming, and LLM reward model evaluation datasets for Fortune 500 AI models.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$55 - $68 / hr",
      deadline: new Date(now + 20 * day),
      requiredSkills: [
        "Python",
        "TypeScript",
        "PostgreSQL",
        "LLM Evaluation",
        "Kafka",
      ],
      applicationUrl: "https://scale.com/careers",
    },
    {
      companyId: scaleAiId.id,
      title: "Full-Stack AI Data Platform Intern",
      description:
        "Engineer high-throughput React web interfaces and Go microservices for real-time human annotator consensus scoring.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$52 - $65 / hr",
      deadline: new Date(now + 18 * day),
      requiredSkills: [
        "TypeScript",
        "React",
        "Go",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      applicationUrl: "https://scale.com/careers",
    },
    // Vercel (2)
    {
      companyId: vercelId.id,
      title: "Frontend Engineering Intern (Next.js Core)",
      description:
        "Help build the future of the web with React 19, Server Components, and Turbopack compiler engineering.",
      location: "Remote",
      workType: "remote",
      salary: "$48 - $58 / hr",
      deadline: new Date(now + 20 * day),
      requiredSkills: [
        "TypeScript",
        "Next.js",
        "React",
        "Tailwind CSS",
        "Web Performance",
      ],
      applicationUrl: "https://vercel.com/careers",
    },
    {
      companyId: vercelId.id,
      title: "Edge Runtime & Compiler Systems Intern",
      description:
        "Engineer Rust-based web bundlers, Turbopack optimizations, and edge computing V8 isolate infrastructure.",
      location: "Remote",
      workType: "remote",
      salary: "$50 - $62 / hr",
      deadline: new Date(now + 15 * day),
      requiredSkills: [
        "Rust",
        "TypeScript",
        "WebAssembly",
        "V8 Isolates",
        "Compilers",
      ],
      applicationUrl: "https://vercel.com/careers",
    },
    // Google (2)
    {
      companyId: googleId.id,
      title: "Software Engineering Intern - Cloud Systems",
      description:
        "Design and implement scalable microservices powering Google Cloud Platform's Kubernetes engine (GKE) and serverless infrastructure.",
      location: "Mountain View, CA",
      workType: "onsite",
      salary: "$52 - $64 / hr",
      deadline: new Date(now + 30 * day),
      requiredSkills: [
        "Go",
        "C++",
        "Kubernetes",
        "Distributed Systems",
        "gRPC",
      ],
      applicationUrl: "https://careers.google.com",
    },
    {
      companyId: googleId.id,
      title: "Gemini AI & Multimodal Models Intern",
      description:
        "Train multimodal vision-language architectures, speech synthesis pipelines, and video understanding models on Google TPU v5p pods.",
      location: "Mountain View, CA",
      workType: "onsite",
      salary: "$58 - $70 / hr",
      deadline: new Date(now + 42 * day),
      requiredSkills: [
        "Python",
        "JAX",
        "Flax",
        "TPU Infrastructure",
        "Multimodal AI",
      ],
      applicationUrl: "https://careers.google.com",
    },
    // Stripe (2)
    {
      companyId: stripeId.id,
      title: "Backend Engineering Intern (Fintech Core)",
      description:
        "Architect high-reliability payment APIs handling millions of global transactions daily with microsecond latency.",
      location: "Seattle, WA",
      workType: "hybrid",
      salary: "$54 - $62 / hr",
      deadline: new Date(now + 20 * day),
      requiredSkills: [
        "Ruby",
        "Go",
        "PostgreSQL",
        "API Design",
        "Distributed Transactions",
      ],
      applicationUrl: "https://stripe.com/jobs",
    },
    {
      companyId: stripeId.id,
      title: "Financial Fraud & Machine Learning Intern",
      description:
        "Develop real-time fraud detection models analyzing millions of transaction signals using gradient-boosted trees and deep neural nets.",
      location: "New York, NY",
      workType: "hybrid",
      salary: "$56 - $65 / hr",
      deadline: new Date(now + 28 * day),
      requiredSkills: [
        "Python",
        "SQL",
        "Scikit-Learn",
        "Feature Engineering",
        "Kafka",
      ],
      applicationUrl: "https://stripe.com/jobs",
    },
    // Figma (2)
    {
      companyId: figmaId.id,
      title: "WebGL & Graphics Engine Intern",
      description:
        "Optimize high-performance 2D/3D canvas rendering engine for real-time multiplayer vector graphics.",
      location: "New York, NY",
      workType: "hybrid",
      salary: "$50 - $60 / hr",
      deadline: new Date(now + 30 * day),
      requiredSkills: [
        "TypeScript",
        "WebGL",
        "WebAssembly",
        "C++",
        "Canvas API",
      ],
      applicationUrl: "https://figma.com/careers",
    },
    {
      companyId: figmaId.id,
      title: "Collaborative Real-time Systems Intern",
      description:
        "Build real-time CRDT (Conflict-Free Replicated Data Types) synchronization systems for multi-user design canvas editing.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$48 - $58 / hr",
      deadline: new Date(now + 22 * day),
      requiredSkills: [
        "TypeScript",
        "CRDTs",
        "WebSockets",
        "Distributed Systems",
        "Algorithms",
      ],
      applicationUrl: "https://figma.com/careers",
    },
    // Microsoft (2)
    {
      companyId: microsoftId.id,
      title: "Azure Cloud & Distributed Infrastructure Intern",
      description:
        "Build hyper-scale cloud storage services, fault-tolerant consensus protocols, and automated cluster recovery tooling.",
      location: "Redmond, WA",
      workType: "hybrid",
      salary: "$50 - $60 / hr",
      deadline: new Date(now + 24 * day),
      requiredSkills: [
        "C#",
        "C++",
        "Distributed Systems",
        "Azure",
        "Multi-threading",
      ],
      applicationUrl: "https://careers.microsoft.com",
    },
    {
      companyId: microsoftId.id,
      title: "Copilot AI & Developer Tooling Intern",
      description:
        "Integrate multi-modal generative AI models into VS Code, GitHub Copilot, and Office productivity suites.",
      location: "Redmond, WA",
      workType: "hybrid",
      salary: "$54 - $65 / hr",
      deadline: new Date(now + 35 * day),
      requiredSkills: [
        "Python",
        "TypeScript",
        "C#",
        "ONNX Runtime",
        "LLM Integration",
      ],
      applicationUrl: "https://careers.microsoft.com",
    },
    // Apple (2)
    {
      companyId: appleId.id,
      title: "CoreOS Kernel & Performance Intern",
      description:
        "Work on low-level Darwin kernel memory management, Apple Silicon GPU drivers, and system latency profiling tools.",
      location: "Cupertino, CA",
      workType: "onsite",
      salary: "$55 - $65 / hr",
      deadline: new Date(now + 32 * day),
      requiredSkills: ["C", "C++", "Assembly", "OS Kernel", "Arm Architecture"],
      applicationUrl: "https://jobs.apple.com",
    },
    {
      companyId: appleId.id,
      title: "iOS Frameworks & Swift Concurrency Intern",
      description:
        "Build high-performance UI frameworks, Metal graphics shaders, and Swift Concurrency runtime features for iOS 19.",
      location: "Cupertino, CA",
      workType: "onsite",
      salary: "$50 - $60 / hr",
      deadline: new Date(now + 18 * day),
      requiredSkills: ["Swift", "SwiftUI", "Objective-C", "Metal", "iOS SDK"],
      applicationUrl: "https://jobs.apple.com",
    },
    // Meta (2)
    {
      companyId: metaId.id,
      title: "AI Infrastructure & PyTorch Core Intern",
      description:
        "Optimize deep learning tensor compilers, distributed training backends (NCCL), and GPU memory management for Llama models.",
      location: "Menlo Park, CA",
      workType: "hybrid",
      salary: "$58 - $70 / hr",
      deadline: new Date(now + 26 * day),
      requiredSkills: ["Python", "C++", "CUDA", "PyTorch", "GPU Architecture"],
      applicationUrl: "https://metacareers.com",
    },
    {
      companyId: metaId.id,
      title: "Reality Labs & Spatial Computing Intern",
      description:
        "Develop 6DOF tracking algorithms, computer vision pipelines, and hand gesture recognition models for Meta Quest HMDs.",
      location: "Burlingame, CA",
      workType: "hybrid",
      salary: "$52 - $62 / hr",
      deadline: new Date(now + 29 * day),
      requiredSkills: [
        "C++",
        "OpenCV",
        "Computer Vision",
        "SLAM",
        "Linear Algebra",
      ],
      applicationUrl: "https://metacareers.com",
    },
    // Amazon (2)
    {
      companyId: amazonId.id,
      title: "AWS Serverless Container Runtime Intern",
      description:
        "Build ultra-low latency serverless Firecracker microVM container runtimes powering AWS Lambda and ECS Fargate.",
      location: "Seattle, WA",
      workType: "hybrid",
      salary: "$50 - $60 / hr",
      deadline: new Date(now + 21 * day),
      requiredSkills: ["Rust", "C", "Go", "AWS", "Linux Kernel"],
      applicationUrl: "https://amazon.jobs",
    },
    {
      companyId: amazonId.id,
      title: "Robotics & Autonomous Navigation Intern",
      description:
        "Design autonomous mobile robot navigation software, multi-agent fleet dispatching algorithms, and computer vision systems.",
      location: "Boston, MA",
      workType: "hybrid",
      salary: "$52 - $62 / hr",
      deadline: new Date(now + 33 * day),
      requiredSkills: [
        "C++",
        "ROS2",
        "Python",
        "Path Planning",
        "Control Theory",
      ],
      applicationUrl: "https://amazon.jobs",
    },
    // Netflix (2)
    {
      companyId: netflixId.id,
      title: "Real-time Video Streaming & Edge Systems Intern",
      description:
        "Architect dynamic bitrate video adaptive streaming protocols, AV1 codec hardware acceleration, and CDN edge caches.",
      location: "Los Gatos, CA",
      workType: "hybrid",
      salary: "$55 - $65 / hr",
      deadline: new Date(now + 27 * day),
      requiredSkills: [
        "Java",
        "C++",
        "Video Codecs",
        "Networking Protocols",
        "CDNs",
      ],
      applicationUrl: "https://jobs.netflix.com",
    },
    {
      companyId: netflixId.id,
      title: "Recommendation Algorithms & ML Intern",
      description:
        "Build contextual bandit algorithms and personalized deep learning recommenders serving customized artwork and titles.",
      location: "Los Gatos, CA",
      workType: "hybrid",
      salary: "$56 - $68 / hr",
      deadline: new Date(now + 31 * day),
      requiredSkills: [
        "Python",
        "Spark",
        "PyTorch",
        "Recommender Systems",
        "A/B Testing",
      ],
      applicationUrl: "https://jobs.netflix.com",
    },
    // Datadog (2)
    {
      companyId: datadogId.id,
      title: "Distributed Tracing & Telemetry Engineering Intern",
      description:
        "Engineer high-throughput telemetry ingestion pipelines processing trillions of span metrics per day with sub-second ingestion.",
      location: "Remote",
      workType: "remote",
      salary: "$50 - $60 / hr",
      deadline: new Date(now + 19 * day),
      requiredSkills: [
        "Go",
        "Kafka",
        "ClickHouse",
        "Distributed Systems",
        "eBPF",
      ],
      applicationUrl: "https://careers.datadoghq.com",
    },
    {
      companyId: datadogId.id,
      title: "eBPF Security & Observability Kernel Intern",
      description:
        "Develop eBPF Linux kernel probes capturing network sockets, process executions, and zero-day security anomalies.",
      location: "Remote",
      workType: "remote",
      salary: "$52 - $64 / hr",
      deadline: new Date(now + 24 * day),
      requiredSkills: ["C", "Go", "eBPF", "Linux Kernel", "Cyber Security"],
      applicationUrl: "https://careers.datadoghq.com",
    },
    // Airbnb (2)
    {
      companyId: airbnbId.id,
      title: "Full-Stack Platform & Payments Engineering Intern",
      description:
        "Build multi-currency guest checkouts, global host payout systems, and responsive React web experiences.",
      location: "Remote",
      workType: "remote",
      salary: "$52 - $62 / hr",
      deadline: new Date(now + 23 * day),
      requiredSkills: ["TypeScript", "React", "Java", "GraphQL", "MySQL"],
      applicationUrl: "https://careers.airbnb.com",
    },
    {
      companyId: airbnbId.id,
      title: "Search Ranking & Dynamic Pricing ML Intern",
      description:
        "Engineer transformer recommendation algorithms matching guests to host listings based on real-time price elasticity.",
      location: "Remote",
      workType: "remote",
      salary: "$55 - $66 / hr",
      deadline: new Date(now + 29 * day),
      requiredSkills: ["Python", "PyTorch", "Spark", "Search Ranking", "MLOps"],
      applicationUrl: "https://careers.airbnb.com",
    },
    // Uber (2)
    {
      companyId: uberId.id,
      title: "Real-time Dispatching & Spatial Algorithms Intern",
      description:
        "Optimize Uber's H3 spatial indexing and real-time rider-driver matching algorithms serving millions of trips.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$54 - $64 / hr",
      deadline: new Date(now + 21 * day),
      requiredSkills: [
        "Go",
        "Java",
        "Graph Algorithms",
        "Spatial Indexing",
        "Kafka",
      ],
      applicationUrl: "https://uber.com/careers",
    },
    {
      companyId: uberId.id,
      title: "Autonomous Delivery & Perception Systems Intern",
      description:
        "Develop 3D bounding box perception and LiDAR sensor fusion algorithms for Uber Eats sidewalk delivery robots.",
      location: "San Francisco, CA",
      workType: "hybrid",
      salary: "$55 - $65 / hr",
      deadline: new Date(now + 34 * day),
      requiredSkills: ["C++", "Python", "LiDAR", "Computer Vision", "TensorRT"],
      applicationUrl: "https://uber.com/careers",
    },
    // Snowflake (2)
    {
      companyId: snowflakeId.id,
      title: "Database Engine & Query Compiler Intern",
      description:
        "Work on vectorized SQL query execution engines, columnar storage formats, and parallel query planners.",
      location: "San Mateo, CA",
      workType: "hybrid",
      salary: "$54 - $65 / hr",
      deadline: new Date(now + 27 * day),
      requiredSkills: [
        "C++",
        "Java",
        "Database Systems",
        "Vectorized Execution",
        "SQL",
      ],
      applicationUrl: "https://snowflake.com/careers",
    },
    {
      companyId: snowflakeId.id,
      title: "Snowpark Container Services & Kubernetes Intern",
      description:
        "Architect secure multi-tenant container runtimes executing custom Python and ML code inside data warehouses.",
      location: "San Mateo, CA",
      workType: "hybrid",
      salary: "$52 - $62 / hr",
      deadline: new Date(now + 19 * day),
      requiredSkills: [
        "Go",
        "Kubernetes",
        "Docker",
        "Security Sandboxing",
        "Python",
      ],
      applicationUrl: "https://snowflake.com/careers",
    },
    // Cloudflare (2)
    {
      companyId: cloudflareId.id,
      title: "Edge Workers Runtime & V8 Systems Intern",
      description:
        "Improve zero-overhead cold-start latencies of V8 JavaScript isolates executing at 300+ global edge locations.",
      location: "Austin, TX",
      workType: "remote",
      salary: "$50 - $60 / hr",
      deadline: new Date(now + 16 * day),
      requiredSkills: [
        "Rust",
        "C++",
        "V8 Engine",
        "Edge Computing",
        "WebSockets",
      ],
      applicationUrl: "https://cloudflare.com/careers",
    },
    {
      companyId: cloudflareId.id,
      title: "DDoS Mitigation & Packet Processing Intern",
      description:
        "Build eBPF XDP packet filtering algorithms capable of mitigating multi-terabit SYN flood and HTTP attacks.",
      location: "Austin, TX",
      workType: "remote",
      salary: "$52 - $62 / hr",
      deadline: new Date(now + 22 * day),
      requiredSkills: [
        "C",
        "Rust",
        "eBPF XDP",
        "BGP Routing",
        "Network Security",
      ],
      applicationUrl: "https://cloudflare.com/careers",
    },
    // Palantir (2)
    {
      companyId: palantirId.id,
      title: "Forward Deployed Software Engineering (FDSE) Intern",
      description:
        "Deploy custom data pipelines, ontology models, and mission-critical decision systems alongside client engineering teams.",
      location: "New York, NY",
      workType: "onsite",
      salary: "$52 - $62 / hr",
      deadline: new Date(now + 30 * day),
      requiredSkills: [
        "TypeScript",
        "Java",
        "Python",
        "Data Modeling",
        "System Architecture",
      ],
      applicationUrl: "https://palantir.com/careers",
    },
    {
      companyId: palantirId.id,
      title: "AIP (Artificial Intelligence Platform) Core Intern",
      description:
        "Build LLM orchestration engines connecting private enterprise databases to LLM agents with strict access control security.",
      location: "Palo Alto, CA",
      workType: "onsite",
      salary: "$56 - $68 / hr",
      deadline: new Date(now + 26 * day),
      requiredSkills: [
        "Java",
        "TypeScript",
        "Python",
        "LLMs",
        "Access Control",
      ],
      applicationUrl: "https://palantir.com/careers",
    },
    // Coinbase (2)
    {
      companyId: coinbaseId.id,
      title: "Crypto Protocol & Smart Contract Security Intern",
      description:
        "Audit EVM smart contracts, write formal verification proofs, and build zero-knowledge (ZK) rollup bridge infrastructure.",
      location: "Remote",
      workType: "remote",
      salary: "$54 - $65 / hr",
      deadline: new Date(now + 20 * day),
      requiredSkills: ["Solidity", "Rust", "Go", "Cryptography", "ZK-Rollups"],
      applicationUrl: "https://coinbase.com/careers",
    },
    {
      companyId: coinbaseId.id,
      title: "High-Frequency Crypto Exchange Matching Engine Intern",
      description:
        "Optimize ultra-low latency order matching engines processing sub-millisecond order books in C++.",
      location: "Remote",
      workType: "remote",
      salary: "$58 - $70 / hr",
      deadline: new Date(now + 25 * day),
      requiredSkills: [
        "C++",
        "Go",
        "Order Book Matching",
        "Low-Latency",
        "Sockets",
      ],
      applicationUrl: "https://coinbase.com/careers",
    },
  ]

  const insertedInternships: any[] = []
  for (const item of internshipsList) {
    const created = await prisma.internship.create({
      data: {
        ...item,
        workType: item.workType as "remote" | "hybrid" | "onsite",
      },
    })
    insertedInternships.push(created)
  }

  // ==========================================
  // 3. SEED DIVERSE STUDENT PERSONAS & PROFILES
  // ==========================================
  // Student 1: Alex Rivera (Stanford - Full-Stack & AI Systems)
  const alexUserId = await prisma.user.create({
    data: {
      email: "alex.student@university.edu",
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "student",
      createdAt: new Date(now - 90 * day),
      updatedAt: new Date(now - 1 * day),
    },
  })

  await prisma.profile.create({
    data: {
      userId: alexUserId.id,
      bio: "Computer Science junior at Stanford specializing in Full-Stack Web Development, Real-Time Systems, and Autonomous AI Agents.",
      headline: "CS Junior @ Stanford | Full-Stack & AI Systems Specialist",
      education: "Stanford University",
      university: "Stanford University",
      degree: "B.S. Computer Science",
      branch: "Artificial Intelligence & Systems",
      graduationYear: 2026,
      github: "https://github.com/alexrivera",
      linkedin: "https://linkedin.com/in/alexrivera",
      portfolio: "https://alexrivera.dev",
      careerGoal: "Full-Stack & AI Systems Engineer",
    },
  })

  // Student 2: Maya Lin (MIT - AI Research & CUDA Kernels)
  const mayaUserId = await prisma.user.create({
    data: {
      email: "maya.lin@mit.edu",
      name: "Maya Lin",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
      role: "student",
      createdAt: new Date(now - 60 * day),
      updatedAt: new Date(now - 2 * day),
    },
  })

  await prisma.profile.create({
    data: {
      userId: mayaUserId.id,
      bio: "MIT CS Senior researching transformer model compression, custom CUDA GPU kernels, and LLM alignment frameworks.",
      headline: "CS Senior @ MIT | AI Research & Systems Specialist",
      education: "Massachusetts Institute of Technology",
      university: "MIT",
      degree: "B.S. Computer Science & Artificial Intelligence",
      branch: "Machine Learning & Hardware Systems",
      graduationYear: 2025,
      github: "https://github.com/mayalin-ai",
      linkedin: "https://linkedin.com/in/mayalin-ai",
      portfolio: "https://mayalin.ai",
      careerGoal: "AI Research Scientist / Systems Engineer",
    },
  })

  // Student 3: David Kim (UC Berkeley - Distributed Cloud Infrastructure)
  const davidUserId = await prisma.user.create({
    data: {
      email: "david.kim@berkeley.edu",
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      role: "student",
      createdAt: new Date(now - 45 * day),
      updatedAt: new Date(now - 3 * day),
    },
  })

  await prisma.profile.create({
    data: {
      userId: davidUserId.id,
      bio: "UC Berkeley EECS junior passionate about distributed databases, Kubernetes operator design, and eBPF kernel tracing.",
      headline: "EECS Junior @ UC Berkeley | Distributed Cloud Systems",
      education: "University of California, Berkeley",
      university: "UC Berkeley",
      degree: "B.S. EECS",
      branch: "Cloud Systems & Networking",
      graduationYear: 2026,
      github: "https://github.com/davidkim-cloud",
      linkedin: "https://linkedin.com/in/davidkim-cloud",
      portfolio: "https://davidkim.io",
      careerGoal: "Cloud Infrastructure & Site Reliability Engineer",
    },
  })

  // Student 4: Priya Patel (CMU - Quant Systems & Algorithms)
  const priyaUserId = await prisma.user.create({
    data: {
      email: "priya.patel@cmu.edu",
      name: "Priya Patel",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "student",
      createdAt: new Date(now - 30 * day),
      updatedAt: new Date(now - 4 * day),
    },
  })

  await prisma.profile.create({
    data: {
      userId: priyaUserId.id,
      bio: "Carnegie Mellon CS Senior specializing in high-frequency order matching engines, C++ template metaprogramming, and graph algorithms.",
      headline: "CS Senior @ CMU | Low-Latency & Quant Systems Engineer",
      education: "Carnegie Mellon University",
      university: "CMU",
      degree: "B.S. Computer Science",
      branch: "Algorithms & Quantitative Systems",
      graduationYear: 2025,
      github: "https://github.com/priyapatel-quant",
      linkedin: "https://linkedin.com/in/priyapatel-quant",
      portfolio: "https://priyapatel.dev",
      careerGoal: "Quant Systems Engineer / Low-Latency Developer",
    },
  })

  // Mentor & Admin Roles
  const mentorUserId = await prisma.user.create({
    data: {
      email: "sarah.chen@internedge.io",
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      role: "mentor",
      createdAt: new Date(now - 120 * day),
      updatedAt: new Date(now - 5 * day),
    },
  })

  const adminUserId = await prisma.user.create({
    data: {
      email: "marcus.vance@stanford.edu",
      name: "Marcus Vance",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "placement_cell",
      createdAt: new Date(now - 200 * day),
      updatedAt: new Date(now - 10 * day),
    },
  })

  // ==========================================
  // 4. SEED SKILLS, PROJECTS, & EXPERIENCES
  // ==========================================
  const alexSkills = [
    {
      name: "TypeScript",
      category: "frontend",
      level: "expert",
      verified: true,
    },
    {
      name: "React 19 & Next.js 15",
      category: "frontend",
      level: "expert",
      verified: true,
    },
    {
      name: "Tailwind CSS v4",
      category: "frontend",
      level: "expert",
      verified: true,
    },
    {
      name: "Prisma ORM & Realtime Sync",
      category: "backend",
      level: "advanced",
      verified: true,
    },
    {
      name: "Node.js & Express",
      category: "backend",
      level: "advanced",
      verified: true,
    },
    {
      name: "Python & PyTorch",
      category: "ai_ml",
      level: "intermediate",
      verified: true,
    },
    {
      name: "PostgreSQL & SQL",
      category: "database",
      level: "intermediate",
      verified: true,
    },
    {
      name: "Docker & Containerization",
      category: "devops",
      level: "intermediate",
      verified: false,
    },
    {
      name: "System Architecture & Design",
      category: "backend",
      level: "advanced",
      verified: true,
    },
    {
      name: "Technical Communication",
      category: "soft_skill",
      level: "expert",
      verified: true,
    },
  ] as const

  for (const s of alexSkills) {
    await prisma.skill.create({ data: { userId: alexUserId.id, ...s } })
  }

  const mayaSkills = [
    {
      name: "Python & PyTorch",
      category: "ai_ml",
      level: "expert",
      verified: true,
    },
    {
      name: "C++ & CUDA",
      category: "ai_ml",
      level: "advanced",
      verified: true,
    },
    {
      name: "Transformers & LLMs",
      category: "ai_ml",
      level: "expert",
      verified: true,
    },
    {
      name: "RLHF & Fine-Tuning",
      category: "ai_ml",
      level: "advanced",
      verified: true,
    },
    {
      name: "JAX & Flax",
      category: "ai_ml",
      level: "intermediate",
      verified: true,
    },
    {
      name: "Distributed GPU Training",
      category: "devops",
      level: "advanced",
      verified: true,
    },
  ] as const

  for (const s of mayaSkills) {
    await prisma.skill.create({ data: { userId: mayaUserId.id, ...s } })
  }

  // Projects for Alex Rivera
  await prisma.project.create({
    data: {
      userId: alexUserId.id,
      title: "Antigravity Autonomous AI Agent Shell",
      description:
        "Full-stack web application orchestrating multi-agent LLM workflows with real-time WebSockets, Prisma ORM, and vector embeddings.",
      techStack: [
        "Next.js 15",
        "TypeScript",
        "Prisma ORM",
        "Tailwind CSS",
        "OpenAI API",
      ],
      github: "https://github.com/alexrivera/antigravity-shell",
      liveDemo: "https://antigravity-demo.vercel.app",
      startDate: "2025-09",
      endDate: "2026-01",
    },
  })

  await prisma.project.create({
    data: {
      userId: alexUserId.id,
      title: "Distributed Raft Consensus KV Store",
      description:
        "High-throughput in-memory key-value storage engine implementing Raft consensus, WAL logging, and LSM-tree persistence in Go.",
      techStack: ["Go", "Raft Consensus", "gRPC", "Protobuf", "Docker"],
      github: "https://github.com/alexrivera/raft-store",
      startDate: "2025-05",
      endDate: "2025-08",
    },
  })

  await prisma.project.create({
    data: {
      userId: alexUserId.id,
      title: "InternEdge AI Career Companion",
      description:
        "AI-powered career acceleration dashboard matching student profiles to top tech internships and generating custom study roadmaps.",
      techStack: [
        "React 19",
        "Next.js",
        "Prisma ORM",
        "Tailwind CSS v4",
        "Framer Motion",
      ],
      github: "https://github.com/alexrivera/internedge-app",
      liveDemo: "https://internedge-demo.vercel.app",
      startDate: "2026-01",
      endDate: "Present",
    },
  })

  // Experiences for Alex Rivera
  await prisma.experience.create({
    data: {
      userId: alexUserId.id,
      company: "Apex Developer Tools",
      role: "Software Engineering Intern",
      description:
        "Built real-time collaboration widgets and optimized React bundle rendering times by 35% using code splitting and Web Workers.",
      startDate: "2025-06",
      endDate: "2025-09",
    },
  })

  await prisma.experience.create({
    data: {
      userId: alexUserId.id,
      company: "Stanford Computer Science Department",
      role: "Head Teaching Assistant - CS106B",
      description:
        "Led weekly discussion sections for 120+ undergraduates covering C++ memory management, graph algorithms, and recursive backtracking.",
      startDate: "2025-09",
      endDate: "2026-06",
    },
  })

  // ==========================================
  // 5. SEED RESUMES & ATS SCORECARDS
  // ==========================================
  await prisma.resume.create({
    data: {
      userId: alexUserId.id,
      fileId: "resume_alex_rivera_v3_ats.pdf",
      parsedText:
        "Alex Rivera | Stanford CS Junior | Full-Stack & AI Systems Engineer. Technical Skills: Next.js 15, React 19, TypeScript, Prisma ORM, Tailwind CSS v4, Go, Python, PyTorch, Docker, PostgreSQL, System Design.",
      atsScore: 96,
      keywords: [
        "Next.js",
        "React",
        "TypeScript",
        "Prisma",
        "Tailwind CSS",
        "Go",
        "Distributed Systems",
        "PyTorch",
        "REST APIs",
        "Git",
        "System Architecture",
        "Node.js",
      ],
      missingKeywords: ["Kubernetes", "GraphQL", "AWS Lambda"],
      version: 3,
      isPrimary: true,
    },
  })

  await prisma.resume.create({
    data: {
      userId: alexUserId.id,
      fileId: "resume_alex_rivera_v2.pdf",
      parsedText:
        "Alex Rivera | Stanford CS Junior | Web Development Enthusiast.",
      atsScore: 89,
      keywords: [
        "React",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Python",
        "Node.js",
      ],
      missingKeywords: [
        "Next.js",
        "Prisma",
        "Docker",
        "PyTorch",
        "System Design",
      ],
      version: 2,
      isPrimary: false,
    },
  })

  await prisma.resume.create({
    data: {
      userId: mayaUserId.id,
      fileId: "resume_maya_lin_ai.pdf",
      parsedText:
        "Maya Lin | MIT CS Senior | AI Research & Systems. Skills: PyTorch, C++, CUDA, Triton, Transformers, JAX, Distributed Training.",
      atsScore: 98,
      keywords: [
        "PyTorch",
        "C++",
        "CUDA",
        "Transformers",
        "LLMs",
        "JAX",
        "Distributed Training",
        "RLHF",
      ],
      missingKeywords: ["TensorRT", "OpenCV"],
      version: 1,
      isPrimary: true,
    },
  })

  // ==========================================
  // 6. SEED MULTI-TRACK ROADMAPS & TASKS
  // ==========================================
  // Alex's Roadmap
  const alexRoadmapId = await prisma.roadmap.create({
    data: {
      userId: alexUserId.id,
      title: "Summer 2026 AI & Full-Stack Readiness Path",
      targetRole: "Full-Stack & AI Engineer",
      overallProgress: 65,
      createdAt: new Date(now - 35 * day),
    },
  })

  const alexTasks = [
    {
      title: "Master Next.js 15 App Router & Server Actions",
      description:
        "Build 2 full-stack projects using Next.js 15, Server Components, and Tailwind CSS v4.",
      week: 1,
      dueDate: new Date(now - 20 * day),
      category: "Frontend",
      completed: true,
    },
    {
      title: "Implement Real-Time Prisma Backend Mutations",
      description:
        "Learn schema design, indexed queries, and real-time client sync with Prisma ORM.",
      week: 2,
      dueDate: new Date(now - 12 * day),
      category: "Backend",
      completed: true,
    },
    {
      title: "Master Advanced LeetCode Graph & Dynamic Programming Problems",
      description:
        "Solve 25 top-tier technical interview coding questions covering Topological Sort, Dijkstra, and 2D DP.",
      week: 3,
      dueDate: new Date(now - 2 * day),
      category: "Algorithms",
      completed: true,
    },
    {
      title: "Build & Deploy AI Agent Prototype with Embeddings",
      description:
        "Create an autonomous career assistant agent utilizing vector embeddings and LLM tool calling.",
      week: 4,
      dueDate: new Date(now + 5 * day),
      category: "AI/ML",
      completed: false,
    },
    {
      title: "Complete System Architecture & Distributed Caching Mock",
      description:
        "Conduct 1-on-1 AI mock technical interview focusing on web performance, CDNs, and database indexing.",
      week: 5,
      dueDate: new Date(now + 12 * day),
      category: "Interview Prep",
      completed: false,
    },
    {
      title: "Final Portfolio Optimization & Referral Outreach",
      description:
        "Polish portfolio website, update ATS resume to 95%+, and send referral requests to alumni.",
      week: 6,
      dueDate: new Date(now + 19 * day),
      category: "Career Outing",
      completed: false,
    },
  ]

  for (const t of alexTasks) {
    await prisma.roadmapTask.create({
      data: {
        roadmapId: alexRoadmapId.id,
        title: t.title,
        description: t.description,
        week: t.week,
        dueDate: t.dueDate,
        category: t.category,
        completed: t.completed,
      },
    })
  }

  // Maya's Roadmap
  const mayaRoadmapId = await prisma.roadmap.create({
    data: {
      userId: mayaUserId.id,
      title: "Frontier AI Research & GPU Systems Track",
      targetRole: "AI Research Scientist & Systems Specialist",
      overallProgress: 80,
      createdAt: new Date(now - 40 * day),
    },
  })

  const mayaTasks = [
    {
      title: "Write Custom Triton Kernel for FlashAttention-3",
      description:
        "Implement fused matrix multiplication and attention softmax in Triton and benchmark speedup over PyTorch.",
      week: 1,
      dueDate: new Date(now - 25 * day),
      category: "GPU Systems",
      completed: true,
    },
    {
      title: "Implement Mechanistic Interpretability Sparse Autoencoders",
      description:
        "Extract interpretable feature directions from Claude and Llama intermediate activations.",
      week: 2,
      dueDate: new Date(now - 15 * day),
      category: "AI Safety",
      completed: true,
    },
    {
      title: "Fine-tune Llama 3 70B on Custom Domain Corpus via FSDP",
      description:
        "Execute Fully Sharded Data Parallel (FSDP) training across multi-node GPU cluster.",
      week: 3,
      dueDate: new Date(now - 5 * day),
      category: "Distributed AI",
      completed: true,
    },
    {
      title: "Submit Paper to NeurIPS / ICLR Workshop",
      description:
        "Finalize paper draft on efficient transformer KV-cache quantization techniques.",
      week: 4,
      dueDate: new Date(now + 8 * day),
      category: "Research Paper",
      completed: false,
    },
  ]

  for (const t of mayaTasks) {
    await prisma.roadmapTask.create({
      data: {
        roadmapId: mayaRoadmapId.id,
        title: t.title,
        description: t.description,
        week: t.week,
        dueDate: t.dueDate,
        category: t.category,
        completed: t.completed,
      },
    })
  }

  // ==========================================
  // 7. SEED APPLICATION TRACKER PIPELINE (ALL 7 STATUSES)
  // ==========================================
  // Application 1: Applied (Vercel Next.js)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId:
        insertedInternships.find((i) => i.title.includes("Next.js Core"))?.id ||
        insertedInternships[8].id,
      status: "applied",
      notes: "Submitted referral application through Stanford alumni network.",
      appliedAt: new Date(now - 5 * day),
      updatedAt: new Date(now - 5 * day),
    },
  })

  // Application 2: Assessment (OpenAI AI Research)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId: insertedInternships[0].id,
      status: "assessment",
      notes:
        "Completed Online Coding Assessment on Hackerrank (scored 100%). Waiting for technical round invitation.",
      appliedAt: new Date(now - 10 * day),
      updatedAt: new Date(now - 2 * day),
    },
  })

  // Application 3: Technical Interview (Google Cloud Systems)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId:
        insertedInternships.find((i) => i.companyId === googleId.id)?.id ||
        insertedInternships[10].id,
      status: "interview",
      notes:
        "Technical Interview scheduled with Cloud Systems Engineering Lead on Friday at 2:00 PM PST.",
      appliedAt: new Date(now - 14 * day),
      updatedAt: new Date(now - 1 * day),
    },
  })

  // Application 4: HR Round (Figma WebGL)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId:
        insertedInternships.find((i) => i.companyId === figmaId.id)?.id ||
        insertedInternships[14].id,
      status: "hr",
      notes:
        "Passed 2 technical rounds! Final HR & Culture Fit interview scheduled.",
      appliedAt: new Date(now - 20 * day),
      updatedAt: new Date(now - 3 * day),
    },
  })

  // Application 5: Offer Received (Stripe Backend)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId:
        insertedInternships.find((i) => i.companyId === stripeId.id)?.id ||
        insertedInternships[12].id,
      status: "offer",
      notes:
        "Received official internship offer letter! $54/hr hybrid in Seattle. Offer deadline next month.",
      appliedAt: new Date(now - 25 * day),
      updatedAt: new Date(now - 1 * day),
    },
  })

  // Application 6: Saved (Microsoft Azure)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId:
        insertedInternships.find((i) => i.companyId === microsoftId.id)?.id ||
        insertedInternships[16].id,
      status: "saved",
      notes:
        "Saved high-priority application. Tailoring resume to emphasize C++ and Azure cloud concepts.",
      appliedAt: new Date(now - 2 * day),
      updatedAt: new Date(now - 2 * day),
    },
  })

  // Application 7: Rejected (Apple CoreOS)
  await prisma.application.create({
    data: {
      userId: alexUserId.id,
      internshipId:
        insertedInternships.find((i) => i.companyId === appleId.id)?.id ||
        insertedInternships[18].id,
      status: "rejected",
      notes:
        "Application closed for Summer cohort. Encouraged to re-apply for Fall.",
      appliedAt: new Date(now - 40 * day),
      updatedAt: new Date(now - 15 * day),
    },
  })

  // Maya's Applications
  await prisma.application.create({
    data: {
      userId: mayaUserId.id,
      internshipId: insertedInternships[1].id, // OpenAI Safety
      status: "interview",
      notes:
        "Second technical round with Frontier Safety team completed cleanly.",
      appliedAt: new Date(now - 12 * day),
      updatedAt: new Date(now - 2 * day),
    },
  })

  await prisma.application.create({
    data: {
      userId: mayaUserId.id,
      internshipId: insertedInternships[2].id, // Anthropic Claude
      status: "offer",
      notes: "Offer extended! $68/hr hybrid in SF for Claude Core Safety team.",
      appliedAt: new Date(now - 18 * day),
      updatedAt: new Date(now - 1 * day),
    },
  })

  // ==========================================
  // 8. SEED MOCK INTERVIEW LOGS & TRANSCRIPTS
  // ==========================================
  await prisma.interview.create({
    data: {
      userId: alexUserId.id,
      track: "technical",
      title: "Full-Stack System Architecture Mock Round",
      score: 94,
      feedback:
        "Authoritative explanation of React 19 server rendering model, hydration dynamics, and state updates. Minor feedback on optimizing graph algorithm time complexity.",
      questions: [
        {
          question:
            "Explain the architectural difference between React Server Components (RSC) and Client Components.",
          userAnswer:
            "Server Components execute exclusively on the server, producing UI trees without shipping JS code to client bundles. Client Components render interactively in the browser using state and hooks.",
          score: 96,
          feedback:
            "Precise, authoritative answer demonstrating deep mental model.",
        },
        {
          question:
            "How would you optimize real-time data synchronization across thousands of active web clients?",
          userAnswer:
            "Utilize optimistic UI updates paired with indexed query subscriptions over WebSockets (e.g. Prisma ORM), falling back to delta patch diffing to minimize payload size.",
          score: 92,
          feedback: "Great modern architectural intuition.",
        },
      ],
      createdAt: new Date(now - 3 * day),
    },
  })

  await prisma.interview.create({
    data: {
      userId: alexUserId.id,
      track: "hr",
      title: "Behavioral & Leadership Mock Interview",
      score: 90,
      feedback:
        "Strong STAR method structure when describing past engineering leadership. Recommended adding quantitative impact metrics.",
      questions: [
        {
          question:
            "Tell me about a time you resolved a major technical disagreement in a software team.",
          userAnswer:
            "During a hackathon, our team debated between REST and Prisma real-time DB. I benchmarked prototype latency over 15 minutes, showing 3x faster sync, which united the team behind Prisma.",
          score: 90,
          feedback: "Clear STAR framework with data-driven resolution.",
        },
      ],
      createdAt: new Date(now - 8 * day),
    },
  })

  await prisma.interview.create({
    data: {
      userId: mayaUserId.id,
      track: "coding",
      title: "CUDA Kernel Fusion & Tensor Algorithms Mock",
      score: 98,
      feedback:
        "Exceptional mastery of GPU shared memory bank conflicts, warp shuffle primitives, and memory latency hiding.",
      questions: [
        {
          question:
            "How do you avoid shared memory bank conflicts when storing 2D matrices in CUDA?",
          userAnswer:
            "Pad the matrix column dimension by 1 element (e.g., [32][33] instead of [32][32]) so threads in a warp access distinct memory banks simultaneously.",
          score: 100,
          feedback: "Flawless technical precision.",
        },
      ],
      createdAt: new Date(now - 5 * day),
    },
  })

  // ==========================================
  // 9. SEED ACTIVITY LOGS & TIMELINE
  // ==========================================
  const activityEntries = [
    {
      action: "application_offer_received",
      entityType: "applications",
      details:
        "Received official internship offer from Stripe (Backend Engineering Intern)",
      timestamp: new Date(now - 1 * day),
    },
    {
      action: "mock_interview_completed",
      entityType: "interviews",
      details:
        "Completed Full-Stack System Architecture Mock Round with score 94/100",
      timestamp: new Date(now - 3 * day),
    },
    {
      action: "application_submitted",
      entityType: "applications",
      details:
        "Applied for Frontend Engineering Intern (Next.js Core) at Vercel",
      timestamp: new Date(now - 5 * day),
    },
    {
      action: "roadmap_task_completed",
      entityType: "roadmapTasks",
      details:
        "Completed roadmap task: Master Advanced LeetCode Graph & Dynamic Programming Problems",
      timestamp: new Date(now - 7 * day),
    },
    {
      action: "resume_analyzed",
      entityType: "resumes",
      details: "Uploaded resume v3 - ATS Compatibility Score increased to 96%",
      timestamp: new Date(now - 12 * day),
    },
    {
      action: "project_created",
      entityType: "projects",
      details:
        "Added new portfolio project: Antigravity Autonomous AI Agent Shell",
      timestamp: new Date(now - 18 * day),
    },
  ]

  for (const entry of activityEntries) {
    await prisma.activityLog.create({
      data: {
        userId: alexUserId.id,
        ...entry,
      },
    })
  }

  // ==========================================
  // 10. SEED SYSTEM NOTIFICATIONS
  // ==========================================
  await prisma.notification.create({
    data: {
      userId: alexUserId.id,
      title: "Upcoming Application Deadline",
      message:
        "Frontend Engineering Intern (Next.js Core) at Vercel deadline is approaching in 5 days.",
      type: "deadline",
      read: false,
      createdAt: new Date(now - 2 * day),
    },
  })

  await prisma.notification.create({
    data: {
      userId: alexUserId.id,
      title: "Roadmap Milestone Reached!",
      message:
        "Congratulations! You completed 65% of your Summer 2026 AI & Full-Stack Readiness Path.",
      type: "roadmap",
      read: false,
      createdAt: new Date(now - 4 * day),
    },
  })

  await prisma.notification.create({
    data: {
      userId: alexUserId.id,
      title: "Interview Reminder",
      message:
        "Technical Interview with Cloud Systems Engineering Lead is scheduled for Friday at 2:00 PM PST.",
      type: "interview",
      read: true,
      createdAt: new Date(now - 6 * day),
    },
  })

  await prisma.notification.create({
    data: {
      userId: alexUserId.id,
      title: "New AI Resume Recommendation",
      message:
        "Adding 'Kubernetes' and 'GraphQL' to your project bullet points could increase your ATS match score to 98%.",
      type: "resume",
      read: false,
      createdAt: new Date(now - 1 * day),
    },
  })

  console.log(
    "Database successfully seeded with 20 Tech Companies & Unicorns, 40+ Internships, 4 Student Profiles, Skills, Projects, Experiences, ATS Resumes, Roadmaps, Applications, Mock Interviews, Activity Logs, and Notifications!",
  )
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
