import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '../utils/storage';

const ProjectFormModal = ({ isOpen, onClose, onSave, editingProject }) => {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData(e.target);
      const beforeImageFile = formData.get('beforeImageFile');
      const afterImageFile = formData.get('afterImageFile');

      let beforeImageURL = editingProject?.beforeImage || null;
      let afterImageURL = editingProject?.afterImage || null;

      if (beforeImageFile && beforeImageFile.size > 0) {
        beforeImageURL = await uploadImage(beforeImageFile);
      }

      if (afterImageFile && afterImageFile.size > 0) {
        afterImageURL = await uploadImage(afterImageFile);
      }

      const projectData = {
        id: editingProject ? editingProject.id : uuidv4(),
        name: formData.get('name'),
        gnDivision: formData.get('gnDivision'),
        program: formData.get('program'),
        status: formData.get('status'),
        projectType: formData.get('projectType') || 'Construction',
        year: formData.get('year'),
        allocation: parseFloat(formData.get('allocation')) || 0,
        disbursed: parseFloat(formData.get('disbursed')) || 0,
        contractor: formData.get('contractor'),
        financialProgress: formData.get('financialProgress'),
        retentionAmount: parseFloat(formData.get('retentionAmount')) || 0,
        retentionPeriodMonths: formData.get('retentionPeriodMonths') ? parseInt(formData.get('retentionPeriodMonths')) : '',
        specialRemarks: formData.get('specialRemarks'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        projectDuration: formData.get('projectDuration') || '',
        actualEndDate: formData.get('actualEndDate') || null,
        beforeImage: beforeImageURL,
        afterImage: afterImageURL,
        // Preserve retentionPaid status on submit
        retentionPaid: editingProject?.retentionPaid || false,
      };

      onSave(projectData);
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            {editingProject ? t('editProject') : t('addProject')}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('projectName')} *</label>
              <input required name="name" defaultValue={editingProject?.name} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('gnDivision')} *</label>
              <input required name="gnDivision" defaultValue={editingProject?.gnDivision} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('year')} *</label>
              <input required name="year" defaultValue={editingProject?.year} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('program')} *</label>
              <select name="program" required defaultValue={editingProject?.program || 'Decentralized Budget'} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm cursor-pointer">
                <option value="Decentralized Budget" className="dark:bg-slate-900 dark:text-slate-100">{t('decentralizedBudget')}</option>
                <option value="District Development" className="dark:bg-slate-900 dark:text-slate-100">{t('districtDevelopment')}</option>
                <option value="Building Rehabilitation" className="dark:bg-slate-900 dark:text-slate-100">{t('buildingRehabilitation')}</option>
                <option value="Community Power" className="dark:bg-slate-900 dark:text-slate-100">{t('communityPower')}</option>
                <option value="Ministries" className="dark:bg-slate-900 dark:text-slate-100">{t('ministries')}</option>
                <option value="Provincial Councils" className="dark:bg-slate-900 dark:text-slate-100">{t('provincialCouncils')}</option>
                <option value="Other" className="dark:bg-slate-900 dark:text-slate-100">{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('status')} *</label>
              <select name="status" defaultValue={editingProject?.status || 'Not Approved'} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm cursor-pointer">
                <option value="Not Approved" className="dark:bg-slate-900 dark:text-slate-100">{t('notApproved')}</option>
                <option value="Approved" className="dark:bg-slate-900 dark:text-slate-100">{t('approved')}</option>
                <option value="Estimating" className="dark:bg-slate-900 dark:text-slate-100">{t('estimating')}</option>
                <option value="Procurement" className="dark:bg-slate-900 dark:text-slate-100">{t('procurement')}</option>
                <option value="Contracted" className="dark:bg-slate-900 dark:text-slate-100">{t('contracted')}</option>
                <option value="Physical Progress 0-25%" className="dark:bg-slate-900 dark:text-slate-100">{t('physical0to25')}</option>
                <option value="Physical Progress 26-50%" className="dark:bg-slate-900 dark:text-slate-100">{t('physical26to50')}</option>
                <option value="Physical Progress 51-75%" className="dark:bg-slate-900 dark:text-slate-100">{t('physical51to75')}</option>
                <option value="Physical Progress 76-99%" className="dark:bg-slate-900 dark:text-slate-100">{t('physical76to99')}</option>
                <option value="Completed" className="dark:bg-slate-900 dark:text-slate-100">{t('completed')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('projectType')} *</label>
              <select name="projectType" defaultValue={editingProject?.projectType || 'Construction'} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm cursor-pointer">
                <option value="Construction" className="dark:bg-slate-900 dark:text-slate-100">{t('construction')}</option>
                <option value="Purchasing" className="dark:bg-slate-900 dark:text-slate-100">{t('purchasing')}</option>
                <option value="Machine repair" className="dark:bg-slate-900 dark:text-slate-100">{t('machineRepair')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('allocation')} (M) *</label>
              <input required name="allocation" defaultValue={editingProject?.allocation} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('disbursed')} (M) *</label>
              <input required name="disbursed" defaultValue={editingProject?.disbursed} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('financialProgress')}</label>
              <input name="financialProgress" defaultValue={editingProject?.financialProgress} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('retentionAmount')} (M)</label>
              <input name="retentionAmount" defaultValue={editingProject?.retentionAmount} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('retentionPeriodMonths')}</label>
              <input name="retentionPeriodMonths" defaultValue={editingProject?.retentionPeriodMonths} type="number" min="0" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('contractor')}</label>
              <input name="contractor" defaultValue={editingProject?.contractor} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('specialRemarks')}</label>
              <textarea name="specialRemarks" defaultValue={editingProject?.specialRemarks} rows="2" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm"></textarea>
            </div>

            {/* Date Inputs in exact required order */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('startDate')} *</label>
              <input required name="startDate" defaultValue={editingProject?.startDate} type="date" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('endDate')}</label>
              <input name="endDate" defaultValue={editingProject?.endDate} type="date" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('projectDuration')}</label>
              <input name="projectDuration" defaultValue={editingProject?.projectDuration} type="text" placeholder="e.g. 6 Months" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('actualEndDate')}</label>
              <input name="actualEndDate" defaultValue={editingProject?.actualEndDate} type="date" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm" />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/20">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <UploadCloud size={16} /> {t('beforePhoto')}
              </label>
              <input name="beforeImageFile" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-950/30 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
              {editingProject?.beforeImage && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Current file attached.</p>}
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/20">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <UploadCloud size={16} /> {t('afterPhoto')}
              </label>
              <input name="afterImageFile" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-950/30 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
              {editingProject?.afterImage && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Current file attached.</p>}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors disabled:opacity-50 cursor-pointer">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isUploading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
              {isUploading && <Loader2 size={16} className="animate-spin" />}
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
