import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, DollarSign, CheckCircle2, Clock, Hourglass } from 'lucide-react';

const KPIDashboard = ({ projects }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const totalAllocation = projects.reduce((acc, curr) => acc + (parseFloat(curr.allocation) || 0), 0);

    let ongoingProjectsCount = 0;
    let completedProjectsCount = 0;
    let retentionPayableCount = 0;

    const today = new Date();

    projects.forEach(p => {
       if (p.status !== 'Work Completed') {
           ongoingProjectsCount++;
       } else {
           completedProjectsCount++;

           if (!p.retentionPaid) {
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
       }
    });

    return {
      ongoingProjectsCount,
      completedProjectsCount,
      retentionPayableCount,
      totalAllocation
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-yellow-500 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{t('ongoingProjects')}</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.ongoingProjectsCount}</p>
        </div>
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
          <Briefcase size={24} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-red-500 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{t('retentionPayable')}</p>
          <p className="text-3xl font-bold text-red-600">{stats.retentionPayableCount}</p>
        </div>
        <div className="p-3 bg-red-100 text-red-600 rounded-full">
          <Hourglass size={24} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-emerald-500 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{t('totalAllocation')}</p>
          <p className="text-3xl font-bold text-emerald-600">
             {stats.totalAllocation.toFixed(2)} <span className="text-sm font-normal text-slate-500">M</span>
          </p>
        </div>
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-blue-500 flex items-center justify-between bg-blue-50">
        <div>
          <p className="text-sm text-blue-800 font-medium mb-1">{t('completedProjects')}</p>
          <p className="text-3xl font-bold text-blue-700">{stats.completedProjectsCount}</p>
        </div>
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <CheckCircle2 size={24} />
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
