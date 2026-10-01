import React, { useState } from 'react';
import {
  Scissors,
  Briefcase,
  Smile,
  Target,
  Wand2,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface RefinementBarProps {
  onRefine: (refinementType: string, customInstruction?: string) => Promise<void>;
  isRefining: boolean;
}

const QUICK_ACTIONS = [
  { id: 'shorter', label: 'Make Shorter', icon: Scissors, instruction: 'Make it significantly more concise and punchy, trimming any unnecessary sentences while preserving key facts and next steps.' },
  { id: 'more-formal', label: 'More Formal', icon: Briefcase, instruction: 'Elevate the vocabulary, formality, and executive polish, suitable for senior leadership or enterprise clients.' },
  { id: 'warmer', label: 'More Cordial & Warm', icon: Smile, instruction: 'Add genuine interpersonal warmth, friendly rapport, and empathy while maintaining professionalism.' },
  { id: 'strong-cta', label: 'Sharpen Call to Action', icon: Target, instruction: 'Make the closing call to action crystal clear, decisive, and action-oriented with a defined next step.' },
  { id: 'bullet-points', label: 'Convert to Bullets', icon: Wand2, instruction: 'Structure key details or takeaways into clean, scannable bullet points.' },
];

export const RefinementBar: React.FC<RefinementBarProps> = ({
  onRefine,
  isRefining,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleQuickAction = async (item: typeof QUICK_ACTIONS[0]) => {
    if (isRefining) return;
    await onRefine(item.label, item.instruction);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isRefining) return;
    await onRefine('Custom Instruction', customPrompt.trim());
    setCustomPrompt('');
  };

  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Quick AI Refinements</span>
        </span>
        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          {showCustomInput ? 'Hide Custom Prompt' : '+ Custom Prompt'}
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickAction(item)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              <Icon className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Refinement Input */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isRefining}
            placeholder="e.g. Translate to Spanish, make it sound like a friendly follow-up, soften bad news..."
            className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isRefining || !customPrompt.trim()}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isRefining ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Apply</span>
          </button>
        </form>
      )}

      {isRefining && (
        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 animate-pulse pt-0.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Refining draft and adjusting tone...</span>
        </div>
      )}
    </div>
  );
};
