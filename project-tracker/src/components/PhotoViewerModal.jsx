import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Image as ImageIcon } from 'lucide-react';

const PhotoViewerModal = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-medium text-slate-200">
            {t('photoComparison')} - {project.name}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-center font-medium text-slate-300 bg-slate-800 py-2 rounded-lg">{t('beforePhoto')}</h3>
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
            <h3 className="text-center font-medium text-emerald-400 bg-slate-800 py-2 rounded-lg">{t('afterPhoto')}</h3>
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
      </div>
    </div>
  );
};

export default PhotoViewerModal;
