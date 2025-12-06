import type { GenerateAutopsyScenarioOutput } from '@/ai/flows/generate-autopsy-scenario';

export type AutopsyScenario = GenerateAutopsyScenarioOutput;

export type OrganInteraction = {
  name: string;
  count: number;
};

export type DataTag = {
  id: string;
  text: string;
  position: { x: number; y: number; z: number };
};
