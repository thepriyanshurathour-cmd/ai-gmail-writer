import React, { useState } from 'react';
import {
  X,
  History,
  Star,
  Copy,
  Check,
  Trash2,
  Search,
  ExternalLink,
} from 'lucide-react';
import { EmailDraftRecord } from '../types/email';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: EmailDraftRecord[];
  onSelectDraft: (draft: EmailDraftRecord) => void;
  onToggleStar: (id: string) => void;
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onToggleStar,
  onDeleteDraft,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDrafts = drafts.filter((d) => {
    if (filterStarredOnly && !d.isStarred) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.subject.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tone.toLowerCase().includes(q) ||
      d.fullText.toLowerCase().includes(q)
    );
  });

  const handleCopy = (draft: EmailDraftRecord) => {
    navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.fullText}`);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Saved Drafts & Generation History
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {drafts.length} total
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past emails by subject, brief, or content..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterStarredOnly(!filterStarredOnly)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              filterStarredOnly
                ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${filterStarredOnly ? 'fill-amber-500 text-amber-500' : ''}`}
            />
            <span>Starred</span>
          </button>
          {drafts.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-2 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Clear all history"
            >
              Clear
            </button>
          )}
        </div>

        {/* List of drafts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredDrafts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {drafts.length === 0
                ? 'No drafts generated yet. Create your first email on the studio!'
                : 'No drafts match your search filter.'}
            </div>
          ) : (
            filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800/80 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {draft.tone}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(draft.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {draft.subject}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onToggleStar(draft.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-500 transition-colors"
                      title={draft.isStarred ? 'Unstar' : 'Star'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${draft.isStarred ? 'fill-amber-500 text-amber-500' : ''}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(draft)}
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Copy full email"
                    >
                      {copiedId === draft.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                  {draft.fullText}
                </p>

                <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400 truncate max-w-[280px]">
                    Brief: "{draft.description}"
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDraft(draft);
                      onClose();
                    }}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Load in Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
