'use server';

/**
 * @fileOverview Generates a fictional autopsy scenario using an LLM.
 *
 * - generateAutopsyScenario - A function that generates an autopsy scenario.
 * - GenerateAutopsyScenarioInput - The input type for the generateAutopsyScenario function.
 * - GenerateAutopsyScenarioOutput - The return type for the generateAutopsyScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAutopsyScenarioInputSchema = z.object({
  userQuery: z
    .string()
    .optional()
    .describe(
      'Optional user input that provides context for the autopsy scenario. Leave blank for a random scenario'
    ),
});
export type GenerateAutopsyScenarioInput = z.infer<typeof GenerateAutopsyScenarioInputSchema>;

const GenerateAutopsyScenarioOutputSchema = z.object({
  scenario: z.string().describe('A fictional autopsy scenario.'),
  causeOfDeath: z.string().describe('The determined cause of death.'),
  timeOfDeath: z.string().describe('The estimated time of death.'),
  injuriesSustained: z.string().describe('A description of injuries sustained by the deceased.'),
});
export type GenerateAutopsyScenarioOutput = z.infer<typeof GenerateAutopsyScenarioOutputSchema>;

export async function generateAutopsyScenario(
  input: GenerateAutopsyScenarioInput
): Promise<GenerateAutopsyScenarioOutput> {
  return generateAutopsyScenarioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutopsyScenarioPrompt',
  input: {schema: GenerateAutopsyScenarioInputSchema},
  output: {schema: GenerateAutopsyScenarioOutputSchema},
  prompt: `You are an expert forensic pathologist. Please generate a fictional autopsy scenario based on the following user input: {{{userQuery}}}. If the input is blank, make up a scenario.

  The scenario should include:
  - A detailed narrative of the circumstances leading to the death.
  - The cause of death.
  - The estimated time of death.
  - A description of injuries sustained by the deceased.

  Here's what you need to do:
  1.  Craft a fictional autopsy scenario including circumstances around the death.
  2.  Determine the cause of death based on the scenario.
  3.  Estimate the time of death.
  4.  Describe any injuries sustained by the deceased.
  `,
});

const generateAutopsyScenarioFlow = ai.defineFlow(
  {
    name: 'generateAutopsyScenarioFlow',
    inputSchema: GenerateAutopsyScenarioInputSchema,
    outputSchema: GenerateAutopsyScenarioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
