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

const KanbanCard = ({ project, onEdit, onViewDetails, onPhotoView, isAdmin }) => {
  const { t } = useLanguage();
  const utilization = project.allocation > 0 ? (project.disbursed / project.allocation) * 100 : 0;

  // Map status values to compact Sinhala status badges or styles if needed
  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
    if (status === 'Not Approved') return 'bg-red-100 dark:bg-red-950/20 text-red-850 dark:text-red-400 border border-red-200 dark:border-red-900/30';
    return 'bg-blue-100 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-3 hover:scale-[1.01] active:scale-[0.99] hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight pr-2">
          <ExpandableText text={project.name} year={project.year} maxLength={55} />
        </h4>
        <div className="flex space-x-1.5 flex-shrink-0">
           {(project.beforeImage || project.afterImage) && (
              <button onClick={(e) => { e.stopPropagation(); onPhotoView(project); }} className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer p-0.5">
                <ImageIcon size={14} />
              </button>
            )}
           <button onClick={(e) => { e.stopPropagation(); onViewDetails(project); }} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer p-0.5">
              <Eye size={14} />
            </button>
            {isAdmin && (
              <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer p-0.5">
                <Edit2 size={14} />
              </button>
            )}
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{project.gnDivision}</p>

      <div className="flex justify-between items-end gap-2">
        <div className="flex-1">
           <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-1">Utilization</p>
           <div className="w-full max-w-[100px] bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-1">
             <div className="bg-emerald-500 dark:bg-emerald-600 h-1.5 rounded-full" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
           </div>
           <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{Number(project.disbursed).toFixed(1)} / {Number(project.allocation).toFixed(1)} M</p>
        </div>
        
        {/* Render Status instead of Program inside card since column is program */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold truncate max-w-[120px] ${getStatusColor(project.status)}`}>
          {t({
            "Not Approved": "notApproved",
            "Approved": "approved",
            "Estimating": "estimating",
            "Procurement": "procurement",
            "Contracted": "contracted",
            "Physical Progress 0-25%": "physical0to25",
            "Physical Progress 26-50%": "physical26to50",
            "Physical Progress 51-75%": "physical51to75",
            "Physical Progress 76-99%": "physical76to99",
            "Completed": "completed"
          }[project.status] || project.status)}
        </span>
      </div>
    </div>
  );
};

const KanbanView = ({ projects, onEdit, onViewDetails, onPhotoView, isAdmin }) => {
  const { t } = useLanguage();
  
  const programKeys = [
    "Decentralized Budget",
    "District Development",
    "Building Rehabilitation",
    "Community Power",
    "Ministries",
    "Provincial Councils",
    "Other"
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
      {programKeys.map(key => {
        // Filter projects for this program. Fallback non-matched programs to 'Other'
        const columnProjects = projects.filter(p => p.program === key || (key === 'Other' && (!p.program || !programKeys.includes(p.program))));
        
        return (
          <div key={key} className="flex-shrink-0 w-80 bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-md rounded-xl p-4 border border-slate-100 dark:border-slate-800/60 flex flex-col max-h-[75vh]">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
              <span className="truncate text-sm" title={t({
                "Decentralized Budget": "decentralizedBudget",
                "District Development": "districtDevelopment",
                "Building Rehabilitation": "buildingRehabilitation",
                "Community Power": "communityPower",
                "Ministries": "ministries",
                "Provincial Councils": "provincialCouncils",
                "Other": "other"
              }[key] || key)}>
                {t({
                  "Decentralized Budget": "decentralizedBudget",
                  "District Development": "districtDevelopment",
                  "Building Rehabilitation": "buildingRehabilitation",
                  "Community Power": "communityPower",
                  "Ministries": "ministries",
                  "Provincial Councils": "provincialCouncils",
                  "Other": "other"
                }[key] || key)}
              </span>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-0.5 rounded-full flex-shrink-0 ml-2 font-mono">
                {columnProjects.length}
              </span>
            </h3>
            
            <div className="overflow-y-auto flex-1 pr-1 space-y-1">
              {columnProjects.map(project => (
                <KanbanCard key={project.id} project={project} onEdit={onEdit} onViewDetails={onViewDetails} onPhotoView={onPhotoView} isAdmin={isAdmin} />
              ))}
              {columnProjects.length === 0 && (
                <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 dark:text-slate-600 text-xs italic">
                  No projects
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanView;