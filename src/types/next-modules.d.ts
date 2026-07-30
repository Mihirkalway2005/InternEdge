declare module "next/link" {
  import React from "react"
  export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    as?: string
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    passHref?: boolean
    prefetch?: boolean
  }
  const Link: React.ComponentType<LinkProps>
  export default Link
}

declare module "next/navigation" {
  export interface AppRouterInstance {
    back(): void
    forward(): void
    refresh(): void
    push(href: string, options?: { scroll?: boolean }): void
    replace(href: string, options?: { scroll?: boolean }): void
    prefetch(href: string): void
  }
  export function useRouter(): AppRouterInstance
  export function usePathname(): string
  export function useSearchParams(): URLSearchParams
  export function useParams<T extends Record<string, string | string[]> = Record<string, string>,>(): T
  export function redirect(url: string): never
  export function notFound(): never
}
