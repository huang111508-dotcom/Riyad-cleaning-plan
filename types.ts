export type Language = 'cn' | 'en';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface LocalizedText {
  cn: string;
  en: string;
}

export interface Department {
  id: string;
  name: LocalizedText;
  roles: Role[];
}

export interface Role {
  id: string;
  name: LocalizedText;
}

export interface Task {
  id: string;
  deptId: string;
  roleId: string;
  frequency: Frequency;
  title: LocalizedText;
  details: LocalizedText;
  // Scheduling logic
  dayOfWeek?: number; // 1 (Mon) - 7 (Sun), required for Weekly
  weekOfMonth?: number; // 1 - 4, required for Monthly
}

export interface AppState {
  departments: Department[];
  tasks: Task[];
}
