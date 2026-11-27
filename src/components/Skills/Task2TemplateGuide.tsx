import React, { useState } from 'react';
import { Check, Copy, FileText, Sparkles } from 'lucide-react';

interface EssayTypeInfo {
  id: 'opinion' | 'discussion' | 'adv' | 'cause';
  num: string;
  name: string;
  vi: string;
  cues: string;
  body1: string;
  body2: string;
  tip: string;
  thesis: string;
  b1Topic: string;
  b2Topic: string;
  concl: string;
}

const TASK2_ESSAY_TYPES: EssayTypeInfo[] = [
  {
    id: 'opinion',
    num: '1',
    name: 'Opinion',
    vi: 'Nêu quan điểm',
    cues: '“Do you agree or disagree?” · “To what extent do you agree or disagree?”',
    body1: 'Lý do / luận điểm 1 ủng hộ lập trường của bạn.',
    body2: 'Lý do / luận điểm 2 củng cố lập trường của bạn.',
    tip: 'Phải chốt rõ lập trường (đồng ý / phản đối / đồng ý một phần) ngay ở Mở bài và Kết bài.',
    thesis:
      'I strongly agree (hoặc partly agree) that [quan điểm] for two main reasons.',
    b1Topic: 'First, there is a clear reason why I support this idea.',
    b2Topic: 'In addition, there is another strong reason for my opinion.',
    concl:
      'In conclusion, although some people disagree, I still believe that [quan điểm].',
  },
  {
    id: 'discussion',
    num: '2',
    name: 'Discussion',
    vi: 'Thảo luận 2 chiều',
    cues: '“Discuss both views and give your own opinion.”',
    body1: 'Phân tích mặt được / lý do của quan điểm A.',
    body2: 'Phân tích quan điểm B (thường là phía bạn nghiêng về).',
    tip: 'Bẫy hay gặp: Chỉ bàn 2 chiều mà QUÊN nêu quan điểm cá nhân ở Mở bài và Kết bài.',
    thesis:
      'This essay will look at both sides and explain why I agree with the second view.',
    b1Topic:
      'On the one hand, some people support [quan điểm A] for several reasons.',
    b2Topic:
      'On the other hand, I agree with people who think that [quan điểm B].',
    concl:
      'In conclusion, both sides have good points, but I personally believe that [quan điểm bạn chọn].',
  },
  {
    id: 'adv',
    num: '3',
    name: 'Adv & Disadv',
    vi: 'Lợi ích & Hạn chế',
    cues: '“Discuss the advantages and disadvantages...” · “Do advantages outweigh disadvantages?”',
    body1: '2 lợi ích (Advantages) nổi bật nhất.',
    body2: '2 hạn chế (Disadvantages) nổi bật nhất.',
    tip: 'Nếu đề có chữ “outweigh”, bắt buộc phải khẳng định bên nào nhiều hơn ở Mở bài và Kết bài.',
    thesis:
      'This essay will discuss both the good and bad points of this trend. (Nếu có "outweigh": I think the benefits are greater than the drawbacks.)',
    b1Topic: 'On the one hand, [chủ đề] brings some clear benefits.',
    b2Topic: 'On the other hand, this trend also has some clear problems.',
    concl:
      'In conclusion, despite some problems, [chủ đề] brings many benefits (nếu có "outweigh": that are greater than its drawbacks).',
  },
  {
    id: 'cause',
    num: '4',
    name: 'Causes & Solutions',
    vi: 'Nguyên nhân & Giải pháp',
    cues: '“What are the reasons/effects and what solutions can be taken?”',
    body1: '2 nguyên nhân (hoặc hệ quả) chính của vấn đề.',
    body2: '2 giải pháp cụ thể (cấp Chính phủ/Trường học & Cá nhân).',
    tip: 'Tránh viết giải pháp chung chung; giải pháp ở Body 2 nên giải quyết trực tiếp nguyên nhân ở Body 1.',
    thesis:
      'This essay will explain the main reasons for this problem and suggest some useful solutions.',
    b1Topic: 'There are two main reasons why this problem happens.',
    b2Topic: 'However, there are some simple ways to solve this problem.',
    concl:
      'In conclusion, [vấn đề] happens because of [nguyên nhân], and we need clear actions to fix it.',
  },
];

function buildPlainTemplate(info: EssayTypeInfo): string {
  return [
    `Nowadays, [viết lại chủ đề] has become a very popular topic in modern life. Many people talk about this issue today. ${info.thesis}`,
    `${info.b1Topic} First of all, it is clear that [Ý 1A]. This is because [giải thích 1A]. For example, [ví dụ 1A], and this shows how important it is. Second, another important point is that [Ý 1B]. As a result, this can lead to [kết quả 1B].`,
    `${info.b2Topic} To begin with, one main point to think about is that [Ý 2A]. In fact, [giải thích 2A]. For instance, [ví dụ 2A], which makes this point even clearer. Besides, we should also remember that [Ý 2B]. Because of this, [kết quả 2B].`,
    `${info.concl} Therefore, both people and the government should think carefully about this issue to get the best result.`,
  ].join('\n\n');
}

