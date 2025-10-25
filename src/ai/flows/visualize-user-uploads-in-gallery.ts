'use server';

/**
 * @fileOverview Allows users to visualize their uploaded photos in different gallery formats (album, acrylic print, wall frame).
 * 
 * - visualizeInGallery - A function that takes a photo and a gallery style and returns an image visualizing the photo in that style.
 * - VisualizeInGalleryInput - The input type for the visualizeInGallery function.
 * - VisualizeInGalleryOutput - The return type for the visualizeInGallery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeInGalleryInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be visualized, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  galleryStyle: z
    .enum(['album', 'acrylic', 'wallframe'])
    .describe('The desired gallery style: album, acrylic print, or wall frame.'),
});
export type VisualizeInGalleryInput = z.infer<typeof VisualizeInGalleryInputSchema>;

const VisualizeInGalleryOutputSchema = z.object({
  visualizedImage: z
    .string()
    .describe('The visualized image in data URI format.'),
  error: z.string().optional(),
});
export type VisualizeInGalleryOutput = z.infer<typeof VisualizeInGalleryOutputSchema>;

export async function visualizeInGallery(input: VisualizeInGalleryInput): Promise<VisualizeInGalleryOutput> {
  return visualizeInGalleryFlow(input);
}

const visualizeInGalleryFlow = ai.defineFlow(
  {
    name: 'visualizeInGalleryFlow',
    inputSchema: VisualizeInGalleryInputSchema,
    outputSchema: VisualizeInGalleryOutputSchema,
  },
  async input => {
    try {
      const {media, content} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: `You are an expert in visualizing images in different gallery styles.

You will take the user's photo and visualize it as if it were displayed in the specified gallery style.

Photo: {{media url=photoDataUri}}

Gallery Style: {{galleryStyle}}

Based on the gallery style, create an image that shows how the user's photo will look. Return the visualized image as a data URI.

If the gallery style is album, create an image showing the photo in an album.
If the gallery style is acrylic, create an image showing the photo as an acrylic print.
If the gallery style is wallframe, create an image showing the photo in a wall frame.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      
      const visualizedImage = media?.url;
      if (!visualizedImage) {
        const outputText = content.map(c => c.text).join('');
        console.error("AI visualization failed. No image returned. Output text:", outputText);
        return { visualizedImage: '', error: `AI failed to generate an image. Details: ${outputText}` };
      }

      return {visualizedImage};
    } catch (error: any) {
        console.error("AI visualization error:", error);
        if (error.message && (error.message.includes('429') || error.message.includes('Too Many Requests'))) {
            return {
                visualizedImage: '',
                error: 'Rate limit exceeded. Please check your plan and billing details, or try again later.'
            };
        }
        if(error.message) {
             return {
                visualizedImage: '',
                error: `An unexpected error occurred: ${error.message}`
            };
        }
        return {
            visualizedImage: '',
            error: 'An unexpected error occurred during visualization.'
        };
    }
  }
);