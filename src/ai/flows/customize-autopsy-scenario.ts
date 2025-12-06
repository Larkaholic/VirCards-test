'use server';
/**
 * @fileOverview Flow for customizing the autopsy scenario by specifying parameters like cause of death and time of death.
 *
 * - customizeAutopsyScenario - A function that handles the autopsy scenario customization process.
 * - CustomizeAutopsyScenarioInput - The input type for the customizeAutopsyScenario function.
 * - CustomizeAutopsyScenarioOutput - The return type for the customizeAutopsyScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeAutopsyScenarioInputSchema = z.object({
  causeOfDeath: z
    .string()
    .describe('The cause of death for the autopsy scenario.'),
  timeOfDeath: z.string().describe('The time of death for the autopsy scenario.'),
  injuriesSustained: z
    .string()
    .optional()
    .describe('Optional: The injuries sustained by the deceased.'),
  additionalContext: z
    .string()
    .optional()
    .describe('Optional: Additional context or details for the scenario.'),
});
export type CustomizeAutopsyScenarioInput = z.infer<
  typeof CustomizeAutopsyScenarioInputSchema
>;

const CustomizeAutopsyScenarioOutputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A detailed description of the customized autopsy scenario.'),
});
export type CustomizeAutopsyScenarioOutput = z.infer<
  typeof CustomizeAutopsyScenarioOutputSchema
>;

export async function customizeAutopsyScenario(
  input: CustomizeAutopsyScenarioInput
): Promise<CustomizeAutopsyScenarioOutput> {
  return customizeAutopsyScenarioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeAutopsyScenarioPrompt',
  input: {schema: CustomizeAutopsyScenarioInputSchema},
  output: {schema: CustomizeAutopsyScenarioOutputSchema},
  prompt: `You are an expert in creating realistic autopsy scenarios.

  Based on the provided information, generate a detailed and engaging description of an autopsy scenario.

  Cause of Death: {{{causeOfDeath}}}
  Time of Death: {{{timeOfDeath}}}
  Injuries Sustained: {{{injuriesSustained}}}
  Additional Context: {{{additionalContext}}}
  `,
});

const customizeAutopsyScenarioFlow = ai.defineFlow(
  {
    name: 'customizeAutopsyScenarioFlow',
    inputSchema: CustomizeAutopsyScenarioInputSchema,
    outputSchema: CustomizeAutopsyScenarioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
