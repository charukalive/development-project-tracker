import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Image as ImageIcon } from 'lucide-react';

const PhotoViewerModal = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();
  const hasBoth = project?.beforeImage && project?.afterImage;
  const [viewTab, setViewTab] = useState(hasBoth ? 'slider' : 'side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen || !project) return null;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-sm sm:text-base font-medium text-slate-200 truncate pr-4">
            {t('photoComparison')} - {project.name}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors cursor-pointer flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Tab Headers (Visible only if both images are present) */}
        {hasBoth && (
          <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
            <button
              onClick={() => setViewTab('slider')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewTab === 'slider'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t('splitView')}
            </button>
            <button
              onClick={() => setViewTab('side-by-side')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewTab === 'side-by-side'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t('sideBySide')}
            </button>
          </div>
        )}

        <div className="p-6">
          {viewTab === 'slider' && hasBoth ? (
            <div className="flex flex-col items-center">
              {/* Slider Wrapper */}
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative w-full aspect-video select-none overflow-hidden rounded-xl border border-slate-700 cursor-ew-resize touch-none"
              >
                {/* Before Image (Background layer) */}
                <img
                  src={project.beforeImage}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                
                {/* Before label top-left */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-slate-100 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded shadow-md pointer-events-none uppercase">
                  {t('beforePhoto')}
                </div>

                {/* After Image (Clipping mask layer) */}
                <img
                  src={project.afterImage}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                  }}
                />

                {/* After label top-right */}
                <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded shadow-md pointer-events-none uppercase">
                  {t('afterPhoto')}
                </div>

                {/* Vertical slider divider bar */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-xl pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Slider middle handle button */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-2xl">
                    <span className="text-sm font-semibold select-none">↔</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mt-4 italic font-medium">
                {t('dragPrompt')}
              </p>
            </div>
          ) : (
            /* Side-by-Side or single image fallback */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-center text-xs sm:text-sm font-medium text-slate-300 bg-slate-800 py-2 rounded-lg">{t('beforePhoto')}</h3>
                <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700">
                  {project.beforeImage ? (
                    <img src={project.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-sm">{t('noPhoto')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-center text-xs sm:text-sm font-medium text-emerald-450 bg-slate-800 py-2 rounded-lg">{t('afterPhoto')}</h3>
                <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700">
                  {project.afterImage ? (
                    <img src={project.afterImage} alt="After" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-sm">{t('noPhoto')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoViewerModal;
