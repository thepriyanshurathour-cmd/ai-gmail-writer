import React, { useState } from 'react';
import {
  Copy,
  Check,
  Mail,
  Star,
  FileDown,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { GeneratedEmailResponse } from '../types/email';
import { SubjectPicker } from './SubjectPicker';
import { RefinementBar } from './RefinementBar';

interface EmailPreviewProps {
  data: GeneratedEmailResponse | null;
  activeSubject: string;
  onSelectSubject: (subject: string) => void;
  onEditSubject: (subject: string) => void;
  activeEmailText: string;
  onChangeActiveEmailText: (text: string) => void;
  activeTab: 'primary' | 'variant';
  onSelectTab: (tab: 'primary' | 'variant') => void;
  recipient: string;
  senderName: string;
  onSaveDraft: () => void;
  isSaved: boolean;
  onRefine: (refinementType: string, customInstruction?: string) => Promise<void>;
  isRefining: boolean;
  onRegenerate: () => void;
  isLoading: boolean;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  data,
  activeSubject,
  onSelectSubject,
  onEditSubject,
  activeEmailText,
  onChangeActiveEmailText,
  activeTab,
  onSelectTab,
  recipient,
  senderName,
  onSaveDraft,
  isSaved,
  onRefine,
  isRefining,
  onRegenerate,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const handleCopy = () => {
    const fullMessage = `Subject: ${activeSubject}\n\n${activeEmailText}`;
    navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const encodedSubject = encodeURIComponent(activeSubject);
    const encodedBody = encodeURIComponent(activeEmailText);
    const mailtoUrl = `mailto:${recipient ? encodeURIComponent(recipient) : ''}?subject=${encodedSubject}&body=${encodedBody}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([`Subject: ${activeSubject}\n\n${activeEmailText}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${(activeSubject || 'email-draft')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .slice(0, 30)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = activeEmailText.trim()
    ? activeEmailText.trim().split(/\s+/).length
    : 0;

  if (!data) {
    return (
      <div className="h-full min-h-[480px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-xs">
          <Mail className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
          Your Professional Email Studio
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6">
          Enter rough notes or a brief on the left, pick your desired tone of voice, and click{' '}
          <strong className="text-slate-700 dark:text-slate-200">"Generate Professional Email"</strong>. BriefMail will craft subject lines, full drafts, tone analysis, and instant variations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              1. Any Raw Context
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Messy notes, bullet points, or 1-sentence ideas.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              2. 8 Distinct Tones
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Executive, diplomatic, friendly, persuasive, and more.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              3. 1-Click Refine
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Shorten, sharpen CTA, or re-angle with AI.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col space-y-4 p-5 sm:p-6">
      {/* Top Bar / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        {/* Tab Switcher: Primary vs Alternative Angle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => onSelectTab('primary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'primary'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Primary Recommendation
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('variant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'variant'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Alternative Angle</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Device viewport toggle */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg mr-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1 rounded-md text-xs transition-colors ${
                deviceView === 'desktop'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Desktop View"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1 rounded-md text-xs transition-colors ${
                deviceView === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Mobile Preview"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onSaveDraft}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              isSaved
                ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title={isSaved ? 'Saved in Starred Drafts' : 'Save to Drafts'}
          >
            <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleDownloadText}
            className="p-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Download .txt"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenMailto}
            className="p-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
            title="Open in default Email Client"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">Open Mail</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Email!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alternative angle explanation banner */}
      {activeTab === 'variant' && (
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-900 dark:text-indigo-200 block">
              {data.alternativeVariant.title}
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
              {data.alternativeVariant.description}
            </p>
          </div>
        </div>
      )}

      {/* Subject Line Picker */}
      <SubjectPicker
        options={data.subjectLines}
        selectedSubject={activeSubject}
        onSelectSubject={onSelectSubject}
        onEditSubject={onEditSubject}
      />

      {/* Realistic Simulated Email Client Box */}
      <div
        className={`mx-auto w-full transition-all duration-200 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 overflow-hidden shadow-2xs ${
          deviceView === 'mobile' ? 'max-w-sm border-2 border-slate-300 dark:border-slate-700' : ''
        }`}
      >
        {/* Email Header Chrome */}
        <div className="bg-slate-100 dark:bg-slate-800/90 px-4 py-3 border-b border-slate-200 dark:border-slate-700/80 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>~{data.toneAnalysis.estimatedReadTimeSeconds}s read</span>
              </span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          <div className="pt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium w-14 shrink-0 text-[11px]">To:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {recipient || 'recipient@company.com'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium w-14 shrink-0 text-[11px]">From:</span>
              <span className="text-slate-600 dark:text-slate-300 truncate">
                {senderName ? `${senderName} (You)` : 'You (sender@company.com)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium w-14 shrink-0 text-[11px]">Subject:</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {activeSubject}
              </span>
            </div>
          </div>
        </div>

        {/* Email Body Editable Area */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 min-h-[220px]">
          <textarea
            value={activeEmailText}
            onChange={(e) => onChangeActiveEmailText(e.target.value)}
            rows={10}
            className="w-full text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-transparent resize-y border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md p-1"
            placeholder="Email content..."
          />
        </div>
      </div>

      {/* Tone Health Analysis & Key Takeaway */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Tone Rating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {data.toneAnalysis.politenessRating}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              {data.toneAnalysis.primaryTone}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Core Takeaway
          </span>
          <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-2">
            "{data.toneAnalysis.keyTakeaway}"
          </p>
        </div>
      </div>

      {/* Suggested Follow-ups Checklist */}
      {data.suggestedFollowUps && data.suggestedFollowUps.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Recommended Next Steps Before / After Sending</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            {data.suggestedFollowUps.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-xs"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Refinement Bar */}
      <RefinementBar onRefine={onRefine} isRefining={isRefining} />
    </div>
  );
};
