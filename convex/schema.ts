import { defineSchema } from "convex/server"
import { usersTable } from "./users"
import { profilesTable } from "./profiles"
import { skillsTable } from "./skills"
import { projectsTable } from "./projects"
import { experiencesTable } from "./experiences"
import { companiesTable } from "./companies"
import { internshipsTable } from "./internships"
import { resumesTable } from "./resumes"
import { applicationsTable } from "./applications"
import { roadmapsTable } from "./roadmaps"
import { roadmapTasksTable } from "./roadmapTasks"
import { interviewsTable } from "./interviews"
import { notificationsTable } from "./notifications"
import { activityLogsTable } from "./activityLogs"

/**
 * InternEdge Production Database Schema
 * Scalable, normalized, and high-performance schema definition for Convex.
 */
export default defineSchema({
  users: usersTable,
  profiles: profilesTable,
  skills: skillsTable,
  projects: projectsTable,
  experiences: experiencesTable,
  companies: companiesTable,
  internships: internshipsTable,
  resumes: resumesTable,
  applications: applicationsTable,
  roadmaps: roadmapsTable,
  roadmapTasks: roadmapTasksTable,
  interviews: interviewsTable,
  notifications: notificationsTable,
  activityLogs: activityLogsTable,
})
