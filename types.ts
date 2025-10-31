// FIX: Add React import to resolve namespace error for React.ReactElement.
import React from 'react';

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: Source[];
}

export interface VirtualAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
}