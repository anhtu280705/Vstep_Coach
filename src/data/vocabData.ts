import { VocabTopic, VocabWord } from '../types';
import { VOCAB_PACK_1 } from './vocab/pack1';
import { VOCAB_PACK_2 } from './vocab/pack2';
import { VOCAB_PACK_3 } from './vocab/pack3';
import { VOCAB_PACK_4 } from './vocab/pack4';
import { VOCAB_PACK_5 } from './vocab/pack5';

export const VOCAB_TOPICS: VocabTopic[] = [
  {
    id: 'education',
    title: 'Education & Learning',
    titleVi: 'Giáo dục & Học tập',
    description: '30 từ trọng tâm cho bài đọc học thuật, Writing Task 2 về giáo dục và Speaking Part 3.',
    iconName: 'GraduationCap',
    color: 'indigo',
  },
  {
    id: 'environment',
    title: 'Environment & Climate',
    titleVi: 'Môi trường & Khí hậu',
    description: '30 từ cực hay xuất hiện trong Reading Passage 3–4 và bài luận giải pháp môi trường.',
    iconName: 'Leaf',
    color: 'emerald',
  },
  {
    id: 'technology',
    title: 'Technology & Digital Life',
    titleVi: 'Công nghệ & Đời sống số',
    description: '30 từ B1–B2 về AI, mạng xã hội, học trực tuyến, tin giả và an ninh mạng.',
    iconName: 'Cpu',
    color: 'sky',
  },
  {
    id: 'health',
    title: 'Health & Lifestyle',
    titleVi: 'Sức khỏe & Lối sống',
    description: '30 từ thường gặp trong Listening Part 2, Speaking Part 1–2 và bài luận về lối sống.',
    iconName: 'HeartPulse',
    color: 'rose',
  },
  {
    id: 'work',
    title: 'Work & Career',
    titleVi: 'Công việc & Sự nghiệp',
    description: '30 từ dùng cho Email/Thư xin việc Task 1 và thảo luận môi trường làm việc.',
    iconName: 'Briefcase',
    color: 'amber',
  },
  {
    id: 'travel',
    title: 'Travel & Culture',
    titleVi: 'Du lịch & Văn hóa',
    description: '30 từ thiết yếu cho Listening Part 1–2 (sân bay, đặt phòng) và Speaking.',
    iconName: 'Plane',
    color: 'teal',
  },
  {
    id: 'daily-life',
    title: 'Daily Life & Urban Living',
    titleVi: 'Đời sống & Đô thị',
    description: '30 từ về giao thông, đô thị hóa, nhà ở, chi phí sinh hoạt và thói quen hằng ngày.',
    iconName: 'Building2',
    color: 'violet',
  },
  {
    id: 'social-issues',
    title: 'Social Issues & Community',
    titleVi: 'Vấn đề Xã hội & Cộng đồng',
    description: '30 từ nâng band B2 cho bài luận nguyên nhân – giải pháp và Speaking Part 3.',
    iconName: 'Users',
    color: 'orange',
  },
  {
    id: 'media',
    title: 'Media, Entertainment & Hobbies',
    titleVi: 'Truyền thông, Giải trí & Sở thích',
    description: '30 từ cực hữu ích cho Speaking Part 1–3, Listening và bài đọc về báo chí/giải trí.',
    iconName: 'Tv',
    color: 'pink',
  },
  {
    id: 'economy',
    title: 'Shopping, Money & Economy',
    titleVi: 'Mua sắm, Tài chính & Kinh tế',
    description: '30 từ về tiêu dùng, lạm phát, bảo hành, hoàn tiền (rất hay thi Writing Task 1 & Listening).',
    iconName: 'Wallet',
    color: 'lime',
  },
  {
    id: 'family',
    title: 'Family, Friends & Relationships',
    titleVi: 'Gia đình, Bạn bè & Quan hệ',
    description: '30 từ chuẩn cho thư thân mật Task 1 và bài nói về gia đình, bạn bè, nuôi dạy con.',
    iconName: 'HeartHandshake',
    color: 'red',
  },
  {
    id: 'academic',
    title: 'Academic Writing & Paraphrase B2',
    titleVi: 'Từ vựng Học thuật & Paraphrase B2',
    description: '30 động từ, tính từ & từ nối học thuật "xương sống" giúp nâng thẳng điểm Reading & Writing B2.',
    iconName: 'Feather',
    color: 'cyan',
  },
  {
    id: 'people',
    title: 'Describing People & Personality',
    titleVi: 'Miêu tả Con người & Tính cách',
    description: '30 tính từ & cụm từ chuẩn cho Speaking Part 1–2 và thư thân mật Task 1.',
    iconName: 'Smile',
    color: 'fuchsia',
  },
  {
    id: 'crime-transport',
    title: 'Transport, Crime & Safety',
    titleVi: 'Giao thông, An ninh & Tội phạm',
    description: '30 từ vựng chủ đề An toàn giao thông, Pháp luật & Tội phạm đô thị rất hay ra trong Writing Task 2.',
    iconName: 'ShieldAlert',
    color: 'slate',
  },
];

export const DEFAULT_VOCAB_WORDS: VocabWord[] = [
  ...VOCAB_PACK_1,
  ...VOCAB_PACK_2,
  ...VOCAB_PACK_3,
  ...VOCAB_PACK_4,
  ...VOCAB_PACK_5,
];
