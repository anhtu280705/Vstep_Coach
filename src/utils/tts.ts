import { TtsAccent, TtsRate } from '../types';

let cachedVoices: SpeechSynthesisVoice[] = [];

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isTtsSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

function pickVoice(accent: TtsAccent): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (voices.length === 0) return null;

  const normalizedAccent = accent.toLowerCase();
  const exact = voices.find((v) => v.lang.toLowerCase() === normalizedAccent);
  if (exact) return exact;

  const prefixMatch = voices.find((v) =>
    v.lang.toLowerCase().startsWith(normalizedAccent.replace('-', '_')) ||
    v.lang.toLowerCase().includes(accent === 'en-GB' ? 'gb' : 'us')
  );
  if (prefixMatch) return prefixMatch;

  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  return anyEnglish ?? null;
}

export function stopSpeaking(): void {
  if (!isTtsSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore cancellation errors in restricted browsers
  }
}

export function speakText(
  text: string,
  options?: {
    accent?: TtsAccent;
    rate?: TtsRate;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (!isTtsSupported() || !text.trim()) {
    options?.onError?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const accent = options?.accent ?? 'en-US';
    utterance.lang = accent;
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = 1;

    const voice = pickVoice(accent);
    if (voice) {
      utterance.voice = voice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options?.onError?.();
    return false;
  }
}
