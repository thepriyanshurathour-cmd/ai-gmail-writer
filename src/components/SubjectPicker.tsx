import React, { useState } from 'react';
import { SubjectLineOption } from '../types/email';
import { Check, Copy, Edit2, Sparkles } from 'lucide-react';

interface SubjectPickerProps {
  options: SubjectLineOption[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  onEditSubject: (subject: string) => void;
}

export const SubjectPicker: React.FC<SubjectPickerProps> = ({
  options,
  selectedSubject,
  onSelectSubject,
  onEditSubject,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSubject);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Subject Line Options</span>
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            <span>{isEditing ? 'Done' : 'Edit Selected'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy subject line"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline Edit if active */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={selectedSubject}
            onChange={(e) => onEditSubject(e.target.value)}
            className="flex-1 text-xs font-semibold px-3 py-2 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type custom subject line..."
          />
        </div>
      ) : (
        /* 3 Pill Radio Options */
        <div className="grid grid-cols-1 gap-1.5">
          {options.map((opt, idx) => {
            const isSelected = selectedSubject === opt.text;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSubject(opt.text)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 shadow-xs font-medium'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="truncate">{opt.text}</span>
                </div>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  {opt.badge}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
