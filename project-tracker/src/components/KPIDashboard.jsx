import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, DollarSign, CreditCard, Activity } from 'lucide-react';

const KPIDashboard = ({ projects }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalAllocation = projects.reduce((acc, curr) => acc + (parseFloat(curr.allocation) || 0), 0);
    const disbursedPayments = projects.reduce((acc, curr) => acc + (parseFloat(curr.disbursed) || 0), 0);
    const utilizationRate = totalAllocation > 0 ? (disbursedPayments / totalAllocation) * 100 : 0;

    return {
      totalProjects,
      totalAllocation,
      disbursedPayments,
      utilizationRate
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
          <Briefcase size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{t('totalProjects')}</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalProjects}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{t('totalAllocation')}</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalAllocation.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
          <CreditCard size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{t('disbursedPayments')}</p>
          <p className="text-2xl font-bold text-slate-800">{stats.disbursedPayments.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
             <Activity size={16} className="text-orange-500" />
             <span>{t('utilizationRate')}</span>
          </div>
          <span className="font-bold text-slate-800">{stats.utilizationRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="bg-emerald-500 h-2.5 rounded-full"
            style={{ width: `${Math.min(stats.utilizationRate, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
