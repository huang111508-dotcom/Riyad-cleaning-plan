import React from 'react';
import { Task, Language } from '../types';
import { CheckCircle2, Clock, Calendar, Pencil, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  lang: Language;
  isAdmin?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, lang, isAdmin, onEdit, onDelete }) => {
  const getFrequencyIcon = () => {
    switch (task.frequency) {
      case 'daily': return <Clock className="w-4 h-4 text-teal-600" />;
      case 'weekly': return <Calendar className="w-4 h-4 text-orange-600" />;
      case 'monthly': return <Calendar className="w-4 h-4 text-purple-600" />;
    }
  };

  const getFrequencyLabel = () => {
    if (lang === 'cn') {
      switch (task.frequency) {
        case 'daily': return '日清';
        case 'weekly': return '周清';
        case 'monthly': return '月清';
      }
    } else {
      switch (task.frequency) {
        case 'daily': return 'Daily';
        case 'weekly': return 'Weekly';
        case 'monthly': return 'Monthly';
      }
    }
  };

  const borderColor = 
    task.frequency === 'daily' ? 'border-l-teal-500' :
    task.frequency === 'weekly' ? 'border-l-orange-500' :
    'border-l-purple-500';

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 border-l-4 ${borderColor} relative group transition-transform hover:-translate-y-0.5`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
            {getFrequencyIcon()}
            {getFrequencyLabel()}
          </span>
        </div>
        {isAdmin && (
          <div className="flex space-x-2">
             <button 
              onClick={() => onEdit && onEdit(task)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete && onDelete(task.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {task.title[lang]}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {task.details[lang]}
      </p>
    </div>
  );
};
