import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X } from 'lucide-react';

const ProjectDetailModal = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800 pr-4">{project.name}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('gnDivision')}</p>
              <p className="font-medium text-slate-800">{project.gnDivision}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('year')}</p>
              <p className="font-medium text-slate-800">{project.year || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('program')}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                {t({
                  "Decentralized Budget": "decentralizedBudget",
                  "District Development": "districtDevelopment",
                  "Building Rehabilitation": "buildingRehabilitation",
                  "Community Power": "communityPower",
                  "Ministries": "ministries",
                  "Provincial Councils": "provincialCouncils",
                  "Other": "other"
                }[project.program] || project.program)}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('status')}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {t({
                  "Not Approved": "notApproved",
                  "Approved": "approved",
                  "Estimating": "estimating",
                  "Procurement": "procurement",
                  "Contracted": "contracted",
                  "Physical Progress 0-25%": "physical0to25",
                  "Physical Progress 26-50%": "physical26to50",
                  "Physical Progress 51-75%": "physical51to75",
                  "Physical Progress 76-99%": "physical76to99",
                  "Work Completed": "workCompleted",
                  "Completed": "completed",
                  "In Progress": "inProgress"
                }[project.status] || project.status)}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('projectType')}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                {t({
                  "Construction": "construction",
                  "Purchasing": "purchasing",
                  "Machine repair": "machineRepair"
                }[project.projectType] || project.projectType || 'construction')}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('contractor')}</p>
              <p className="font-medium text-slate-800">{project.contractor || '-'}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('allocation')}</p>
              <p className="font-mono text-lg text-slate-800">{Number(project.allocation).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('disbursed')}</p>
              <p className="font-mono text-lg text-emerald-600">{Number(project.disbursed).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('financialProgress')}</p>
              <p className="font-medium text-slate-800">{project.financialProgress || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('retentionAmount')}</p>
              <p className="font-mono text-lg text-slate-800">{project.retentionAmount != null ? Number(project.retentionAmount).toFixed(2) : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('retentionPeriodMonths')}</p>
              <p className="font-medium text-slate-800">{project.retentionPeriodMonths || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500 mb-1">{t('specialRemarks')}</p>
              <p className="font-medium text-slate-800">{project.specialRemarks || '-'}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
             <div>
              <p className="text-sm text-slate-500 mb-1">{t('startDate')}</p>
              <p className="text-slate-800">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t('endDate')}</p>
              <p className="text-slate-800">{project.endDate || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
