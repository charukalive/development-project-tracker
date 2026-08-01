import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AnalyticsView = ({ projects }) => {
  const { t } = useLanguage();
  
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';

  const programData = useMemo(() => {
    const data = {};
    projects.forEach(p => {
      if (!data[p.program]) {
        data[p.program] = { name: p.program, allocation: 0, disbursed: 0 };
      }
      data[p.program].allocation += Number(p.allocation);
      data[p.program].disbursed += Number(p.disbursed);
    });
    // Map names to translations
    return Object.values(data).map(item => ({
      ...item,
      name: t({
        "Decentralized Budget": "decentralizedBudget",
        "District Development": "districtDevelopment",
        "Building Rehabilitation": "buildingRehabilitation",
        "Community Power": "communityPower",
        "Ministries": "ministries",
        "Provincial Councils": "provincialCouncils",
        "Other": "other"
      }[item.name] || item.name)
    }));
  }, [projects, t]);

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

  // Program Progress Summary Table calculations
  const summaryTableData = useMemo(() => {
    const programKeys = [
      "Decentralized Budget",
      "District Development",
      "Building Rehabilitation",
      "Community Power",
      "Ministries",
      "Provincial Councils",
      "Other"
    ];

    const initialData = {};
    programKeys.forEach(key => {
      initialData[key] = {
        key,
        totalCount: 0,
        totalAllocation: 0,
        estimatingCount: 0,
        approvedCount: 0,
        procurementCount: 0,
        contractedCount: 0,
        p0to25: 0,
        p26to50: 0,
        p51to75: 0,
        p76to99: 0,
        completedCount: 0
      };
    });

    projects.forEach(p => {
      let programKey = p.program;
      if (!programKey || !programKeys.includes(programKey)) {
        programKey = "Other";
      }

      const row = initialData[programKey];
      row.totalCount += 1;
      row.totalAllocation += Number(p.allocation) || 0;

      const status = p.status;
      if (status === 'Estimating' || status === 'ඇස්තමේන්තු සකස් කරමින් පවතී') {
        row.estimatingCount += 1;
      } else if (status === 'Approved' || status === 'අනුමත වී ඇත') {
        row.approvedCount += 1;
      } else if (status === 'Procurement' || status === 'ප්‍රසම්පාදන කටයුතු සිදු කරයි') {
        row.procurementCount += 1;
      } else if (status === 'Contracted' || status === 'ගිවිසුම් ගත වී ඇත') {
        row.contractedCount += 1;
      } else if (status === 'Physical Progress 0-25%' || status === 'භෞතික ප්‍රගතිය 0-25%') {
        row.p0to25 += 1;
      } else if (status === 'Physical Progress 26-50%' || status === 'භෞතික ප්‍රගතිය 26-50%') {
        row.p26to50 += 1;
      } else if (status === 'Physical Progress 51-75%' || status === 'භෞතික ප්‍රගතිය 51-75%') {
        row.p51to75 += 1;
      } else if (status === 'Physical Progress 76-99%' || status === 'භෞතික ප්‍රගතිය 76-99%') {
        row.p76to99 += 1;
      } else if (status === 'Completed' || status === 'වැඩ අවසන්') {
        row.completedCount += 1;
      }
    });

    return Object.values(initialData);
  }, [projects]);

  const grandTotals = useMemo(() => {
    const totals = {
      totalCount: 0,
      totalAllocation: 0,
      estimatingCount: 0,
      approvedCount: 0,
      procurementCount: 0,
      contractedCount: 0,
      p0to25: 0,
      p26to50: 0,
      p51to75: 0,
      p76to99: 0,
      completedCount: 0
    };
    summaryTableData.forEach(row => {
      totals.totalCount += row.totalCount;
      totals.totalAllocation += row.totalAllocation;
      totals.estimatingCount += row.estimatingCount;
      totals.approvedCount += row.approvedCount;
      totals.procurementCount += row.procurementCount;
      totals.contractedCount += row.contractedCount;
      totals.p0to25 += row.p0to25;
      totals.p26to50 += row.p26to50;
      totals.p51to75 += row.p51to75;
      totals.p76to99 += row.p76to99;
      totals.completedCount += row.completedCount;
    });
    return totals;
  }, [summaryTableData]);

  return (
    <div className="space-y-6">
      {/* 1. Programs Progress Summary Table */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-x-auto transition-colors duration-200">
        <h3 className="text-sm sm:text-base font-semibold text-slate-850 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
          වැඩසටහන් ප්‍රගති සාරාංශ වාර්තාව (Programs Progress Summary Report)
        </h3>
        
        <table className="w-full text-[11px] text-left border-collapse border border-slate-200 dark:border-slate-800">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-850/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">SN</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 min-w-[150px]">වැඩසටහන (Program)</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">අනුමත ව්‍යාපෘති ගණන (Approved Projects)</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">අනුමත ප්‍රතිපාදන මුදල (රු.මි.) (Allocation M)</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">ඇස්තමේන්තු සකස් කරමින් පවතින (Est. In Prep)</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">ඇස්තමේන්තු සකස් කර ඇති (Est. Prepared)</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">සැපයුම්කරුවන්/කොන්ත්‍රාත්කරුවන් කැඳවීම (Procurement)</th>
              <th rowSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">ගිවිසුම් ගත වී ඇති (Contracted)</th>
              <th colSpan="4" className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">වැඩ ආරම්භ කර ඇති ව්‍යාපෘති ගණන (Started Projects)</th>
              <th rowSpan="2" className="p-2 text-center">වැඩ අවසන් (Completed)</th>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-850/40 text-slate-600 dark:text-slate-350 border-b border-slate-200 dark:border-slate-800">
              <th className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-center">0-25%</th>
              <th className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-center">26-50%</th>
              <th className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-center">51-75%</th>
              <th className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-center">76-99%</th>
            </tr>
          </thead>
          <tbody>
            {summaryTableData.map((row, idx) => (
              <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800/60">
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{idx + 1}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-semibold">
                  {t({
                    "Decentralized Budget": "decentralizedBudget",
                    "District Development": "districtDevelopment",
                    "Building Rehabilitation": "buildingRehabilitation",
                    "Community Power": "communityPower",
                    "Ministries": "ministries",
                    "Provincial Councils": "provincialCouncils",
                    "Other": "other"
                  }[row.key] || row.key)}
                </td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{row.totalCount}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-right font-mono font-bold text-slate-700 dark:text-slate-300">{row.totalAllocation.toFixed(2)}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.estimatingCount}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.approvedCount}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.procurementCount}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.contractedCount}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.p0to25}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.p26to50}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.p51to75}</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{row.p76to99}</td>
                <td className="p-2 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.completedCount}</td>
              </tr>
            ))}
            
            {/* Grand Total Row */}
            <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-850 dark:text-slate-100 border-t-2 border-slate-300 dark:border-slate-700">
              <td colSpan="2" className="p-2 border-r border-slate-200 dark:border-slate-800 text-right uppercase tracking-wider text-xs">එකතුව (Total)</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono text-xs">{grandTotals.totalCount}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-right font-mono text-xs">{grandTotals.totalAllocation.toFixed(2)}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.estimatingCount}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.approvedCount}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.procurementCount}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.contractedCount}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.p0to25}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.p26to50}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.p51to75}</td>
              <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono">{grandTotals.p76to99}</td>
              <td className="p-2 text-center font-mono text-emerald-650 dark:text-emerald-400 text-xs">{grandTotals.completedCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">{t('allocationByProgram')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 11}} />
                <Tooltip cursor={{fill: isDark ? '#1e293b' : '#f1f5f9'}} contentStyle={{backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} labelStyle={{color: isDark ? '#f8fafc' : '#1e293b'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '20px', color: tickColor}} />
                <Bar dataKey="allocation" name="Total Allocation" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disbursed" name="Disbursed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">{t('allocationByGN')}</h3>
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
                <Tooltip formatter={(value) => [`${value.toFixed(2)} M`, 'Allocation']} contentStyle={{backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} labelStyle={{color: isDark ? '#f8fafc' : '#1e293b'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
