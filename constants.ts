import { Department, Task } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_kitchen',
    name: { cn: '后厨', en: 'Kitchen' },
    roles: [
      { id: 'role_chef', name: { cn: '厨师', en: 'Chef' } },
      { id: 'role_dishwasher', name: { cn: '洗碗工', en: 'Dishwasher' } },
    ],
  },
  {
    id: 'dept_front',
    name: { cn: '前厅', en: 'Front of House' },
    roles: [
      { id: 'role_waiter', name: { cn: '服务员', en: 'Server' } },
      { id: 'role_manager', name: { cn: '经理', en: 'Manager' } },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    deptId: 'dept_kitchen',
    roleId: 'role_chef',
    frequency: 'daily',
    title: { cn: '清洁灶台', en: 'Clean Stove Tops' },
    details: { cn: '使用去油剂擦拭所有灶头和台面，确保无油渍残留。', en: 'Wipe down all burners and surfaces with degreaser, ensuring no grease residue remains.' },
  },
  {
    id: 'task_2',
    deptId: 'dept_kitchen',
    roleId: 'role_chef',
    frequency: 'weekly',
    dayOfWeek: 2, // Tuesday
    title: { cn: '深度清洁炸炉', en: 'Deep Clean Fryers' },
    details: { cn: '排干炸油，清洗加热管，更换新油。', en: 'Drain oil, clean heating elements, and replace with fresh oil.' },
  },
  {
    id: 'task_3',
    deptId: 'dept_kitchen',
    roleId: 'role_chef',
    frequency: 'monthly',
    weekOfMonth: 4,
    title: { cn: '清洁排烟罩', en: 'Clean Exhaust Hoods' },
    details: { cn: '拆卸挡板，使用强力除油剂浸泡清洗。', en: 'Remove baffles and soak in heavy-duty degreaser.' },
  },
  {
    id: 'task_4',
    deptId: 'dept_front',
    roleId: 'role_waiter',
    frequency: 'daily',
    title: { cn: '擦拭桌椅', en: 'Wipe Tables and Chairs' },
    details: { cn: '使用消毒水擦拭所有顾客用餐区域。', en: 'Wipe down all dining areas with disinfectant.' },
  },
];

export const DAYS_OF_WEEK = [
  { val: 1, label: { cn: '星期一', en: 'Monday' } },
  { val: 2, label: { cn: '星期二', en: 'Tuesday' } },
  { val: 3, label: { cn: '星期三', en: 'Wednesday' } },
  { val: 4, label: { cn: '星期四', en: 'Thursday' } },
  { val: 5, label: { cn: '星期五', en: 'Friday' } },
  { val: 6, label: { cn: '星期六', en: 'Saturday' } },
  { val: 7, label: { cn: '星期日', en: 'Sunday' } },
];

export const WEEKS_OF_MONTH = [
  { val: 1, label: { cn: '第一周', en: 'Week 1' } },
  { val: 2, label: { cn: '第二周', en: 'Week 2' } },
  { val: 3, label: { cn: '第三周', en: 'Week 3' } },
  { val: 4, label: { cn: '第四周', en: 'Week 4' } },
];
