import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AnalyticsView = ({ projects }) => {
  const { t } = useLanguage();

  const programData = useMemo(() => {
    const data = {};
    projects.forEach(p => {
      if (!data[p.program]) {
        data[p.program] = { name: p.program, allocation: 0, disbursed: 0 };
      }
      data[p.program].allocation += Number(p.allocation);
      data[p.program].disbursed += Number(p.disbursed);
    });
    return Object.values(data);
  }, [projects]);

  const gnData = useMemo(() => {
    const data = {};
    projects.forEach(p => {
      if (!data[p.gnDivision]) {
        data[p.gnDivision] = { name: p.gnDivision, value: 0 };
      }
      data[p.gnDivision].value += Number(p.allocation);
    });
    return Object.values(data);
  }, [projects]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">{t('allocationByProgram')}</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={programData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
              <Bar dataKey="allocation" name="Total Allocation" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="disbursed" name="Disbursed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">{t('allocationByGN')}</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gnData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {gnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toFixed(2)} M`, 'Allocation']} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
