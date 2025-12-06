'use server';

/**
 * @fileOverview A flow to summarize autopsy findings based on a generated scenario.
 *
 * - summarizeAutopsyFindings - A function that takes autopsy findings and returns a summary.
 * - SummarizeAutopsyFindingsInput - The input type for the summarizeAutopsyFindings function.
 * - SummarizeAutopsyFindingsOutput - The return type for the summarizeAutopsyFindings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAutopsyFindingsInputSchema = z.object({
  scenario: z.string().describe('The generated autopsy scenario.'),
  findings: z.string().describe('The user provided autopsy findings.'),
});
export type SummarizeAutopsyFindingsInput = z.infer<typeof SummarizeAutopsyFindingsInputSchema>;

const SummarizeAutopsyFindingsOutputSchema = z.object({
  summary: z.string().describe('A summary of the autopsy findings.'),
});
export type SummarizeAutopsyFindingsOutput = z.infer<typeof SummarizeAutopsyFindingsOutputSchema>;

export async function summarizeAutopsyFindings(input: SummarizeAutopsyFindingsInput): Promise<SummarizeAutopsyFindingsOutput> {
  return summarizeAutopsyFindingsFlow(input);
}

const summarizeAutopsyFindingsPrompt = ai.definePrompt({
  name: 'summarizeAutopsyFindingsPrompt',
  input: {schema: SummarizeAutopsyFindingsInputSchema},
  output: {schema: SummarizeAutopsyFindingsOutputSchema},
  prompt: `You are an expert forensic pathologist. Please summarize the following autopsy findings in relation to the provided scenario.\n\nScenario: {{{scenario}}}\n\nFindings: {{{findings}}}\n\nSummary: `,
});

const summarizeAutopsyFindingsFlow = ai.defineFlow(
  {
    name: 'summarizeAutopsyFindingsFlow',
    inputSchema: SummarizeAutopsyFindingsInputSchema,
    outputSchema: SummarizeAutopsyFindingsOutputSchema,
  },
  async input => {
    const {output} = await summarizeAutopsyFindingsPrompt(input);
    return output!;
  }
);
