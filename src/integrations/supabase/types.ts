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
      bookings: {
        Row: {
          airport_fee: number
          base_fare: number
          category_id: string | null
          code: string
          completed_at: string | null
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
          base_fare?: number
          category_id?: string | null
          code?: string
          completed_at?: string | null
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
          base_fare?: number
          category_id?: string | null
          code?: string
          completed_at?: string | null
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
      customers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_blocked: boolean
          notes: string | null
          phone: string | null
          total_spent: number
          total_trips: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_blocked?: boolean
          notes?: string | null
          phone?: string | null
          total_spent?: number
          total_trips?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_blocked?: boolean
          notes?: string | null
          phone?: string | null
          total_spent?: number
          total_trips?: number
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          hired_at: string | null
          id: string
          is_active: boolean
          license_expiry: string | null
          license_number: string | null
          notes: string | null
          phone: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"]
          total_earnings: number
          total_trips: number
          updated_at: string
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          hired_at?: string | null
          id?: string
          is_active?: boolean
          license_expiry?: string | null
          license_number?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_earnings?: number
          total_trips?: number
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          hired_at?: string | null
          id?: string
          is_active?: boolean
          license_expiry?: string | null
          license_number?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_earnings?: number
          total_trips?: number
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
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
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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
      vehicles: {
        Row: {
          category_id: string | null
          color: string | null
          created_at: string
          id: string
          last_maintenance_date: string | null
          make: string | null
          model: string | null
          next_maintenance_date: string | null
          notes: string | null
          plate_number: string
          seats: number
          status: Database["public"]["Enums"]["vehicle_status"]
          updated_at: string
          year: number | null
        }
        Insert: {
          category_id?: string | null
          color?: string | null
          created_at?: string
          id?: string
          last_maintenance_date?: string | null
          make?: string | null
          model?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          plate_number: string
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          year?: number | null
        }
        Update: {
          category_id?: string | null
          color?: string | null
          created_at?: string
          id?: string
          last_maintenance_date?: string | null
          make?: string | null
          model?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          plate_number?: string
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
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
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "dispatcher" | "accountant" | "driver"
      booking_status:
        | "pending"
        | "assigned"
        | "en_route"
        | "on_trip"
        | "completed"
        | "cancelled"
        | "no_show"
      driver_status:
        | "offline"
        | "available"
        | "on_trip"
        | "on_break"
        | "suspended"
      payment_method: "cash" | "card" | "wallet" | "bank_transfer"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      vehicle_status: "active" | "maintenance" | "retired"
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
        "assigned",
        "en_route",
        "on_trip",
        "completed",
        "cancelled",
        "no_show",
      ],
      driver_status: [
        "offline",
        "available",
        "on_trip",
        "on_break",
        "suspended",
      ],
      payment_method: ["cash", "card", "wallet", "bank_transfer"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      vehicle_status: ["active", "maintenance", "retired"],
    },
  },
} as const
