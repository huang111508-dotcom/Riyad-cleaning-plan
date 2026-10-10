import * as XLSX from 'xlsx';
import { Department, Role, Task, Frequency } from '../types';
import { DAYS_OF_WEEK, WEEKS_OF_MONTH } from '../constants';

export interface ExcelRow {
  departmentCn: string;
  departmentEn: string;
  roleCn: string;
  roleEn: string;
  frequency: string;
  weekOfMonth?: number | string;
  dayOfWeek?: number | string;
  titleCn: string;
  titleEn: string;
  detailsCn: string;
  detailsEn: string;
}

export interface ParseResult {
  departments: Department[];
  tasks: Task[];
  totalRows: number;
  validRows: number;
  errors: string[];
  warnings: string[];
}

/**
 * Normalizes frequency string to 'daily' | 'weekly' | 'monthly'
 */
const normalizeFrequency = (val: any): Frequency | null => {
  if (!val) return null;
  const s = String(val).trim().toLowerCase();
  if (s.includes('日') || s === 'daily' || s === 'day') return 'daily';
  if (s.includes('周') || s === 'weekly' || s === 'week') return 'weekly';
  if (s.includes('月') || s === 'monthly' || s === 'month') return 'monthly';
  return null;
};

/**
 * Normalizes day of week to 1-7
 */
const normalizeDayOfWeek = (val: any): number | undefined => {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') {
    if (val >= 1 && val <= 7) return val;
  }
  const s = String(val).trim().toLowerCase();
  if (s === '1' || s.includes('一') || s.includes('mon')) return 1;
  if (s === '2' || s.includes('二') || s.includes('tue')) return 2;
  if (s === '3' || s.includes('三') || s.includes('wed')) return 3;
  if (s === '4' || s.includes('四') || s.includes('thu')) return 4;
  if (s === '5' || s.includes('五') || s.includes('fri')) return 5;
  if (s === '6' || s.includes('六') || s.includes('sat')) return 6;
  if (s === '7' || s.includes('日') || s.includes('天') || s.includes('sun')) return 7;
  const num = parseInt(s, 10);
  if (!isNaN(num) && num >= 1 && num <= 7) return num;
  return undefined;
};

/**
 * Normalizes week of month to 1-4
 */
const normalizeWeekOfMonth = (val: any): number | undefined => {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') {
    if (val >= 1 && val <= 4) return val;
  }
  const s = String(val).trim().toLowerCase();
  if (s === '1' || s.includes('一') || s.includes('1')) return 1;
  if (s === '2' || s.includes('二') || s.includes('2')) return 2;
  if (s === '3' || s.includes('三') || s.includes('3')) return 3;
  if (s === '4' || s.includes('四') || s.includes('4')) return 4;
  const num = parseInt(s, 10);
  if (!isNaN(num) && num >= 1 && num <= 4) return num;
  return undefined;
};

/**
 * Generates an Excel workbook containing current cleaning plans or a template
 */
