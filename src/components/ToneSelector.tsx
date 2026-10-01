import React from 'react';
import {
  Briefcase,
  Smile,
  Zap,
  ShieldCheck,
  Sparkles,
  ClockAlert,
  HeartHandshake,
  Sliders,
} from 'lucide-react';
import { TONE_OPTIONS } from '../data/presets';

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
  customToneText: string;
  onChangeCustomToneText: (text: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase className="w-4 h-4" />;
    case 'Smile':
      return <Smile className="w-4 h-4" />;
    case 'Zap':
      return <Zap className="w-4 h-4" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4" />;
    case 'ClockAlert':
      return <ClockAlert className="w-4 h-4" />;
    case 'HeartHandshake':
      return <HeartHandshake className="w-4 h-4" />;
    case 'Sliders':
      return <Sliders className="w-4 h-4" />;
    default:
      return <Briefcase className="w-4 h-4" />;
  }
};

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelectTone,
  customToneText,
  onChangeCustomToneText,
}) => {
  const isCustom = selectedTone === 'Custom Tone';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Desired Tone of Voice
        </label>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {selectedTone}
        </span>
      </div>

      {/* Grid of Tones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TONE_OPTIONS.map((item) => {
          const isSelected = selectedTone === item.name;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTone(item.name)}
              className={`relative flex flex-col p-2.5 rounded-xl text-left border transition-all text-xs group ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  }`}
                >
                  {getIcon(item.icon)}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {item.badge}
                </span>
              </div>
              <span className="font-semibold text-xs leading-snug line-clamp-1">
                {item.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-tight">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Tone Input Field */}
      {isCustom && (
        <div className="pt-1">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Specify Custom Persona or Tone Instruction:
          </label>
          <input
            type="text"
            value={customToneText}
            onChange={(e) => onChangeCustomToneText(e.target.value)}
            placeholder="e.g. British polite, dry wit, Steve Jobs keynote style, academic researcher..."
            className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
};
