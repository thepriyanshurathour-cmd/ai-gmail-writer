import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { EmailPreview } from './components/EmailPreview';
import { HistoryModal } from './components/HistoryModal';
import { PresetsModal } from './components/PresetsModal';
import {
  EmailLength,
  GeneratedEmailResponse,
  EmailDraftRecord,
  RefineResponse,
} from './types/email';
import { PresetItem } from './data/presets';
import { AlertCircle, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'briefmail_saved_drafts';

export default function App() {
  // Input parameters
  const [description, setDescription] = useState(
    'Tell Sarah from marketing that our Q3 roadmap will slip by 1 week because API auth changes took longer than planned. Emphasize that we have a working prototype ready to demo on Thursday to keep them unblocked.'
  );
  const [tone, setTone] = useState('Diplomatic & Tactful');
  const [customToneText, setCustomToneText] = useState('');
  const [recipient, setRecipient] = useState('Sarah (Marketing Lead)');
  const [senderName, setSenderName] = useState('Alex Rivera');
  const [intent, setIntent] = useState('Project Update / Delay');
  const [length, setLength] = useState<EmailLength>('standard');
  const [callToAction, setCallToAction] = useState(
    'Confirm if Thursday 2:00 PM works for a 20-minute walkthrough.'
  );
  const [language, setLanguage] = useState('English');

  // Output & Studio State
  const [generatedData, setGeneratedData] = useState<GeneratedEmailResponse | null>(null);
  const [activeSubject, setActiveSubject] = useState('');
  const [activeEmailText, setActiveEmailText] = useState('');
  const [activeTab, setActiveTab] = useState<'primary' | 'variant'>('primary');

  // Loading & Async
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // History & Presets Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [drafts, setDrafts] = useState<EmailDraftRecord[]>([]);

  // Load saved drafts on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDrafts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load drafts from storage', e);
    }
  }, []);

  // Save drafts to localStorage
  const saveDraftsToStorage = (updatedDrafts: EmailDraftRecord[]) => {
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
    } catch (e) {
      console.error('Failed to save drafts to storage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Main Generation Handler
  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStepText('Analyzing notes & context...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStepText('Applying tone & executive structure...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLoadingStepText('Polishing subject lines & nuances...');
    }, 2400);

    try {
      const effectiveTone =
        tone === 'Custom Tone' && customToneText.trim()
          ? `Custom Tone: ${customToneText.trim()}`
          : tone;

      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          tone: effectiveTone,
          recipient: recipient.trim(),
          senderName: senderName.trim(),
          intent,
          length,
          callToAction: callToAction.trim(),
          language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${res.status}`);
      }

      const data: GeneratedEmailResponse = await res.json();
      setGeneratedData(data);
      setActiveSubject(data.selectedSubject);
      setActiveEmailText(data.primaryEmail.fullText);
      setActiveTab('primary');

      // Auto save into history
      const newDraftRecord: EmailDraftRecord = {
        id: 'draft_' + Date.now(),
        timestamp: Date.now(),
        description: description.trim(),
        tone: effectiveTone,
        subject: data.selectedSubject,
        fullText: data.primaryEmail.fullText,
        recipient: recipient.trim() || undefined,
        isStarred: false,
      };

      const updated = [newDraftRecord, ...drafts.slice(0, 29)];
      saveDraftsToStorage(updated);
      showToast('Professional email generated successfully!');
    } catch (err: any) {
      console.error('Error generating email:', err);
      setErrorMessage(
        err?.message || 'Failed to generate email. Please check your connection and try again.'
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  // Handle Tab Switch (Primary vs Alternative Angle)
  const handleSelectTab = (tab: 'primary' | 'variant') => {
    setActiveTab(tab);
    if (!generatedData) return;
    if (tab === 'primary') {
      setActiveEmailText(generatedData.primaryEmail.fullText);
    } else {
      setActiveEmailText(generatedData.alternativeVariant.fullText);
    }
  };

  // Handle AI Refinement
  const handleRefine = async (refinementType: string, customInstruction?: string) => {
    if (!activeEmailText.trim() || isRefining) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/refine-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: activeEmailText,
          currentSubject: activeSubject,
          refinementType,
          customInstruction,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Refinement failed with status ${res.status}`);
      }

      const data: RefineResponse = await res.json();
      setActiveEmailText(data.refinedEmail);
      if (data.refinedSubject) {
        setActiveSubject(data.refinedSubject);
      }
      showToast(`Refined: ${data.summaryOfChanges || 'Email updated'}`);
    } catch (err: any) {
      console.error('Refinement error:', err);
      setErrorMessage(err?.message || 'Failed to refine email.');
    } finally {
      setIsRefining(false);
    }
  };

  // Save / Star current active email
  const handleSaveDraft = () => {
    if (!activeEmailText.trim()) return;
    const existingIndex = drafts.findIndex((d) => d.fullText === activeEmailText);
    if (existingIndex >= 0) {
      const copy = [...drafts];
      copy[existingIndex].isStarred = !copy[existingIndex].isStarred;
      saveDraftsToStorage(copy);
      showToast(
        copy[existingIndex].isStarred
          ? 'Draft added to Starred!'
          : 'Draft unstarred'
      );
    } else {
      const newDraftRecord: EmailDraftRecord = {
        id: 'draft_' + Date.now(),
        timestamp: Date.now(),
        description: description.trim(),
        tone,
        subject: activeSubject,
        fullText: activeEmailText,
        recipient: recipient.trim() || undefined,
        isStarred: true,
      };
      saveDraftsToStorage([newDraftRecord, ...drafts]);
      showToast('Draft saved and starred!');
    }
  };

  const isCurrentDraftSaved = drafts.some(
    (d) => d.fullText === activeEmailText && d.isStarred
  );

  // Restore draft from history
  const handleSelectDraft = (draft: EmailDraftRecord) => {
    setDescription(draft.description);
    setTone(draft.tone);
    if (draft.recipient) setRecipient(draft.recipient);
    setActiveSubject(draft.subject);
    setActiveEmailText(draft.fullText);

    // Mock response object to populate studio
    setGeneratedData({
      subjectLines: [{ text: draft.subject, badge: 'Loaded' }],
      selectedSubject: draft.subject,
      primaryEmail: {
        greeting: '',
        body: draft.fullText,
        closing: '',
        signOff: '',
        fullText: draft.fullText,
      },
      alternativeVariant: {
        title: 'Alternate Version',
        description: 'Previously generated version',
        fullText: draft.fullText,
      },
      toneAnalysis: {
        primaryTone: draft.tone,
        politenessRating: 'High',
        estimatedReadTimeSeconds: Math.max(
          10,
          Math.round(draft.fullText.split(/\s+/).length / 3)
        ),
        keyTakeaway: draft.description,
      },
      suggestedFollowUps: ['Review dates and links before sending'],
    });

    showToast('Loaded draft into studio');
  };

  // Toggle star in history modal
  const handleToggleStar = (id: string) => {
    const updated = drafts.map((d) =>
      d.id === id ? { ...d, isStarred: !d.isStarred } : d
    );
    saveDraftsToStorage(updated);
  };

  // Delete draft in history modal
  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your email history?')) {
      saveDraftsToStorage([]);
      showToast('History cleared');
    }
  };

  // Apply Scenario Preset
  const handleSelectPreset = (preset: PresetItem) => {
    setDescription(preset.description);
    setTone(preset.tone);
    setIntent(preset.intent);
    setRecipient(preset.recipient);
    setLength(preset.length);
    setCallToAction(preset.callToAction);
    showToast(`Loaded scenario: "${preset.title}"`);
  };

  // Reset to empty
  const handleReset = () => {
    setDescription('');
    setRecipient('');
    setCallToAction('');
    setGeneratedData(null);
    setActiveSubject('');
    setActiveEmailText('');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onReset={handleReset}
        historyCount={drafts.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Generation Error</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-800 font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Studio (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <InputSection
              description={description}
              onChangeDescription={setDescription}
              tone={tone}
              onSelectTone={setTone}
              customToneText={customToneText}
              onChangeCustomToneText={setCustomToneText}
              recipient={recipient}
              onChangeRecipient={setRecipient}
              senderName={senderName}
              onChangeSenderName={setSenderName}
              intent={intent}
              onChangeIntent={setIntent}
              length={length}
              onChangeLength={setLength}
              callToAction={callToAction}
              onChangeCallToAction={setCallToAction}
              language={language}
              onChangeLanguage={setLanguage}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              loadingStepText={loadingStepText}
            />
          </div>

          {/* Right Column: Output & Refinement Studio (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <EmailPreview
              data={generatedData}
              activeSubject={activeSubject}
              onSelectSubject={setActiveSubject}
              onEditSubject={setActiveSubject}
              activeEmailText={activeEmailText}
              onChangeActiveEmailText={setActiveEmailText}
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              recipient={recipient}
              senderName={senderName}
              onSaveDraft={handleSaveDraft}
              isSaved={isCurrentDraftSaved}
              onRefine={handleRefine}
              isRefining={isRefining}
              onRegenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-500 text-xs py-4 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BriefMail Studio • Executive Email Generation & Tone Engineering</span>
          <span className="text-[11px] text-slate-400">
            Powered by Google Gemini 3.8 Flash • Press ⌘+Enter to Draft
          </span>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        drafts={drafts}
        onSelectDraft={handleSelectDraft}
        onToggleStar={handleToggleStar}
        onDeleteDraft={handleDeleteDraft}
        onClearAll={handleClearAllHistory}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}
