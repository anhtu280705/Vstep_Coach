import { VocabLevel, VocabWord } from '../../types';

export function w(
  id: string,
  topicId: string,
  word: string,
  ipa: string,
  pos: string,
  level: VocabLevel,
  meaning: string,
  example: string,
  exampleVi: string,
  collocations: string[]
): VocabWord {
  return { id, topicId, word, ipa, pos, level, meaning, example, exampleVi, collocations };
}
