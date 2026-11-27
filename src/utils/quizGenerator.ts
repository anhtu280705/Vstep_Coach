import { VocabWord } from '../types';

export type QuizKind = 'meaning' | 'word' | 'type' | 'listen';

export interface QuizQuestionItem {
  wordObj: VocabWord;
  kind: QuizKind;
  promptTitle: string;
  promptSub: string;
  maskedSentence?: string;
  options: { label: string; sub?: string; wordId: string }[];
  correctWordId: string;
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function maskWordInSentence(sentence: string, targetWord: string): string {
  const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}[a-z]*\\b`, 'i');
  if (regex.test(sentence)) {
    return sentence.replace(regex, '________');
  }
  return sentence;
}

export function buildHintMask(word: string, revealLevel: number): string {
  return word
    .split(' ')
    .map((part) => {
      if (part.length <= 2) return part[0] + '_'.repeat(Math.max(0, part.length - 1));
      const chars = part.split('');
      return chars
        .map((ch, idx) => {
          if (ch === '-' || ch === "'") return ch;
          if (idx === 0) return ch;
          if (revealLevel >= 1 && idx === chars.length - 1) return ch;
          if (revealLevel >= 2 && idx === 1) return ch;
          return '_';
        })
        .join(' ');
    })
    .join('   ');
}

export function normalizeAnswer(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function pickDistractors(
  target: VocabWord,
  words: VocabWord[],
  pool: VocabWord[]
): VocabWord[] {
  // Ưu tiên lấy 3 đáp án nhiễu từ chính tập từ đang ôn (vd: 10 từ vừa học)
  const fromSession = shuffle(words.filter((w) => w.id !== target.id)).slice(0, 3);
  if (fromSession.length === 3) {
    return fromSession;
  }

  // Chỉ bổ sung thêm khi tập đang ôn có ít hơn 4 từ (vd: ôn lại 1-3 từ làm sai)
  const usedIds = new Set<string>([target.id, ...fromSession.map((w) => w.id)]);
  const sameTopic = shuffle(
    pool.filter((w) => !usedIds.has(w.id) && w.topicId === target.topicId)
  );
  const picked = [...fromSession];

  for (const item of sameTopic) {
    if (picked.length >= 3) break;
    picked.push(item);
    usedIds.add(item.id);
  }

  if (picked.length < 3) {
    const restPool = shuffle(pool.filter((w) => !usedIds.has(w.id)));
    for (const item of restPool) {
      if (picked.length >= 3) break;
      picked.push(item);
    }
  }

  return picked;
}

export function buildQuizQuestions(words: VocabWord[], pool: VocabWord[]): QuizQuestionItem[] {
  // Cycle through all 4 rich modes: chọn từ đúng nghĩa, điền từ đúng nghĩa, chọn nghĩa đúng, nghe chọn từ
  const kinds: QuizKind[] = ['word', 'type', 'meaning', 'listen'];

  return shuffle(words).map((target, idx) => {
    const kind = kinds[idx % kinds.length];
    const distractors = pickDistractors(target, words, pool);
    const allChoices = shuffle([target, ...distractors]);

    if (kind === 'meaning') {
      return {
        wordObj: target,
        kind,
        promptTitle: target.word,
        promptSub: `${target.ipa} · (${target.pos})`,
        options: allChoices.map((c) => ({
          label: c.meaning,
          wordId: c.id,
        })),
        correctWordId: target.id,
      };
    }

    if (kind === 'word') {
      return {
        wordObj: target,
        kind,
        promptTitle: target.meaning,
        promptSub: `Chọn từ tiếng Anh đúng nghĩa (${target.pos} · ${target.level})`,
        options: allChoices.map((c) => ({
          label: c.word,
          sub: c.ipa,
          wordId: c.id,
        })),
        correctWordId: target.id,
      };
    }

    if (kind === 'listen') {
      return {
        wordObj: target,
        kind,
        promptTitle: 'Nghe phát âm và chọn từ tiếng Anh đúng',
        promptSub: `Nghĩa: ${target.meaning}`,
        options: allChoices.map((c) => ({
          label: c.word,
          sub: c.ipa,
          wordId: c.id,
        })),
        correctWordId: target.id,
      };
    }

    // kind === 'type' (Điền từ đúng nghĩa)
    return {
      wordObj: target,
      kind: 'type',
      promptTitle: target.meaning,
      promptSub: `Loại từ: (${target.pos}) · Gõ từ tiếng Anh tương ứng`,
      maskedSentence: maskWordInSentence(target.example, target.word),
      options: [],
      correctWordId: target.id,
    };
  });
}
