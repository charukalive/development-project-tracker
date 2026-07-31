import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Download, Plus } from 'lucide-react';
import { exportToCSV } from '../utils/exportCSV';

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedProgram,
  setSelectedProgram,
  selectedStatus,
  setSelectedStatus,
  selectedYear,
  setSelectedYear,
  selectedRetentionFilter,
  setSelectedRetentionFilter,
  selectedProjectType,
  setSelectedProjectType,
  programOptions,
  statusOptions,
  yearOptions,
  projectTypeOptions,
  onAddProject,
  filteredProjects
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

      <div className="flex-1 w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex w-full md:w-auto gap-2 flex-wrap md:flex-nowrap">
        <select
          className="block w-full md:w-32 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="All">{t('allYears')}</option>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="All">{t('allPrograms')}</option>
          {programOptions.map(p => {
            const programMap = {
                "Decentralized Budget": "decentralizedBudget",
                "District Development": "districtDevelopment",
                "Building Rehabilitation": "buildingRehabilitation",
                "Community Power": "communityPower",
                "Ministries": "ministries",
                "Provincial Councils": "provincialCouncils",
                "Other": "other"
            };
            return <option key={p} value={p}>{t(programMap[p] || p)}</option>;
          })}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">{t('allStatuses')}</option>
          {statusOptions.map(s => {
             // Map standard status strings to their translation keys
             const statusMap = {
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
             };
             return <option key={s} value={s}>{t(statusMap[s] || s)}</option>;
          })}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
        >
          <option value="All">{t('allProjectTypes')}</option>
          {projectTypeOptions.map(pt => {
             const projectTypeMap = {
                 "Construction": "construction",
                 "Purchasing": "purchasing",
                 "Machine repair": "machineRepair"
             };
             return <option key={pt} value={pt}>{t(projectTypeMap[pt] || pt)}</option>;
          })}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedRetentionFilter}
          onChange={(e) => setSelectedRetentionFilter(e.target.value)}
        >
          <option value="All">{t('allRetentions')}</option>
          <option value="Exceeded">{t('retentionExceeded')}</option>
          <option value="PassingSoon">{t('retentionPassingSoon')}</option>
        </select>
      </div>

      <div className="flex w-full md:w-auto gap-2">
        <button
          onClick={() => exportToCSV(filteredProjects)}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Download size={16} />
          <span>{t('exportCSV')}</span>
        </button>
        <button
          onClick={onAddProject}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>{t('addProject')}</span>
        </button>
      </div>

    </div>
  );
};

export default FilterBar;
