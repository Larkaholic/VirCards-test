'use server';

import { config } from 'dotenv';
config();

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
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating autopsy scenario:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate a new scenario. Please try again. Details: ${errorMessage}` };
  }
}
