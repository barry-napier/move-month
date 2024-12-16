export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "employee";
          department: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          activity_type:
            | "cycling"
            | "running"
            | "walking"
            | "golfing"
            | "rowing";
          start_date: string;
          end_date: string;
          target_goal: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          activity_type:
            | "cycling"
            | "running"
            | "walking"
            | "golfing"
            | "rowing";
          distance: number;
          duration: number | null;
          activity_date: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
