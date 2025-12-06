'use client';

import type { AutopsyScenario, OrganInteraction, DataTag } from '@/lib/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type AutopsyContextType = {
  scenario: AutopsyScenario | null;
  setScenario: (scenario: AutopsyScenario | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  interactions: OrganInteraction[];
  recordInteraction: (organName: string) => void;
  tags: DataTag[];
  addTag: (tag: Omit<DataTag, 'id'>) => void;
  removeTag: (id: string) => void;
  clearState: () => void;
};

const AutopsyContext = createContext<AutopsyContextType | undefined>(undefined);

export function AutopsyProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<AutopsyScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interactions, setInteractions] = useState<OrganInteraction[]>([]);
  const [tags, setTags] = useState<DataTag[]>([]);

  const recordInteraction = (organName: string) => {
    setInteractions(prev => {
      const existing = prev.find(i => i.name === organName);
      if (existing) {
        return prev.map(i => i.name === organName ? { ...i, count: i.count + 1 } : i);
      }
      return [...prev, { name: organName, count: 1 }];
    });
  };
  
  const addTag = (tag: Omit<DataTag, 'id'>) => {
    const newTag = { ...tag, id: `tag-${Date.now()}` };
    setTags(prev => [...prev, newTag]);
  };
  
  const removeTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };
  
  const clearState = () => {
    setScenario(null);
    setInteractions([]);
    setTags([]);
  }

  const value = {
    scenario,
    setScenario,
    isLoading,
    setIsLoading,
    interactions,
    recordInteraction,
    tags,
    addTag,
    removeTag,
    clearState,
  };

  return <AutopsyContext.Provider value={value}>{children}</AutopsyContext.Provider>;
}

export function useAutopsy() {
  const context = useContext(AutopsyContext);
  if (context === undefined) {
    throw new Error('useAutopsy must be used within an AutopsyProvider');
  }
  return context;
}
