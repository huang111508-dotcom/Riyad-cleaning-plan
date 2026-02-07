import React, { useState, useEffect, useMemo } from 'react';
import { Department, Role, Task, Language, Frequency } from './types';
import { DAYS_OF_WEEK, WEEKS_OF_MONTH } from './constants';
import { AdminTaskModal } from './components/AdminTaskModal';
import { AdminDeptManager } from './components/AdminDeptManager';
import { Settings, Globe, CheckSquare, Edit3, Lock, LogOut, PlusCircle, Building2, AlertTriangle } from 'lucide-react';
import { subscribeToDepartments, subscribeToTasks, saveTask, initializeDataIfEmpty } from './services/dataService';

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
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
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className={`${isTitle ? 'text-lg font-bold text-gray-800' : 'text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'}`}>
      {content || (
        <span className="text-gray-400 italic text-sm">
          {isAdmin ? "Click edit to add content..." : "No content defined."}
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

  // Filters
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 7);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeptManagerOpen, setIsDeptManagerOpen] = useState(false);
  
  // Context for Task Modal
  const [modalContext, setModalContext] = useState<{
    frequency: Frequency;
    task: Task | null;
  } | null>(null);

  // Initialize Data
  useEffect(() => {
    // Safety timeout: If data doesn't load in 4 seconds, show the app anyway
    const safetyTimer = setTimeout(() => {
      console.warn("Data loading timed out, showing empty state.");
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
      // If no dept selected, OR the currently selected dept ID is no longer in the list (deleted/stale)
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
      // Check if current selectedRoleId is valid for this department
      const roleExists = selectedDept.roles.find(r => r.id === selectedRoleId);
      
      // If no role selected OR selected role not found in this department, default to first role
      if (!selectedRoleId || !roleExists) {
        setSelectedRoleId(selectedDept.roles[0].id);
      }
    } else {
      // If department has no roles, clear selection
      setSelectedRoleId('');
    }
  }, [selectedDept, selectedRoleId]);

  // Derived Tasks for Current View
  // We need distinct tasks for Daily, Weekly, Monthly slots
  const getTaskForSlot = (freq: Frequency) => {
    return tasks.find(t => {
      if (t.deptId !== selectedDeptId || t.roleId !== selectedRoleId) return false;
      if (t.frequency !== freq) return false;
      
      if (freq === 'daily') return true; // Daily applies to all
      if (freq === 'weekly') return t.dayOfWeek === selectedDay;
      if (freq === 'monthly') return t.weekOfMonth === selectedWeek && t.dayOfWeek === selectedDay; // Specific to Week + Day
      return false;
    });
  };

  const dailyTask = getTaskForSlot('daily');
  const weeklyTask = getTaskForSlot('weekly');
  const monthlyTask = getTaskForSlot('monthly');

  // Handlers
  const handleEditClick = (freq: Frequency, task: Task | undefined) => {
    if (!isAdminMode) return;
    setModalContext({
      frequency: freq,
      task: task || null
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    const newTask: Task = {
      ...taskData as Task,
      id: taskData.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    await saveTask(newTask);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '8888') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setAdminPassword('');
    } else {
      alert('Incorrect Password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-teal-600 flex-col gap-3">
        <CheckSquare className="w-10 h-10 animate-bounce"/>
        <span className="text-sm font-medium animate-pulse">Loading CleanSync...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-gray-900 font-sans selection:bg-teal-100">
      
      {/* --- HEADER --- */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-4">
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
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-teal-100 hover:text-white"
              >
                <Globe className="w-5 h-5" />
              </button>
              
              {isAdminMode ? (
                <div className="flex items-center gap-2 bg-orange-500/20 rounded-lg p-1 pr-3 border border-orange-500/30">
                   <button 
                    onClick={() => setIsDeptManagerOpen(true)}
                    className="p-1.5 rounded-md hover:bg-orange-500 text-orange-200 hover:text-white transition-colors"
                    title="Manage Departments"
                   >
                     <Building2 className="w-4 h-4" />
                   </button>
                   <span className="text-xs font-bold text-orange-400">ADMIN</span>
                   <button 
                    onClick={() => setIsAdminMode(false)}
                    className="ml-1 text-orange-400 hover:text-white"
                   >
                     <LogOut className="w-4 h-4" />
                   </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-teal-100 hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* --- FILTERS --- */}
          <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="col-span-1 space-y-1">
              <label className="text-[10px] uppercase font-bold text-teal-200 tracking-wider pl-1">
                {lang === 'cn' ? '部门 Department' : 'Department'}
              </label>
              <div className="relative">
                <select 
                  value={selectedDeptId} 
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full bg-black/20 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id} className="text-gray-900 bg-white">
                      {d.name[lang]}
                    </option>
                  ))}
                  {departments.length === 0 && <option>Loading...</option>}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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
                  className="w-full bg-black/20 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all"
                >
                   {selectedDept?.roles?.map(r => (
                    <option key={r.id} value={r.id} className="text-gray-900 bg-white">
                      {r.name[lang]}
                    </option>
                  ))}
                  {(!selectedDept?.roles?.length) && <option className="text-gray-500">No roles</option>}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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
                  className="w-full bg-black/20 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all"
                >
                   {WEEKS_OF_MONTH.map(w => (
                     <option key={w.val} value={w.val} className="text-gray-900 bg-white">
                       {w.label[lang]}
                     </option>
                   ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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
                    className="w-full bg-black/20 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none border border-transparent focus:border-teal-400 transition-all"
                  >
                    {DAYS_OF_WEEK.map(d => (
                       <option key={d.val} value={d.val} className="text-gray-900 bg-white">
                         {d.label[lang]}
                       </option>
                     ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-200">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (6 BOXES) --- */}
      <main className="max-w-3xl mx-auto p-4 space-y-8">
        
        {/* DAILY SECTION */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2 mb-3">
             <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded-md uppercase">Every Day</span>
             <h2 className="text-lg font-bold text-gray-800">{lang === 'cn' ? '日清计划' : 'Daily Plan'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-1">
                <ContentBox 
                  label={lang === 'cn' ? '日清计划内容' : 'Daily Plan Content'}
                  content={dailyTask?.title[lang] || ''}
                  isEmpty={!dailyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('daily', dailyTask)}
                  isTitle
                />
             </div>
             <div className="md:col-span-2">
                <ContentBox 
                  label={lang === 'cn' ? '清洁细则' : 'Cleaning Details'}
                  content={dailyTask?.details[lang] || ''}
                  isEmpty={!dailyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('daily', dailyTask)}
                />
             </div>
          </div>
        </section>

        {/* WEEKLY SECTION */}
        <section className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
           <div className="flex items-center gap-2 mb-3">
             <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-md uppercase">
               {DAYS_OF_WEEK.find(d => d.val === selectedDay)?.label[lang]}
             </span>
             <h2 className="text-lg font-bold text-gray-800">{lang === 'cn' ? '周清计划' : 'Weekly Plan'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-1">
                <ContentBox 
                  label={lang === 'cn' ? '周清计划内容' : 'Weekly Plan Content'}
                  content={weeklyTask?.title[lang] || ''}
                  isEmpty={!weeklyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('weekly', weeklyTask)}
                  isTitle
                />
             </div>
             <div className="md:col-span-2">
                <ContentBox 
                  label={lang === 'cn' ? '清洁细则' : 'Cleaning Details'}
                  content={weeklyTask?.details[lang] || ''}
                  isEmpty={!weeklyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('weekly', weeklyTask)}
                />
             </div>
          </div>
        </section>

        {/* MONTHLY SECTION */}
        <section className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
           <div className="flex items-center gap-2 mb-3">
             <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-md uppercase">
               Week {selectedWeek}
             </span>
             <h2 className="text-lg font-bold text-gray-800">{lang === 'cn' ? '月清计划' : 'Monthly Plan'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-1">
                <ContentBox 
                  label={lang === 'cn' ? '月清计划内容' : 'Monthly Plan Content'}
                  content={monthlyTask?.title[lang] || ''}
                  isEmpty={!monthlyTask}
                  isAdmin={isAdminMode}
                  onEdit={() => handleEditClick('monthly', monthlyTask)}
                  isTitle
                />
             </div>
             <div className="md:col-span-2">
                <ContentBox 
                  label={lang === 'cn' ? '清洁细则' : 'Cleaning Details'}
                  content={monthlyTask?.details[lang] || ''}
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
             <p className="text-sm text-gray-500 mb-4">Enter passcode to manage tasks and departments.</p>
             <input 
               type="password"
               value={adminPassword}
               onChange={e => setAdminPassword(e.target.value)}
               className="w-full border border-gray-300 rounded-lg p-2.5 mb-4 focus:ring-2 focus:ring-teal-500 outline-none"
               placeholder="Passcode"
               autoFocus
             />
             <button type="submit" className="w-full bg-teal-600 text-white rounded-lg py-2.5 font-bold hover:bg-teal-700">
               Login
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
          dayOfWeek={selectedDay}
          weekOfMonth={selectedWeek}
          initialTask={modalContext.task}
        />
      )}

      {/* Department Manager Modal */}
      <AdminDeptManager 
        isOpen={isDeptManagerOpen}
        onClose={() => setIsDeptManagerOpen(false)}
        departments={departments}
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