import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  GitBranch,
  HelpCircle,
  Lightbulb,
  Mic,
  Square,
  Trash2,
} from 'lucide-react';
import {
  SPEAKING_PART1_PROMPTS,
  SPEAKING_PART2_PROMPTS,
  SPEAKING_PART3_PROMPTS,
} from '../../data/practiceData';
import { SKILL_GUIDES } from '../../data/skillsData';

interface SpeakingPracticeProps {
  guideId: string;
}

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ guideId }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setSelectedIdx(0);
    setShowHints(false);
  }, [guideId]);

  useEffect(() => {
    if (!isRecording) return undefined;
    const id = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Trình duyệt của bạn không hỗ trợ ghi âm micro.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecordSeconds(0);
      setIsRecording(true);
    } catch {
      setMicError(
        'Không thể truy cập micro. Hãy cấp quyền Micro trên trình duyệt hoặc kiểm tra thiết bị thu âm.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordSeconds(0);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const promptList =
    guideId === 'speaking-part1'
      ? SPEAKING_PART1_PROMPTS
      : guideId === 'speaking-part2'
      ? SPEAKING_PART2_PROMPTS
      : SPEAKING_PART3_PROMPTS;

  const currentGuideTemplates =
    SKILL_GUIDES.find((g) => g.id === guideId)?.templates ?? [];

  return (
    <div className="space-y-4">
      {/* Prompt Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {promptList.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setShowHints(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                selectedIdx === idx
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Đề {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(guideId === 'speaking-part2' || guideId === 'speaking-part3') && (
            <button
              type="button"
              onClick={() => setShowHints((s) => !s)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHints ? 'Ẩn gợi ý ý tưởng' : 'Xem gợi ý ý tưởng'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowTemplates((s) => !s)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showTemplates ? 'Ẩn mẫu câu vạn năng' : 'Mẫu câu vạn năng khi nói'}
          </button>
        </div>
      </div>

      {showTemplates && currentGuideTemplates.length > 0 && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/25 p-4 space-y-3 text-xs">
          {currentGuideTemplates.map((tpl) => (
            <div key={tpl.label} className="space-y-1.5">
              <div className="font-bold text-indigo-800 dark:text-indigo-300">
                {tpl.label}
              </div>
              <ul className="space-y-1 list-disc pl-4 text-slate-700 dark:text-slate-200">
                {tpl.phrases.map((ph, i) => (
                  <li key={i}>{ph}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* PART 1 CARD */}
      {guideId === 'speaking-part1' && (() => {
        const item = SPEAKING_PART1_PROMPTS[selectedIdx] ?? SPEAKING_PART1_PROMPTS[0];
        return (
          <div className="rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 p-5 space-y-4">
            <h3 className="font-bold text-sm text-violet-900 dark:text-violet-200">
              {item.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {item.topics.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2.5"
                >
                  <div className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                    {t.name}
                  </div>
                  <ol className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-decimal pl-4">
                    {t.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* PART 2 CARD */}
      {guideId === 'speaking-part2' && (() => {
        const item = SPEAKING_PART2_PROMPTS[selectedIdx] ?? SPEAKING_PART2_PROMPTS[0];
        return (
          <div className="rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 p-5 space-y-4">
            <h3 className="font-bold text-sm text-violet-900 dark:text-violet-200">
              {item.title}
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              {item.situation}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {item.options.map((opt, idx) => (
                <div
                  key={opt.label}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 space-y-2"
                >
                  <div className="text-xs font-bold text-violet-700 dark:text-violet-300">
                    Lựa chọn {idx + 1}: {opt.label}
                  </div>
                  {showHints && (
                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-emerald-700 dark:text-emerald-400">
                        <strong>Ưu:</strong> {opt.pros}
                      </div>
                      <div className="text-rose-600 dark:text-rose-400">
                        <strong>Nhược:</strong> {opt.cons}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* PART 3 MINDMAP CARD */}
      {guideId === 'speaking-part3' && (() => {
        const item = SPEAKING_PART3_PROMPTS[selectedIdx] ?? SPEAKING_PART3_PROMPTS[0];
        return (
          <div className="rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 p-5 space-y-4">
            <h3 className="font-bold text-sm text-violet-900 dark:text-violet-200 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" />
              {item.title}
            </h3>

            {/* Mindmap Layout */}
            <div className="space-y-3">
              <div className="mx-auto max-w-md rounded-2xl bg-violet-600 text-white text-center px-5 py-3.5 font-bold text-sm shadow-md">
                {item.centralTopic}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {item.ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white dark:bg-slate-900 border-2 border-violet-200 dark:border-violet-800 p-3 text-center text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-[68px]"
                  >
                    {idea}
                  </div>
                ))}
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-dashed border-amber-400 dark:border-amber-700 p-3 text-center text-xs font-semibold text-amber-800 dark:text-amber-300 flex flex-col items-center justify-center min-h-[68px]">
                  <span>[Your own idea]</span>
                  {showHints && (
                    <span className="mt-1 font-normal text-[11px]">
                      Gợi ý: {item.yourOwnIdeaHint}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Follow-up questions */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
                Follow-up Questions (Trả lời cuối bài nói)
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-disc pl-4">
                {item.followUpQuestions.map((fq, i) => (
                  <li key={i}>{fq}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}

      {/* Voice Recorder Widget */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
              <Mic className="w-4 h-4 text-rose-500" />
              Ghi âm & Nghe lại giọng nói của bạn
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thu âm thử bài nói để tự kiểm tra tốc độ, ngữ điệu và phát âm âm cuối (-s, -ed).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                {formatDuration(recordSeconds)}
              </span>
            )}

            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                {audioUrl ? 'Ghi âm mới' : 'Bắt đầu ghi âm'}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                Dừng ghi âm
              </button>
            )}
          </div>
        </div>

        {micError && (
          <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{micError}</span>
          </div>
        )}

        {audioUrl && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <audio controls src={audioUrl} className="w-full h-10" />
            <button
              type="button"
              onClick={clearRecording}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa bản thu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
