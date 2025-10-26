
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
      const basePrompt = `Generate a realistic, high-quality image showing the provided photo displayed as a '${galleryStyle}' print.`;
      const sizePrompt = size ? ` The print size is approximately ${size}.` : '';
      const stylePrompt = {
        album: "Show the photo inside an open, elegant photo album on a clean tabletop.",
        acrylic: "Show the photo as a glossy acrylic print mounted on a modern, well-lit wall.",
        wallframe: "Show the photo in a stylish frame hanging on a decorated wall in a room."
      }[galleryStyle];
        
      const llmResponse = await ai.generate({
          model: 'googleai/gemini-2.5-flash-image-preview',
          prompt: [
            { media: { url: photoDataUri } },
            { text: `${basePrompt}${sizePrompt} ${stylePrompt} The scene should be well-composed and aesthetically pleasing, highlighting the product.` }
          ],
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          }
      });
      
      const imageUrl = llmResponse.media?.url;
      
      if (!imageUrl) {
        console.error("AI visualization failed. No image returned. Output:", llmResponse);
        return { visualizedImage: '', error: `AI failed to generate an image. Please try again.` };
      }

      return {visualizedImage: imageUrl, error: undefined};
    } catch (error: any) {
        console.error("AI visualization error:", error);
        if (error.message && (error.message.includes('429') || error.message.includes('Too Many Requests') || error.message.includes('resource has been exhausted'))) {
            return {
                visualizedImage: '',
                error: 'The AI is currently busy due to high demand. Please wait a moment and try again.'
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
