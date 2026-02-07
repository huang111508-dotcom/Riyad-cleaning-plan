import React, { useState } from 'react';
import { Department, Role } from '../types';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { saveDepartment, deleteDepartment } from '../services/dataService';
import { translateText } from '../services/geminiService';

interface AdminDeptManagerProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
}

export const AdminDeptManager: React.FC<AdminDeptManagerProps> = ({ isOpen, onClose, departments }) => {
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newRoleNameCn, setNewRoleNameCn] = useState('');
  
  // New Dept State
  const [isCreating, setIsCreating] = useState(false);
  const [newDeptNameCn, setNewDeptNameCn] = useState('');

  const handleCreateDept = async () => {
    if (!newDeptNameCn) return;
    const nameEn = await translateText(newDeptNameCn, 'en');
    const newDept: Department = {
      id: `dept_${Date.now()}`,
      name: { cn: newDeptNameCn, en: nameEn },
      roles: []
    };
    await saveDepartment(newDept);
    setNewDeptNameCn('');
    setIsCreating(false);
  };

  const handleDeleteDept = async (id: string) => {
    if (window.confirm('Delete this department? All associated tasks will be orphaned.')) {
       await deleteDepartment(id);
       if (editingDept?.id === id) setEditingDept(null);
    }
  };

  const handleAddRole = async () => {
    if (!editingDept || !newRoleNameCn) return;
    const nameEn = await translateText(newRoleNameCn, 'en');
    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: { cn: newRoleNameCn, en: nameEn }
    };
    const updatedDept = {
      ...editingDept,
      roles: [...editingDept.roles, newRole]
    };
    await saveDepartment(updatedDept);
    setEditingDept(updatedDept);
    setNewRoleNameCn('');
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!editingDept) return;
    if (!window.confirm('Delete this role?')) return;
    const updatedDept = {
      ...editingDept,
      roles: editingDept.roles.filter(r => r.id !== roleId)
    };
    await saveDepartment(updatedDept);
    setEditingDept(updatedDept);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Department & Role Management</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex gap-4 md:flex-row flex-col">
          {/* List of Departments */}
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase">Departments</h3>
            {departments.map(dept => (
              <div 
                key={dept.id}
                onClick={() => setEditingDept(dept)}
                className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${editingDept?.id === dept.id ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-200 hover:border-teal-300'}`}
              >
                <div>
                  <div className="font-bold text-gray-800">{dept.name.cn}</div>
                  <div className="text-xs text-gray-500">{dept.name.en}</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteDept(dept.id); }}
                  className="text-gray-300 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {isCreating ? (
              <div className="p-3 border border-teal-300 rounded-lg bg-white">
                <input 
                  autoFocus
                  placeholder="Department Name (中文)"
                  className="w-full text-sm border-b border-gray-300 focus:border-teal-500 focus:outline-none mb-2 pb-1"
                  value={newDeptNameCn}
                  onChange={e => setNewDeptNameCn(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                   <button onClick={() => setIsCreating(false)} className="text-xs text-gray-500">Cancel</button>
                   <button onClick={handleCreateDept} className="text-xs bg-teal-600 text-white px-2 py-1 rounded">Save</button>
                </div>
              </div>
            ) : (
               <button 
                onClick={() => setIsCreating(true)}
                className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            )}
          </div>

          {/* Roles Editor */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
            {editingDept ? (
              <>
                 <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                   Roles in {editingDept.name.cn}
                 </h3>
                 <div className="space-y-2 mb-4">
                   {editingDept.roles.map(role => (
                     <div key={role.id} className="bg-white p-2 rounded shadow-sm flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-gray-800">{role.name.cn}</span>
                          <span className="text-xs text-gray-400 ml-2">{role.name.en}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                     </div>
                   ))}
                   {editingDept.roles.length === 0 && (
                     <p className="text-xs text-gray-400 italic">No roles defined.</p>
                   )}
                 </div>

                 <div className="flex gap-2">
                   <input 
                     placeholder="New Role (中文)"
                     className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-teal-500 focus:border-teal-500"
                     value={newRoleNameCn}
                     onChange={e => setNewRoleNameCn(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                   />
                   <button 
                    onClick={handleAddRole}
                    disabled={!newRoleNameCn}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 disabled:opacity-50"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                 </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Select a department to edit roles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
