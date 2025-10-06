import React from 'react';
import Loader from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';

interface ResultDisplayProps {
  originalImage: string | null | undefined;
  editedImage: string | null;
  isLoading: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  originalImage, 
  editedImage, 
  isLoading,
  onUndo,
  onRedo,
  isUndoDisabled,
  isRedoDisabled
}) => {
  const showControls = editedImage && !isLoading;

  return (
    <div className="w-full h-full flex flex-col">
       <h2 className="text-lg font-semibold text-slate-300 mb-2 text-center">Result</h2>
        <div className="relative flex-grow aspect-square w-full bg-slate-800 rounded-xl border-2 border-slate-700 flex justify-center items-center text-slate-400 p-2">
        {isLoading && <Loader />}
        {!isLoading && !editedImage && (
            <div className="text-center">
                <PhotoIcon />
                <p className="mt-2">{originalImage ? 'Your edited image will appear here' : 'Upload an image to start'}</p>
            </div>
        )}
        {editedImage && !isLoading && (
            <img src={editedImage} alt="Edited result" className="max-h-full max-w-full object-contain rounded-lg" />
        )}
        
        {showControls && (
          <div className="absolute bottom-2 left-2 flex gap-2">
            <button
              onClick={onUndo}
              disabled={isUndoDisabled}
              className="bg-slate-900/50 hover:bg-cyan-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
              title="Undo"
            >
              <UndoIcon />
            </button>
            <button
              onClick={onRedo}
              disabled={isRedoDisabled}
              className="bg-slate-900/50 hover:bg-cyan-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
              title="Redo"
            >
              <RedoIcon />
            </button>
          </div>
        )}

        {showControls && (
            <a
            href={editedImage}
            download="edited-image.png"
            className="absolute bottom-2 right-2 bg-slate-900/50 hover:bg-cyan-600 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            title="Download Image"
            >
            <DownloadIcon />
            </a>
        )}
        </div>
    </div>
  );
};

export default ResultDisplay;