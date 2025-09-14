'use server';

import { generateBusinessNames, GenerateBusinessNamesOutput } from '@/ai/flows/generate-business-names';
import { z } from 'zod';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).max(500, {
    message: 'Description must be 500 characters or less.',
  }),
  existingNames: z.string().optional(),
});

export type BusinessNameState = {
  names?: GenerateBusinessNamesOutput['names'];
  error?: string;
}

export async function getBusinessNamesAction(formData: FormData): Promise<BusinessNameState> {
  try {
    const validatedFields = formSchema.safeParse({
      description: formData.get('description'),
      existingNames: formData.get('existingNames'),
    });
  
    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors.description?.[0],
      };
    }
  
    const { description, existingNames } = validatedFields.data;
    const existingNamesArray = existingNames ? JSON.parse(existingNames) as string[] : [];
  
    const result = await generateBusinessNames({ description, existingNames: existingNamesArray });
  
    if (!result || !result.names || result.names.length === 0) {
      return { error: 'Could not generate names. Please try a different description.' };
    }
  
    return { names: result.names };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
