import React, { useRef } from 'react';
import { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile | null) => void;
  title: string;
  compact?: boolean;
  imageFile: ImageFile | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, compact = false, imageFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        onImageUpload({ base64, mimeType: file.type, name: file.name });
      } catch (error) {
        console.error("Error converting file to base64", error);
        onImageUpload(null);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  if (compact) {
    return (
      <div className="flex flex-col items-center w-full">
         <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button onClick={handleUploadClick} className="w-full bg-slate-700 text-slate-300 rounded-md p-2 text-sm hover:bg-slate-600 transition-colors">
          {imageFile ? `Loaded: ${imageFile.name}` : `Upload ${title}`}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-300 mb-2 text-center">{title}</h2>
      <div
        className="flex-grow aspect-square w-full bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex flex-col justify-center items-center text-slate-400 cursor-pointer hover:border-cyan-500 hover:bg-slate-700 transition-all duration-300 p-2"
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {imageFile ? (
          <img src={imageFile.base64} alt="Uploaded preview" className="max-h-full max-w-full object-contain rounded-lg" />
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2">Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;