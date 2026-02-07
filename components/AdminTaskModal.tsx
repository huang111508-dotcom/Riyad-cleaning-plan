import React, { useState, useEffect } from 'react';
import { Task, Frequency } from '../types';
import { X, Loader2, Sparkles } from 'lucide-react';
import { translateText } from '../services/geminiService';

interface AdminTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  // Context is passed in to lock these fields
  deptId: string;
  roleId: string;
  frequency: Frequency;
  dayOfWeek?: number;
  weekOfMonth?: number;
  initialTask?: Task | null;
}

export const AdminTaskModal: React.FC<AdminTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  deptId,
  roleId,
  frequency,
  dayOfWeek,
  weekOfMonth,
  initialTask,
}) => {
  const [titleCn, setTitleCn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [detailsCn, setDetailsCn] = useState('');
  const [detailsEn, setDetailsEn] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitleCn(initialTask.title.cn);
      setTitleEn(initialTask.title.en);
      setDetailsCn(initialTask.details.cn);
      setDetailsEn(initialTask.details.en);
    } else {
      setTitleCn('');
      setTitleEn('');
      setDetailsCn('');
      setDetailsEn('');
    }
  }, [initialTask, isOpen]);

  const handleTranslate = async () => {
    if (!titleCn && !detailsCn) return;
    setIsTranslating(true);
    try {
      if (titleCn) {
        const transTitle = await translateText(titleCn, 'en');
        setTitleEn(transTitle);
      }
      if (detailsCn) {
        const transDetails = await translateText(detailsCn, 'en');
        setDetailsEn(transDetails);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialTask?.id, // If undefined, App will generate new ID
      deptId,
      roleId,
      frequency,
      title: { cn: titleCn, en: titleEn },
      details: { cn: detailsCn, en: detailsEn },
      dayOfWeek,
      weekOfMonth,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div>
             <h2 className="text-xl font-bold text-gray-800">
               {initialTask ? '编辑计划 (Edit Plan)' : '创建计划 (Create Plan)'}
             </h2>
             <p className="text-xs text-gray-500 uppercase mt-1">
               {frequency} • {frequency === 'weekly' ? `Day ${dayOfWeek}` : frequency === 'monthly' ? `Week ${weekOfMonth}, Day ${dayOfWeek}` : 'All Days'}
             </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
             <span className="text-sm font-bold text-gray-900">内容详情 Content</span>
             <button
               type="button"
               onClick={handleTranslate}
               disabled={isTranslating}
               className="flex items-center text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full hover:bg-teal-100 disabled:opacity-50 transition-colors"
             >
               {isTranslating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
               Auto Translate
             </button>
          </div>

          <div className="space-y-4">
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">计划标题 (Plan Title - CN)</label>
               <input 
                 type="text" 
                 value={titleCn}
                 onChange={(e) => setTitleCn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                 placeholder="例如：清洁灶台"
                 required
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Plan Title (EN)</label>
               <input 
                 type="text" 
                 value={titleEn}
                 onChange={(e) => setTitleEn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                 placeholder="e.g., Clean Stove Tops"
               />
             </div>

             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">清洁细则 (Cleaning Details - CN)</label>
               <textarea 
                 value={detailsCn}
                 onChange={(e) => setDetailsCn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 h-32 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                 placeholder="详细的清洁步骤..."
                 required
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Cleaning Details (EN)</label>
               <textarea 
                 value={detailsEn}
                 onChange={(e) => setDetailsEn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 h-32 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                 placeholder="Detailed steps..."
               />
             </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              取消 Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-teal-600 rounded-xl text-white hover:bg-teal-700 font-medium shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98]"
            >
              保存 Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
