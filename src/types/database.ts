export type UserRole = "admin" | "user";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: UserRole;
          password?: string | null;
          updated_at: string;
          reset_token?: string | null;
          reset_token_expiry?: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          role?: UserRole;
          updated_at?: string;
          password?: string | null;
          reset_token?: string | null;
          reset_token_expiry?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          role?: UserRole;
          updated_at?: string;
          password?: string | null;
          reset_token?: string | null;
          reset_token_expiry?: string | null;
        };
        Relationships: [];
      };

      properties: {
        Row: {
          id: string;
          title: string;
          location: string;
          type: string;
          price: number;
          bedrooms: number | null;   // nullable for Plot of Land
          bathrooms: number | null;  // nullable for Plot of Land
          area: number;
          image_url: string | null;
          status: string;
          description: string | null;
          video_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          location: string;
          type: string;
          price: number;
          bedrooms?: number | null;  // nullable for Plot of Land
          bathrooms?: number | null; // nullable for Plot of Land
          area: number;
          image_url?: string | null;
          status?: string;
          description?: string | null;
          video_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          type?: string;
          price?: number;
          bedrooms?: number | null;  // nullable for Plot of Land
          bathrooms?: number | null; // nullable for Plot of Land
          area?: number;
          image_url?: string | null;
          status?: string;
          description?: string | null;
          video_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      sell_property_submissions: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string;
          address: string | null;
          id_number: string | null;
          property_type: string | null;
          location: string | null;
          property_size: string | null;
          asking_price: string | null;
          documents_available: string | null;
          has_issues: string | null;
          issues_explanation: string | null;
          unread: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email: string;
          address?: string | null;
          id_number?: string | null;
          property_type?: string | null;
          location?: string | null;
          property_size?: string | null;
          asking_price?: string | null;
          documents_available?: string | null;
          has_issues?: string | null;
          issues_explanation?: string | null;
          unread?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string;
          address?: string | null;
          id_number?: string | null;
          property_type?: string | null;
          location?: string | null;
          property_size?: string | null;
          asking_price?: string | null;
          documents_available?: string | null;
          has_issues?: string | null;
          issues_explanation?: string | null;
          unread?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      property_visit_submissions: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          address: string | null;
          id_number: string | null;
          property_type: string | null;
          property_location: string | null;
          property_price: string | null;
          visit_date: string | null;
          visit_time: string | null;
          transportation: string | null;
          unread: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          id_number?: string | null;
          property_type?: string | null;
          property_location?: string | null;
          property_price?: string | null;
          visit_date?: string | null;
          visit_time?: string | null;
          transportation?: string | null;
          unread?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          id_number?: string | null;
          property_type?: string | null;
          property_location?: string | null;
          property_price?: string | null;
          visit_date?: string | null;
          visit_time?: string | null;
          transportation?: string | null;
          unread?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};