import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          className="appearance-none w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 pr-8 shadow-sm transition-colors"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};
