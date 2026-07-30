/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as applications from "../applications.js"
import type * as companies from "../companies.js"
import type * as experiences from "../experiences.js"
import type * as internships from "../internships.js"
import type * as interviews from "../interviews.js"
import type * as lib_helpers from "../lib/helpers.js"
import type * as lib_validators from "../lib/validators.js"
import type * as notifications from "../notifications.js"
import type * as profiles from "../profiles.js"
import type * as projects from "../projects.js"
import type * as resumes from "../resumes.js"
import type * as roadmapTasks from "../roadmapTasks.js"
import type * as roadmaps from "../roadmaps.js"
import type * as skills from "../skills.js"
import type * as users from "../users.js"

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server"

declare const fullApi: ApiFromModules<{
  applications: typeof applications
  companies: typeof companies
  experiences: typeof experiences
  internships: typeof internships
  interviews: typeof interviews
  "lib/helpers": typeof lib_helpers
  "lib/validators": typeof lib_validators
  notifications: typeof notifications
  profiles: typeof profiles
  projects: typeof projects
  resumes: typeof resumes
  roadmapTasks: typeof roadmapTasks
  roadmaps: typeof roadmaps
  skills: typeof skills
  users: typeof users
}>

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>

export declare const components: {}
