import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Edit2, Eye, Trash2, Image as ImageIcon } from 'lucide-react';

const ExpandableText = ({ text, subText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={`font-semibold text-slate-800 mb-1 cursor-pointer ${isExpanded ? '' : 'line-clamp-2'}`}
      onClick={() => setIsExpanded(!isExpanded)}
      title={isExpanded ? "Click to collapse" : "Click to expand"}
    >
      {text} {subText ? `(${subText})` : ''}
    </div>
  );
};

const TableView = ({ projects, onEdit, onViewDetails, onDelete, onPhotoView }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium">{t('projectDetails')}</th>
              <th className="p-4 font-medium">{t('finances')}</th>
              <th className="p-4 font-medium">{t('dates')}</th>
              <th className="p-4 font-medium text-center">{t('retentionPeriodAndRemaining')}</th>
              <th className="p-4 font-medium text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map(project => {
                let retentionStatus = null;
                let isRetentionExceeded = false;
                let daysRemaining = 0;
                let yearsRemaining = 0;

                if (project.status === 'Work Completed') {
                   if (project.retentionPaid) {
                       retentionStatus = "paid";
                   } else if (project.endDate && project.retentionPeriodMonths) {
                      const endDate = new Date(project.endDate);
                      const retentionDate = new Date(endDate);
                      retentionDate.setMonth(retentionDate.getMonth() + parseInt(project.retentionPeriodMonths, 10));

                      const today = new Date();
                      const timeDiff = retentionDate.getTime() - today.getTime();
                      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

                      if (daysRemaining < 0) {
                         isRetentionExceeded = true;
                         daysRemaining = Math.abs(daysRemaining); // positive for "days ago"
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
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <ExpandableText text={project.name} subText={project.year} />
                    <div className="text-xs text-slate-500 mb-2 truncate" title={`${project.gnDivision} • ${project.contractor}`}>
                       {project.gnDivision} • {project.contractor}
                       {project.projectType && ` • ${t({
                          "Construction": "construction",
                          "Purchasing": "purchasing",
                          "Machine repair": "machineRepair"
                       }[project.projectType] || project.projectType)}`}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mr-2 mb-1">
                      {t({
                        "Decentralized Budget": "decentralizedBudget",
                        "Building Rehabilitation": "buildingRehabilitation",
                        "Community Power": "communityPower",
                        "Ministries": "ministries",
                        "Provincial Councils": "provincialCouncils",
                        "District Development": "districtDevelopment",
                        "Other": "other"
                      }[project.program] || project.program)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                      project.status === 'Work Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
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
                        "Work Completed": "workCompleted",
                        "Completed": "completed",
                        "In Progress": "inProgress"
                      }[project.status] || project.status)}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-mono text-slate-700 mb-1">
                      <span className="text-slate-400 text-xs mr-2">Alloc:</span>
                      {Number(project.allocation).toFixed(2)}
                    </div>
                    <div className="font-mono text-slate-700">
                      <span className="text-slate-400 text-xs mr-2">Disb: </span>
                      {Number(project.disbursed).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-slate-600 mb-1"><span className="text-slate-400 text-xs mr-1">Start:</span>{project.startDate}</div>
                    <div className="text-slate-600"><span className="text-slate-400 text-xs mr-1">End:</span>{project.endDate || '-'}</div>
                  </td>
                  <td className="p-4 align-top text-center">
                    {retentionStatus === "ongoing" && (
                       <span className="inline-flex items-center px-2.5 py-1.5 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                         {t('ongoing')}
                       </span>
                    )}
                    {retentionStatus === "paid" && (
                       <span className="inline-flex items-center px-2.5 py-1.5 rounded bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200">
                         {t('paid')}
                       </span>
                    )}
                    {retentionStatus === "payable" && (
                       <span className="inline-flex flex-col items-center justify-center p-2 rounded bg-red-100 text-red-800 text-xs font-medium">
                         <div className="w-2 h-2 rounded-full bg-red-500 mb-1"></div>
                         {t('payable')}
                       </span>
                    )}
                    {retentionStatus === null && (
                      <div className={`inline-flex flex-col items-center justify-center p-2 rounded text-xs font-medium ${isRetentionExceeded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        <div className={`w-2 h-2 rounded-full mb-1 ${isRetentionExceeded ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        {isRetentionExceeded ? (
                           <span>{t('payable')} ({t('days')} {daysRemaining} {t('ago')})</span>
                        ) : (
                           <span>{t('remaining')} {t('days')} {daysRemaining} {yearsRemaining > 0 ? `(${t('years')} ${yearsRemaining})` : ''}</span>
                        )}
                      </div>
                    )}
                    {project.retentionAmount != null && project.retentionAmount > 0 && (
                        <div className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                          {t('retentionAmount')}: {Number(project.retentionAmount).toFixed(2)}
                        </div>
                    )}
                  </td>
                  <td className="p-4 align-top text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => onViewDetails(project)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title={t('projectDetails')}>
                        <Eye size={18} />
                      </button>
                      <button onClick={() => onEdit(project)} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors" title={t('editProject')}>
                        <Edit2 size={18} />
                      </button>
                      {(project.beforeImage || project.afterImage) && (
                        <button onClick={() => onPhotoView(project)} className="p-1.5 text-slate-400 hover:text-purple-600 rounded-md hover:bg-purple-50 transition-colors" title={t('photoComparison')}>
                          <ImageIcon size={18} />
                        </button>
                      )}
                      <button onClick={() => {
                        if(window.confirm('Are you sure you want to delete this project?')) {
                          onDelete(project.id);
                        }
                      }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
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
