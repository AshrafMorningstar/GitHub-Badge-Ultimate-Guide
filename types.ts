export type BadgeCategory = 'Achievement' | 'Highlight' | 'Special';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface BadgeTier {
  name: string;
  color: string;
  requirement: string;
  unlocked: boolean;
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