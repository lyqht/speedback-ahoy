import { Room } from '@/services/RoomService';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Ship: {
        Row: {
          id: string;
          created_at: string | null;
          captain: string;
          crew: Json[] | null;
          code: string | null;
          name: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          captain?: string | null;
          crew?: Json[] | null;
          code?: string | null;
          name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          captain?: string | null;
          crew?: Json[] | null;
          code?: string | null;
          name?: string | null;
        };
      };
      UserMetadata: {
        Row: {
          id: string;
          created_at: string | null;
          userId: string;
          avatarUrl?: string | null;
          nickname?: string | null;
          shipId: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          userId: string;
          avatarUrl?: string | null;
          nickname?: string | null;
          shipId?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          userId?: string;
          avatarUrl?: string | null;
          nickname?: string | null;
          shipId?: string | null;
        };
      };
      Schedule: {
        Row: {
          id: number;
          created_at: string | null;
          shipId: string | null;
          sequence: Json | null;
          rooms: Room[] | null;
          active: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          shipId?: string | null;
          sequence?: Json | null;
          rooms?: Json | null;
          active?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          shipId?: string | null;
          sequence?: Json | null;
          rooms?: Json | null;
          active?: boolean | null;
        };
      };
    };
  };
}
