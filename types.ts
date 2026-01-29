export type BadgeCategory = 'Achievement' | 'Highlight' | 'Special';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface BadgeTier {
  name: string;
  color: string;
  requirement: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or URL
  category: BadgeCategory;
  rarity: Rarity;
  tiers?: BadgeTier[];
  howToEarn: string;
  retired?: boolean;
  owned?: boolean; // New property to track if the user owns this badge (for non-tiered badges)
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  images?: string[];
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export enum ModelType {
  FAST = 'fast',
  SMART = 'smart',
  CREATIVE = 'creative'
}

export interface UserProfile {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

export interface UserStats {
  totalStars: number;
  mergedPRs: number;
}
