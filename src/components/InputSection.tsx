import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Target,
  Clock,
  Globe,
  CornerDownLeft,
  X,
  FileText,
} from 'lucide-react';
import { ToneSelector } from './ToneSelector';
import { INTENT_OPTIONS, RECIPIENT_OPTIONS } from '../data/presets';
import { EmailLength } from '../types/email';

interface InputSectionProps {
  description: string;
  onChangeDescription: (val: string) => void;
  tone: string;
  onSelectTone: (tone: string) => void;
  customToneText: string;
  onChangeCustomToneText: (val: string) => void;
  recipient: string;
  onChangeRecipient: (val: string) => void;
  senderName: string;
  onChangeSenderName: (val: string) => void;
  intent: string;
  onChangeIntent: (val: string) => void;
  length: EmailLength;
  onChangeLength: (len: EmailLength) => void;
  callToAction: string;
  onChangeCallToAction: (val: string) => void;
  language: string;
  onChangeLanguage: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  loadingStepText: string;
}

const QUICK_INSPIRATION_CHIPS = [
  'Request 2-day deadline extension due to blocker',
  'Politely decline a vendor pricing proposal',
  'Follow up on unread message sent last week',
  'Introduce new product feature to key clients',
  'Thank team for successful sprint release',
];

export const InputSection: React.FC<InputSectionProps> = ({
  description,
  onChangeDescription,
  tone,
  onSelectTone,
  customToneText,
  onChangeCustomToneText,
  recipient,
  onChangeRecipient,
  senderName,
  onChangeSenderName,
  intent,
  onChangeIntent,
  length,
  onChangeLength,
  callToAction,
  onChangeCallToAction,
  language,
  onChangeLanguage,
  onGenerate,
  isLoading,
  loadingStepText,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && description.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Description Field Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="description-input"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Short Description or Raw Notes</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
            {description.length > 0 && (
              <button
                type="button"
                onClick={() => onChangeDescription('')}
                className="hover:text-rose-500 flex items-center gap-0.5 ml-1 transition-colors"
                title="Clear input"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="description-input"
            rows={4}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your brief or rough notes here...&#10;e.g. Tell Sarah our Q3 roadmap will slip by 1 week because API auth changes took longer. Emphasize that we have a working prototype ready to demo on Thursday to keep them unblocked."
            className="w-full text-sm leading-relaxed p-3.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all resize-y"
          />
        </div>

        {/* Quick Inspiration Chips */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Quick prompts:
            </span>
            {QUICK_INSPIRATION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChangeDescription(chip)}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-700 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tone of Voice Selector */}
      <ToneSelector
        selectedTone={tone}
        onSelectTone={onSelectTone}
        customToneText={customToneText}
        onChangeCustomToneText={onChangeCustomToneText}
      />

      {/* Advanced Parameters Accordion */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-950/20">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Audience, Length & Details</span>
            {(recipient || senderName || callToAction || length !== 'standard') && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <span>{showAdvanced ? 'Hide' : 'Customize'}</span>
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {showAdvanced && (
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4 text-xs">
            {/* Length Preference */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Target Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'concise', label: 'Concise', hint: '< 100 words' },
                  { id: 'standard', label: 'Standard', hint: '100-180 words' },
                  { id: 'detailed', label: 'Detailed', hint: '180+ words' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChangeLength(item.id as EmailLength)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      length === item.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {item.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient and Sender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Recipient Context / Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => onChangeRecipient(e.target.value)}
                    placeholder="e.g. Sarah (Marketing Lead)"
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Sender Name / Sign-off
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => onChangeSenderName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Intent & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Primary Intent
                </label>
                <select
                  value={intent}
                  onChange={(e) => onChangeIntent(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INTENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => onChangeLanguage(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="English">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>
            </div>

            {/* Explicit Call to Action */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Specific Call to Action (Optional)
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => onChangeCallToAction(e.target.value)}
                placeholder="e.g. Schedule a 15-minute call before Friday 3 PM"
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Submit Button */}
      <div className="pt-1">
        <button
          type="button"
          disabled={isLoading || !description.trim()}
          onClick={onGenerate}
          className={`w-full py-3 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 shadow-md transition-all ${
            isLoading || !description.trim()
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{loadingStepText || 'Drafting professional email...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Professional Email</span>
              <span className="hidden sm:inline-flex items-center gap-0.5 ml-1 text-[11px] font-normal px-2 py-0.5 rounded-md bg-white/20 text-white/90">
                ⌘ Enter
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
