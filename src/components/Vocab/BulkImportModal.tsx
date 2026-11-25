import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { VOCAB_TOPICS } from '../../data/vocabData';
import { VocabLevel, VocabWord } from '../../types';

interface BulkImportModalProps {
  onClose: () => void;
  onImport: (words: Omit<VocabWord, 'id' | 'isCustom'>[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  onClose,
  onImport,
}) => {
  const [topicId, setTopicId] = useState('custom');
  const [level, setLevel] = useState<VocabLevel>('B2');
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setError('Vui lòng dán ít nhất 1 dòng từ vựng theo định dạng: từ | nghĩa tiếng Việt');
      return;
    }

    const parsed: Omit<VocabWord, 'id' | 'isCustom'>[] = [];

    for (const line of lines) {
      // Support separator: | or Tab or " - "
      const parts = line.includes('|')
        ? line.split('|').map((s) => s.trim())
        : line.includes('\t')
        ? line.split('\t').map((s) => s.trim())
        : line.split(' - ').map((s) => s.trim());

      const word = parts[0];
      const meaning = parts[1];
      if (!word || !meaning) continue;

      const example =
        parts[2] || `I practiced using "${word}" in my VSTEP preparation today.`;
      const ipa = parts[3] || `/${word.toLowerCase()}/`;

      parsed.push({
        topicId,
        word,
        ipa,
        pos: 'n/v',
        level,
        meaning,
        example,
        exampleVi: `Ví dụ cho từ "${word}".`,
        collocations: [],
      });
    }

    if (parsed.length === 0) {
      setError(
        'Không tách được dòng hợp lệ nào. Mỗi dòng cần có dấu | (hoặc Tab hoặc " - "), ví dụ: resilient | kiên cường'
      );
      return;
    }

    onImport(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-500" />
            Nhập nhanh hàng loạt từ mới
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lưu vào chủ đề
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
              >
                <option value="custom">Từ vựng cá nhân</option>
                {VOCAB_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.titleVi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trình độ mặc định
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as VocabLevel)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
              >
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Dán danh sách từ (mỗi dòng 1 từ: <code className="font-mono">từ | nghĩa | ví dụ (tùy chọn)</code>)
            </label>
            <textarea
              rows={7}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setError('');
              }}
              placeholder={
                'resilient | kiên cường, phục hồi nhanh | Resilient communities recover faster after storms.\n' +
                'prioritize | ưu tiên | Students must prioritize sleep before exams.\n' +
                'versatile | đa năng, linh hoạt'
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Hỗ trợ dán trực tiếp từ Excel/Google Sheets (tách cột bằng Tab), dấu <code>|</code> hoặc <code> - </code>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Nhập tất cả từ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
