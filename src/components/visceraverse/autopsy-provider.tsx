'use client';

import { create } from 'zustand';
import type { AutopsyScenario, OrganInteraction, DataTag, Evidence, Injury } from '@/lib/types';

type Tool = 'magnifying-glass' | null;

type AutopsyState = {
  scenario: AutopsyScenario | null;
  isLoading: boolean;
  interactions: OrganInteraction[];
  tags: DataTag[];
  discoveredEvidence: string[];
  injuries: Injury[];
  activeTool: Tool;
};

type AutopsyActions = {
  setScenario: (scenario: AutopsyScenario | null) => void;
  setIsLoading: (loading: boolean) => void;
  recordInteraction: (organName: string) => void;
  addTag: (tag: Omit<DataTag, 'id'>) => void;
  removeTag: (id: string) => void;
  discoverEvidence: (evidenceId: string) => void;
  setActiveTool: (tool: Tool) => void;
  clearState: () => void;
};

export const useAutopsyStore = create<AutopsyState & AutopsyActions>((set, get) => ({
  // State
  scenario: null,
  isLoading: false,
  interactions: [],
  tags: [],
  discoveredEvidence: [],
  injuries: [],
  activeTool: null,

  // Actions
  setScenario: (scenario) => {
    set({
      scenario,
      injuries: scenario?.injuries || [],
      discoveredEvidence: [],
    });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  recordInteraction: (organName) => {
    set(state => {
      const existing = state.interactions.find(i => i.name === organName);
      if (existing) {
        return {
          interactions: state.interactions.map(i =>
            i.name === organName ? { ...i, count: i.count + 1 } : i
          ),
        };
      }
      return { interactions: [...state.interactions, { name: organName, count: 1 }] };
    });
  },
  addTag: (tag) => {
    const newTag = { ...tag, id: `tag-${Date.now()}` };
    set(state => ({ tags: [...state.tags, newTag] }));
  },
  removeTag: (id) => {
    set(state => ({ tags: state.tags.filter(t => t.id !== id) }));
  },
  discoverEvidence: (evidenceId) => {
    if (!get().discoveredEvidence.includes(evidenceId)) {
        set(state => ({ discoveredEvidence: [...state.discoveredEvidence, evidenceId] }));
    }
  },
  setActiveTool: (tool) => set({ activeTool: tool }),
  clearState: () => {
    set({
      scenario: null,
      interactions: [],
      tags: [],
      discoveredEvidence: [],
      injuries: [],
      activeTool: null,
    });
  },
}));

// The provider is no longer strictly necessary if all components use the hook,
// but it's good practice to keep it to signify that this part of the tree
// uses the autopsy store.
export function AutopsyProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
