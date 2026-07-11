export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          event_type: string
          from_value: string | null
          id: string
          message: string | null
          metadata: Json
          to_value: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          event_type: string
          from_value?: string | null
          id?: string
          message?: string | null
          metadata?: Json
          to_value?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          event_type?: string
          from_value?: string | null
          id?: string
          message?: string | null
          metadata?: Json
          to_value?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content_ar: string | null
          content_en: string | null
          cover_url: string | null
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          slug: string
          tags: string[] | null
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content_ar?: string | null
          content_en?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content_ar?: string | null
          content_en?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          airport_fee: number
          assigned_at: string | null
          base_fare: number
          cancellation_reason: string | null
          category_id: string | null
          code: string
          completed_at: string | null
          confirmed_at: string | null
          coupon_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          discount: number
          distance_fare: number
          distance_km: number | null
          driver_id: string | null
          dropoff_location: string
          duration_min: number | null
          id: string
          is_priority: boolean
          night_surcharge: number
          notes: string | null
          pickup_at: string
          pickup_location: string
          route_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          time_fare: number
          total_fare: number
          updated_at: string
          vehicle_id: string | null
          waiting_fare: number
          waiting_min: number
        }
        Insert: {
          airport_fee?: number
          assigned_at?: string | null
          base_fare?: number
          cancellation_reason?: string | null
          category_id?: string | null
          code?: string
          completed_at?: string | null
          confirmed_at?: string | null
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          discount?: number
          distance_fare?: number
          distance_km?: number | null
          driver_id?: string | null
          dropoff_location: string
          duration_min?: number | null
          id?: string
          is_priority?: boolean
          night_surcharge?: number
          notes?: string | null
          pickup_at?: string
          pickup_location: string
          route_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          time_fare?: number
          total_fare?: number
          updated_at?: string
          vehicle_id?: string | null
          waiting_fare?: number
          waiting_min?: number
        }
        Update: {
          airport_fee?: number
          assigned_at?: string | null
          base_fare?: number
          cancellation_reason?: string | null
          category_id?: string | null
          code?: string
          completed_at?: string | null
          confirmed_at?: string | null
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          discount?: number
          distance_fare?: number
          distance_km?: number | null
          driver_id?: string | null
          dropoff_location?: string
          duration_min?: number | null
          id?: string
          is_priority?: boolean
          night_surcharge?: number
          notes?: string | null
          pickup_at?: string
          pickup_location?: string
          route_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          time_fare?: number
          total_fare?: number
          updated_at?: string
          vehicle_id?: string | null
          waiting_fare?: number
          waiting_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          body_ar: string | null
          body_en: string | null
          created_at: string
          hero_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          page_type: Database["public"]["Enums"]["cms_page_type"]
          published: boolean
          slug: string
          sort_order: number
          subtitle_ar: string | null
          subtitle_en: string | null
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          body_ar?: string | null
          body_en?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          page_type?: Database["public"]["Enums"]["cms_page_type"]
          published?: boolean
          slug: string
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          body_ar?: string | null
          body_en?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          page_type?: Database["public"]["Enums"]["cms_page_type"]
          published?: boolean
          slug?: string
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_accounts: {
        Row: {
          billing_address: string | null
          billing_cycle: string
          code: string
          company_name: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          credit_limit: number
          discount_percent: number
          id: string
          is_active: boolean
          notes: string | null
          outstanding_balance: number
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_cycle?: string
          code?: string
          company_name: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          credit_limit?: number
          discount_percent?: number
          id?: string
          is_active?: boolean
          notes?: string | null
          outstanding_balance?: number
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_cycle?: string
          code?: string
          company_name?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          credit_limit?: number
          discount_percent?: number
          id?: string
          is_active?: boolean
          notes?: string | null
          outstanding_balance?: number
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          used_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      customer_documents: {
        Row: {
          created_at: string
          customer_id: string
          doc_type: string
          expires_at: string | null
          file_path: string
          file_size: number | null
          id: string
          label: string | null
          mime_type: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          doc_type: string
          expires_at?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          label?: string | null
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          doc_type?: string
          expires_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          label?: string | null
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          customer_id: string
          id: string
          kind: Database["public"]["Enums"]["customer_note_kind"]
          pinned: boolean
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          customer_id: string
          id?: string
          kind?: Database["public"]["Enums"]["customer_note_kind"]
          pinned?: boolean
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["customer_note_kind"]
          pinned?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          alt_phone: string | null
          avg_booking_value: number
          cancelled_trips: number
          city: string | null
          company: string | null
          completed_trips: number
          corporate_account_id: string | null
          country: string | null
          created_at: string
          email: string | null
          favorite_category_id: string | null
          favorite_driver_id: string | null
          favorite_dropoff: string | null
          favorite_pickup: string | null
          first_booking_at: string | null
          full_name: string
          id: string
          is_blocked: boolean
          last_booking_at: string | null
          no_show_trips: number
          notes: string | null
          phone: string | null
          preferred_language: string | null
          preferred_payment_method: string | null
          preferred_pickup_hour: number | null
          tags: string[]
          tier: Database["public"]["Enums"]["customer_tier"]
          total_spent: number
          total_trips: number
          updated_at: string
          vat_number: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          alt_phone?: string | null
          avg_booking_value?: number
          cancelled_trips?: number
          city?: string | null
          company?: string | null
          completed_trips?: number
          corporate_account_id?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          favorite_category_id?: string | null
          favorite_driver_id?: string | null
          favorite_dropoff?: string | null
          favorite_pickup?: string | null
          first_booking_at?: string | null
          full_name: string
          id?: string
          is_blocked?: boolean
          last_booking_at?: string | null
          no_show_trips?: number
          notes?: string | null
          phone?: string | null
          preferred_language?: string | null
          preferred_payment_method?: string | null
          preferred_pickup_hour?: number | null
          tags?: string[]
          tier?: Database["public"]["Enums"]["customer_tier"]
          total_spent?: number
          total_trips?: number
          updated_at?: string
          vat_number?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          alt_phone?: string | null
          avg_booking_value?: number
          cancelled_trips?: number
          city?: string | null
          company?: string | null
          completed_trips?: number
          corporate_account_id?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          favorite_category_id?: string | null
          favorite_driver_id?: string | null
          favorite_dropoff?: string | null
          favorite_pickup?: string | null
          first_booking_at?: string | null
          full_name?: string
          id?: string
          is_blocked?: boolean
          last_booking_at?: string | null
          no_show_trips?: number
          notes?: string | null
          phone?: string | null
          preferred_language?: string | null
          preferred_payment_method?: string | null
          preferred_pickup_hour?: number | null
          tags?: string[]
          tier?: Database["public"]["Enums"]["customer_tier"]
          total_spent?: number
          total_trips?: number
          updated_at?: string
          vat_number?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_favorite_category_id_fkey"
            columns: ["favorite_category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_favorite_driver_id_fkey"
            columns: ["favorite_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_number: string | null
          driver_id: string
          expires_on: string | null
          file_path: string | null
          id: string
          issued_on: string | null
          kind: Database["public"]["Enums"]["driver_doc_kind"]
          notes: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          driver_id: string
          expires_on?: string | null
          file_path?: string | null
          id?: string
          issued_on?: string | null
          kind: Database["public"]["Enums"]["driver_doc_kind"]
          notes?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          driver_id?: string
          expires_on?: string | null
          file_path?: string | null
          id?: string
          issued_on?: string | null
          kind?: Database["public"]["Enums"]["driver_doc_kind"]
          notes?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_payroll: {
        Row: {
          bonuses: number
          commission_amount: number
          commission_rate: number
          created_at: string
          created_by: string | null
          deductions: number
          driver_id: string
          gross_revenue: number
          id: string
          net_salary: number
          notes: string | null
          paid_at: string | null
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["payroll_status"]
          trip_count: number
          updated_at: string
        }
        Insert: {
          bonuses?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          created_by?: string | null
          deductions?: number
          driver_id: string
          gross_revenue?: number
          id?: string
          net_salary?: number
          notes?: string | null
          paid_at?: string | null
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["payroll_status"]
          trip_count?: number
          updated_at?: string
        }
        Update: {
          bonuses?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          created_by?: string | null
          deductions?: number
          driver_id?: string
          gross_revenue?: number
          id?: string
          net_salary?: number
          notes?: string | null
          paid_at?: string | null
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["payroll_status"]
          trip_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_payroll_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_vehicle_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          driver_id: string
          ended_at: string | null
          id: string
          notes: string | null
          started_at: string
          vehicle_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          driver_id: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string
          vehicle_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          driver_id?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_vehicle_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_vehicle_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          avg_rating: number | null
          cancelled_trips: number
          completed_trips: number
          created_at: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employment_status: Database["public"]["Enums"]["employment_status"]
          full_name: string
          hired_at: string | null
          id: string
          insurance_expiry: string | null
          is_active: boolean
          languages: string[]
          license_class: string | null
          license_expiry: string | null
          license_number: string | null
          medical_expiry: string | null
          national_id: string | null
          no_show_trips: number
          notes: string | null
          phone: string | null
          photo_url: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"]
          total_earnings: number
          total_trips: number
          updated_at: string
          user_id: string | null
          vehicle_id: string | null
          whatsapp: string | null
          work_permit_expiry: string | null
        }
        Insert: {
          address?: string | null
          avg_rating?: number | null
          cancelled_trips?: number
          completed_trips?: number
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_status?: Database["public"]["Enums"]["employment_status"]
          full_name: string
          hired_at?: string | null
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean
          languages?: string[]
          license_class?: string | null
          license_expiry?: string | null
          license_number?: string | null
          medical_expiry?: string | null
          national_id?: string | null
          no_show_trips?: number
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_earnings?: number
          total_trips?: number
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
          whatsapp?: string | null
          work_permit_expiry?: string | null
        }
        Update: {
          address?: string | null
          avg_rating?: number | null
          cancelled_trips?: number
          completed_trips?: number
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_status?: Database["public"]["Enums"]["employment_status"]
          full_name?: string
          hired_at?: string | null
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean
          languages?: string[]
          license_class?: string | null
          license_expiry?: string | null
          license_number?: string | null
          medical_expiry?: string | null
          national_id?: string | null
          no_show_trips?: number
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_earnings?: number
          total_trips?: number
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
          whatsapp?: string | null
          work_permit_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approved_by: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          created_by: string | null
          currency: string
          driver_id: string | null
          expense_date: string
          id: string
          notes: string | null
          receipt_url: string | null
          reference: string
          supplier: string | null
          updated_at: string
          vat_amount: number
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string | null
          currency?: string
          driver_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          receipt_url?: string | null
          reference?: string
          supplier?: string | null
          updated_at?: string
          vat_amount?: number
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string | null
          currency?: string
          driver_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          receipt_url?: string | null
          reference?: string
          supplier?: string | null
          updated_at?: string
          vat_amount?: number
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer_ar: string
          answer_en: string
          category: string | null
          created_at: string
          id: string
          published: boolean
          question_ar: string
          question_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_ar: string
          answer_en: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          question_ar: string
          question_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_ar?: string
          answer_en?: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          question_ar?: string
          question_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      finance_settings: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_name: string
          company_phone: string | null
          currency: string
          default_commission_rate: number
          id: string
          invoice_footer: string | null
          updated_at: string
          vat_number: string | null
          vat_rate: number
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_name?: string
          company_phone?: string | null
          currency?: string
          default_commission_rate?: number
          id?: string
          invoice_footer?: string | null
          updated_at?: string
          vat_number?: string | null
          vat_rate?: number
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_name?: string
          company_phone?: string | null
          currency?: string
          default_commission_rate?: number
          id?: string
          invoice_footer?: string | null
          updated_at?: string
          vat_number?: string | null
          vat_rate?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          booking_id: string | null
          corporate_account_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          discount_amount: number
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_amount: number
          pdf_url: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          total_amount: number
          updated_at: string
          vat_amount: number
        }
        Insert: {
          booking_id?: string | null
          corporate_account_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total_amount?: number
          updated_at?: string
          vat_amount?: number
        }
        Update: {
          booking_id?: string | null
          corporate_account_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total_amount?: number
          updated_at?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          coupon_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          discount_amount: number
          driver_id: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          paid_amount: number
          paid_at: string | null
          payment_number: string | null
          receipt_url: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_ref: string | null
          updated_at: string
          vat_amount: number
        }
        Insert: {
          amount: number
          booking_id: string
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          driver_id?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          payment_number?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
          updated_at?: string
          vat_amount?: number
        }
        Update: {
          amount?: number
          booking_id?: string
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          driver_id?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          payment_number?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
          updated_at?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          code: string
          description: string | null
          id: string
        }
        Insert: {
          code: string
          description?: string | null
          id?: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          airport_fee: number
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          min_fare: number
          night_end_hour: number
          night_start_hour: number
          night_surcharge_pct: number
          waiting_per_min: number
        }
        Insert: {
          airport_fee?: number
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          min_fare?: number
          night_end_hour?: number
          night_start_hour?: number
          night_surcharge_pct?: number
          waiting_per_min?: number
        }
        Update: {
          airport_fee?: number
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          min_fare?: number
          night_end_hour?: number
          night_start_hour?: number
          night_surcharge_pct?: number
          waiting_per_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string
          created_by: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          payment_id: string
          reason: string | null
          reference: string
          refund_date: string
          refund_type: Database["public"]["Enums"]["refund_type"]
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payment_id: string
          reason?: string | null
          reference?: string
          refund_date?: string
          refund_type?: Database["public"]["Enums"]["refund_type"]
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payment_id?: string
          reason?: string | null
          reference?: string
          refund_date?: string
          refund_type?: Database["public"]["Enums"]["refund_type"]
        }
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string
          destination: string
          distance_km: number | null
          duration_min: number | null
          fixed_price: number | null
          id: string
          is_active: boolean
          name: string
          origin: string
        }
        Insert: {
          created_at?: string
          destination: string
          distance_km?: number | null
          duration_min?: number | null
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          name: string
          origin: string
        }
        Update: {
          created_at?: string
          destination?: string
          distance_km?: number | null
          duration_min?: number | null
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          name?: string
          origin?: string
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          created_at: string
          id: string
          json_ld: Json | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          path: string
          robots: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          json_ld?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          path: string
          robots?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          json_ld?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          path?: string
          robots?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          published: boolean
          quote_ar: string
          quote_en: string
          rating: number
          role_ar: string | null
          role_en: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          published?: boolean
          quote_ar: string
          quote_en: string
          rating?: number
          role_ar?: string | null
          role_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          published?: boolean
          quote_ar?: string
          quote_en?: string
          rating?: number
          role_ar?: string | null
          role_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_categories: {
        Row: {
          base_fare: number
          code: string
          created_at: string
          id: string
          is_active: boolean
          price_per_km: number
          price_per_min: number
          seats: number
          sort_order: number
        }
        Insert: {
          base_fare?: number
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          price_per_km?: number
          price_per_min?: number
          seats?: number
          sort_order?: number
        }
        Update: {
          base_fare?: number
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          price_per_km?: number
          price_per_min?: number
          seats?: number
          sort_order?: number
        }
        Relationships: []
      }
      vehicle_category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          locale: string
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          locale: string
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          locale?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_number: string | null
          expires_on: string | null
          file_path: string | null
          id: string
          issued_on: string | null
          kind: Database["public"]["Enums"]["vehicle_doc_kind"]
          notes: string | null
          title: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          expires_on?: string | null
          file_path?: string | null
          id?: string
          issued_on?: string | null
          kind: Database["public"]["Enums"]["vehicle_doc_kind"]
          notes?: string | null
          title?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          expires_on?: string | null
          file_path?: string | null
          id?: string
          issued_on?: string | null
          kind?: Database["public"]["Enums"]["vehicle_doc_kind"]
          notes?: string | null
          title?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_maintenance: {
        Row: {
          cost: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["maintenance_kind"]
          mileage: number | null
          next_due_date: string | null
          next_due_mileage: number | null
          notes: string | null
          service_date: string
          updated_at: string
          vehicle_id: string
          vendor: string | null
        }
        Insert: {
          cost?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind: Database["public"]["Enums"]["maintenance_kind"]
          mileage?: number | null
          next_due_date?: string | null
          next_due_mileage?: number | null
          notes?: string | null
          service_date?: string
          updated_at?: string
          vehicle_id: string
          vendor?: string | null
        }
        Update: {
          cost?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["maintenance_kind"]
          mileage?: number | null
          next_due_date?: string | null
          next_due_mileage?: number | null
          notes?: string | null
          service_date?: string
          updated_at?: string
          vehicle_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          category_id: string | null
          color: string | null
          created_at: string
          current_mileage: number
          fuel_type: string | null
          id: string
          inspection_expiry: string | null
          insurance_expiry: string | null
          internal_code: string | null
          last_maintenance_date: string | null
          luggage_capacity: number
          make: string | null
          model: string | null
          next_maintenance_date: string | null
          next_maintenance_mileage: number | null
          notes: string | null
          plate_number: string
          registration_expiry: string | null
          road_tax_expiry: string | null
          seats: number
          status: Database["public"]["Enums"]["vehicle_status"]
          taxi_permit_expiry: string | null
          transmission: string | null
          updated_at: string
          vin: string | null
          year: number | null
        }
        Insert: {
          category_id?: string | null
          color?: string | null
          created_at?: string
          current_mileage?: number
          fuel_type?: string | null
          id?: string
          inspection_expiry?: string | null
          insurance_expiry?: string | null
          internal_code?: string | null
          last_maintenance_date?: string | null
          luggage_capacity?: number
          make?: string | null
          model?: string | null
          next_maintenance_date?: string | null
          next_maintenance_mileage?: number | null
          notes?: string | null
          plate_number: string
          registration_expiry?: string | null
          road_tax_expiry?: string | null
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          taxi_permit_expiry?: string | null
          transmission?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          category_id?: string | null
          color?: string | null
          created_at?: string
          current_mileage?: number
          fuel_type?: string | null
          id?: string
          inspection_expiry?: string | null
          insurance_expiry?: string | null
          internal_code?: string | null
          last_maintenance_date?: string | null
          luggage_capacity?: number
          make?: string | null
          model?: string | null
          next_maintenance_date?: string | null
          next_maintenance_mileage?: number | null
          notes?: string | null
          plate_number?: string
          registration_expiry?: string | null
          road_tax_expiry?: string | null
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          taxi_permit_expiry?: string | null
          transmission?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_finance: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      recompute_customer_stats: {
        Args: { _customer_id: string }
        Returns: undefined
      }
      recompute_driver_stats: {
        Args: { _driver_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "dispatcher" | "accountant" | "driver"
      booking_status:
        | "pending"
        | "confirmed"
        | "assigned"
        | "en_route"
        | "on_trip"
        | "picked_up"
        | "completed"
        | "cancelled"
        | "no_show"
      cms_page_type:
        | "generic"
        | "service"
        | "airport"
        | "city"
        | "route_page"
        | "category"
      customer_note_kind:
        | "note"
        | "call"
        | "whatsapp"
        | "complaint"
        | "compliment"
        | "follow_up"
      customer_tier: "regular" | "vip" | "corporate" | "blacklisted"
      driver_doc_kind:
        | "license"
        | "national_id"
        | "medical"
        | "work_permit"
        | "insurance"
        | "other"
      driver_status:
        | "offline"
        | "available"
        | "on_trip"
        | "on_break"
        | "suspended"
        | "assigned"
        | "en_route"
        | "waiting"
        | "vacation"
      employment_status:
        | "active"
        | "probation"
        | "suspended"
        | "terminated"
        | "vacation"
      expense_category:
        | "fuel"
        | "maintenance"
        | "insurance"
        | "vehicle_repair"
        | "driver_salary"
        | "marketing"
        | "office"
        | "software"
        | "taxes"
        | "other"
      invoice_status:
        | "draft"
        | "issued"
        | "paid"
        | "partially_paid"
        | "overdue"
        | "cancelled"
      maintenance_kind:
        | "oil_change"
        | "tire"
        | "brake"
        | "battery"
        | "inspection"
        | "general"
        | "repair"
        | "other"
      payment_method:
        | "cash"
        | "card"
        | "wallet"
        | "bank_transfer"
        | "online"
        | "corporate_account"
        | "invoice_later"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_paid"
        | "cancelled"
      payroll_status: "draft" | "approved" | "paid"
      refund_type: "full" | "partial"
      vehicle_doc_kind:
        | "registration"
        | "insurance"
        | "inspection"
        | "taxi_permit"
        | "road_tax"
        | "other"
      vehicle_status:
        | "active"
        | "maintenance"
        | "retired"
        | "available"
        | "assigned"
        | "on_trip"
        | "out_of_service"
        | "reserved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "dispatcher", "accountant", "driver"],
      booking_status: [
        "pending",
        "confirmed",
        "assigned",
        "en_route",
        "on_trip",
        "picked_up",
        "completed",
        "cancelled",
        "no_show",
      ],
      cms_page_type: [
        "generic",
        "service",
        "airport",
        "city",
        "route_page",
        "category",
      ],
      customer_note_kind: [
        "note",
        "call",
        "whatsapp",
        "complaint",
        "compliment",
        "follow_up",
      ],
      customer_tier: ["regular", "vip", "corporate", "blacklisted"],
      driver_doc_kind: [
        "license",
        "national_id",
        "medical",
        "work_permit",
        "insurance",
        "other",
      ],
      driver_status: [
        "offline",
        "available",
        "on_trip",
        "on_break",
        "suspended",
        "assigned",
        "en_route",
        "waiting",
        "vacation",
      ],
      employment_status: [
        "active",
        "probation",
        "suspended",
        "terminated",
        "vacation",
      ],
      expense_category: [
        "fuel",
        "maintenance",
        "insurance",
        "vehicle_repair",
        "driver_salary",
        "marketing",
        "office",
        "software",
        "taxes",
        "other",
      ],
      invoice_status: [
        "draft",
        "issued",
        "paid",
        "partially_paid",
        "overdue",
        "cancelled",
      ],
      maintenance_kind: [
        "oil_change",
        "tire",
        "brake",
        "battery",
        "inspection",
        "general",
        "repair",
        "other",
      ],
      payment_method: [
        "cash",
        "card",
        "wallet",
        "bank_transfer",
        "online",
        "corporate_account",
        "invoice_later",
      ],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_paid",
        "cancelled",
      ],
      payroll_status: ["draft", "approved", "paid"],
      refund_type: ["full", "partial"],
      vehicle_doc_kind: [
        "registration",
        "insurance",
        "inspection",
        "taxi_permit",
        "road_tax",
        "other",
      ],
      vehicle_status: [
        "active",
        "maintenance",
        "retired",
        "available",
        "assigned",
        "on_trip",
        "out_of_service",
        "reserved",
      ],
    },
  },
} as const
