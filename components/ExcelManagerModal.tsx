import React, { useState, useRef } from 'react';
import { Department, Task, Language } from '../types';
import { 
  X, FileSpreadsheet, Download, UploadCloud, CheckCircle2, 
  AlertCircle, Loader2, Sparkles, Table, Check, Info, FileText
} from 'lucide-react';
import { 
  generateCleaningPlansWorkbook, downloadExcel, 
  parseUploadedExcel, ParseResult 
} from '../services/excelService';
import { bulkSaveTasksAndDepartments } from '../services/dataService';
import { translateText } from '../services/geminiService';

interface ExcelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  tasks: Task[];
  lang: Language;
  onSuccess: (message: string) => void;
}

export const ExcelManagerModal: React.FC<ExcelManagerModalProps> = ({
  isOpen,
  onClose,
  departments,
  tasks,
  lang,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'upload'>('download');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState<string>('');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [replaceAll, setReplaceAll] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export / Template Downloads
  const handleDownloadCurrent = () => {
    try {
      const data = generateCleaningPlansWorkbook(departments, tasks, 'current');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadExcel(data, `Riyadh_Clean_清洁计划_${dateStr}.xlsx`);
    } catch (e: any) {
      alert((lang === 'cn' ? '导出失败: ' : 'Export failed: ') + e.message);
    }
  };

  const handleDownloadBlank = () => {
    try {
      const data = generateCleaningPlansWorkbook(departments, tasks, 'blank');
      downloadExcel(data, `Riyadh_Clean_清洁计划标准导入模版.xlsx`);
    } catch (e: any) {
      alert((lang === 'cn' ? '下载失败: ' : 'Download failed: ') + e.message);
    }
  };

  // Handle File Selection
  const handleFileChange = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert(lang === 'cn' ? '请上传 Excel 格式文件 (.xlsx 或 .xls)' : 'Please select an Excel file (.xlsx or .xls)');
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);
    setParseResult(null);

    try {
      const result = await parseUploadedExcel(file, departments);
      setParseResult(result);
    } catch (err: any) {
      console.error(err);
      alert((lang === 'cn' ? '解析 Excel 失败: ' : 'Failed to parse Excel: ') + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle Confirm Save to Cloud Firestore
  const handleConfirmSync = async () => {
    if (!parseResult || parseResult.tasks.length === 0) return;

    setIsSaving(true);
    setSaveProgress(lang === 'cn' ? '正在准备同步数据...' : 'Preparing data...');

    try {
      let finalDepts = [...parseResult.departments];
      let finalTasks = [...parseResult.tasks];

      // Auto-translate if requested for any items missing English
      if (autoTranslate) {
        setSaveProgress(lang === 'cn' ? '正在使用 AI 自动翻译并校验英文内容...' : 'Translating missing English text with AI...');
        for (const task of finalTasks) {
          if (!task.title.en || task.title.en === task.title.cn) {
            task.title.en = await translateText(task.title.cn, 'en');
          }
          if (!task.details.en || task.details.en === task.details.cn) {
            task.details.en = await translateText(task.details.cn, 'en');
          }
        }
      }

      setSaveProgress(lang === 'cn' ? '正在批量写入云端 Firestore 数据库...' : 'Saving to Cloud Firestore...');
      await bulkSaveTasksAndDepartments(finalDepts, finalTasks, replaceAll);

      onSuccess(
        lang === 'cn' 
          ? `成功同步 Excel 清洁计划！共更新 ${finalDepts.length} 个部门，${finalTasks.length} 项计划。` 
          : `Successfully synced Excel! Updated ${finalDepts.length} departments and ${finalTasks.length} tasks.`
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      alert((lang === 'cn' ? '同步至云端失败: ' : 'Failed to sync to cloud: ') + err.message);
    } finally {
      setIsSaving(false);
      setSaveProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b bg-gradient-to-r from-teal-700 to-teal-800 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold leading-tight">
                {lang === 'cn' ? 'Excel 清洁计划导入与导出' : 'Excel Plan Import & Export'}
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                {lang === 'cn' ? '通过 Excel 批量修改并一键同步更新 APP' : 'Batch edit via Excel & sync directly to app'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 flex-shrink-0 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'download' 
                ? 'border-teal-600 text-teal-800 bg-white shadow-sm' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'cn' ? '1. 下载 Excel 表格模版' : '1. Download Template'}</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'upload' 
                ? 'border-teal-600 text-teal-800 bg-white shadow-sm' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{lang === 'cn' ? '2. 上传 Excel 并同步至APP' : '2. Upload & Sync'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* TAB 1: DOWNLOAD */}
          {activeTab === 'download' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-4 text-xs text-teal-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-teal-950 text-sm">
                  <Info className="w-4 h-4 text-teal-600" />
                  <span>使用指南 (How it works)</span>
                </div>
                <p className="leading-relaxed">
                  推荐先点击下方<b>【导出当前完整计划 Excel】</b>，在保留全部部门与已有细则的基础上直接修改或新增，修改完毕后切换至“上传并同步”页上传即可秒级生效。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Download Current Data */}
                <div className="border border-teal-200 rounded-xl p-4 bg-gradient-to-b from-teal-50/40 to-white hover:border-teal-400 transition-all shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-3">
                      <Table className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {lang === 'cn' ? '下载当前完整清洁计划' : 'Export Current Plan'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      包含云端现有的全部 <b>{departments.length} 个部门</b>、<b>{tasks.length} 项标准日清/周清/月清计划</b>。适合在此基础直接修改。
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadCurrent}
                    className="mt-4 w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'cn' ? '导出当前完整数据 (.xlsx)' : 'Download Current (.xlsx)'}</span>
                  </button>
                </div>

                {/* Download Blank Template */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white hover:border-teal-300 transition-all shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {lang === 'cn' ? '下载空白规范模版' : 'Blank Template'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      含标准表头结构、示范样例行以及各字段填写规范说明，适合从零开始整理新数据。
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBlank}
                    className="mt-4 w-full py-2.5 px-3 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'cn' ? '下载空白规范模版 (.xlsx)' : 'Download Blank Template'}</span>
                  </button>
                </div>
              </div>

              {/* Next step prompt */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                >
                  <span>修改好后，前往上传同步页面 →</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* File Dropzone */}
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-300' 
                    : selectedFile 
                    ? 'border-emerald-400 bg-emerald-50/40' 
                    : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className={`p-3 rounded-full ${selectedFile ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-50 text-teal-600'}`}>
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    {selectedFile ? (
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{selectedFile.name}</span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB • 点击可重新选择其他文件
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-gray-800 text-sm">
                          {lang === 'cn' ? '点击选择或拖拽已修改的 Excel 表格到此处' : 'Click to select or drag & drop Excel file here'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">支持 .xlsx 与 .xls 格式</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Parsing Indicator */}
              {isParsing && (
                <div className="flex items-center justify-center gap-2 py-4 text-teal-700 text-xs font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在解析 Excel 数据并校验规范...</span>
                </div>
              )}

              {/* Parsing Results / Preview */}
              {parseResult && (
                <div className="space-y-3">
                  
                  {/* Status Banner */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    parseResult.errors.length > 0
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {parseResult.errors.length > 0 ? (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                      <span>
                        {lang === 'cn' 
                          ? `解析完成: 检测到 ${parseResult.departments.length} 个部门，共 ${parseResult.tasks.length} 项有效清洁计划。` 
                          : `Parsed: Found ${parseResult.departments.length} departments and ${parseResult.tasks.length} tasks.`}
                      </span>
                    </div>
                  </div>

                  {/* Errors if any */}
                  {parseResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 max-h-32 overflow-y-auto space-y-1">
                      <div className="font-bold text-red-800">解析错误 (无法导入以下行):</div>
                      {parseResult.errors.map((err, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warnings if any */}
                  {parseResult.warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800 max-h-24 overflow-y-auto space-y-1">
                      <div className="font-bold text-amber-900">提示建议:</div>
                      {parseResult.warnings.slice(0, 5).map((w, i) => (
                        <div key={i}>• {w}</div>
                      ))}
                    </div>
                  )}

                  {/* Preview Table (First few rows) */}
                  {parseResult.tasks.length > 0 && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 border-b flex justify-between items-center">
                        <span>计划预览 (前 5 项):</span>
                        <span className="text-gray-400 font-normal">总计 {parseResult.tasks.length} 项</span>
                      </div>
                      <div className="overflow-x-auto max-h-48">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] sticky top-0">
                            <tr>
                              <th className="p-2">部门</th>
                              <th className="p-2">岗位</th>
                              <th className="p-2">频次</th>
                              <th className="p-2">计划内容</th>
                              <th className="p-2">周期/时间</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {parseResult.tasks.slice(0, 5).map((t, idx) => {
                              const dept = parseResult.departments.find(d => d.id === t.deptId);
                              const role = dept?.roles.find(r => r.id === t.roleId);
                              return (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2 font-medium text-gray-800">{dept?.name.cn}</td>
                                  <td className="p-2 text-gray-600">{role?.name.cn}</td>
                                  <td className="p-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      t.frequency === 'daily' ? 'bg-teal-100 text-teal-800' :
                                      t.frequency === 'weekly' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                      {t.frequency === 'daily' ? '日清' : t.frequency === 'weekly' ? '周清' : '月清'}
                                    </span>
                                  </td>
                                  <td className="p-2 text-gray-800 truncate max-w-[150px]">{t.title.cn}</td>
                                  <td className="p-2 text-gray-500 text-[11px]">
                                    {t.frequency === 'daily' && '每天'}
                                    {t.frequency === 'weekly' && `星期${t.dayOfWeek}`}
                                    {t.frequency === 'monthly' && `第${t.weekOfMonth}周 星期${t.dayOfWeek}`}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Sync Settings */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={autoTranslate} 
                        onChange={(e) => setAutoTranslate(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>自动使用 AI 翻译补齐缺少的英文名称与细则 (Auto-translate missing English)</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={replaceAll} 
                        onChange={(e) => setReplaceAll(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>全量覆盖同步（以本次上传的 Excel 为准，清空已移除的旧计划）</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {lang === 'cn' ? '取 消' : 'Cancel'}
          </button>

          {activeTab === 'upload' && parseResult && parseResult.tasks.length > 0 && (
            <button
              onClick={handleConfirmSync}
              disabled={isSaving}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{saveProgress || (lang === 'cn' ? '正在写入云端...' : 'Syncing...')}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {lang === 'cn' ? `确认同步更新 ${parseResult.tasks.length} 项计划至APP` : `Sync ${parseResult.tasks.length} Tasks to App`}
                  </span>
                </>
              )}
            </button>
          )}

          {activeTab === 'download' && (
            <button
              onClick={() => setActiveTab('upload')}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              {lang === 'cn' ? '下一步：上传表格 →' : 'Next: Upload →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
