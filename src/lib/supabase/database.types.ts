export type AccountState = 'onboarding' | 'active' | 'restricted' | 'suspended' | 'deactivated' | 'deletion_pending' | 'banned';
export type VerificationState = 'not_applied' | 'submitted' | 'under_review' | 'needs_information' | 'approved' | 'rejected' | 'revoked';

export interface Database {
  public: {
    Tables: {
      skills: {
        Row: { id: string; name: string; slug: string; discipline_id: string | null; active: boolean; created_at: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      creative_disciplines: {
        Row: { id: string; name: string; slug: string; parent_id: string | null; active: boolean; sort_order: number; created_at: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          creative_name: string | null;
          bio: string | null;
          avatar_path: string | null;
          collaboration_open: boolean;
          account_state: AccountState;
          verification_state: VerificationState;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; username?: string | null; display_name?: string | null };
        Update: { username?: string | null; display_name?: string | null; creative_name?: string | null; bio?: string | null; avatar_path?: string | null; collaboration_open?: boolean };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          author_name: string;
          author_handle: string;
          discipline: string;
          avatar_url: string | null;
          image_url: string;
          title: string;
          caption: string | null;
          category: string;
          location: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          author_name: string;
          author_handle: string;
          discipline: string;
          avatar_url?: string | null;
          image_url: string;
          title: string;
          caption?: string | null;
          category: string;
          location?: string | null;
          likes_count?: number;
          comments_count?: number;
        };
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          author_name: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          author_name: string;
          body: string;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          poster_id: string | null;
          client_name: string;
          title: string;
          discipline: string;
          budget: string;
          location: string;
          job_type: string;
          description: string;
          skills: string[];
          deadline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          poster_id?: string | null;
          client_name: string;
          title: string;
          discipline: string;
          budget: string;
          location: string;
          job_type: string;
          description: string;
          skills?: string[];
          deadline?: string | null;
        };
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          applicant_id: string | null;
          applicant_name: string;
          applicant_role: string;
          cover_letter: string;
          proposed_rate: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          applicant_id?: string | null;
          applicant_name: string;
          applicant_role: string;
          cover_letter: string;
          proposed_rate?: string | null;
        };
        Update: Partial<Database['public']['Tables']['job_applications']['Insert']>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          owner_id: string | null;
          title: string;
          client_name: string;
          status: string;
          phase: string;
          progress: number;
          budget: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          title: string;
          client_name: string;
          status?: string;
          phase?: string;
          progress?: number;
          budget?: string | null;
          due_date?: string | null;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
        Relationships: [];
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string | null;
          title: string;
          status: string;
          priority: string;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          user_id?: string | null;
          title: string;
          status?: string;
          priority?: string;
          due_date?: string | null;
        };
        Update: Partial<Database['public']['Tables']['project_tasks']['Insert']>;
        Relationships: [];
      };
      saved_items: {
        Row: {
          id: string;
          user_id: string | null;
          item_id: string;
          kind: string;
          title: string;
          subtitle: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          item_id: string;
          kind: string;
          title: string;
          subtitle?: string | null;
        };
        Update: Partial<Database['public']['Tables']['saved_items']['Insert']>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type?: string;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string | null;
          sender_name: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id?: string | null;
          sender_name: string;
          body: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
