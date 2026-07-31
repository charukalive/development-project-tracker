import React, { useState, useMemo } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useProjects } from './hooks/useProjects';
import KPIDashboard from './components/KPIDashboard';
import FilterBar from './components/FilterBar';
import TableView from './components/TableView';
import KanbanView from './components/KanbanView';
import AnalyticsView from './components/AnalyticsView';
import ProjectFormModal from './components/ProjectFormModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import PhotoViewerModal from './components/PhotoViewerModal';
import { LayoutGrid, TableProperties, BarChart3, Globe, Landmark } from 'lucide-react';

const AppContent = () => {
  const { t, language, setLanguage } = useLanguage();
  const { projects, addProject, updateProject, deleteProject, loading } = useProjects();

  const [viewMode, setViewMode] = useState('table'); // table, kanban, analytics
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRetentionFilter, setSelectedRetentionFilter] = useState('All');
  const [selectedProjectType, setSelectedProjectType] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const programOptions = useMemo(() => [...new Set(projects.map(p => p.program))], [projects]);
  const statusOptions = useMemo(() => [...new Set(projects.map(p => p.status))], [projects]);
  const yearOptions = useMemo(() => {
    const years = new Set(projects.map(p => p.year).filter(y => y));
    return [...years].sort((a, b) => String(b).localeCompare(String(a))); // Sort descending safely
  }, [projects]);
  const projectTypeOptions = useMemo(() => {
    const types = new Set(projects.map(p => p.projectType).filter(Boolean));
    types.add("Construction");
    types.add("Purchasing");
    types.add("Machine repair");
    return [...types];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const today = new Date();

    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.gnDivision.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.contractor && p.contractor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesProgram = selectedProgram === 'All' || p.program === selectedProgram;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesYear = selectedYear === 'All' || p.year === selectedYear;

      const projectType = p.projectType || 'Construction';
      const matchesProjectType = selectedProjectType === 'All' || projectType === selectedProjectType;

      let matchesRetention = true;
      if (selectedRetentionFilter !== 'All') {
        if (p.status === 'Completed' && p.endDate && p.retentionPeriodMonths) {
          const endDate = new Date(p.endDate);
          const retentionDate = new Date(endDate);
          retentionDate.setMonth(retentionDate.getMonth() + parseInt(p.retentionPeriodMonths, 10));

          const timeDiff = retentionDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (selectedRetentionFilter === 'Exceeded') {
            matchesRetention = daysDiff < 0;
          } else if (selectedRetentionFilter === 'PassingSoon') {
            matchesRetention = daysDiff >= 0 && daysDiff <= 60; // Approx 2 months
          }
        } else {
          matchesRetention = false; // Only completed projects with end date and retention period can match these filters
        }
      }

      return matchesSearch && matchesProgram && matchesStatus && matchesYear && matchesRetention && matchesProjectType;
    });
  }, [projects, searchTerm, selectedProgram, selectedStatus, selectedYear, selectedRetentionFilter, selectedProjectType]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleOpenPhotoView = (project) => {
    setSelectedProject(project);
    setIsPhotoViewerOpen(true);
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      updateProject(projectData);
    } else {
      addProject(projectData);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">{t('appTitle')}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`} title={t('tableView')}>
                <TableProperties size={18} />
              </button>
              <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`} title={t('kanbanView')}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode('analytics')} className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'analytics' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`} title={t('analyticsView')}>
                <BarChart3 size={18} />
              </button>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
              <Globe size={16} className="text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="si">සිං</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Galnewa Secretariat Header Banner */}
      <div className="bg-[#0d5c4b] text-white py-6 px-4 shadow-md border-b border-[#0b4d3f]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <Landmark size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  {t('headerTitle')}
                </h1>
                <span className="bg-[#0b4d3f] text-emerald-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm flex-shrink-0">
                  {t('headerPill')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 font-normal leading-relaxed">
                {t('headerSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedRetentionFilter={selectedRetentionFilter}
              setSelectedRetentionFilter={setSelectedRetentionFilter}
              selectedProjectType={selectedProjectType}
              setSelectedProjectType={setSelectedProjectType}
              programOptions={programOptions}
              statusOptions={statusOptions}
              yearOptions={yearOptions}
              projectTypeOptions={projectTypeOptions}
              onAddProject={handleOpenAdd}
              filteredProjects={filteredProjects}
            />

            <KPIDashboard projects={filteredProjects} />

            {/* View Rendering */}
            <div className="transition-all duration-300 ease-in-out">
              {viewMode === 'table' && (
                <TableView
                  projects={filteredProjects}
                  onEdit={handleOpenEdit}
                  onViewDetails={handleOpenDetails}
                  onDelete={deleteProject}
                  onPhotoView={handleOpenPhotoView}
                />
              )}
              {viewMode === 'kanban' && (
                <KanbanView
                  projects={filteredProjects}
                  onEdit={handleOpenEdit}
                  onViewDetails={handleOpenDetails}
                  onPhotoView={handleOpenPhotoView}
                />
              )}
              {viewMode === 'analytics' && (
                <AnalyticsView projects={filteredProjects} />
              )}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />
      <ProjectDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={selectedProject}
      />
      <PhotoViewerModal
        isOpen={isPhotoViewerOpen}
        onClose={() => setIsPhotoViewerOpen(false)}
        project={selectedProject}
      />
    </div>
  );
};

export default AppContent;
