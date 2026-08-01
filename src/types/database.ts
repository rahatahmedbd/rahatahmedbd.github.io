export type UserRole = "visitor" | "client" | "admin";
export type ProjectStatus = "draft" | "active" | "archived";
export type TestimonialStatus = "pending" | "approved" | "rejected";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "delivered"
  | "completed"
  | "cancelled";
export type NotificationType = "info" | "success" | "warning" | "error";
export type BlogPostStatus = "draft" | "published" | "archived";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type InvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "overdue"
  | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  role_id?: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  category_id: string | null;
  live_url: string | null;
  repo_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  tags: string[] | null;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  image_url: string | null;
  meta: Record<string, unknown> | null;
  published: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  rating: number;
  content: string;
  status: TestimonialStatus;
}

export interface Order {
  id: string;
  reference: string;
  client_id: string;
  project_id: string | null;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  notes: string | null;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  is_read: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
}

export interface FileAsset {
  id: string;
  owner_id: string;
  bucket: string;
  path: string;
  name: string;
  mime_type: string | null;
  size_bytes: number | null;
  public_url: string | null;
}

export interface Setting {
  key: string;
  value: unknown;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  status: BlogPostStatus;
  published_at: string | null;
  author_id: string | null;
  tags: string[] | null;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  provider_payment_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

export interface Invoice {
  id: string;
  number: string;
  order_id: string | null;
  client_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_at: string | null;
  due_at: string | null;
  pdf_url: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "email">;
        Update: Partial<Profile>;
      };
      categories: {
        Row: Category;
        Insert: Partial<Category> & Pick<Category, "slug" | "name">;
        Update: Partial<Category>;
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & Pick<Project, "slug" | "title">;
        Update: Partial<Project>;
      };
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Partial<PortfolioItem> &
          Pick<PortfolioItem, "slug" | "title">;
        Update: Partial<PortfolioItem>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Partial<Testimonial> &
          Pick<Testimonial, "author_name" | "rating" | "content">;
        Update: Partial<Testimonial>;
      };
      orders: {
        Row: Order;
        Insert: Partial<Order> &
          Pick<Order, "reference" | "client_id" | "total_amount">;
        Update: Partial<Order>;
      };
      messages: {
        Row: Message;
        Insert: Partial<Message> &
          Pick<Message, "name" | "email" | "subject" | "body">;
        Update: Partial<Message>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> &
          Pick<Notification, "user_id" | "type" | "title">;
        Update: Partial<Notification>;
      };
      file_assets: {
        Row: FileAsset;
        Insert: Partial<FileAsset> &
          Pick<FileAsset, "owner_id" | "bucket" | "path" | "name">;
        Update: Partial<FileAsset>;
      };
      settings: {
        Row: Setting;
        Insert: Setting;
        Update: Partial<Setting>;
      };
      faqs: {
        Row: Faq;
        Insert: Partial<Faq> &
          Pick<Faq, "question" | "answer" | "category">;
        Update: Partial<Faq>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Partial<BlogPost> & Pick<BlogPost, "slug" | "title">;
        Update: Partial<BlogPost>;
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment> &
          Pick<Payment, "order_id" | "provider" | "amount">;
        Update: Partial<Payment>;
      };
      invoices: {
        Row: Invoice;
        Insert: Partial<Invoice> &
          Pick<Invoice, "number" | "client_id" | "amount">;
        Update: Partial<Invoice>;
      };
    };
  };
}
