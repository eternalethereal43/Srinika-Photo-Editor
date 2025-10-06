import React, { useState, useCallback } from 'react';
import { EditMode, ImageFile, StyleOption, StyleOptions } from './types';
import { PROMPTS } from './constants';
import { editImageWithGemini } from './services/geminiService';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ActionTabs from './components/ActionTabs';
import ResultDisplay from './components/ResultDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EditMode>(EditMode.RemoveBackground);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(StyleOptions[0]);
  const [objectToRemove, setObjectToRemove] = useState<string>('');
  const [dressDescription, setDressDescription] = useState<string>('');
  const [backgroundDescription, setBackgroundDescription] = useState<string>('');
  const [poseDescription, setPoseDescription] = useState<string>('');
  const [objectToAdd, setObjectToAdd] = useState<string>('');

  const editedImage = history[historyIndex] ?? null;

  const handleGenerate = useCallback(async () => {
    const sourceImageFile = editedImage
      ? {
          base64: editedImage,
          mimeType: editedImage.split(';')[0].split(':')[1] ?? 'image/png',
          name: 'edited_image.png',
        }
      : originalImage;

    if (!sourceImageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let prompt = '';
      const images: ImageFile[] = [sourceImageFile];

      switch (activeTab) {
        case EditMode.RemoveBackground:
          prompt = PROMPTS[EditMode.RemoveBackground]();
          break;
        case EditMode.Stylize:
          prompt = PROMPTS[EditMode.Stylize](selectedStyle);
          break;
        case EditMode.ChangeDress:
          if (!dressDescription.trim()) {
            throw new Error('Please describe the new outfit.');
          }
          prompt = PROMPTS[EditMode.ChangeDress](dressDescription);
          break;
        case EditMode.RemoveObject:
          if (!objectToRemove.trim()) {
            throw new Error('Please describe the object to remove.');
          }
          prompt = PROMPTS[EditMode.RemoveObject](objectToRemove);
          break;
        case EditMode.AddBackground:
          if (!backgroundDescription.trim()) {
            throw new Error('Please describe the background to add.');
          }
          prompt = PROMPTS[EditMode.AddBackground](backgroundDescription);
          break;
        case EditMode.ChangePose:
          if (!poseDescription.trim()) {
            throw new Error('Please describe the new pose.');
          }
          prompt = PROMPTS[EditMode.ChangePose](poseDescription);
          break;
        case EditMode.AddObject:
            if (!objectToAdd.trim()) {
                throw new Error('Please describe the object to add.');
            }
            prompt = PROMPTS[EditMode.AddObject](objectToAdd);
            break;
        case EditMode.Upscale:
            prompt = PROMPTS[EditMode.Upscale]();
            break;
      }
      
      const result = await editImageWithGemini(prompt, images);
      
      const newHistory = [...history.slice(0, historyIndex + 1), result];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, editedImage, activeTab, selectedStyle, objectToRemove, dressDescription, backgroundDescription, poseDescription, objectToAdd, history, historyIndex]);
  
  const handleClearAll = useCallback(() => {
    setOriginalImage(null);
    setHistory([]);
    setHistoryIndex(-1);
    setError(null);
    setActiveTab(EditMode.RemoveBackground);
    setSelectedStyle(StyleOptions[0]);
    setObjectToRemove('');
    setDressDescription('');
    setBackgroundDescription('');
    setPoseDescription('');
    setObjectToAdd('');
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);
  
  const sourceImageFile = editedImage ? { base64: editedImage } : originalImage;
  const isGenerateDisabled = isLoading || !sourceImageFile || 
    (activeTab === EditMode.ChangeDress && !dressDescription.trim()) || 
    (activeTab === EditMode.RemoveObject && !objectToRemove.trim()) ||
    (activeTab === EditMode.AddBackground && !backgroundDescription.trim()) ||
    (activeTab === EditMode.ChangePose && !poseDescription.trim()) ||
    (activeTab === EditMode.AddObject && !objectToAdd.trim());

  const isUndoDisabled = historyIndex <= 0;
  const isRedoDisabled = historyIndex >= history.length - 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <Header />
        
        <main className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader onImageUpload={setOriginalImage} title="Original Image" imageFile={originalImage} />
            <ResultDisplay 
              originalImage={originalImage?.base64} 
              editedImage={editedImage} 
              isLoading={isLoading}
              onUndo={handleUndo}
              onRedo={handleRedo}
              isUndoDisabled={isUndoDisabled}
              isRedoDisabled={isRedoDisabled}
            />
          </div>

          <div className="bg-slate-800 p-4 rounded-xl mt-6 shadow-lg">
            <ActionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-4 min-h-[80px]">
              {activeTab === EditMode.Stylize && (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="style-select" className="font-medium text-slate-300">Choose a style:</label>
                  <select id="style-select" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value as StyleOption)} className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    {StyleOptions.map(style => <option key={style} value={style}>{style}</option>)}
                  </select>
                </div>
              )}
              {activeTab === EditMode.ChangeDress && (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="dress-desc-input" className="font-medium text-slate-300">Describe the new outfit:</label>
                   <input
                    id="dress-desc-input"
                    type="text"
                    value={dressDescription}
                    onChange={(e) => setDressDescription(e.target.value)}
                    placeholder="e.g., 'a stylish red leather jacket'"
                    className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400"
                  />
                </div>
              )}
              {activeTab === EditMode.RemoveObject && (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="object-input" className="font-medium text-slate-300">Object to remove:</label>
                   <input
                    id="object-input"
                    type="text"
                    value={objectToRemove}
                    onChange={(e) => setObjectToRemove(e.target.value)}
                    placeholder="e.g., 'the red car' or 'the person on the left'"
                    className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400"
                  />
                </div>
              )}
              {activeTab === EditMode.AddBackground && (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="background-input" className="font-medium text-slate-300">Describe the background:</label>
                   <input
                    id="background-input"
                    type="text"
                    value={backgroundDescription}
                    onChange={(e) => setBackgroundDescription(e.target.value)}
                    placeholder="e.g., 'a futuristic cityscape at night'"
                    className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400"
                  />
                </div>
              )}
              {activeTab === EditMode.ChangePose && (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="pose-input" className="font-medium text-slate-300">Describe the new pose:</label>
                   <input
                    id="pose-input"
                    type="text"
                    value={poseDescription}
                    onChange={(e) => setPoseDescription(e.target.value)}
                    placeholder="e.g., 'standing with arms crossed'"
                    className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400"
                  />
                </div>
              )}
              {activeTab === EditMode.AddObject && (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="object-add-input" className="font-medium text-slate-300">Describe the object to add:</label>
                   <input
                    id="object-add-input"
                    type="text"
                    value={objectToAdd}
                    onChange={(e) => setObjectToAdd(e.target.value)}
                    placeholder="e.g., 'a small cat sitting on the couch'"
                    className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400"
                  />
                </div>
              )}
              {activeTab === EditMode.Upscale && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="font-medium text-slate-300">Enhance Image to 4K</p>
                  <p className="text-sm text-slate-400 mt-1">Click 'Generate' to upscale your current image, improving detail and clarity.</p>
                </div>
              )}
            </div>

            {error && <p className="text-red-400 text-center my-2 text-sm">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              <SparklesIcon />
              Generate
            </button>
            <button
              onClick={handleClearAll}
              className="w-full mt-3 text-center text-slate-400 hover:text-slate-200 text-sm transition-colors py-1 rounded-md"
            >
              Clear All
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;