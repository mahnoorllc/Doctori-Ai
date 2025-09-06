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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string | null
          id: number
          metadata: Json | null
          target_id: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string | null
          id?: number
          metadata?: Json | null
          target_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string | null
          id?: number
          metadata?: Json | null
          target_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          primary_symptoms: string[] | null
          specialty_recommendation: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          urgency_level: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          primary_symptoms?: string[] | null
          specialty_recommendation?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          primary_symptoms?: string[] | null
          specialty_recommendation?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          age: number | null
          answers: Json
          completed_at: string | null
          created_at: string
          gender: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          consent_type: string
          consented_at: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type?: string
          consented_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          consented_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          approved: boolean | null
          availability: Json | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          experience: number | null
          id: string
          license_number: string | null
          photo_url: string | null
          specialty: string
          updated_at: string
          user_id: string
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          approved?: boolean | null
          availability?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience?: number | null
          id?: string
          license_number?: string | null
          photo_url?: string | null
          specialty: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          approved?: boolean | null
          availability?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience?: number | null
          id?: string
          license_number?: string | null
          photo_url?: string | null
          specialty?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      medical_assessments: {
        Row: {
          assessment_data: Json | null
          created_at: string | null
          id: string
          recommendations: string[] | null
          session_id: string | null
          symptoms: Json
          urgency_score: number | null
        }
        Insert: {
          assessment_data?: Json | null
          created_at?: string | null
          id?: string
          recommendations?: string[] | null
          session_id?: string | null
          symptoms: Json
          urgency_score?: number | null
        }
        Update: {
          assessment_data?: Json | null
          created_at?: string | null
          id?: string
          recommendations?: string[] | null
          session_id?: string | null
          symptoms?: Json
          urgency_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_assessments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      medicine_cache: {
        Row: {
          created_at: string
          id: string
          medicine_data: Json
          medicine_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          medicine_data: Json
          medicine_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          medicine_data?: Json
          medicine_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          allergies: string[] | null
          approval_status: Database["public"]["Enums"]["approval_status"] | null
          bio: string | null
          blood_group: Database["public"]["Enums"]["blood_group_type"] | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          first_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          health_info: Json | null
          height: number | null
          id: string
          last_name: string | null
          medical_conditions: string[] | null
          medications: string[] | null
          name: string | null
          phone: string | null
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string[] | null
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          bio?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group_type"] | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          health_info?: Json | null
          height?: number | null
          id: string
          last_name?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string[] | null
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          bio?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group_type"] | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          health_info?: Json | null
          height?: number | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      provider_patient_assignments: {
        Row: {
          created_at: string | null
          id: number
          patient_id: string
          provider_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          patient_id: string
          provider_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          patient_id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_patient_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_patient_assignments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limiter: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: unknown
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          id: number
          notes: string | null
          reminder_time: string
          repeat_interval: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          notes?: string | null
          reminder_time: string
          repeat_interval?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          notes?: string | null
          reminder_time?: string
          repeat_interval?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_preparations: {
        Row: {
          created_at: string | null
          id: string
          medications_to_discuss: string[] | null
          questions: string[] | null
          session_id: string | null
          summary: string
          symptoms_timeline: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          medications_to_discuss?: string[] | null
          questions?: string[] | null
          session_id?: string | null
          summary: string
          symptoms_timeline?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          medications_to_discuss?: string[] | null
          questions?: string[] | null
          session_id?: string | null
          summary?: string
          symptoms_timeline?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visit_preparations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      doctors_public: {
        Row: {
          bio: string | null
          consultation_fee: number | null
          created_at: string | null
          experience: number | null
          id: string | null
          photo_url: string | null
          specialty: string | null
          verified: boolean | null
        }
        Insert: {
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          experience?: number | null
          id?: string | null
          photo_url?: string | null
          specialty?: string | null
          verified?: boolean | null
        }
        Update: {
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          experience?: number | null
          id?: string | null
          photo_url?: string | null
          specialty?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          _endpoint: string
          _ip_address: unknown
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_approval_status: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["approval_status"]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      log_activity_safe: {
        Args: { _action: string; _metadata?: Json }
        Returns: undefined
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      blood_group_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      gender_type: "male" | "female" | "other"
      user_role: "user" | "provider" | "admin"
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
      approval_status: ["pending", "approved", "rejected"],
      blood_group_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      gender_type: ["male", "female", "other"],
      user_role: ["user", "provider", "admin"],
    },
  },
} as const
