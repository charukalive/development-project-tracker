import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const ProjectDetailModal = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();

  if (!isOpen || !project) return null;

  const isPurchasing = project.projectType === 'Purchasing' || project.projectType === 'Purchases' || project.projectType === 'මිලදී ගැනීම්';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white pr-4">{project.name}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            
            {/* 1. Year */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('year')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.year || '-'}</p>
            </div>

            {/* 2. GN Division */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('gnDivision')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.gnDivision}</p>
            </div>

            {/* 3. Program */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('program')}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
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
            </div>

            {/* 4. Project Type */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('projectType')}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                {t({
                  "Construction": "construction",
                  "Purchasing": "purchasing",
                  "Machine repair": "machineRepair"
                }[project.projectType] || project.projectType || 'construction')}
              </span>
            </div>

            {/* 5. Allocated Amount */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('allocation')}</p>
              <p className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">Rs. {Number(project.allocation).toFixed(2)} M</p>
            </div>

            {/* 6. Paid Amount */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('disbursed')}</p>
              <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-450">Rs. {Number(project.disbursed).toFixed(2)} M</p>
            </div>

            {/* 7. Financial Progress */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('financialProgress')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.financialProgress || '-'}</p>
            </div>

            {/* 8. Contractor/Society */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('contractor')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.contractor || '-'}</p>
            </div>

            {/* 9. Start Date */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('startDate')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.startDate || '-'}</p>
            </div>

            {/* 10. Expected End Date */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('endDate')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.endDate || '-'}</p>
            </div>

            {/* 11. Project Duration */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('projectDuration')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.projectDuration || '-'}</p>
            </div>

            {/* 12. Actual End Date */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('actualEndDate')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.actualEndDate || '-'}</p>
            </div>

            {/* 13. Retention Money - Display in Rs (without 'M') */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('retentionAmount')}</p>
              <p className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">
                {isPurchasing
                  ? t('notApplicable')
                  : (project.retentionAmount != null && project.retentionAmount > 0
                      ? `Rs. ${Number(project.retentionAmount).toFixed(2)}`
                      : '-')}
              </p>
            </div>

            {/* 14. Retention Period */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('retentionPeriodMonths')}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {isPurchasing
                  ? t('notApplicable')
                  : (project.retentionPeriodMonths ? `${project.retentionPeriodMonths} ${t('months')}` : '-')}
              </p>
            </div>

            {/* 15. Special Remarks */}
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2 col-span-2">
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-0.5 uppercase tracking-wide font-medium">{t('specialRemarks')}</p>
              <p className="font-medium text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{project.specialRemarks || '-'}</p>
            </div>

          </div>

          {/* Retention Money Settlement Status Section (Read-only status badge) */}
          {!isPurchasing && project.retentionAmount != null && project.retentionAmount > 0 && (
            <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/80 flex items-center space-x-3 mt-2">
              {project.retentionPaid ? (
                <CheckCircle className="text-emerald-500 flex-shrink-0" size={22} />
              ) : (
                <AlertCircle className="text-amber-500 flex-shrink-0" size={22} />
              )}
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Retention Settlement Status</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  {project.retentionPaid ? t('retentionPaid') : 'Pending Release'}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
