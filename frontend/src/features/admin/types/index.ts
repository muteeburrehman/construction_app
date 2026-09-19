/**
 * TypeScript definitions for the Admin Panel and Data Models
 */

export interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_staff: boolean
  is_superuser: boolean
}

export interface ProjectImage {
  id: string
  project: string
  image: string
  image_url: string
  alt_text: string
  caption: string
  order: number
  is_cover: boolean
  created_at: string
}

export interface AdminProject {
  id: string
  slug: string
  title: string
  service: string | null
  service_title: string | null
  category: "residential" | "commercial"
  category_display: string
  location: string
  year: number
  scope: string
  summary: string
  body: string
  is_featured: boolean
  is_published: boolean
  order: number
  images: ProjectImage[]
  images_count: number
  created_at: string
  updated_at: string
}

export interface AdminService {
  id: string
  slug: string
  title: string
  category: "residential" | "commercial"
  category_display: string
  summary: string
  body: string
  capabilities: string[]
  order: number
  is_published: boolean
  projects_count: number
  created_at: string
  updated_at: string
}

export interface AdminTestimonial {
  id: string
  author: string
  role_or_location: string
  quote: string
  project: string | null
  project_title: string | null
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type InquiryStatus = "NEW" | "IN_PROGRESS" | "CONTACTED" | "ARCHIVED"

export interface AdminInquiry {
  id: string
  name: string
  email: string
  phone: string
  project_type: string
  project_type_display: string
  project_location: string
  estimated_budget: string
  timeline: string
  message: string
  status: InquiryStatus
  status_display: string
  notes: string
  created_at: string
  updated_at: string
}

export interface AdminFAQ {
  id: string
  question: string
  answer: string
  category: "general" | "residential" | "commercial" | "process" | "pricing" | "licensing"
  category_display: string
  keywords: string
  order: number
  is_active: boolean
  is_suggested: boolean
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface AdminChatLog {
  id: string
  session_id: string
  user_message: string
  response_text: string
  source: "faq" | "project" | "service" | "settings" | "fallback"
  source_display: string
  matched_intent: string
  is_helpful: boolean | null
  created_at: string
}

export interface AdminSiteSettings {
  id: string
  company_name: string
  tagline: string
  license_number: string
  phone: string
  email: string
  founding_year: number
  street_address: string
  city: string
  state: string
  postal_code: string
  hours: string
  service_area: string
  linkedin_url: string
  facebook_url: string
  youtube_url: string
  updated_at: string
}

export interface DashboardStats {
  stats: {
    projects: {
      total: number
      published: number
      featured: number
    }
    inquiries: {
      total: number
      new: number
      in_progress: number
      contacted: number
    }
    services: {
      total: number
    }
    testimonials: {
      total: number
      published: number
    }
    faq: {
      total: number
      active: number
    }
    chat: {
      total_conversations: number
      faq_resolved: number
      project_resolved: number
      settings_resolved: number
    }
  }
  recent_inquiries: AdminInquiry[]
  recent_chats: AdminChatLog[]
}
