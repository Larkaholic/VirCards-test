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

const InjurySchema = z.object({
  type: z.enum(['stabbing', 'gunshot', 'poisoning', 'blunt-force-trauma', 'unknown']),
  location: z.string().describe('e.g., \'Heart\', \'Left Lung\''),
  position: z.array(z.number()).length(3).describe('Position of the injury as [x, y, z] coordinates.'),
  orientation: z.array(z.number()).length(3).describe('Orientation of the injury as [x, y, z] Euler angles.'),
  size: z.array(z.number()).length(3).describe('Size of the decal for the injury as [width, height, depth].')
});

const EvidenceSchema = z.object({
    id: z.string().describe('A unique ID for the evidence, e.g., evidence-heart'),
    description: z.string().describe('A detailed description of the evidence found.'),
    type: z.enum(['visual', 'toxicology', 'document']).describe('The type of evidence.'),
    discovered: z.boolean().describe('Whether the evidence has been discovered by the player.'),
    data: z.object({
        title: z.string().describe('A short title for the evidence, e.g., "Stab Wound Details"')
    }).passthrough().describe('Any additional data related to the evidence.')
});

const GenerateAutopsyScenarioOutputSchema = z.object({
  scenario: z.string().describe('A fictional autopsy scenario.'),
  causeOfDeath: z.string().describe('The determined cause of death.'),
  timeOfDeath: z.string().describe('The estimated time of death.'),
  injuriesSustained: z.string().describe('A description of injuries sustained by the deceased.'),
  injuries: z.array(InjurySchema).describe('An array of injury objects with details for 3D visualization.'),
  evidence: z.array(EvidenceSchema).describe('An array of evidence that can be discovered.')
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
  prompt: `You are an expert forensic pathologist. Please generate a fictional autopsy scenario based on the following user input: {{{userQuery}}}. If the input is blank, create a scenario involving a single stab wound to the heart.

  The scenario should include:
  - A detailed narrative of the circumstances leading to the death.
  - The cause of death, which should be 'stabbing'.
  - The estimated time of death.
  - A description of injuries sustained by the deceased.
  - A detailed list of injuries for 3D visualization. For a stabbing, create one injury object.
  - A list of discoverable evidence. For a stabbing, include evidence related to the heart wound.

  Here's what you need to do:
  1.  Craft a fictional autopsy scenario.
  2.  Set the cause of death to 'stabbing'.
  3.  Estimate a time of death.
  4.  Describe the injuries sustained.
  5.  Generate an 'injuries' array with one object for the stab wound. The injury location must be 'Heart'. Provide realistic 'position' [0, 0, 1.5], 'orientation' [0, 0, 0], and 'size' [0.5, 0.5, 1] values for a decal on the 3D model. For a stab wound, the size should be narrow and long.
  6.  Generate an 'evidence' array. Create one evidence object with id 'evidence-heart' for the stab wound. Describe the clean, incised wound margins, indicating a sharp, single-edged blade. Set 'type' to 'visual', and 'discovered' to false. Add a 'title' to the data object.
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
