'use server';

import { generateAutopsyScenario, type GenerateAutopsyScenarioInput } from '@/ai/flows/generate-autopsy-scenario';
import type { AutopsyScenario } from '@/lib/types';

type ActionResult = {
  success: boolean;
  data?: AutopsyScenario;
  error?: string;
};

export async function createAutopsyScenario(input: GenerateAutopsyScenarioInput): Promise<ActionResult> {
  try {
    const result = await generateAutopsyScenario(input);
    const scenario: AutopsyScenario = {
        ...result,
        evidence: [], // Initially no evidence is tied to the scenario
    }
    return { success: true, data: scenario };
  } catch (error) {
    console.error('Error generating autopsy scenario:', error);
    return { success: false, error: 'Failed to generate a new scenario. Please try again.' };
  }
}
