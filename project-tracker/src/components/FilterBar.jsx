import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Download, Plus, Printer } from 'lucide-react';
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
  onPrintPDF,
  filteredProjects,
  isAdmin
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/80 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-200">

      <div className="flex-1 w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex w-full md:w-auto gap-2 flex-wrap md:flex-nowrap">
        <select
          className="block w-full md:w-32 py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="All" className="dark:bg-slate-900 dark:text-slate-100">{t('allYears')}</option>
          {yearOptions.map(y => <option key={y} value={y} className="dark:bg-slate-900 dark:text-slate-100">{y}</option>)}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="All" className="dark:bg-slate-900 dark:text-slate-100">{t('allPrograms')}</option>
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
            return <option key={p} value={p} className="dark:bg-slate-900 dark:text-slate-100">{t(programMap[p] || p)}</option>;
          })}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All" className="dark:bg-slate-900 dark:text-slate-100">{t('allStatuses')}</option>
          {statusOptions.map(s => {
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
             return <option key={s} value={s} className="dark:bg-slate-900 dark:text-slate-100">{t(statusMap[s] || s)}</option>;
          })}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
        >
          <option value="All" className="dark:bg-slate-900 dark:text-slate-100">{t('allProjectTypes')}</option>
          {projectTypeOptions.map(pt => {
             const projectTypeMap = {
                 "Construction": "construction",
                 "Purchasing": "purchasing",
                 "Machine repair": "machineRepair"
             };
             return <option key={pt} value={pt} className="dark:bg-slate-900 dark:text-slate-100">{t(projectTypeMap[pt] || pt)}</option>;
          })}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          value={selectedRetentionFilter}
          onChange={(e) => setSelectedRetentionFilter(e.target.value)}
        >
          <option value="All" className="dark:bg-slate-900 dark:text-slate-100">{t('allRetentions')}</option>
          <option value="Exceeded" className="dark:bg-slate-900 dark:text-slate-100">{t('retentionExceeded')}</option>
          <option value="PassingSoon" className="dark:bg-slate-900 dark:text-slate-100">{t('retentionPassingSoon')}</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
        <div className="flex gap-2 w-full sm:w-auto flex-1">
          <button
            onClick={onPrintPDF}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-95 group transition-all duration-200 cursor-pointer"
          >
            <Printer size={16} className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
            <span className="truncate">{t('printPDF')}</span>
          </button>
          <button
            onClick={() => exportToCSV(filteredProjects)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-95 group transition-all duration-200 cursor-pointer"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform duration-200 flex-shrink-0" />
            <span className="truncate">{t('exportCSV')}</span>
          </button>
        </div>
        {isAdmin && (
          <button
            onClick={onAddProject}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-700 hover:scale-[1.03] active:scale-95 group transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
            <span className="truncate">{t('addProject')}</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default FilterBar;