export const generateCleaningPlansWorkbook = (
  departments: Department[],
  tasks: Task[],
  type: 'current' | 'blank'
): Uint8Array => {
  const wb = XLSX.utils.book_new();

  // Columns definition
  const headers = [
    '部门名称(中文)',
    '部门名称(英文)',
    '岗位名称(中文)',
    '岗位名称(英文)',
    '清洁频次(日清/周清/月清)',
    '执行周次(1-4，仅月清)',
    '执行星期(1-7，周清/月清)',
    '计划内容(中文)',
    '计划内容(英文)',
    '清洁细则(中文)',
    '清洁细则(英文)'
  ];

  let rowsData: any[][] = [];

  if (type === 'current') {
    // Populate all current tasks
    departments.forEach(dept => {
      (dept.roles || []).forEach(role => {
        const roleTasks = tasks.filter(t => t.deptId === dept.id && t.roleId === role.id);
        if (roleTasks.length === 0) {
          // Keep role row even if no tasks
          rowsData.push([
            dept.name.cn,
            dept.name.en || '',
            role.name.cn,
            role.name.en || '',
            '日清',
            '',
            '',
            '',
            '',
            '',
            ''
          ]);
        } else {
          roleTasks.forEach(task => {
            const freqLabel = task.frequency === 'daily' ? '日清' : task.frequency === 'weekly' ? '周清' : '月清';
            rowsData.push([
              dept.name.cn,
              dept.name.en || '',
              role.name.cn,
              role.name.en || '',
              freqLabel,
              task.frequency === 'monthly' ? (task.weekOfMonth || 1) : '',
              task.frequency !== 'daily' ? (task.dayOfWeek || 1) : '',
              task.title.cn,
              task.title.en || '',
              task.details.cn,
              task.details.en || ''
            ]);
          });
        }
      });
    });
  } else {
    // Blank template with illustrative examples
    rowsData = [
      [
        '果蔬生鲜部',
        'Fruit & Veg (Produce)',
        '果蔬理货员',
        'Fruit & Veg Worker',
        '日清',
        '',
        '',
        '挑拣烂果与擦拭货架',
        'Pick Bad Fruits & Wipe Shelves',
        '1. 挑出所有烂果、发霉或变软蔬菜，放入损耗筐。\n2. 用干净湿毛巾擦净水果台面与货架层板。\n3. 拖干地面水渍，防止顾客滑倒摔伤。',
        '1. Pick out bad fruits and rotten vegetables.\n2. Wipe display tables clean.\n3. Keep floor dry.'
      ],
      [
        '果蔬生鲜部',
        'Fruit & Veg (Produce)',
        '果蔬理货员',
        'Fruit & Veg Worker',
        '周清',
        '',
        '2',
        '刷洗果蔬塑料筐与冷风口',
        'Wash Fruit Baskets & Air Vents',
        '1. 把塑料陈列筐拿到清洗池，用肥皂水刷洗并冲干净。\n2. 关掉冷风柜电源，擦拭出风口防尘网灰尘。\n3. 果筐晾干后整齐码回货架。',
        '1. Wash plastic fruit baskets with soapy water.\n2. Wipe off dust from cooler air vents.\n3. Stack baskets back.'
      ],
      [
        '果蔬生鲜部',
        'Fruit & Veg (Produce)',
        '果蔬理货员',
        'Fruit & Veg Worker',
        '月清',
        '1',
        '2',
        '深度冲洗果蔬冷库与地沟',
        'Deep Clean Cool Room & Floor Drain',
        '1. 搬出冷库垫板，用水管彻底冲洗冷库地面和墙角。\n2. 打开地沟盖板，清理烂菜叶与泥沙，倒入消毒水。\n3. 擦洗冷库大门胶条，去除霉斑并擦干。',
        '1. Wash cool room floor with water.\n2. Clean floor drains.\n3. Wipe door rubber seal.'
      ]
    ];
  }

  // Combine headers and rows
  const fullSheetData = [headers, ...rowsData];
  const ws = XLSX.utils.aoa_to_sheet(fullSheetData);

  // Set nice column widths
  ws['!cols'] = [
    { wch: 18 }, // 部门中文
    { wch: 22 }, // 部门英文
    { wch: 18 }, // 岗位中文
    { wch: 22 }, // 岗位英文
    { wch: 15 }, // 频次
    { wch: 14 }, // 周次
    { wch: 14 }, // 星期
    { wch: 30 }, // 计划内容中文
    { wch: 35 }, // 计划内容英文
    { wch: 45 }, // 细则中文
    { wch: 45 }  // 细则英文
  ];

  XLSX.utils.book_append_sheet(wb, ws, '清洁计划数据表');

  // Add an Instruction Sheet
  const instructions = [
    ['【Riyadh Clean - 清洁计划Excel模版使用说明】'],
    [''],
    ['1. 部门与岗位：'],
    ['   - 表格支持新增或修改部门及岗位，相同部门名称的行会自动归入同一部门。'],
    ['   - 中文名为必填项；英文名若留空，后台上传时可支持一键AI自动翻译补齐。'],
    [''],
    ['2. 清洁频次：'],
    ['   - 可填写【日清】、【周清】、【月清】（或 Daily / Weekly / Monthly）。'],
    [''],
    ['3. 执行周次与星期：'],
    ['   - 【日清】：每日营业结束前必做，周次和星期请留空。'],
    ['   - 【周清】：填写执行星期（填 1 到 7，例如 1 代表星期一，5 代表星期五）。'],
    ['   - 【月清】：填写执行周次（1 到 4，如 1 代表第一周）以及执行星期（1 到 7）。'],
    [''],
    ['4. 计划内容与细则：'],
    ['   - 计划内容即该清洁项目的简短标题（如“清理烤盘碎屑”）。'],
    ['   - 清洁细则请按步骤分行书写（换行在Excel中可按 Alt + Enter）。'],
    [''],
    ['5. 上传与生效：'],
    ['   - 在APP管理后台点击【上传Excel更新计划】，选择填写好的表格。'],
    ['   - 系统会自动校验并提供预览确认，确认后将即时同步至云端，所有员工端界面秒级自动更新！']
  ];
  const wsGuide = XLSX.utils.aoa_to_sheet(instructions);
  wsGuide['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, '填写说明与规范');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(excelBuffer);
};

/**
 * Triggers a file download in the browser
 */
export const downloadExcel = (data: Uint8Array, fileName: string) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Parses an uploaded Excel file and constructs Departments and Tasks
 */
export const parseUploadedExcel = async (
  file: File,
  existingDepartments: Department[]
): Promise<ParseResult> => {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  // Use first sheet or sheet with '清洁' in name
  const sheetName = wb.SheetNames.find(n => n.includes('清洁') || n.includes('计划')) || wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    throw new Error('未在Excel中找到有效的工作表 (No valid sheet found)');
  }

  // Convert sheet to JSON array with header detection
  const rawRows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

  const errors: string[] = [];
  const warnings: string[] = [];

  if (rawRows.length === 0) {
    return {
      departments: [],
      tasks: [],
      totalRows: 0,
      validRows: 0,
      errors: ['表格中没有任何数据行 (The uploaded sheet is empty).'],
      warnings: []
    };
  }

  // Map of department name -> Department object
  const deptMap = new Map<string, Department>();
  // Map to reuse existing IDs when matching department/role names
  const existingDeptByName = new Map<string, Department>();
  existingDepartments.forEach(d => {
    if (d.name.cn) existingDeptByName.set(d.name.cn.trim(), d);
    if (d.name.en) existingDeptByName.set(d.name.en.trim().toLowerCase(), d);
  });

  const parsedTasks: Task[] = [];
  let validRowCount = 0;

  // Helper to extract value from row by possible header aliases
  const getField = (row: any, ...keys: string[]): string => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) {
        const val = String(row[key]).trim();
        if (val) return val;
      }
    }
    // Also try fuzzy key match
    const rowKeys = Object.keys(row);
    for (const k of rowKeys) {
      for (const target of keys) {
        if (k.toLowerCase().includes(target.toLowerCase())) {
          const val = String(row[k]).trim();
          if (val) return val;
        }
      }
    }
    return '';
  };

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // Row number in Excel (header is row 1)

    const deptCn = getField(row, '部门名称(中文)', '部门(中文)', '部门名称', '部门', 'dept', 'department');
    const deptEn = getField(row, '部门名称(英文)', '部门(英文)', 'Department (EN)', 'department_en');
    const roleCn = getField(row, '岗位名称(中文)', '岗位(中文)', '岗位名称', '岗位', 'role', 'role_cn');
    const roleEn = getField(row, '岗位名称(英文)', '岗位(英文)', 'Role (EN)', 'role_en');
    const freqRaw = getField(row, '清洁频次(日清/周清/月清)', '清洁频次', '频次', 'frequency', 'freq');
    const weekRaw = getField(row, '执行周次(1-4，仅月清)', '执行周次', '周次', 'week', 'weekofmonth');
    const dayRaw = getField(row, '执行星期(1-7，周清/月清)', '执行星期', '星期', 'day', 'dayofweek');
    const titleCn = getField(row, '计划内容(中文)', '计划内容', '内容', 'title_cn', 'title');
    const titleEn = getField(row, '计划内容(英文)', 'Title (EN)', 'title_en');
    const detailsCn = getField(row, '清洁细则(中文)', '清洁细则', '细则', 'details_cn', 'details');
    const detailsEn = getField(row, '清洁细则(英文)', 'Details (EN)', 'details_en');

    // Skip entirely blank rows
    if (!deptCn && !roleCn && !titleCn && !detailsCn) {
      return;
    }

    if (!deptCn) {
      errors.push(`第 ${rowNum} 行: 部门名称不能为空。`);
      return;
    }
    if (!roleCn) {
      errors.push(`第 ${rowNum} 行: 岗位名称不能为空。`);
      return;
    }

    const frequency = normalizeFrequency(freqRaw);
    if (!frequency) {
      errors.push(`第 ${rowNum} 行: 频次无效 ("${freqRaw}")，请填写【日清】、【周清】或【月清】。`);
      return;
    }

    if (!titleCn) {
      errors.push(`第 ${rowNum} 行: 计划内容(中文)不能为空。`);
      return;
    }

    // Resolve or create department
    let currentDept = deptMap.get(deptCn);
    if (!currentDept) {
      const matchExisting = existingDeptByName.get(deptCn);
      currentDept = {
        id: matchExisting?.id || `dept_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: {
          cn: deptCn,
          en: deptEn || matchExisting?.name?.en || deptCn
        },
        roles: []
      };
      deptMap.set(deptCn, currentDept);
    } else if (deptEn && !currentDept.name.en) {
      currentDept.name.en = deptEn;
    }

    // Resolve or create role within department
    let currentRole = currentDept.roles.find(r => r.name.cn === roleCn);
    if (!currentRole) {
      // Check if existing dept had this role
      const matchExistingDept = existingDeptByName.get(deptCn);
      const matchExistingRole = matchExistingDept?.roles?.find(r => r.name.cn === roleCn);

      currentRole = {
        id: matchExistingRole?.id || `role_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: {
          cn: roleCn,
          en: roleEn || matchExistingRole?.name?.en || roleCn
        }
      };
      currentDept.roles.push(currentRole);
    } else if (roleEn && !currentRole.name.en) {
      currentRole.name.en = roleEn;
    }

    // Schedule handling
    let dayOfWeek: number | undefined;
    let weekOfMonth: number | undefined;

    if (frequency === 'weekly') {
      dayOfWeek = normalizeDayOfWeek(dayRaw);
      if (!dayOfWeek) {
        dayOfWeek = 1;
        warnings.push(`第 ${rowNum} 行: 周清计划未填写有效星期，已默认为星期一。`);
      }
    } else if (frequency === 'monthly') {
      weekOfMonth = normalizeWeekOfMonth(weekRaw);
      dayOfWeek = normalizeDayOfWeek(dayRaw);
      if (!weekOfMonth) {
        weekOfMonth = 1;
        warnings.push(`第 ${rowNum} 行: 月清计划未填写有效周次，已默认为第1周。`);
      }
      if (!dayOfWeek) {
        dayOfWeek = 1;
        warnings.push(`第 ${rowNum} 行: 月清计划未填写有效星期，已默认为星期一。`);
      }
    }

    // Task construction (Generate unique ID for each task row so multiple tasks under same role are preserved)
    const task: Task = {
      id: `task_${currentDept.id}_${currentRole.id}_${frequency}_${idx + 1}_${Math.random().toString(36).substr(2, 6)}`.replace(/[^a-zA-Z0-9_]/g, '_'),
      deptId: currentDept.id,
      roleId: currentRole.id,
      frequency,
      ...(dayOfWeek !== undefined ? { dayOfWeek } : {}),
      ...(weekOfMonth !== undefined ? { weekOfMonth } : {}),
      title: {
        cn: titleCn,
        en: titleEn || titleCn
      },
      details: {
        cn: detailsCn || titleCn,
        en: detailsEn || (titleEn || titleCn)
      }
    };

    parsedTasks.push(task);
    validRowCount++;
  });

  const finalDepartments = Array.from(deptMap.values());

  return {
    departments: finalDepartments,
    tasks: parsedTasks,
    totalRows: rawRows.length,
    validRows: validRowCount,
    errors,
    warnings
  };
};
