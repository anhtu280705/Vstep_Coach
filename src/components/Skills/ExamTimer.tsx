import React, { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { TimerPreset } from '../../types';

interface ExamTimerProps {
  presets: TimerPreset[];
}

export const ExamTimer: React.FC<ExamTimerProps> = ({ presets }) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(presets[0]?.seconds ?? 1200);
  const [running, setRunning] = useState(false);

  // Sync when presets change (switching skill guide)
  useEffect(() => {
    setSelectedPresetIdx(0);
    setSecondsLeft(presets[0]?.seconds ?? 1200);
    setRunning(false);
  }, [presets]);

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

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setSecondsLeft(presets[idx].seconds);
    setRunning(false);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/70 dark:bg-indigo-950/30 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">
          <Timer className="w-4 h-4" />
          Đồng hồ bấm giờ luyện thi thực chiến
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={p.label}
              onClick={() => handleSelectPreset(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedPresetIdx === idx
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div
          className={`font-mono text-3xl font-extrabold tracking-tight ${
            secondsLeft === 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {formatted}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Tạm dừng' : secondsLeft === 0 ? 'Chạy lại' : 'Bắt đầu'}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setSecondsLeft(presets[selectedPresetIdx]?.seconds ?? 1200);
            }}
            title="Đặt lại"
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
