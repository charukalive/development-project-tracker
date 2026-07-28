import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Edit2, Eye, Trash2, Image as ImageIcon } from 'lucide-react';

const TableView = ({ projects, onEdit, onViewDetails, onDelete, onPhotoView }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium">{t('projectDetails')}</th>
              <th className="p-4 font-medium">{t('finances')}</th>
              <th className="p-4 font-medium">{t('dates')}</th>
              <th className="p-4 font-medium text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 mb-1">{project.name}</div>
                    <div className="text-xs text-slate-500 mb-2">{project.gnDivision} • {project.contractor}</div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mr-2">
                      {project.program}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {t(project.status === 'Completed' ? 'completed' : 'inProgress')}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-mono text-slate-700 mb-1">
                      <span className="text-slate-400 text-xs mr-2">Alloc:</span>
                      {Number(project.allocation).toFixed(2)}
                    </div>
                    <div className="font-mono text-slate-700">
                      <span className="text-slate-400 text-xs mr-2">Disb: </span>
                      {Number(project.disbursed).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-slate-600 mb-1"><span className="text-slate-400 text-xs mr-1">Start:</span>{project.startDate}</div>
                    <div className="text-slate-600"><span className="text-slate-400 text-xs mr-1">End:</span>{project.endDate || '-'}</div>
                  </td>
                  <td className="p-4 align-top text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => onViewDetails(project)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title={t('projectDetails')}>
                        <Eye size={18} />
                      </button>
                      <button onClick={() => onEdit(project)} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors" title={t('editProject')}>
                        <Edit2 size={18} />
                      </button>
                      {(project.beforeImage || project.afterImage) && (
                        <button onClick={() => onPhotoView(project)} className="p-1.5 text-slate-400 hover:text-purple-600 rounded-md hover:bg-purple-50 transition-colors" title={t('photoComparison')}>
                          <ImageIcon size={18} />
                        </button>
                      )}
                      <button onClick={() => {
                        if(window.confirm('Are you sure you want to delete this project?')) {
                          onDelete(project.id);
                        }
                      }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