export const Task2TemplateGuide: React.FC = () => {
  const [selectedId, setSelectedId] = useState<EssayTypeInfo['id']>('opinion');
  const [copied, setCopied] = useState(false);

  const cur =
    TASK2_ESSAY_TYPES.find((item) => item.id === selectedId) ??
    TASK2_ESSAY_TYPES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainTemplate(cur));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 Essay Type Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TASK2_ESSAY_TYPES.map((item) => {
          const isActive = item.id === cur.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-slate-900 dark:text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {item.num}. {item.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {item.vi}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Essay Type Summary Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {cur.num}. {cur.name} ({cur.vi})
          </h3>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
            4 đoạn · ≥ 250 từ · 40 phút
          </span>
        </div>

        <div className="text-xs sm:text-sm space-y-2.5">
          <div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              Dấu hiệu đề:{' '}
            </span>
            <span className="text-slate-800 dark:text-slate-200">{cur.cues}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Body 1 (~90–110 từ)
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cur.body1}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Body 2 (~90–110 từ)
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cur.body2}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">
            <span className="font-bold text-amber-700 dark:text-amber-400">
              Lưu ý ăn điểm:{' '}
            </span>
            {cur.tip}
          </div>
        </div>
      </div>

      {/* Universal Simple Essay Template Card */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/35 dark:bg-emerald-950/15 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-200/80 dark:border-emerald-900/50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <FileText className="w-4 h-4" />
              Bài mẫu chung dễ nhớ · Dạng {cur.name}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 font-medium">
                ~150 từ cố định · điền ý ~9–10 từ/ô là &gt;260 từ
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500/20 border border-indigo-500/50 inline-block" />
                Phần tô màu = 3 khớp nối đổi theo dạng đề
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Đã chép
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Chép bài mẫu
              </>
            )}
          </button>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Đoạn 1 — Mở bài (~33 từ khung)
            </div>
            <p>
              Nowadays, [viết lại chủ đề] has become a very popular topic in
              modern life. Many people talk about this issue today.{' '}
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.5 rounded">
                {cur.thesis}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Đoạn 2 — Body 1 (~45 từ khung)
            </div>
            <p>
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.5 rounded">
                {cur.b1Topic}
              </span>{' '}
              First of all, it is clear that [Ý 1A]. This is because [giải thích
              1A]. For example, [ví dụ 1A], and this shows how important it is.
              Second, another important point is that [Ý 1B]. As a result, this
              can lead to [kết quả 1B].
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Đoạn 3 — Body 2 (~41 từ khung)
            </div>
            <p>
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.5 rounded">
                {cur.b2Topic}
              </span>{' '}
              To begin with, one main point to think about is that [Ý 2A]. In
              fact, [giải thích 2A]. For instance, [ví dụ 2A], which makes this
              point even clearer. Besides, we should also remember that [Ý 2B].
              Because of this, [kết quả 2B].
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Đoạn 4 — Kết bài (~32 từ khung)
            </div>
            <p>
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.5 rounded">
                {cur.concl}
              </span>{' '}
              Therefore, both people and the government should think carefully
              about this issue to get the best result.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Reference Table of 3 Joints + Easy Connectors */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Bảng tra nhanh 3 khớp nối cho cả 4 dạng đề
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Bấm vào hàng để chọn dạng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-3 font-semibold whitespace-nowrap">
                  Dạng đề
                </th>
                <th className="py-2 pr-3 font-semibold">Khớp 1 (Mở bài)</th>
                <th className="py-2 pr-3 font-semibold">
                  Khớp 2 (Mở Body 1 &amp; 2)
                </th>
                <th className="py-2 font-semibold">Khớp 3 (Kết bài)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {TASK2_ESSAY_TYPES.map((row) => {
                const isActive = row.id === cur.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-950/60'
                    }`}
                  >
                    <td className="py-2.5 pr-3 align-top font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {row.num}. {row.name}
                      <div className="font-normal text-[11px] text-slate-500 dark:text-slate-400">
                        {row.vi}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 align-top text-slate-700 dark:text-slate-300">
                      {row.thesis}
                    </td>
                    <td className="py-2.5 pr-3 align-top text-slate-700 dark:text-slate-300 space-y-1">
                      <div>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          B1:
                        </span>{' '}
                        {row.b1Topic}
                      </div>
                      <div>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          B2:
                        </span>{' '}
                        {row.b2Topic}
                      </div>
                    </td>
                    <td className="py-2.5 align-top text-slate-700 dark:text-slate-300">
                      {row.concl}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Compact Easy Connectors Box */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Bộ từ nối dễ thuộc trong 10 phút
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Body 1:
              </span>{' '}
              First of all → This is because → For example → Second → As a result
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Body 2:
              </span>{' '}
              To begin with → In fact → For instance → Besides → Because of this
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Kết bài:
              </span>{' '}
              In conclusion → Therefore
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
