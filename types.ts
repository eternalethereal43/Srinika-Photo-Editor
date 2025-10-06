export enum EditMode {
  RemoveBackground = 'Remove Background',
  Stylize = 'Stylize',
  ChangeDress = 'Change Dress',
  RemoveObject = 'Remove Object',
  AddBackground = 'Add Background',
  ChangePose = 'Change Pose',
  AddObject = 'Add Object',
  Upscale = 'Upscale',
}

export const StyleOptions = [
  '90s look',
  'Vintage',
  'Polaroid',
  '90s Bollywood',
  'Cyberpunk',
  'Fantasy Art',
  'Watercolor',
  'Steampunk',
] as const;

export type StyleOption = typeof StyleOptions[number];

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}