import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HardHat, Hourglass, DollarSign, CheckCircle2 } from 'lucide-react';

const KPIDashboard = ({ projects }) => {
  const { t, language } = useLanguage();

  const stats = useMemo(() => {
    const totalAllocation = projects.reduce((acc, curr) => acc + (parseFloat(curr.allocation) || 0), 0);

    let ongoingProjectsCount = 0;
    let completedProjectsCount = 0;
    let retentionPayableCount = 0;

    const today = new Date();

    projects.forEach(p => {
       if (p.status !== 'Completed') {
           ongoingProjectsCount++;
       } else {
           completedProjectsCount++;

           if (p.endDate && p.retentionPeriodMonths) {
              const endDate = new Date(p.endDate);
              const retentionDate = new Date(endDate);
              retentionDate.setMonth(retentionDate.getMonth() + parseInt(p.retentionPeriodMonths, 10));

              if (retentionDate <= today) {
                  retentionPayableCount++;
              }
           } else {
              retentionPayableCount++;
           }
       }
    });

    return {
      ongoingProjectsCount,
      completedProjectsCount,
      retentionPayableCount,
      totalAllocation
    };
  }, [projects]);

  const formattedAllocation = useMemo(() => {
    const value = stats.totalAllocation.toFixed(2);
    if (language === 'si') return `රු. ${value} මි.`;
    if (language === 'ta') return `ரூ. ${value} மி.`;
    return `Rs. ${value} M`;
  }, [stats.totalAllocation, language]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Ongoing Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-sm group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 cursor-default">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">{t('ongoingProjects')}</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400 mt-1">{stats.ongoingProjectsCount}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{t('ongoingDesc')}</p>
        </div>
        <div className="p-2 sm:p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-full ml-2 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-350">
          <HardHat className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Retention Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-sm group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 cursor-default">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">{t('retentionPayable')}</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-450 mt-1">{stats.retentionPayableCount}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{t('retentionPayableDesc')}</p>
        </div>
        <div className="p-2 sm:p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-455 rounded-full ml-2 flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-350">
          <Hourglass className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Allocation Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-sm group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 cursor-default">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">{t('totalAllocation')}</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">{formattedAllocation}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{t('allocationDesc')}</p>
        </div>
        <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-455 rounded-full ml-2 flex-shrink-0 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-350">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Completed Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-sm group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 cursor-default">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">{t('completedProjects')}</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.completedProjectsCount}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{t('completedDesc')}</p>
        </div>
        <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400 rounded-full ml-2 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-350">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
