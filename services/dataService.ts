import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where, onSnapshot, writeBatch } from 'firebase/firestore';
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

// Explicitly restore all cloud data from standard supermarket schedule
export const restoreAllCloudData = async () => {
  console.log("Restoring All Cloud Departments and Tasks from master schedule...");
  for (const dept of INITIAL_DEPARTMENTS) {
    await setDoc(doc(db, DEPT_COLLECTION, dept.id), dept);
  }
  for (const task of INITIAL_TASKS) {
    await setDoc(doc(db, TASK_COLLECTION, task.id), task);
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

/**
 * Bulk saves or synchronizes departments and tasks from Excel import.
 * Uses atomic batched writes to ensure rapid and consistent updates in Firestore.
 */
export const bulkSaveTasksAndDepartments = async (
  newDepartments: Department[],
  newTasks: Task[],
  replaceAll: boolean = true
) => {
  console.log(`Bulk saving ${newDepartments.length} depts and ${newTasks.length} tasks (replaceAll: ${replaceAll})...`);

  // If replaceAll, find existing items to delete
  let toDeleteTasks: string[] = [];
  let toDeleteDepts: string[] = [];

  if (replaceAll) {
    const currentTaskSnap = await getDocs(collection(db, TASK_COLLECTION));
    const newTaskIds = new Set(newTasks.map(t => t.id));
    currentTaskSnap.forEach(d => {
      if (!newTaskIds.has(d.id)) {
        toDeleteTasks.push(d.id);
      }
    });

    const currentDeptSnap = await getDocs(collection(db, DEPT_COLLECTION));
    const newDeptIds = new Set(newDepartments.map(d => d.id));
    currentDeptSnap.forEach(d => {
      if (!newDeptIds.has(d.id)) {
        toDeleteDepts.push(d.id);
      }
    });
  }

  // Execute in batches of up to 400 operations
  const BATCH_SIZE = 400;
  let batch = writeBatch(db);
  let opCount = 0;

  const commitBatchIfNeeded = async () => {
    if (opCount >= BATCH_SIZE) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }
  };

  // 1. Delete removed tasks
  for (const taskId of toDeleteTasks) {
    batch.delete(doc(db, TASK_COLLECTION, taskId));
    opCount++;
    await commitBatchIfNeeded();
  }

  // 2. Delete removed depts
  for (const deptId of toDeleteDepts) {
    batch.delete(doc(db, DEPT_COLLECTION, deptId));
    opCount++;
    await commitBatchIfNeeded();
  }

  // 3. Set departments
  for (const dept of newDepartments) {
    batch.set(doc(db, DEPT_COLLECTION, dept.id), dept);
    opCount++;
    await commitBatchIfNeeded();
  }

  // 4. Set tasks
  for (const task of newTasks) {
    batch.set(doc(db, TASK_COLLECTION, task.id), task);
    opCount++;
    await commitBatchIfNeeded();
  }

  // Final commit
  if (opCount > 0) {
    await batch.commit();
  }

  console.log("Bulk save committed successfully.");
};

