import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Edit2, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import ExpandableText from './ExpandableText';

const TableView = ({ projects, onEdit, onViewDetails, onDelete, onPhotoView }) => {
  const { t } = useLanguage();

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

  const getStatusBadgeClasses = (status) => {
    if (status === 'Completed') {
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/30";
    }
    if (status === 'Not Approved') {
      return "bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30";
    }
    if (['Approved', 'Estimating', 'Procurement', 'Contracted'].includes(status)) {
      return "bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
    }
    return "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30";
  };

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-350 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 font-medium">{t('projectDetails')}</th>
              <th className="p-4 font-medium">{t('finances')}</th>
              <th className="p-4 font-medium">{t('dates')}</th>
              <th className="p-4 font-medium text-center">{t('retentionPeriodAndRemaining')}</th>
              <th className="p-4 font-medium text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400 bg-transparent">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map(project => {
                let retentionStatus = null;
                let isRetentionExceeded = false;
                let daysRemaining = 0;
                let yearsRemaining = 0;

                if (project.status === 'Completed') {
                   if (project.endDate && project.retentionPeriodMonths) {
                      const endDate = new Date(project.endDate);
                      const retentionDate = new Date(endDate);
                      retentionDate.setMonth(retentionDate.getMonth() + parseInt(project.retentionPeriodMonths, 10));

                      const today = new Date();
                      const timeDiff = retentionDate.getTime() - today.getTime();
                      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

                      if (daysRemaining < 0) {
                         isRetentionExceeded = true;
                         daysRemaining = Math.abs(daysRemaining);
                      }

                      if (daysRemaining > 365) {
                          yearsRemaining = Math.floor(daysRemaining / 365);
                      }
                   } else {
                       retentionStatus = "payable";
                   }
                } else {
                   retentionStatus = "ongoing";
                }

                return (
                <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 max-w-md">
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 leading-snug">
                      <ExpandableText text={project.name} year={project.year} maxLength={80} />
                    </div>
                    <div className="text-xs text-slate-505 dark:text-slate-400 mb-2">{project.gnDivision} • {project.contractor || '-'}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${getProgramBadgeClasses(project.program)}`}>
                      {t({
                        "Decentralized Budget": "decentralizedBudget",
                        "District Development": "districtDevelopment",
                        "Building Rehabilitation": "buildingRehabilitation",
                        "Community Power": "communityPower",
                        "Ministries": "ministries",
                        "Provincial Councils": "provincialCouncils",
                        "Other": "other"
                      }[project.program] || project.program)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClasses(project.status)}`}>
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
                        "Completed": "completed",
                        "In Progress": "inProgress"
                      }[project.status] || project.status)}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-mono text-slate-700 dark:text-slate-300 mb-1">
                      <span className="text-slate-400 dark:text-slate-500 text-xs mr-2">Alloc:</span>
                      {Number(project.allocation).toFixed(2)}
                    </div>
                    <div className="font-mono text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500 text-xs mr-2">Disb: </span>
                      {Number(project.disbursed).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-slate-655 dark:text-slate-350 mb-1"><span className="text-slate-400 dark:text-slate-505 text-xs mr-1">Start:</span>{project.startDate}</div>
                    <div className="text-slate-655 dark:text-slate-350"><span className="text-slate-400 dark:text-slate-505 text-xs mr-1">End:</span>{project.endDate || '-'}</div>
                  </td>
                  <td className="p-4 align-top text-center">
                    {retentionStatus === "ongoing" && (
                       <span className="inline-flex items-center px-2.5 py-1.5 rounded bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 text-xs font-medium">
                         {t('ongoing')}
                       </span>
                    )}
                    {retentionStatus === "payable" && (
                       <span className="inline-flex flex-col items-center justify-center p-2 rounded bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400 text-xs font-medium">
                         <div className="w-2 h-2 rounded-full bg-red-500 mb-1"></div>
                         {t('payable')}
                       </span>
                    )}
                    {retentionStatus === null && (
                      <div className={`inline-flex flex-col items-center justify-center p-2 rounded text-xs font-medium ${isRetentionExceeded ? 'bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400' : 'bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400'}`}>
                         <div className={`w-2 h-2 rounded-full mb-1 ${isRetentionExceeded ? 'bg-red-500' : 'bg-green-500'}`}></div>
                         {isRetentionExceeded ? (
                            <span>{t('payable')} ({t('days')} {daysRemaining} {t('ago')})</span>
                         ) : (
                            <span>{t('remaining')} {t('days')} {daysRemaining} {yearsRemaining > 0 ? `(${t('years')} ${yearsRemaining})` : ''}</span>
                         )}
                      </div>
                    )}
                    {project.retentionAmount != null && project.retentionAmount > 0 && (
                        <div className="text-xs text-slate-500 dark:text-slate-450 mt-1 whitespace-nowrap">
                          {t('retentionAmount')}: {Number(project.retentionAmount).toFixed(2)}
                        </div>
                    )}
                  </td>
                  <td className="p-4 align-top text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => onViewDetails(project)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer" title={t('projectDetails')}>
                        <Eye size={18} />
                      </button>
                      <button onClick={() => onEdit(project)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer" title={t('editProject')}>
                        <Edit2 size={18} />
                      </button>
                      {(project.beforeImage || project.afterImage) && (
                        <button onClick={() => onPhotoView(project)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 rounded-md hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer" title={t('photoComparison')}>
                          <ImageIcon size={18} />
                        </button>
                      )}
                      <button onClick={() => {
                        if(window.confirm('Are you sure you want to delete this project?')) {
                          onDelete(project.id);
                        }
                      }} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer" title={t('delete')}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
