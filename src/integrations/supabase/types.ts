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
      diagnostic_sessions: {
        Row: {
          career_moment: string | null
          communication_type: string | null
          completed_at: string | null
          created_at: string
          email: string | null
          first_name: string | null
          gaps: Json | null
          id: string
          ip_address: string
          readiness_score: number | null
          recommended_pathway: string | null
          recommended_pathway_name: string | null
          recommended_price: string | null
          transcript: string | null
        }
        Insert: {
          career_moment?: string | null
          communication_type?: string | null
          completed_at?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gaps?: Json | null
          id?: string
          ip_address: string
          readiness_score?: number | null
          recommended_pathway?: string | null
          recommended_pathway_name?: string | null
          recommended_price?: string | null
          transcript?: string | null
        }
        Update: {
          career_moment?: string | null
          communication_type?: string | null
          completed_at?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gaps?: Json | null
          id?: string
          ip_address?: string
          readiness_score?: number | null
          recommended_pathway?: string | null
          recommended_pathway_name?: string | null
          recommended_price?: string | null
          transcript?: string | null
        }
        Relationships: []
      }
      quiz_leads: {
        Row: {
          career_moment: string | null
          communication_type: string | null
          converted_to_paid: boolean
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          recommended_pathway: string | null
          recommended_price: string | null
          source: string | null
          urgency: string | null
        }
        Insert: {
          career_moment?: string | null
          communication_type?: string | null
          converted_to_paid?: boolean
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          recommended_pathway?: string | null
          recommended_price?: string | null
          source?: string | null
          urgency?: string | null
        }
        Update: {
          career_moment?: string | null
          communication_type?: string | null
          converted_to_paid?: boolean
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          recommended_pathway?: string | null
          recommended_price?: string | null
          source?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          authority_score: number | null
          clarity_score: number | null
          confidence_score: number | null
          created_at: string
          duration_minutes: number | null
          evidence_score: number | null
          homework_instructions: string | null
          id: string
          pathway: string | null
          practice_focus: string | null
          questions_covered: string | null
          readiness_score_end: number | null
          readiness_score_start: number | null
          session_number: number | null
          session_status: string
          strongest_moment: string | null
          transcript: string | null
          upsell_shown: boolean
          user_id: string
        }
        Insert: {
          authority_score?: number | null
          clarity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          duration_minutes?: number | null
          evidence_score?: number | null
          homework_instructions?: string | null
          id?: string
          pathway?: string | null
          practice_focus?: string | null
          questions_covered?: string | null
          readiness_score_end?: number | null
          readiness_score_start?: number | null
          session_number?: number | null
          session_status?: string
          strongest_moment?: string | null
          transcript?: string | null
          upsell_shown?: boolean
          user_id: string
        }
        Update: {
          authority_score?: number | null
          clarity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          duration_minutes?: number | null
          evidence_score?: number | null
          homework_instructions?: string | null
          id?: string
          pathway?: string | null
          practice_focus?: string | null
          questions_covered?: string | null
          readiness_score_end?: number | null
          readiness_score_start?: number | null
          session_number?: number | null
          session_status?: string
          strongest_moment?: string | null
          transcript?: string | null
          upsell_shown?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      story_bank: {
        Row: {
          answer_final: string | null
          created_at: string
          id: string
          notes: string | null
          question: string | null
          readiness_score: number | null
          user_id: string
        }
        Insert: {
          answer_final?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          question?: string | null
          readiness_score?: number | null
          user_id: string
        }
        Update: {
          answer_final?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          question?: string | null
          readiness_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_bank_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          customer_email: string | null
          environment: string
          id: string
          pathway: string | null
          price_id: string
          product_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          environment?: string
          id?: string
          pathway?: string | null
          price_id: string
          product_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          environment?: string
          id?: string
          pathway?: string | null
          price_id?: string
          product_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          access_expires_at: string | null
          communication_type: string | null
          created_at: string
          cv_text: string | null
          email: string
          first_name: string | null
          id: string
          jd_key_phrases: string | null
          jd_text: string | null
          last_question_worked_on: string | null
          last_readiness_score: number | null
          minutes_per_session: number
          pathway: string | null
          payment_status: string
          practice_focus: string | null
          quiz_urgency: string | null
          sessions_completed: number
          sessions_purchased: number
          source: string | null
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          stripe_subscription_id: string | null
          subscription_cancel_at_period_end: boolean
          subscription_price_id: string | null
          subscription_status: string | null
          upsell_shown: boolean
          welcome_shown: boolean
        }
        Insert: {
          access_expires_at?: string | null
          communication_type?: string | null
          created_at?: string
          cv_text?: string | null
          email: string
          first_name?: string | null
          id: string
          jd_key_phrases?: string | null
          jd_text?: string | null
          last_question_worked_on?: string | null
          last_readiness_score?: number | null
          minutes_per_session?: number
          pathway?: string | null
          payment_status?: string
          practice_focus?: string | null
          quiz_urgency?: string | null
          sessions_completed?: number
          sessions_purchased?: number
          source?: string | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cancel_at_period_end?: boolean
          subscription_price_id?: string | null
          subscription_status?: string | null
          upsell_shown?: boolean
          welcome_shown?: boolean
        }
        Update: {
          access_expires_at?: string | null
          communication_type?: string | null
          created_at?: string
          cv_text?: string | null
          email?: string
          first_name?: string | null
          id?: string
          jd_key_phrases?: string | null
          jd_text?: string | null
          last_question_worked_on?: string | null
          last_readiness_score?: number | null
          minutes_per_session?: number
          pathway?: string | null
          payment_status?: string
          practice_focus?: string | null
          quiz_urgency?: string | null
          sessions_completed?: number
          sessions_purchased?: number
          source?: string | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cancel_at_period_end?: boolean
          subscription_price_id?: string | null
          subscription_status?: string | null
          upsell_shown?: boolean
          welcome_shown?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
