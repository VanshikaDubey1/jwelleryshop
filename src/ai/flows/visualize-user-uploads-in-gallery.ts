
'use server';

/**
 * @fileOverview Allows users to visualize their uploaded photos in different gallery formats (album, acrylic print, wall frame).
 * 
 * - visualizeInGallery - A function that takes a photo, a gallery style, and a size, and returns an image visualizing the photo in that style.
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
  size: z.string().optional().describe('The desired size for the visualization (e.g., "12x9 in").'),
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
  async ({photoDataUri, galleryStyle, size}) => {
    try {
      const llmResponse = await ai.generate({
          model: 'googleai/gemini-1.5-flash-latest',
          prompt: [
            { text: `You are an expert in visualizing images in different gallery styles.

You will take the user's photo and visualize it as if it were displayed in the specified gallery style and size.

Gallery Style: ${galleryStyle}
${size ? `Size: ${size}` : ''}

Based on the gallery style and size, create a realistic image that shows how the user's photo will look. Return only the generated image.

If the gallery style is 'album', create an image showing the photo inside an open, high-quality photo album.
If the gallery style is 'acrylic', create an image showing the photo as a glossy acrylic print of the specified size, perhaps mounted on a modern wall to give a sense of scale.
If the gallery style is 'wallframe', create an image showing the photo in an elegant wall frame of the specified size, hanging in a well-lit room to give a sense of scale.`},
            { media: { url: photoDataUri } }
          ],
      });
      
      const imageUrl = llmResponse.media?.url;
      
      if (!imageUrl) {
        console.error("AI visualization failed. No image returned. Output:", llmResponse);
        return { visualizedImage: '', error: `AI failed to generate an image. Please try again.` };
      }

      return {visualizedImage: imageUrl, error: undefined};
    } catch (error: any) {
        console.error("AI visualization error:", error);
        if (error.message && (error.message.includes('429') || error.message.includes('Too Many Requests'))) {
            return {
                visualizedImage: '',
                error: 'The AI is currently busy. Please wait a moment and try again.'
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
