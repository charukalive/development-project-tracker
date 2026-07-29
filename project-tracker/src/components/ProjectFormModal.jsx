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
        year: formData.get('year'),
        allocation: parseFloat(formData.get('allocation')) || 0,
        disbursed: parseFloat(formData.get('disbursed')) || 0,
        contractor: formData.get('contractor'),
        financialProgress: formData.get('financialProgress'),
        retentionAmount: parseFloat(formData.get('retentionAmount')) || 0,
        retentionPeriodMonths: formData.get('retentionPeriodMonths'),
        specialRemarks: formData.get('specialRemarks'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        beforeImage: beforeImageURL,
        afterImage: afterImageURL,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            {editingProject ? t('editProject') : t('addProject')}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('projectName')} *</label>
              <input required name="name" defaultValue={editingProject?.name} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('gnDivision')} *</label>
              <input required name="gnDivision" defaultValue={editingProject?.gnDivision} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('year')}</label>
              <input name="year" defaultValue={editingProject?.year} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('program')} *</label>
              <select name="program" required defaultValue={editingProject?.program || 'Decentralized Budget'} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="Decentralized Budget">{t('decentralizedBudget')}</option>
                <option value="Building Rehabilitation">{t('buildingRehabilitation')}</option>
                <option value="Community Power">{t('communityPower')}</option>
                <option value="Ministries">{t('ministries')}</option>
                <option value="Provincial Councils">{t('provincialCouncils')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('status')} *</label>
              <select name="status" defaultValue={editingProject?.status || 'Not Approved'} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="Not Approved">{t('notApproved')}</option>
                <option value="Approved">{t('approved')}</option>
                <option value="Estimating">{t('estimating')}</option>
                <option value="Procurement">{t('procurement')}</option>
                <option value="Contracted">{t('contracted')}</option>
                <option value="Physical Progress 0-25%">{t('physical0to25')}</option>
                <option value="Physical Progress 26-50%">{t('physical26to50')}</option>
                <option value="Physical Progress 51-75%">{t('physical51to75')}</option>
                <option value="Physical Progress 76-99%">{t('physical76to99')}</option>
                <option value="Work Completed">{t('workCompleted')}</option>
                <option value="Completed">{t('completed')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('allocation')} *</label>
              <input required name="allocation" defaultValue={editingProject?.allocation} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('disbursed')} *</label>
              <input required name="disbursed" defaultValue={editingProject?.disbursed} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('financialProgress')}</label>
              <input name="financialProgress" defaultValue={editingProject?.financialProgress} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('retentionAmount')}</label>
              <input name="retentionAmount" defaultValue={editingProject?.retentionAmount} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('retentionPeriodMonths')}</label>
              <input name="retentionPeriodMonths" defaultValue={editingProject?.retentionPeriodMonths} type="number" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('contractor')}</label>
              <input name="contractor" defaultValue={editingProject?.contractor} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('specialRemarks')}</label>
              <textarea name="specialRemarks" defaultValue={editingProject?.specialRemarks} rows="2" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('startDate')} *</label>
              <input required name="startDate" defaultValue={editingProject?.startDate} type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('endDate')}</label>
              <input name="endDate" defaultValue={editingProject?.endDate} type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <UploadCloud size={16} /> {t('beforePhoto')}
              </label>
              <input name="beforeImageFile" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors" />
              {editingProject?.beforeImage && <p className="text-xs text-emerald-600 mt-2">Current file attached.</p>}
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <UploadCloud size={16} /> {t('afterPhoto')}
              </label>
              <input name="afterImageFile" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors" />
              {editingProject?.afterImage && <p className="text-xs text-emerald-600 mt-2">Current file attached.</p>}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors disabled:opacity-50">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isUploading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm disabled:opacity-50">
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
