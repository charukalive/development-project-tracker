import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useProjects } from './hooks/useProjects';
import { useAuth } from './context/AuthContext';
import KPIDashboard from './components/KPIDashboard';
import FilterBar from './components/FilterBar';
import TableView from './components/TableView';
import KanbanView from './components/KanbanView';
import AnalyticsView from './components/AnalyticsView';
import ProjectFormModal from './components/ProjectFormModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import PhotoViewerModal from './components/PhotoViewerModal';
import AdminLoginModal from './components/AdminLoginModal';
import { LayoutGrid, TableProperties, BarChart3, Globe, Sun, Moon, ChevronDown, Check, Unlock, Lock, LogOut } from 'lucide-react';

const AppContent = () => {
  const { t, language, setLanguage } = useLanguage();
  const { projects, addProject, updateProject, deleteProject, loading } = useProjects();
  const { user, isAdmin, logout } = useAuth();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban' | 'analytics'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedProjectType, setSelectedProjectType] = useState('All');
  const [selectedRetentionFilter, setSelectedRetentionFilter] = useState('All'); // 'All' | 'Exceeded' | 'PassingSoon'

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [photoViewerProject, setPhotoViewerProject] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Custom UI dropdown states
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Dark Mode System State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Derived Unique Filter Options
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
        if (p.retentionPaid) {
          matchesRetention = false; // Exclude resolved retention projects
        } else if (p.status === 'Completed' && p.endDate && p.retentionPeriodMonths) {
          const endDate = new Date(p.endDate);
          const retentionDate = new Date(endDate);
          retentionDate.setMonth(retentionDate.getMonth() + parseInt(p.retentionPeriodMonths, 10));

          const timeDiff = retentionDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (selectedRetentionFilter === 'Exceeded') {
            matchesRetention = daysDiff < 0;
          } else if (selectedRetentionFilter === 'PassingSoon') {
            matchesRetention = daysDiff >= 0 && daysDiff <= 60;
          }
        } else {
          matchesRetention = false;
        }
      }

      return matchesSearch && matchesProgram && matchesStatus && matchesYear && matchesRetention && matchesProjectType;
    });
  }, [projects, searchTerm, selectedProgram, selectedStatus, selectedYear, selectedRetentionFilter, selectedProjectType]);

  // Page 2 Requirement: Sort projects from Current Year (descending) -> Program -> GN Division
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      // 1. Current/Latest Year descending
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      if (yearB !== yearA) return yearB - yearA;

      // 2. Program type ascending
      const progA = (a.program || '').toLowerCase();
      const progB = (b.program || '').toLowerCase();
      if (progA !== progB) return progA.localeCompare(progB);

      // 3. GN Division ascending
      const gnA = (a.gnDivision || '').toLowerCase();
      const gnB = (b.gnDivision || '').toLowerCase();
      return gnA.localeCompare(gnB);
    });
  }, [filteredProjects]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Year', 'Project Name', 'GN Division', 'Program', 'Status', 'Project Type', 'Allocation (M)', 'Disbursed (M)', 'Contractor', 'Financial Progress', 'Retention Amount (Rs.)', 'Retention Period (Months)', 'Start Date', 'End Date', 'Project Period', 'Actual Completion Date', 'Special Remarks'];
    const rows = sortedProjects.map(p => [
      p.id,
      p.year || '',
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.gnDivision.replace(/"/g, '""')}"`,
      `"${p.program.replace(/"/g, '""')}"`,
      `"${p.status.replace(/"/g, '""')}"`,
      `"${(p.projectType || 'Construction').replace(/"/g, '""')}"`,
      p.allocation,
      p.disbursed,
      `"${(p.contractor || '').replace(/"/g, '""')}"`,
      `"${(p.financialProgress || '').replace(/"/g, '""')}"`,
      p.retentionAmount != null ? p.retentionAmount : '',
      p.retentionPeriodMonths || '',
      p.startDate || '',
      p.endDate || '',
      `"${(p.projectDuration || '').replace(/"/g, '""')}"`,
      p.actualEndDate || '',
      `"${(p.specialRemarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Projects_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const title = t('appTitle');
    const headerTitle = t('headerTitle');
    
    const rows = sortedProjects.map(p => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 500; color: #1e293b;">${p.name}</td>
        <td style="padding: 10px 8px; text-align: left; font-size: 11px; color: #475569;">${p.gnDivision}</td>
        <td style="padding: 10px 8px; text-align: left; font-size: 11px; color: #475569;">${p.program}</td>
        <td style="padding: 10px 8px; text-align: left; font-size: 11px; color: #475569;">${p.status}</td>
        <td style="padding: 10px 8px; text-align: right; font-size: 11px; font-family: monospace; font-weight: 600; color: #0f172a;">${Number(p.allocation).toFixed(2)}</td>
        <td style="padding: 10px 8px; text-align: right; font-size: 11px; font-family: monospace; font-weight: 600; color: #059669;">${Number(p.disbursed).toFixed(2)}</td>
        <td style="padding: 10px 8px; text-align: left; font-size: 11px; color: #475569;">${p.contractor || '-'}</td>
      </tr>
    `).join('');

    const totalAlloc = sortedProjects.reduce((acc, p) => acc + Number(p.allocation), 0).toFixed(2);
    const totalDisb = sortedProjects.reduce((acc, p) => acc + Number(p.disbursed), 0).toFixed(2);

    const html = `
      <html>
        <head>
          <title>${headerTitle} - ${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 30px; color: #1e293b; background: #fff; margin: 0; }
            .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0d5c4b; padding-bottom: 15px; margin-bottom: 20px; }
            .secretariat-title { font-size: 22px; font-weight: 700; margin: 0 0 4px 0; color: #0d5c4b; }
            .app-title { font-size: 14px; font-weight: 500; margin: 0; color: #64748b; }
            .btn-print { background: #0d5c4b; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .btn-print:hover { background: #0b4d3f; }
            .meta-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #e2e8f0; }
            .meta-item { display: flex; flex-direction: column; }
            .meta-label { font-size: 10px; text-transform: uppercase; font-weight: 600; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px; }
            .meta-value { font-size: 15px; font-weight: 700; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f1f5f9; padding: 12px 8px; text-align: left; font-size: 11px; font-weight: 600; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; font-weight: 500; }
            @media print {
              .no-print { display: none !important; }
              body { padding: 0; }
              .meta-grid { border: 1px solid #cbd5e1; background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <h1 class="secretariat-title">${headerTitle}</h1>
              <h2 class="app-title">${title}</h2>
            </div>
            <button class="btn-print no-print" onclick="window.print()">${t('printPDF')}</button>
          </div>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">${t('totalProjects')}</span>
              <span class="meta-value">${sortedProjects.length}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Report Date</span>
              <span class="meta-value">${new Date().toLocaleDateString()}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${t('totalAllocation')}</span>
              <span class="meta-value">Rs. ${totalAlloc} M</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${t('disbursedPayments')}</span>
              <span class="meta-value" style="color: #059669;">Rs. ${totalDisb} M</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 30%;">${t('projectName')}</th>
                <th>${t('gnDivision')}</th>
                <th>${t('program')}</th>
                <th>${t('status')}</th>
                <th style="text-align: right;">${t('allocation')} (M)</th>
                <th style="text-align: right;">${t('disbursed')} (M)</th>
                <th>${t('contractor')}</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="footer">
            ${headerTitle} - Progress Report &copy; ${new Date().getFullYear()}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      updateProject(projectData);
    } else {
      addProject(projectData);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Controls Sticky Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Kept top nav clean without duplicate logo */}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* View Toggles */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`} title={t('tableView')}>
                <TableProperties size={18} />
              </button>
              <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`} title={t('kanbanView')}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode('analytics')} className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'analytics' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`} title={t('analyticsView')}>
                <BarChart3 size={18} />
              </button>
            </div>

            {/* Guest / Admin Mode Switch */}
            {isAdmin ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 uppercase">
                  <Unlock size={10} className="mr-1" />
                  <span className="hidden sm:inline">{t('adminMode')}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1 sm:px-2 sm:py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  title={t('logout')}
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline text-xs font-semibold">{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 uppercase">
                  <Lock size={10} className="mr-1" />
                  <span className="hidden sm:inline">{t('guestMode')}</span>
                </span>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-1 sm:px-2 sm:py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1 animate-pulse"
                  title={t('loginToAdmin')}
                >
                  <Lock size={14} />
                  <span className="hidden sm:inline text-xs font-semibold">{t('loginToAdmin')}</span>
                </button>
              </div>
            )}

            {/* Theme Toggle & Language Toggle */}
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-4 relative">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 hover:rotate-12 transition-all duration-250 cursor-pointer mr-1"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Custom Language Dropdown Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                >
                  <Globe size={16} className="text-slate-450 dark:text-slate-505" />
                  <span className="text-xs font-semibold uppercase">{language === 'en' ? 'EN' : language === 'si' ? 'සිං' : 'தம'}</span>
                  <ChevronDown size={14} className={`text-slate-400 dark:text-slate-550 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-50" onClick={() => setIsLangMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-55 overflow-hidden animate-fade-in p-1">
                      {[
                        { code: 'en', label: 'English (EN)' },
                        { code: 'si', label: 'සිංහල (සිං)' },
                        { code: 'ta', label: 'தமிழ் (தம)' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                            language === lang.code
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <span>{lang.label}</span>
                          {language === lang.code && <Check size={12} className="text-emerald-650 dark:text-emerald-400 ml-1.5" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page 4 Requirement: Clean Header Banner with 1 Single Logo & 2 Topics */}
      <div className="bg-[#0d5c4b] text-white py-6 px-4 shadow-md border-b border-[#0b4d3f]">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden bg-white/10 border border-white/20">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans leading-tight">
              {t('appTitle')}
            </h1>
            <h2 className="text-sm sm:text-base text-emerald-100 font-medium mt-0.5">
              {t('headerTitle')}
            </h2>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <KPIDashboard projects={projects} />
            
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedProjectType={selectedProjectType}
              setSelectedProjectType={setSelectedProjectType}
              selectedRetentionFilter={selectedRetentionFilter}
              setSelectedRetentionFilter={setSelectedRetentionFilter}
              programOptions={programOptions}
              statusOptions={statusOptions}
              yearOptions={yearOptions}
              projectTypeOptions={projectTypeOptions}
              onOpenAdd={handleOpenAdd}
              onExportCSV={handleExportCSV}
              onPrintPDF={handlePrintPDF}
              isAdmin={isAdmin}
            />

            {viewMode === 'table' && (
              <TableView
                projects={sortedProjects}
                onEdit={handleOpenEdit}
                onViewDetails={(p) => setSelectedProject(p)}
                onDelete={deleteProject}
                onPhotoView={(p) => setPhotoViewerProject(p)}
                isAdmin={isAdmin}
              />
            )}

            {viewMode === 'kanban' && (
              <KanbanView
                projects={sortedProjects}
                onEdit={handleOpenEdit}
                onViewDetails={(p) => setSelectedProject(p)}
                onDelete={deleteProject}
                onPhotoView={(p) => setPhotoViewerProject(p)}
                isAdmin={isAdmin}
              />
            )}

            {viewMode === 'analytics' && (
              <AnalyticsView projects={sortedProjects} />
            )}
          </div>
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
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      <PhotoViewerModal
        isOpen={!!photoViewerProject}
        onClose={() => setPhotoViewerProject(null)}
        project={photoViewerProject}
      />

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
