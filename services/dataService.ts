import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { Department, Task } from '../types';
import { INITIAL_DEPARTMENTS, INITIAL_TASKS } from '../constants';

// Collections
const DEPT_COLLECTION = 'departments';
const TASK_COLLECTION = 'tasks';

// Initialize Data if empty
export const initializeDataIfEmpty = async () => {
  const deptSnapshot = await getDocs(collection(db, DEPT_COLLECTION));
  if (deptSnapshot.empty) {
    console.log("Seeding Initial Departments...");
    for (const dept of INITIAL_DEPARTMENTS) {
      await setDoc(doc(db, DEPT_COLLECTION, dept.id), dept);
    }
  }

  // We can seed tasks, but usually tasks are specific. 
  // Let's seed initial tasks only if absolutely empty for demo purposes
  const taskSnapshot = await getDocs(collection(db, TASK_COLLECTION));
  if (taskSnapshot.empty) {
    console.log("Seeding Initial Tasks...");
    for (const task of INITIAL_TASKS) {
      await setDoc(doc(db, TASK_COLLECTION, task.id), task);
    }
  }
};

// Department Listeners
export const subscribeToDepartments = (callback: (depts: Department[]) => void) => {
  const q = query(collection(db, DEPT_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const depts: Department[] = [];
    snapshot.forEach((doc) => depts.push(doc.data() as Department));
    callback(depts);
  });
};

export const saveDepartment = async (dept: Department) => {
  await setDoc(doc(db, DEPT_COLLECTION, dept.id), dept);
};

export const deleteDepartment = async (deptId: string) => {
  await deleteDoc(doc(db, DEPT_COLLECTION, deptId));
};

// Task Listeners (We can subscribe to all and filter client side for this scale, or query)
export const subscribeToTasks = (callback: (tasks: Task[]) => void) => {
  const q = query(collection(db, TASK_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => tasks.push(doc.data() as Task));
    callback(tasks);
  });
};

export const saveTask = async (task: Task) => {
  await setDoc(doc(db, TASK_COLLECTION, task.id), task);
};

export const deleteTask = async (taskId: string) => {
  await deleteDoc(doc(db, TASK_COLLECTION, taskId));
};
