import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Image as ImageIcon, Eye, Edit2 } from 'lucide-react';

const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 40;
  const shouldTruncate = text && text.length > maxLength;

  const displayText = (!isExpanded && shouldTruncate)
    ? `${text.substring(0, maxLength)}...`
    : text;

  return (
    <h4
      className="font-semibold text-slate-800 text-sm leading-tight cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      title={isExpanded ? "Click to collapse" : "Click to expand"}
    >
      {displayText}
    </h4>
  );
};

const KanbanCard = ({ project, onEdit, onViewDetails, onPhotoView }) => {
  const utilization = project.allocation > 0 ? (project.disbursed / project.allocation) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2 gap-2">
        <ExpandableText text={project.name} />
        <div className="flex space-x-1 shrink-0">
           {(project.beforeImage || project.afterImage) && (
              <button onClick={() => onPhotoView(project)} className="text-slate-400 hover:text-purple-600 transition-colors">
                <ImageIcon size={14} />
              </button>
            )}
           <button onClick={() => onViewDetails(project)} className="text-slate-400 hover:text-blue-600 transition-colors">
              <Eye size={14} />
            </button>
            <button onClick={() => onEdit(project)} className="text-slate-400 hover:text-emerald-600 transition-colors">
              <Edit2 size={14} />
            </button>
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-3">{project.gnDivision}</p>

      <div className="flex justify-between items-end">
        <div>
           <p className="text-xs text-slate-400 mb-1">Utilization</p>
           <div className="w-24 bg-slate-100 rounded-full h-1.5 mb-1">
             <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
           </div>
           <p className="text-[10px] font-mono text-slate-600">{Number(project.disbursed).toFixed(1)} / {Number(project.allocation).toFixed(1)} M</p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 truncate max-w-[100px]">
          {project.program}
        </span>
      </div>
    </div>
  );
};

const KanbanView = ({ projects, onEdit, onViewDetails, onPhotoView }) => {
  const { t } = useLanguage();
  const inProgress = projects.filter(p => p.status === 'In Progress');
  const completed = projects.filter(p => p.status === 'Completed');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
          <span>{t('inProgress')}</span>
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{inProgress.length}</span>
        </h3>
        <div>
          {inProgress.map(project => (
            <KanbanCard key={project.id} project={project} onEdit={onEdit} onViewDetails={onViewDetails} onPhotoView={onPhotoView} />
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
          <span>{t('completed')}</span>
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{completed.length}</span>
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