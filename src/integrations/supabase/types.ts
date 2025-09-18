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
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          team_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          team_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          files: Json | null
          id: string
          is_user: boolean
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          files?: Json | null
          id?: string
          is_user?: boolean
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          files?: Json | null
          id?: string
          is_user?: boolean
          user_id?: string
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
      documents: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          updated_at: string | null
          uploader_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          updated_at?: string | null
          uploader_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          updated_at?: string | null
          uploader_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          file_url: string | null
          filename: string
          id: string
          mime_type: string | null
          owner_id: string
          space_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          file_url?: string | null
          filename: string
          id?: string
          mime_type?: string | null
          owner_id: string
          space_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_url?: string | null
          filename?: string
          id?: string
          mime_type?: string | null
          owner_id?: string
          space_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
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
      shared_files: {
        Row: {
          created_at: string
          id: string
          platform: string | null
          shared_by: string
          shared_with_user_id: string | null
          team_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform?: string | null
          shared_by: string
          shared_with_user_id?: string | null
          team_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string | null
          shared_by?: string
          shared_with_user_id?: string | null
          team_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_files_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_files_shared_with_user_id_fkey"
            columns: ["shared_with_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_files_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      space_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          space_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["app_role"]
          space_id: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["app_role"]
          space_id?: string
          token?: string
        }
        Relationships: []
      }
      space_members: {
        Row: {
          added_at: string
          added_by: string
          email: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          space_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          space_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          space_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      spaces: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"]
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"]
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"]
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
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
      workspace_members: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_space_invitation: {
        Args: { invitation_token: string }
        Returns: Json
      }
      accept_team_invitation: {
        Args: { invitation_id: string }
        Returns: Json
      }
      are_team_members: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
      can_view_user_roles: {
        Args: { team_id: string; user_id: string }
        Returns: boolean
      }
      check_user_invitation_status: {
        Args: { user_email: string }
        Returns: {
          expires_at: string
          invitation_id: string
          role: Database["public"]["Enums"]["app_role"]
          team_name: string
        }[]
      }
      create_audit_log: {
        Args: {
          p_action: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_new_values?: Json
          p_old_values?: Json
          p_resource_id?: string
          p_resource_type: string
          p_severity?: string
          p_team_id: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      create_team_with_setup: {
        Args: {
          team_description?: string
          team_name: string
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
      get_team_member_info: {
        Args: { target_user_id: string }
        Returns: {
          avatar_url: string
          first_name: string
          id: string
          last_name: string
        }[]
      }
      get_team_member_safe_info: {
        Args: { target_user_id: string }
        Returns: {
          avatar_url: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      get_team_members: {
        Args: { team_id_param: string }
        Returns: {
          avatar_url: string
          first_name: string
          last_name: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          user_id: string
        }[]
      }
      get_user_email_secure: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_user_role_for_space: {
        Args: { space_id_param: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_role_in_team: {
        Args: { team_id: string; user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      handle_team_invitation: {
        Args: {
          custom_department?: string
          invitation_email: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          team_id: string
        }
        Returns: Json
      }
      is_team_admin: {
        Args: { team_id: string; user_id: string }
        Returns: boolean
      }
      log_profile_access: {
        Args: { access_type: string; accessed_user_id: string }
        Returns: undefined
      }
      search_users: {
        Args: { search_query: string }
        Returns: {
          email: string
          first_name: string
          id: string
          last_name: string
        }[]
      }
      validate_email_format: {
        Args: { email_input: string }
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
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "done" | "blocked"
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
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "done", "blocked"],
    },
  },
} as const
