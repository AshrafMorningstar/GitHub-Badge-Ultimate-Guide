/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import { Badge, Rarity } from './types';
import React from 'react';

export const BADGES: Badge[] = [
  {
    id: 'starstruck',
    name: 'Starstruck',
    description: 'Created a repository that has many stars.',
    icon: '⭐',
    category: 'Achievement',
    rarity: 'Common',
    howToEarn: 'Receive stars on a repository you own.',
    tiers: [
      { name: 'Bronze', color: '#cd7f32', requirement: '16 stars', unlocked: true },
      { name: 'Silver', color: '#c0c0c0', requirement: '128 stars', unlocked: false },
      { name: 'Gold', color: '#ffd700', requirement: '4096 stars', unlocked: false },
    ]
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    description: 'Closed an issue or pull request within 5 minutes of opening.',
    icon: '⚡',
    category: 'Achievement',
    rarity: 'Rare',
    howToEarn: 'Close an issue/PR within 5 minutes.',
    tiers: [
      { name: 'One-time', color: '#58a6ff', requirement: 'Close in < 5m', unlocked: true }
    ]
  },
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    description: 'Opened pull requests that have been merged.',
    icon: '🦈',
    category: 'Achievement',
    rarity: 'Common',
    howToEarn: 'Have your pull requests merged.',
    tiers: [
      { name: 'Bronze', color: '#cd7f32', requirement: '2 PRs', unlocked: true },
      { name: 'Silver', color: '#c0c0c0', requirement: '16 PRs', unlocked: true },
      { name: 'Gold', color: '#ffd700', requirement: '1024 PRs', unlocked: false },
    ]
  },
  {
    id: 'yolo',
    name: 'YOLO',
    description: 'Merged a pull request without code review.',
    icon: '🚀',
    category: 'Achievement',
    rarity: 'Epic',
    howToEarn: 'Merge a PR without a review (requires specific repo settings).',
    tiers: [{ name: 'One-time', color: '#e3b341', requirement: 'Merge solo', unlocked: false }]
  },
  {
    id: 'arctic-code-vault',
    name: 'Arctic Code Vault',
    description: 'Code contributed to the 2020 GitHub Archive Program.',
    icon: '❄️',
    category: 'Highlight',
    rarity: 'Legendary',
    howToEarn: 'Contributed code before 02/02/2020.',
    retired: true
  },
  {
    id: 'public-sponsor',
    name: 'GitHub Sponsor',
    description: 'Sponsoring an open source contributor.',
    icon: '💖',
    category: 'Highlight',
    rarity: 'Common',
    howToEarn: 'Sponsor a developer via GitHub Sponsors.',
  },
  {
    id: 'mars-2020',
    name: 'Mars 2020',
    description: 'Code contributed to a repository used in the Mars 2020 mission.',
    icon: '🚁',
    category: 'Highlight',
    rarity: 'Legendary',
    howToEarn: 'Contributed to specific NASA/JPL libraries.',
    retired: true
  }
];

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: 'text-slate-500 dark:text-slate-400',
  Rare: 'text-blue-600 dark:text-blue-400',
  Epic: 'text-purple-600 dark:text-purple-400',
  Legendary: 'text-yellow-600 dark:text-yellow-400'
};
