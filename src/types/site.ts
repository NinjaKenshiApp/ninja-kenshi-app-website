export type AppStatus = 'Publicado' | 'En desarrollo' | 'Proximamente'

export interface FeatureBlock {
  title: string
  items: string[]
}

export interface PricingPlan {
  name: string
  price: string
  description: string
}

export interface PlatformSpec {
  name: string
  tech: string
  requirement: string
  downloadUrl?: string
  downloadLabel?: string
}

export interface LegalLink {
  label: string
  href: string
}

export interface AppItem {
  id: string
  name: string
  logo?: string
  tagline: string
  description: string
  status: AppStatus
  tech: string[]
  highlights: string[]
  version: string
  lastUpdate: string
  modules?: FeatureBlock[]
  plans?: PricingPlan[]
  platforms?: PlatformSpec[]
  security?: string[]
  legalLinks?: LegalLink[]
  supportEmail?: string
  storeUrl?: string
  repoUrl?: string
}

export interface BrandMeta {
  name: string
  logo?: string
}

export interface ReviewItem {
  id: string
  author: string
  role: string
  quote: string
  rating: number
}
