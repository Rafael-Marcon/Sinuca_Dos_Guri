// Hand-written types matching supabase/migrations/*.sql.
// Regenerate with `supabase gen types typescript --project-id <id>` once the
// project is linked, and replace this file with the generated output.

export type MatchType = "1v1" | "2v2";
export type Side = "A" | "B";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          match_type: MatchType;
          played_at: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_type: MatchType;
          played_at?: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_type?: MatchType;
          played_at?: string;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      match_participants: {
        Row: {
          id: string;
          match_id: string;
          player_id: string;
          side: Side;
          is_winner: boolean;
          points_awarded: number;
        };
        Insert: {
          id?: string;
          match_id: string;
          player_id: string;
          side: Side;
          is_winner: boolean;
          points_awarded?: number;
        };
        Update: {
          id?: string;
          match_id?: string;
          player_id?: string;
          side?: Side;
          is_winner?: boolean;
          points_awarded?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      player_points: {
        Row: {
          player_id: string;
          total_points: number;
          matches_played: number;
          wins: number;
        };
        Relationships: [];
      };
      duo_matches: {
        Row: {
          match_id: string;
          played_at: string;
          player_a: string;
          player_b: string;
          is_winner: boolean;
          duo_points: number;
        };
        Relationships: [];
      };
      duo_stats: {
        Row: {
          player_a: string;
          player_b: string;
          matches_played: number;
          wins: number;
          win_rate: number;
          total_points: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      record_match: {
        Args: {
          p_match_type: MatchType;
          p_played_at: string;
          p_participants: {
            player_id: string;
            side: Side;
            is_winner: boolean;
          }[];
        };
        Returns: string;
      };
      ranking_for_period: {
        Args: {
          period_start: string;
          period_end: string;
        };
        Returns: {
          player_id: string;
          name: string;
          points: number;
          wins: number;
          matches: number;
        }[];
      };
      player_streaks: {
        Args: Record<string, never>;
        Returns: {
          player_id: string;
          longest_win_streak: number;
          longest_loss_streak: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
