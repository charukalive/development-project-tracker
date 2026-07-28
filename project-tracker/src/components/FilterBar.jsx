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
  programOptions,
  statusOptions,
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

      <div className="flex w-full md:w-auto gap-4">
        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="All">{t('allPrograms')}</option>
          {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className="block w-full md:w-40 py-2 px-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">{t('allStatuses')}</option>
          {statusOptions.map(s => <option key={s} value={s}>{t(s === 'Completed' ? 'completed' : 'inProgress')}</option>)}
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
