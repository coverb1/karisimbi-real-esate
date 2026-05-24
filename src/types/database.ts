// 📁 types/database.types.ts

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
          bedrooms: number;
          bathrooms: number;
          area: number;
          image_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          location: string;
          type: string;
          price: number;
          bedrooms: number;
          bathrooms: number;
          area: number;
          image_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          type?: string;
          price?: number;
          bedrooms?: number;
          bathrooms?: number;
          area?: number;
          image_url?: string | null;
          status?: string;
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