export type AccountState = 'onboarding' | 'active' | 'restricted' | 'suspended' | 'deactivated' | 'deletion_pending' | 'banned';
export type VerificationState = 'not_applied' | 'submitted' | 'under_review' | 'needs_information' | 'approved' | 'rejected' | 'revoked';

export interface Database {
  public: {
    Tables: {
      skills: { Row: { id: string; name: string; slug: string; discipline_id: string | null; active: boolean; created_at: string }; Insert: never; Update: never; Relationships: [] };
      creative_disciplines: { Row: { id: string; name: string; slug: string; parent_id: string | null; active: boolean; sort_order: number; created_at: string }; Insert: never; Update: never; Relationships: [] };
      profiles: { Row: { id: string; username: string | null; display_name: string | null; creative_name: string | null; bio: string | null; avatar_path: string | null; collaboration_open: boolean; account_state: AccountState; verification_state: VerificationState; created_at: string; updated_at: string }; Insert: { id: string; username?: string | null; display_name?: string | null }; Update: { username?: string | null; display_name?: string | null; creative_name?: string | null; bio?: string | null; avatar_path?: string | null; collaboration_open?: boolean }; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
