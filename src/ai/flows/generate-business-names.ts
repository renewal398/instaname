'use server';

/**
 * @fileOverview A business name generation AI agent.
 *
 * - generateBusinessNames - A function that generates business names based on a description.
 * - GenerateBusinessNamesInput - The input type for the generateBusinessnames function.
 * - GenerateBusinessNamesOutput - The return type for the generateBusinessNames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessNamesInputSchema = z.object({
  description: z.string().describe('The description of the business, product, or idea.'),
  existingNames: z.array(z.string()).optional().describe('An array of names that have already been generated and should not be repeated.'),
});
export type GenerateBusinessNamesInput = z.infer<typeof GenerateBusinessNamesInputSchema>;

const GenerateBusinessNamesOutputSchema = z.object({
  names: z
    .array(
      z.object({
        name: z.string().describe('A catchy and unique business name.'),
        description: z.string().describe('A short, catchy description for the business name.'),
      })
    )
    .describe('An array of business names with descriptions.'),
});
export type GenerateBusinessNamesOutput = z.infer<typeof GenerateBusinessNamesOutputSchema>;

export async function generateBusinessNames(input: GenerateBusinessNamesInput): Promise<GenerateBusinessNamesOutput> {
  return generateBusinessNamesFlow(input);
}

const generateBusinessNamesPrompt = ai.definePrompt({
  name: 'generateBusinessNamesPrompt',
  input: {schema: GenerateBusinessNamesInputSchema},
  output: {schema: GenerateBusinessNamesOutputSchema},
  prompt: `You are an expert at creating short, catchy, and available domain names for businesses. Based on the description of the business idea, generate 3-5 short and unique business names that would likely be available as a .com domain. The names should be one or two words at most. For each name, also provide a short, catchy description that could be used in a tweet.

Description: {{{description}}}

{{#if existingNames}}
Do not generate the following names again: {{#each existingNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{/if}}

Output the names as a JSON array of objects, each with a "name" and a "description" property.

Here are some examples:
Description: A modern clothing brand for teenagers.
Names: [
  {"name": "Stylo", "description": "Wear your style."},
  {"name": "Verve Wear", "description": "Threads with attitude."},
  {"name": "Next Threads", "description": "The future of fashion."}
]

Description: A traditional bakery specializing in artisanal breads.
Names: [
  {"name": "Dough & Co", "description": "Artisanal breads, baked fresh daily."},
  {"name": "Rise Breads", "description": "Handcrafted loaves that rise to the occasion."},
  {"name": "The Loaf", "description": "Simply great bread."}
]`,
});

const generateBusinessNamesFlow = ai.defineFlow(
  {
    name: 'generateBusinessNamesFlow',
    inputSchema: GenerateBusinessNamesInputSchema,
    outputSchema: GenerateBusinessNamesOutputSchema,
  },
  async input => {
    const {output} = await generateBusinessNamesPrompt(input);
    return output!;
  }
);
