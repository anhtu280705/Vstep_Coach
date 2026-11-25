import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, RotateCcw, Zap } from 'lucide-react';

interface StudyFocusBarProps {
  dayNumber: number;
  doneMinutes: number;
  totalMinutes: number;
}

const FOCUS_PRESETS = [
  { label: '25p · Pomodoro', seconds: 25 * 60 },
  { label: '50p · Chặng sâu', seconds: 50 * 60 },
  { label: '120p · Ca đầy 2h', seconds: 120 * 60 },
];

export const StudyFocusBar: React.FC<StudyFocusBarProps> = ({
  dayNumber,
  doneMinutes,
  totalMinutes,
}) => {
  const [presetIdx, setPresetIdx] = useState(2); // Default to 120m (2 hours)
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_PRESETS[2].seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;
  const formatted =
    hours > 0
      ? `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const timePct =
    totalMinutes > 0
      ? Math.min(100, Math.round((doneMinutes / totalMinutes) * 100))
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
      {/* Left: Daily 2-hour minutes progress */}
      <div className="lg:col-span-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <Clock className="w-4 h-4 text-indigo-500" />
            Thời lượng học hôm nay (Ngày {dayNumber}/14)
          </span>
          <span className="text-indigo-600 dark:text-indigo-400">
            {doneMinutes} / {totalMinutes} phút ({timePct}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Gợi ý chia 2 tiếng/ngày: 35p Từ vựng + 25p Ngữ pháp + 25p Kỹ năng + 35p Thực chiến & Speed Quiz.
        </p>
      </div>

      {/* Right: Focus Timer */}
      <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:pl-4 lg:border-l border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Zap className="w-4 h-4 text-amber-500" />
            Đồng hồ tập trung 2 tiếng
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FOCUS_PRESETS.map((p, idx) => (
              <button
                key={p.label}
                onClick={() => {
                  setPresetIdx(idx);
                  setSecondsLeft(p.seconds);
                  setRunning(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                  presetIdx === idx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <span
            className={`font-mono text-2xl font-extrabold tracking-tight ${
              secondsLeft === 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatted}
          </span>
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
          >
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {running ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setSecondsLeft(FOCUS_PRESETS[presetIdx].seconds);
            }}
            title="Đặt lại đồng hồ"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
