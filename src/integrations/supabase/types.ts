export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      anomaly_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          severity: string | null
          team_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          severity?: string | null
          team_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          severity?: string | null
          team_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          content: Json | null
          created_at: string
          document_id: string
          id: string
          metadata: Json | null
          team_id: string | null
          user_id: string | null
          version_number: number
        }
        Insert: {
          content?: Json | null
          created_at?: string
          document_id: string
          id?: string
          metadata?: Json | null
          team_id?: string | null
          user_id?: string | null
          version_number: number
        }
        Update: {
          content?: Json | null
          created_at?: string
          document_id?: string
          id?: string
          metadata?: Json | null
          team_id?: string | null
          user_id?: string | null
          version_number?: number
        }
        Relationships: []
      }
      permission_audits: {
        Row: {
          granted_by: string | null
          id: string
          new_permission: string | null
          old_permission: string | null
          permission_type: string
          resource_id: string | null
          resource_type: string | null
          target_user_id: string | null
          team_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          granted_by?: string | null
          id?: string
          new_permission?: string | null
          old_permission?: string | null
          permission_type: string
          resource_id?: string | null
          resource_type?: string | null
          target_user_id?: string | null
          team_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          granted_by?: string | null
          id?: string
          new_permission?: string | null
          old_permission?: string | null
          permission_type?: string
          resource_id?: string | null
          resource_type?: string | null
          target_user_id?: string | null
          team_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          resource: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          resource: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          resource?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_employees: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          custom_department: string | null
          custom_role: string | null
          department_id: string | null
          id: string
          invited_by: string | null
          joined_at: string | null
          last_active: string | null
          status: string | null
          team_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          custom_department?: string | null
          custom_role?: string | null
          department_id?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          last_active?: string | null
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          custom_department?: string | null
          custom_role?: string | null
          department_id?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          last_active?: string | null
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_employees_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_employees_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_team_invitation: {
        Args: { invitation_id: string }
        Returns: Json
      }
      can_view_user_roles: {
        Args: { user_id: string; team_id: string }
        Returns: boolean
      }
      create_audit_log: {
        Args: {
          p_user_id: string
          p_team_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_metadata?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_severity?: string
        }
        Returns: string
      }
      create_team_with_setup: {
        Args: {
          team_name: string
          team_description?: string
          user_first_name?: string
          user_last_name?: string
        }
        Returns: Json
      }
      detect_anomalies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_auth_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role_in_team: {
        Args: { user_id: string; team_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      handle_team_invitation: {
        Args: {
          invitation_email: string
          team_id: string
          role: Database["public"]["Enums"]["app_role"]
          invited_by: string
          custom_department?: string
        }
        Returns: Json
      }
      is_team_admin: {
        Args: { user_id: string; team_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "team_lead" | "employee" | "viewer"
      permission_type:
        | "read"
        | "write"
        | "delete"
        | "manage_users"
        | "manage_roles"
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
      app_role: ["admin", "team_lead", "employee", "viewer"],
      permission_type: [
        "read",
        "write",
        "delete",
        "manage_users",
        "manage_roles",
      ],
    },
  },
} as const
