import React, { Component, useState, useEffect, useMemo, ReactNode } from 'react';
import { Department, Role, Task, Language, Frequency } from './types';
import { DAYS_OF_WEEK, WEEKS_OF_MONTH } from './constants';
import { AdminTaskModal } from './components/AdminTaskModal';
import { AdminDeptManager } from './components/AdminDeptManager';
import { ExcelManagerModal } from './components/ExcelManagerModal';
import { 
  Settings, CheckSquare, Edit3, Lock, LogOut, PlusCircle, Building2, 
  AlertTriangle, RotateCcw, Calendar, CheckCircle2, Cloud, Sparkles, FileSpreadsheet
} from 'lucide-react';
import { 
  subscribeToDepartments, subscribeToTasks, saveTask, 
  initializeDataIfEmpty, restoreAllCloudData 
} from './services/dataService';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 max-w-md bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {this.state.error?.message}
          </p>
          <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg">
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Component for a single "Box" (Title or Details)
const ContentBox: React.FC<{
  label: string;
  content: string;
  isEmpty: boolean;
  isAdmin: boolean;
  onEdit: () => void;
  isTitle?: boolean;
}> = ({ label, content, isEmpty, isAdmin, onEdit, isTitle }) => (
  <div 
    className={`relative group border rounded-xl p-4 transition-all duration-200 ${isEmpty ? 'bg-gray-50 border-dashed border-gray-300' : 'bg-white border-gray-200 shadow-sm'}`}
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      {isAdmin && (
        <button 
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full text-teal-600"
          title="Edit"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-normal">
      {content || (
        <span className="text-gray-400 italic text-sm">
          {isAdmin ? "点击右上角编辑添加内容..." : "暂无内容 (No content defined)"}
        </span>
      )}
    </div>
    {/* Overlay for quick edit access on empty mobile */}
    {isAdmin && isEmpty && (
      <button 
        onClick={onEdit} 
        className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50/50 transition-colors"
      >
        <PlusCircle className="w-8 h-8 opacity-20" />
      </button>
    )}
  </div>
);

const AppLogo = () => (
  <svg className="w-12 h-12 rounded-lg shadow-md border-2 border-green-500/50 bg-green-600 flex-shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#16a34a" /> 
    <text x="50" y="45" fontSize="24" fontWeight="900" textAnchor="middle" fill="white" fontFamily="sans-serif">Riyadh</text>
    <text x="50" y="75" fontSize="24" fontWeight="900" textAnchor="middle" fill="white" fontFamily="sans-serif">clean</text>
  </svg>
);

const MainApp: React.FC = () => {
  // Data State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [lang, setLang] = useState<Language>('cn');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 7);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeptManagerOpen, setIsDeptManagerOpen] = useState(false);
  const [isExcelManagerOpen, setIsExcelManagerOpen] = useState(false);
  
  // Context for Task Modal
  const [modalContext, setModalContext] = useState<{
    frequency: Frequency;
    task: Task | null;
    dayOfWeek?: number;
    weekOfMonth?: number;
  } | null>(null);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Initialize Data
  useEffect(() => {
    // Safety timeout: If data doesn't load in 4 seconds, show the app anyway
    const safetyTimer = setTimeout(() => {
      console.warn("Data loading timed out, showing app state.");
      setLoading(false);
    }, 4000);

    initializeDataIfEmpty();
    
    const unsubDept = subscribeToDepartments((depts) => {
      setDepartments(depts);
      setLoading(false);
      clearTimeout(safetyTimer);
    });
    
    const unsubTasks = subscribeToTasks((t) => setTasks(t));
    
    return () => {
      unsubDept();
      unsubTasks();
      clearTimeout(safetyTimer);
    };
  }, []);

  // Initialize and Validate Selection Defaults
  useEffect(() => {
    if (departments.length > 0) {
      const isValid = departments.find(d => d.id === selectedDeptId);
      if (!selectedDeptId || !isValid) {
        setSelectedDeptId(departments[0].id);
      }
    }
  }, [departments, selectedDeptId]);

  // Derived selectedDept
  const selectedDept = departments.find(d => d.id === selectedDeptId);

  // Auto-select Role Logic
  useEffect(() => {
    if (selectedDept && selectedDept.roles && selectedDept.roles.length > 0) {
      const roleExists = selectedDept.roles.find(r => r.id === selectedRoleId);
      if (!selectedRoleId || !roleExists) {
        setSelectedRoleId(selectedDept.roles[0].id);
      }
    } else {
      setSelectedRoleId('');
    }
  }, [selectedDept, selectedRoleId]);

  // Derived Tasks for Current Selected Department & Role:
  // 1. Daily Task for current role
  const dailyTask = useMemo(() => {
    return tasks.find(t => t.deptId === selectedDeptId && t.roleId === selectedRoleId && t.frequency === 'daily');
  }, [tasks, selectedDeptId, selectedRoleId]);

  // 2. Weekly Task for current role
  const weeklyTask = useMemo(() => {
    return tasks.find(t => t.deptId === selectedDeptId && t.roleId === selectedRoleId && t.frequency === 'weekly');
  }, [tasks, selectedDeptId, selectedRoleId]);

  // 3. Monthly Task for current role
  const monthlyTask = useMemo(() => {
    return tasks.find(t => t.deptId === selectedDeptId && t.roleId === selectedRoleId && t.frequency === 'monthly');
  }, [tasks, selectedDeptId, selectedRoleId]);

  // Check if current day/week matches the scheduled task
  const isWeeklyToday = Boolean(weeklyTask && weeklyTask.dayOfWeek === selectedDay);
  const isMonthlyToday = Boolean(monthlyTask && monthlyTask.weekOfMonth === selectedWeek && monthlyTask.dayOfWeek === selectedDay);

  // Handlers
  const handleEditClick = (freq: Frequency, task: Task | undefined) => {
    if (!isAdminMode) return;
    setModalContext({
      frequency: freq,
      task: task || null,
      dayOfWeek: task?.dayOfWeek || selectedDay,
      weekOfMonth: task?.weekOfMonth || selectedWeek,
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    const newTask: Task = {
      ...taskData as Task,
      id: taskData.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    await saveTask(newTask);
    showToast(lang === 'cn' ? '计划保存成功！' : 'Plan saved successfully!');
  };

  // Restore Master Cleaning Plan directly to Cloud Firestore
  const handleRestoreCloudData = async () => {
    const confirmed = window.confirm(
      lang === 'cn'
        ? '确定要恢复云端完整的预设清洁计划吗？\n\n该操作将确保云端完整包含所有 6 个部门以及 36 项标准日清、周清和月清清洁计划，不会丢失任何标准配置。'
        : 'Are you sure you want to restore all 6 departments and 36 standard cleaning tasks to the cloud?'
    );
    if (!confirmed) return;

    try {
      setIsRestoring(true);
      await restoreAllCloudData();
      showToast(lang === 'cn' ? '✅ 云端清洁计划已成功恢复！（6个部门 · 36项计划）' : '✅ Cloud cleaning plan successfully restored! (6 departments · 36 tasks)');
    } catch (err: any) {
      console.error("Restore failed:", err);
      alert((lang === 'cn' ? '恢复失败: ' : 'Restore failed: ') + (err?.message || '未知错误'));
    } finally {
      setIsRestoring(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '111508') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setAdminPassword('');
      showToast(lang === 'cn' ? '已进入管理员模式' : 'Admin mode enabled');
    } else {
      alert('Incorrect Password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-teal-600 flex-col gap-3">
        <CheckSquare className="w-10 h-10 animate-bounce"/>
        <span className="text-sm font-medium animate-pulse">
          {lang === 'cn' ? '正在连接云端并同步清洁计划...' : 'Connecting to Cloud & Syncing...'}
        </span>
      </div>
    );
  }

  const selectedDayObj = DAYS_OF_WEEK.find(d => d.val === selectedDay);
  const selectedWeekObj = WEEKS_OF_MONTH.find(w => w.val === selectedWeek);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-gray-900 font-sans selection:bg-teal-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-teal-800 text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-teal-600 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <AppLogo />
              <div>
                <h1 className="text-xl font-black leading-none tracking-tight">Riyadh Clean</h1>
                <p className="text-xs text-teal-200 mt-0.5 opacity-90 font-medium">
                  {lang === 'cn' ? '门店清洁智能管理系统' : 'Store Cleaning Management'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')}
                className="px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors text-white font-bold text-xs border border-white/20 tracking-wide"
              >
                {lang === 'cn' ? 'English' : '中文'}
              </button>
              
              {isAdminMode ? (
                <div className="flex items-center gap-1.5 bg-orange-500/20 rounded-lg p-1 pr-2 border border-orange-500/30">
                  <button 
                    onClick={() => setIsDeptManagerOpen(true)}
                    className="p-1.5 rounded-md hover:bg-orange-500 text-orange-200 hover:text-white transition-colors"
                    title={lang === 'cn' ? '管理部门与岗位' : 'Manage Departments'}
                  >
                    <Building2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsExcelManagerOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold transition-all shadow-sm"
                    title={lang === 'cn' ? 'Excel 模版下载与上传同步' : 'Excel Plan Manager'}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                    <span>{lang === 'cn' ? 'Excel计划' : 'Excel'}</span>
                  </button>
                  <button
                    onClick={handleRestoreCloudData}
                    disabled={isRestoring}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-orange-600/80 hover:bg-orange-600 text-white text-[11px] font-bold transition-all disabled:opacity-50"
                    title={lang === 'cn' ? '重置为标准预设清洁计划' : 'Reset Master Plan'}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                    <span>{lang === 'cn' ? '标准重置' : 'Reset'}</span>
                  </button>
                  <span className="text-[10px] font-black text-orange-400 px-1">ADMIN</span>
                  <button 
                    onClick={() => setIsAdminMode(false)}
                    className="ml-1 text-orange-400 hover:text-white"
                    title={lang === 'cn' ? '退出管理员' : 'Exit Admin'}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-teal-100 hover:text-white"
                  title="Admin Login"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Cloud Sync Status Pill */}
          <div className="flex items-center justify-between text-[11px] text-teal-200/90 mb-3 bg-black/15 px-3 py-1.5 rounded-lg border border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <span>
                {lang === 'cn' 
                  ? `云端数据库已同步: ${departments.length} 个部门 · ${tasks.length} 项清洁计划` 
                  : `Cloud Synced: ${departments.length} Depts · ${tasks.length} Tasks`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (!isAdminMode) {
                    setShowLoginModal(true);
                  } else {
                    setIsExcelManagerOpen(true);
                  }
                }}
                className="text-[11px] text-emerald-300 hover:text-white font-semibold underline flex items-center gap-1"
                title={lang === 'cn' ? '下载Excel模版并在表格中修改上传' : 'Excel Template & Upload'}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{lang === 'cn' ? 'Excel模版与上传' : 'Excel Template & Upload'}</span>
              </button>
              {!isAdminMode && (
                <button 
                  onClick={handleRestoreCloudData}
                  disabled={isRestoring}
                  className="text-[11px] text-teal-200 hover:text-white underline flex items-center gap-1 disabled:opacity-50"
                  title={lang === 'cn' ? '恢复标准预设' : 'Restore Master'}
                >
                  <RotateCcw className={`w-3 h-3 ${isRestoring ? 'animate-spin' : ''}`} />
                  <span>{lang === 'cn' ? '标准预设' : 'Master'}</span>
                </button>
              )}
            </div>
          </div>

          {/* --- FILTERS --- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/10 p-3 rounded-xl border border-white/15 backdrop-blur-md">
            <div className="col-span-1 space-y-1">
              <label className="text-[10px] uppercase font-bold text-teal-200 tracking-wider pl-1">
                {lang === 'cn' ? '部门 Department' : 'Department'}
              </label>
              <div className="relative">
                <select 
                  value={selectedDeptId} 
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full bg-black/25 text-white text-xs sm:text-sm rounded-lg pl-2.5 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all font-medium truncate"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id} className="text-gray-900 bg-white">
                      {d.name[lang] || d.name['cn']}
                    </option>
                  ))}
                  {departments.length === 0 && <option>Loading...</option>}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                  <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 space-y-1">
              <label className="text-[10px] uppercase font-bold text-teal-200 tracking-wider pl-1">
                 {lang === 'cn' ? '岗位 Role' : 'Role'}
              </label>
              <div className="relative">
                <select 
                  value={selectedRoleId} 
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full bg-black/25 text-white text-xs sm:text-sm rounded-lg pl-2.5 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all font-medium truncate"
                >
                   {selectedDept?.roles?.map(r => (
                    <option key={r.id} value={r.id} className="text-gray-900 bg-white">
                      {r.name[lang] || r.name['cn']}
                    </option>
                  ))}
                  {(!selectedDept?.roles?.length) && <option className="text-gray-500">No roles</option>}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                  <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-1">
              <label className="text-[10px] uppercase font-bold text-teal-200 tracking-wider pl-1">
                {lang === 'cn' ? '周次 Week' : 'Week'}
              </label>
              <div className="relative">
                <select 
                  value={selectedWeek} 
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="w-full bg-black/25 text-white text-xs sm:text-sm rounded-lg pl-2.5 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all font-medium"
                >
                   {WEEKS_OF_MONTH.map(w => (
                     <option key={w.val} value={w.val} className="text-gray-900 bg-white">
                       {w.label[lang] || w.label['cn']}
                     </option>
                   ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                  <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 space-y-1">
               <label className="text-[10px] uppercase font-bold text-teal-200 tracking-wider pl-1">
                {lang === 'cn' ? '星期 Day' : 'Day'}
               </label>
               <div className="relative">
                  <select 
                    value={selectedDay} 
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full bg-black/25 text-white text-xs sm:text-sm rounded-lg pl-2.5 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all font-medium"
                  >
                    {DAYS_OF_WEEK.map(d => (
                       <option key={d.val} value={d.val} className="text-gray-900 bg-white">
                         {d.label[lang] || d.label['cn']}
                       </option>
                     ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                    <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (DAILY, WEEKLY, MONTHLY) --- */}
      <main className="max-w-3xl mx-auto p-4 space-y-8">
        
        {/* DAILY SECTION */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline" />
                {lang === 'cn' ? '每日必做' : 'Every Day'}
              </span>
              <h2 className="text-lg font-bold text-gray-800">{lang === 'cn' ? '日清计划' : 'Daily Plan'}</h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {lang === 'cn' ? '日清频次: 每天营业结束前完成' : 'Daily: Complete before closing'}
            </span>
          </div>

          <div className="flex flex-col gap-4">
             <div className="w-full">
                <ContentBox 
                  label={lang === 'cn' ? '日清计划内容' : 'Daily Plan Content'}
                  content={dailyTask?.title[lang] || dailyTask?.title['cn'] || ''}
                  isEmpty={!dailyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('daily', dailyTask)}
                  isTitle
                />
             </div>
             <div className="w-full">
                <ContentBox 
                  label={lang === 'cn' ? '清洁细则' : 'Cleaning Details'}
                  content={dailyTask?.details[lang] || dailyTask?.details['cn'] || ''}
                  isEmpty={!dailyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('daily', dailyTask)}
                />
             </div>
          </div>
        </section>

        {/* WEEKLY SECTION */}
        <section className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
           <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
             <div className="flex items-center gap-2">
               <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase flex items-center gap-1 ${
                 isWeeklyToday ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400' : 'bg-orange-100 text-orange-800'
               }`}>
                 <Calendar className="w-3.5 h-3.5 inline" />
                 {weeklyTask?.dayOfWeek 
                   ? (lang === 'cn' ? `每周${DAYS_OF_WEEK.find(d => d.val === weeklyTask.dayOfWeek)?.label.cn?.replace('星期', '')}` : `Every ${DAYS_OF_WEEK.find(d => d.val === weeklyTask.dayOfWeek)?.label.en}`)
                   : (selectedDayObj?.label[lang] || selectedDayObj?.label['cn'])}
               </span>
               <h2 className="text-lg font-bold text-gray-800">{lang === 'cn' ? '周清计划' : 'Weekly Plan'}</h2>
               {weeklyTask && (
                 <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                   isWeeklyToday ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                 }`}>
                   {isWeeklyToday 
                     ? (lang === 'cn' ? '★ 今日执行' : '★ Today') 
                     : (lang === 'cn' ? `排期: 星期${DAYS_OF_WEEK.find(d => d.val === weeklyTask.dayOfWeek)?.label.cn?.replace('星期', '')}` : `Scheduled: ${DAYS_OF_WEEK.find(d => d.val === weeklyTask.dayOfWeek)?.label.en}`)}
                 </span>
               )}
             </div>

             {weeklyTask?.dayOfWeek && weeklyTask.dayOfWeek !== selectedDay && (
               <button
                 onClick={() => setSelectedDay(weeklyTask.dayOfWeek!)}
                 className="text-xs text-orange-600 hover:text-orange-800 hover:underline font-semibold flex items-center gap-1"
               >
                 {lang === 'cn' 
                   ? `切至 ${DAYS_OF_WEEK.find(d => d.val === weeklyTask.dayOfWeek)?.label.cn}` 
                   : `Go to ${DAYS_OF_WEEK.find(d => d.val === weeklyTask.dayOfWeek)?.label.en}`}
               </button>
             )}
          </div>

          <div className="flex flex-col gap-4">
             <div className="w-full">
                <ContentBox 
                  label={lang === 'cn' ? '周清计划内容' : 'Weekly Plan Content'}
                  content={weeklyTask?.title[lang] || weeklyTask?.title['cn'] || ''}
                  isEmpty={!weeklyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('weekly', weeklyTask)}
                  isTitle
                />
             </div>
             <div className="w-full">
                <ContentBox 
                  label={lang === 'cn' ? '清洁细则' : 'Cleaning Details'}
                  content={weeklyTask?.details[lang] || weeklyTask?.details['cn'] || ''}
                  isEmpty={!weeklyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('weekly', weeklyTask)}
                />
             </div>
          </div>
        </section>

        {/* MONTHLY SECTION */}
        <section className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
           <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
             <div className="flex items-center gap-2">
               <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase flex items-center gap-1 ${
                 isMonthlyToday ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400' : 'bg-purple-100 text-purple-800'
               }`}>
                 <Calendar className="w-3.5 h-3.5 inline" />
                 {monthlyTask?.weekOfMonth && monthlyTask?.dayOfWeek
                   ? (lang === 'cn' 
                       ? `第${monthlyTask.weekOfMonth}周 星期${DAYS_OF_WEEK.find(d => d.val === monthlyTask.dayOfWeek)?.label.cn?.replace('星期', '')}` 
                       : `Wk ${monthlyTask.weekOfMonth}, ${DAYS_OF_WEEK.find(d => d.val === monthlyTask.dayOfWeek)?.label.en}`)
                   : `Week ${selectedWeek}`}
               </span>
               <h2 className="text-lg font-bold text-gray-800">{lang === 'cn' ? '月清计划' : 'Monthly Plan'}</h2>
               {monthlyTask && (
                 <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                   isMonthlyToday ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                 }`}>
                   {isMonthlyToday 
                     ? (lang === 'cn' ? '★ 本周今日执行' : '★ Today') 
                     : (lang === 'cn' 
                         ? `排期: 第${monthlyTask.weekOfMonth}周 星期${DAYS_OF_WEEK.find(d => d.val === monthlyTask.dayOfWeek)?.label.cn?.replace('星期', '')}` 
                         : `Scheduled: Wk ${monthlyTask.weekOfMonth}, ${DAYS_OF_WEEK.find(d => d.val === monthlyTask.dayOfWeek)?.label.en}`)}
                 </span>
               )}
             </div>

             {monthlyTask?.weekOfMonth && monthlyTask?.dayOfWeek && (monthlyTask.weekOfMonth !== selectedWeek || monthlyTask.dayOfWeek !== selectedDay) && (
               <button
                 onClick={() => {
                   if (monthlyTask.weekOfMonth) setSelectedWeek(monthlyTask.weekOfMonth);
                   if (monthlyTask.dayOfWeek) setSelectedDay(monthlyTask.dayOfWeek);
                 }}
                 className="text-xs text-purple-600 hover:text-purple-800 hover:underline font-semibold flex items-center gap-1"
               >
                 {lang === 'cn' 
                   ? `切至 第${monthlyTask.weekOfMonth}周${DAYS_OF_WEEK.find(d => d.val === monthlyTask.dayOfWeek)?.label.cn}` 
                   : `Go to Wk ${monthlyTask.weekOfMonth} ${DAYS_OF_WEEK.find(d => d.val === monthlyTask.dayOfWeek)?.label.en}`}
               </button>
             )}
          </div>

          <div className="flex flex-col gap-4">
             <div className="w-full">
                <ContentBox 
                  label={lang === 'cn' ? '月清计划内容' : 'Monthly Plan Content'}
                  content={monthlyTask?.title[lang] || monthlyTask?.title['cn'] || ''}
                  isEmpty={!monthlyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('monthly', monthlyTask)}
                  isTitle
                />
             </div>
             <div className="w-full">
                <ContentBox 
                  label={lang === 'cn' ? '清洁细则' : 'Cleaning Details'}
                  content={monthlyTask?.details[lang] || monthlyTask?.details['cn'] || ''}
                  isEmpty={!monthlyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('monthly', monthlyTask)}
                />
             </div>
          </div>
        </section>
      </main>

      {/* --- MODALS --- */}
      
      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleAdminLogin} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Admin Access</h3>
                <button type="button" onClick={() => setShowLoginModal(false)}><XIcon/></button>
             </div>
             <p className="text-sm text-gray-500 mb-4">
               {lang === 'cn' ? '输入管理员密码以编辑计划或恢复云端数据。' : 'Enter passcode to manage tasks and departments.'}
             </p>
             <input 
               type="password"
               value={adminPassword}
               onChange={e => setAdminPassword(e.target.value)}
               className="w-full border border-gray-300 rounded-lg p-2.5 mb-4 focus:ring-2 focus:ring-teal-500 outline-none"
               placeholder="Passcode"
               autoFocus
             />
             <button type="submit" className="w-full bg-teal-600 text-white rounded-lg py-2.5 font-bold hover:bg-teal-700">
               {lang === 'cn' ? '登 录' : 'Login'}
             </button>
          </form>
        </div>
      )}

      {/* Task Edit Modal */}
      {modalContext && (
        <AdminTaskModal 
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          deptId={selectedDeptId}
          roleId={selectedRoleId}
          frequency={modalContext.frequency}
          dayOfWeek={modalContext.dayOfWeek}
          weekOfMonth={modalContext.weekOfMonth}
          initialTask={modalContext.task}
        />
      )}

      {/* Department Manager Modal */}
      <AdminDeptManager 
        isOpen={isDeptManagerOpen}
        onClose={() => setIsDeptManagerOpen(false)}
        departments={departments}
        onOpenExcelManager={() => setIsExcelManagerOpen(true)}
      />

      {/* Excel Manager Modal */}
      <ExcelManagerModal 
        isOpen={isExcelManagerOpen}
        onClose={() => setIsExcelManagerOpen(false)}
        departments={departments}
        tasks={tasks}
        lang={lang}
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <MainApp />
  </ErrorBoundary>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default App;
