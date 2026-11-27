import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Lightbulb,
  PenLine,
  Trash2,
} from 'lucide-react';
import { WRITING_PROMPTS } from '../../data/practiceData';
import { useApp } from '../../context/AppContext';

interface WritingPracticePadProps {
  guideId: string;
  targetWords: number;
}

export const WritingPracticePad: React.FC<WritingPracticePadProps> = ({
  guideId,
  targetWords,
}) => {
  const { state, saveWritingDraft } = useApp();
  const prompts = WRITING_PROMPTS[guideId] ?? [];
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [showOutline, setShowOutline] = useState(false);

  const activePrompt = prompts[selectedPromptIdx];
  const draftKey = activePrompt ? `${guideId}_${activePrompt.id}` : guideId;
  const legacyDraftKey =
    guideId === 'writing-task2-opinion' && activePrompt
      ? `writing-task2-cause-adv_${activePrompt.id}`
      : null;
  const text =
    state.writingDrafts[draftKey] ??
    (legacyDraftKey ? state.writingDrafts[legacyDraftKey] : undefined) ??
    state.writingDrafts[guideId] ??
    '';

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedPromptIdx(0);
    setShowOutline(false);
  }, [guideId]);

  const handleChange = (val: string) => {
    saveWritingDraft(draftKey, val);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const reachedTarget = wordCount >= targetWords;
  const pct = Math.min(100, Math.round((wordCount / targetWords) * 100));

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="space-y-4">
      {/* Sample Prompts Selector */}
      {prompts.length > 0 && activePrompt && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {prompts.map((p, idx) => {
                const shortLabel =
                  guideId === 'writing-task2-opinion' && p.title.includes(':')
                    ? p.title.split(':')[0].trim()
                    : `Đề ${idx + 1}`;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPromptIdx(idx);
                      setShowOutline(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      selectedPromptIdx === idx
                        ? 'bg-amber-500 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowOutline((o) => !o)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showOutline ? 'Ẩn gợi ý dàn ý' : 'Xem gợi ý dàn ý & Từ vựng'}
            </button>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <FileText className="w-3.5 h-3.5" />
              {activePrompt.title}
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
              {activePrompt.promptText}
            </p>
          </div>

          {showOutline && (
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 p-3.5 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Gợi ý dàn ý nhanh:
              </div>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 dark:text-slate-300">
                {activePrompt.outlineHints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500">Từ vựng gợi ý:</span>
                {activePrompt.suggestedVocab.map((v) => (
                  <span
                    key={v}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Writing Pad */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
            <PenLine className="w-4 h-4 text-indigo-500" />
            Khung luyện viết thực chiến (Tự động lưu nháp)
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              reachedTarget
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {reachedTarget && <CheckCircle2 className="w-3.5 h-3.5" />}
            {wordCount} / ≥{targetWords} từ
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              reachedTarget ? 'bg-emerald-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <textarea
          rows={9}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Bấm giờ phía trên và viết bài tiếng Anh của bạn tại đây (Mục tiêu tối thiểu ${targetWords} từ)...`}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {reachedTarget
              ? 'Đã đạt chuẩn độ dài tối thiểu VSTEP — hãy rà lỗi ngữ pháp & từ nối.'
              : `Cần thêm ít nhất ${targetWords - wordCount} từ để đạt chuẩn.`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!text.trim()}
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Đã chép' : 'Sao chép bài'}
            </button>
            <button
              type="button"
              disabled={!text}
              onClick={() => handleChange('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa nháp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
