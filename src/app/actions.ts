'use server';

import {predefinedScenario} from '@/lib/predefined-scenario';
import type {AutopsyScenario} from '@/lib/types';

type ActionResult = {
  success: boolean;
  data?: AutopsyScenario;
  error?: string;
};

export async function createAutopsyScenario(): Promise<ActionResult> {
  try {
    // Return the predefined scenario instead of generating a new one
    return {success: true, data: predefinedScenario};
  } catch (error) {
    console.error('Error loading predefined scenario:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to load the scenario. Please try again. Details: ${errorMessage}`,
    };
  }
}
