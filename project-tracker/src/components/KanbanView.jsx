import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Image as ImageIcon, Eye, Edit2 } from 'lucide-react';
import ExpandableText from './ExpandableText';

const getProgramBadgeClasses = (program) => {
  const classes = {
    "Decentralized Budget": "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/30",
    "District Development": "bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/30",
    "Building Rehabilitation": "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30",
    "Community Power": "bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-900/30",
    "Ministries": "bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950/20 dark:text-teal-300 dark:border-teal-900/30",
    "Provincial Councils": "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/30"
  };
  return classes[program] || "bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-700/30";
};

const KanbanCard = ({ project, onEdit, onViewDetails, onPhotoView }) => {
  const { t } = useLanguage();
  const utilization = project.allocation > 0 ? (project.disbursed / project.allocation) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight pr-2">
          <ExpandableText text={project.name} year={project.year} maxLength={60} />
        </h4>
        <div className="flex space-x-1">
           {(project.beforeImage || project.afterImage) && (
              <button onClick={() => onPhotoView(project)} className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                <ImageIcon size={14} />
              </button>
            )}
           <button onClick={() => onViewDetails(project)} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              <Eye size={14} />
            </button>
            <button onClick={() => onEdit(project)} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
              <Edit2 size={14} />
            </button>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{project.gnDivision}</p>

      <div className="flex justify-between items-end">
        <div>
           <p className="text-[10px] text-slate-450 dark:text-slate-500 mb-1">Utilization</p>
           <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-1">
             <div className="bg-emerald-500 dark:bg-emerald-600 h-1.5 rounded-full" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
           </div>
           <p className="text-[10px] font-mono text-slate-655 dark:text-slate-400">{Number(project.disbursed).toFixed(1)} / {Number(project.allocation).toFixed(1)} M</p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium truncate max-w-[100px] ${getProgramBadgeClasses(project.program)}`}>
          {project.program}
        </span>
      </div>
    </div>
  );
};

const KanbanView = ({ projects, onEdit, onViewDetails, onPhotoView }) => {
  const { t } = useLanguage();
  // We classify projects to status buckets dynamically
  const inProgress = projects.filter(p => p.status !== 'Completed');
  const completed = projects.filter(p => p.status === 'Completed');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-md rounded-xl p-4 border border-slate-100 dark:border-slate-800/60">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
          <span>{t('inProgress')}</span>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded-full">{inProgress.length}</span>
        </h3>
        <div>
          {inProgress.map(project => (
            <KanbanCard key={project.id} project={project} onEdit={onEdit} onViewDetails={onViewDetails} onPhotoView={onPhotoView} />
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-md rounded-xl p-4 border border-slate-100 dark:border-slate-800/60">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
          <span>{t('completed')}</span>
          <span className="bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded-full">{completed.length}</span>
        </h3>
        <div>
          {completed.map(project => (
            <KanbanCard key={project.id} project={project} onEdit={onEdit} onViewDetails={onViewDetails} onPhotoView={onPhotoView} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;