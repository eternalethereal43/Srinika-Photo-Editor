import { EditMode, StyleOption } from './types';

export const PROMPTS: Record<EditMode, (extra?: string) => string> = {
  [EditMode.RemoveBackground]: () => "Remove the background of this image and make it transparent. The output must be a PNG with a transparent background.",
  [EditMode.Stylize]: (style: StyleOption = 'Vintage') => `Stylize this picture to have a ${style} look. Preserve the original subject as much as possible.`,
  [EditMode.ChangeDress]: (description: string = 'a new outfit') => `In the image, replace the person's clothing with the following description: '${description}'. Maintain the person's face and the background, but you can adjust their pose slightly and naturally to make the new outfit look good. The result should be realistic.`,
  [EditMode.RemoveObject]: (object: string = 'the specified object') => `Completely remove the ${object} from this image and realistically fill in the background where the object was.`,
  [EditMode.AddBackground]: (description: string = 'a new background') => `Add a new background to this image based on the following description: '${description}'. The main subject of the image should be preserved and realistically integrated into the new background.`,
  [EditMode.ChangePose]: (description: string = 'a new pose') => `Change the person's pose in the image based on the following description: '${description}'. Keep the person's identity, clothing, and the background the same.`,
  [EditMode.AddObject]: (description: string = 'an object') => `Realistically add the following object to the image: '${description}'. The object should be placed in a natural and believable position, with appropriate lighting, shadows, and perspective to match the scene.`,
  [EditMode.Upscale]: () => `Upscale this image to 4K resolution, significantly enhancing its quality. Improve details, sharpness, and clarity while preserving the original content and style. The final output should be a high-resolution, photorealistic image.`,
};