import React, { useState } from 'react';
import { X } from 'lucide-react';
import { VOCAB_TOPICS } from '../../data/vocabData';
import { VocabLevel, VocabWord } from '../../types';

interface CustomWordModalProps {
  initialWord?: VocabWord | null;
  defaultTopicId?: string;
  onClose: () => void;
  onSave: (data: Omit<VocabWord, 'id' | 'isCustom'>, existingId?: string) => void;
}

export const CustomWordModal: React.FC<CustomWordModalProps> = ({
  initialWord,
  defaultTopicId,
  onClose,
  onSave,
}) => {
  const [word, setWord] = useState(initialWord?.word ?? '');
  const [ipa, setIpa] = useState(initialWord?.ipa ?? '');
  const [pos, setPos] = useState(initialWord?.pos ?? 'n');
  const [level, setLevel] = useState<VocabLevel>(initialWord?.level ?? 'B2');
  const [topicId, setTopicId] = useState(initialWord?.topicId ?? defaultTopicId ?? 'custom');
  const [meaning, setMeaning] = useState(initialWord?.meaning ?? '');
  const [example, setExample] = useState(initialWord?.example ?? '');
  const [exampleVi, setExampleVi] = useState(initialWord?.exampleVi ?? '');
  const [collocationsText, setCollocationsText] = useState(
    initialWord?.collocations.join(', ') ?? ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      setError('Vui lòng nhập ít nhất Từ tiếng Anh và Nghĩa tiếng Việt.');
      return;
    }

    const collocations = collocationsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave(
      {
        topicId,
        word: word.trim(),
        ipa: ipa.trim() || `/${word.trim().toLowerCase()}/`,
        pos: pos.trim() || 'n',
        level,
        meaning: meaning.trim(),
        example:
          example.trim() ||
          `We discussed "${word.trim()}" in our English class today.`,
        exampleVi: exampleVi.trim() || `Ví dụ minh họa cho từ "${word.trim()}".`,
        collocations,
      },
      initialWord?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {initialWord ? 'Chỉnh sửa từ cá nhân' : 'Thêm từ mới vào kho học tập'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Từ / Cụm từ tiếng Anh *
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="vd: sustainable"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phiên âm IPA
              </label>
              <input
                type="text"
                value={ipa}
                onChange={(e) => setIpa(e.target.value)}
                placeholder="vd: /səˈsteɪ.nə.bəl/"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chủ đề
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                Từ loại
              </label>
              <select
                value={pos}
                onChange={(e) => setPos(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="n">Danh từ (n)</option>
                <option value="v">Động từ (v)</option>
                <option value="adj">Tính từ (adj)</option>
                <option value="adv">Trạng từ (adv)</option>
                <option value="phrase">Cụm từ (phrase)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trình độ
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as VocabLevel)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nghĩa tiếng Việt *
            </label>
            <input
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="vd: bền vững, không gây hại lâu dài"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Câu ví dụ tiếng Anh
            </label>
            <textarea
              rows={2}
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="vd: Governments must invest in sustainable energy."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Dịch nghĩa ví dụ
            </label>
            <input
              type="text"
              value={exampleVi}
              onChange={(e) => setExampleVi(e.target.value)}
              placeholder="vd: Chính phủ phải đầu tư vào năng lượng bền vững."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cụm từ hay đi kèm (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={collocationsText}
              onChange={(e) => setCollocationsText(e.target.value)}
              placeholder="vd: sustainable development, sustainable energy"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
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
              {initialWord ? 'Lưu thay đổi' : 'Thêm từ mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
