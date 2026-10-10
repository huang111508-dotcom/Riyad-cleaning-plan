import React, { useState, useEffect } from 'react';
import { Task, Frequency } from '../types';
import { X, Loader2, Sparkles, Calendar } from 'lucide-react';
import { translateText } from '../services/geminiService';
import { DAYS_OF_WEEK, WEEKS_OF_MONTH } from '../constants';

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
  const [taskDayOfWeek, setTaskDayOfWeek] = useState<number>(dayOfWeek || 1);
  const [taskWeekOfMonth, setTaskWeekOfMonth] = useState<number>(weekOfMonth || 1);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitleCn(initialTask.title.cn);
      setTitleEn(initialTask.title.en);
      setDetailsCn(initialTask.details.cn);
      setDetailsEn(initialTask.details.en);
      if (initialTask.dayOfWeek) setTaskDayOfWeek(initialTask.dayOfWeek);
      if (initialTask.weekOfMonth) setTaskWeekOfMonth(initialTask.weekOfMonth);
    } else {
      setTitleCn('');
      setTitleEn('');
      setDetailsCn('');
      setDetailsEn('');
      setTaskDayOfWeek(dayOfWeek || 1);
      setTaskWeekOfMonth(weekOfMonth || 1);
    }
  }, [initialTask, isOpen, dayOfWeek, weekOfMonth]);

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
      dayOfWeek: frequency !== 'daily' ? taskDayOfWeek : undefined,
      weekOfMonth: frequency === 'monthly' ? taskWeekOfMonth : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 flex-shrink-0">
          <div>
             <h2 className="text-xl font-bold text-gray-800">
               {initialTask ? '编辑计划 (Edit Plan)' : '创建计划 (Create Plan)'}
             </h2>
             <p className="text-xs text-gray-500 uppercase mt-1">
               {frequency === 'daily' && '日清计划 • Daily Plan (Everyday)'}
               {frequency === 'weekly' && `周清计划 • Weekly Plan (${DAYS_OF_WEEK.find(d => d.val === taskDayOfWeek)?.label.cn || `Day ${taskDayOfWeek}`})`}
               {frequency === 'monthly' && `月清计划 • Monthly Plan (${WEEKS_OF_MONTH.find(w => w.val === taskWeekOfMonth)?.label.cn || `Week ${taskWeekOfMonth}`}, ${DAYS_OF_WEEK.find(d => d.val === taskDayOfWeek)?.label.cn || `Day ${taskDayOfWeek}`})`}
             </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Schedule Configuration for Weekly / Monthly */}
          {frequency !== 'daily' && (
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wide">
                <Calendar className="w-3.5 h-3.5" />
                <span>执行时间设置 (Schedule Setting)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {frequency === 'monthly' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">执行周次 (Week)</label>
                    <select
                      value={taskWeekOfMonth}
                      onChange={(e) => setTaskWeekOfMonth(Number(e.target.value))}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white text-gray-800 focus:ring-1 focus:ring-teal-500"
                    >
                      {WEEKS_OF_MONTH.map(w => (
                        <option key={w.val} value={w.val}>{w.label.cn} ({w.label.en})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={frequency === 'weekly' ? 'col-span-2' : ''}>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">执行星期 (Day)</label>
                  <select
                    value={taskDayOfWeek}
                    onChange={(e) => setTaskDayOfWeek(Number(e.target.value))}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white text-gray-800 focus:ring-1 focus:ring-teal-500"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d.val} value={d.val}>{d.label.cn} ({d.label.en})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

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
               <label className="block text-xs font-medium text-gray-500 mb-1">计划内容 (Plan Content - CN)</label>
               <textarea 
                 value={titleCn}
                 onChange={(e) => setTitleCn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 h-48 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                 placeholder="例如：清洁灶台"
                 required
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Plan Content (EN)</label>
               <textarea 
                 value={titleEn}
                 onChange={(e) => setTitleEn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 h-48 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                 placeholder="e.g., Clean Stove Tops"
               />
             </div>

             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">清洁细则 (Cleaning Details - CN)</label>
               <textarea 
                 value={detailsCn}
                 onChange={(e) => setDetailsCn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 h-48 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                 placeholder="详细的清洁步骤..."
                 required
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Cleaning Details (EN)</label>
               <textarea 
                 value={detailsEn}
                 onChange={(e) => setDetailsEn(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2.5 h-48 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                 placeholder="Detailed steps..."
               />
             </div>
          </div>
        </form>

        <div className="p-4 border-t bg-gray-50 flex space-x-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            取消 Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-teal-600 rounded-xl text-white hover:bg-teal-700 font-medium shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98]"
          >
            保存 Save
          </button>
        </div>
      </div>
    </div>
  );
};