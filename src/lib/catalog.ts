export interface StockAvatar {
  id: string;
  name: string;
  role: string;
  roleVi: string;
  category: 'presenter' | 'ugc' | 'podcast' | 'educator' | 'broadcast' | 'founder' | 'pet';
  image: string;
  defaultVoiceId: string;
  languages: number;
  styleTag: string;
  accentColor: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  gender: 'Female' | 'Male' | 'Neutral';
  style: string;
  styleVi: string;
  pitch: number;
  rate: number;
  isCloned?: boolean;
  sampleText: string;
}

export interface AIModelInfo {
  id: string;
  apiId: string;
  name: string;
  provider: string;
  category: 'avatar' | 'video' | 'image';
  badge: string;
  resolution: string;
  maxDuration: string;
  creditsPerUnit: string;
  summaryEn: string;
  summaryVi: string;
  capabilities: string[];
  showcaseImage: string;
}

export interface PodcastStudioTemplate {
  id: string;
  title: string;
  category: 'AI & Technology' | 'Business' | 'Education' | 'Health & Care' | 'Personal Growth' | 'General';
  image: string;
  hostAId: string;
  hostBId: string;
}

export const STOCK_AVATARS: StockAvatar[] = [
  {
    id: 'av_aria_v4',
    name: 'Aria',
    role: 'Executive Brand Presenter',
    roleVi: 'MC Thương hiệu & Sản phẩm',
    category: 'presenter',
    image: '/assets/avatars/aria.jpg',
    defaultVoiceId: 'voice_alloy',
    languages: 88,
    styleTag: 'V-Character 4.0',
    accentColor: '#625df5',
  },
  {
    id: 'av_claire_v4',
    name: 'Claire',
    role: 'Creative Studio Host',
    roleVi: 'Host Sáng tạo & Đời sống',
    category: 'presenter',
    image: '/assets/avatars/claire.jpg',
    defaultVoiceId: 'voice_nova',
    languages: 88,
    styleTag: 'V-Character 4.0',
    accentColor: '#625df5',
  },
  {
    id: 'av_linh_v4',
    name: 'Linh Nguyen',
    role: 'UGC & Social Creator',
    roleVi: 'Creator UGC & Mạng xã hội',
    category: 'ugc',
    image: '/assets/avatars/linh.jpg',
    defaultVoiceId: 'voice_minh_anh',
    languages: 88,
    styleTag: 'UGC Ready',
    accentColor: '#625df5',
  },
  {
    id: 'av_marcus_v4',
    name: 'Marcus',
    role: 'Executive & Podcast Host',
    roleVi: 'Host Kinh doanh & Podcast',
    category: 'podcast',
    image: '/assets/avatars/marcus.jpg',
    defaultVoiceId: 'voice_echo',
    languages: 88,
    styleTag: 'V-Character 4.0',
    accentColor: '#625df5',
  },
  {
    id: 'av_david_v4',
    name: 'David',
    role: 'Newsroom & L&D Anchor',
    roleVi: 'BTV Bản tin & Đào tạo',
    category: 'educator',
    image: '/assets/avatars/david.jpg',
    defaultVoiceId: 'voice_daniel',
    languages: 88,
    styleTag: 'Training Host',
    accentColor: '#625df5',
  },
  {
    id: 'av_elena_v4',
    name: 'Elena',
    role: 'Keynote & Product Storyteller',
    roleVi: 'Diễn giả Ra mắt Sản phẩm',
    category: 'presenter',
    image: '/assets/avatars/elena.jpg',
    defaultVoiceId: 'voice_alloy',
    languages: 88,
    styleTag: 'Flagship Hero',
    accentColor: '#625df5',
  },
  {
    id: 'av_hannah_v4',
    name: 'Hannah',
    role: 'TikTok & Reels UGC Creator',
    roleVi: 'Creator Review TikTok & Reels',
    category: 'ugc',
    image: '/assets/avatars/hannah.jpg',
    defaultVoiceId: 'voice_nova',
    languages: 88,
    styleTag: 'Creator Ads',
    accentColor: '#625df5',
  },
  {
    id: 'av_sofia_v4',
    name: 'Sofia',
    role: 'Global Financial Anchor',
    roleVi: 'BTV Tài chính Quốc tế',
    category: 'broadcast',
    image: '/assets/avatars/sofia.jpg',
    defaultVoiceId: 'voice_nova',
    languages: 88,
    styleTag: 'Broadcast HD',
    accentColor: '#625df5',
  },
  {
    id: 'av_olivia_v4',
    name: 'Olivia',
    role: 'SaaS Walkthrough Presenter',
    roleVi: 'Chuyên gia Demo Phần mềm',
    category: 'presenter',
    image: '/assets/avatars/olivia.jpg',
    defaultVoiceId: 'voice_alloy',
    languages: 88,
    styleTag: 'SaaS Demo',
    accentColor: '#625df5',
  },
  {
    id: 'av_kenji_v4',
    name: 'Kenji',
    role: 'Tech Founder & Keynote',
    roleVi: 'Founder Công nghệ & Keynote',
    category: 'founder',
    image: '/assets/avatars/kenji.jpg',
    defaultVoiceId: 'voice_kenji',
    languages: 88,
    styleTag: 'Keynote 2K',
    accentColor: '#625df5',
  },
  {
    id: 'av_nina_v4',
    name: 'Nina',
    role: 'Travel & Lifestyle Presenter',
    roleVi: 'MC Phong cách sống & Du lịch',
    category: 'presenter',
    image: '/assets/avatars/nina.jpg',
    defaultVoiceId: 'voice_mateo',
    languages: 88,
    styleTag: '2K Daylight',
    accentColor: '#625df5',
  },
  {
    id: 'av_golden_pet',
    name: 'Barnaby Gold',
    role: 'Viral Pet Podcast & Skit Star',
    roleVi: 'Thú cưng Podcast & Skit Viral',
    category: 'pet',
    image: '/assets/avatars/golden-podcaster.jpg',
    defaultVoiceId: 'voice_echo',
    languages: 88,
    styleTag: 'Pet Video',
    accentColor: '#eab308',
  },
];

export const PODCAST_STUDIOS: PodcastStudioTemplate[] = [
  {
    id: 'mindful-mornings',
    title: 'Mindful Mornings Studio',
    category: 'Personal Growth',
    image: '/assets/showcase/podcast-mindful.jpg',
    hostAId: 'av_elena_v4',
    hostBId: 'av_marcus_v4',
  },
  {
    id: 'lecture-hall',
    title: 'Lecture Hall Voices',
    category: 'Education',
    image: '/assets/showcase/podcast-lecture.jpg',
    hostAId: 'av_david_v4',
    hostBId: 'av_sofia_v4',
  },
  {
    id: 'growth-mindset',
    title: 'Growth Mindset Corner',
    category: 'Business',
    image: '/assets/showcase/podcast-studio.jpg',
    hostAId: 'av_marcus_v4',
    hostBId: 'av_aria_v4',
  },
  {
    id: 'faculty-lounge',
    title: 'Faculty Lounge Podcast',
    category: 'AI & Technology',
    image: '/assets/showcase/podcast-mindful.jpg',
    hostAId: 'av_kenji_v4',
    hostBId: 'av_claire_v4',
  },
];

export const VOICE_CATALOG: VoiceOption[] = [
  {
    id: 'voice_alloy',
    name: 'Alloy',
    language: 'English (US)',
    languageCode: 'en-US',
    gender: 'Female',
    style: 'Warm, articulate studio presenter',
    styleVi: 'Ấm áp, rõ chữ, chuẩn thuyết trình',
    pitch: 1.05,
    rate: 1.0,
    sampleText: 'Welcome to VisionStory! Turn any idea, photo, or script into a lifelike AI video in minutes.',
  },
  {
    id: 'voice_echo',
    name: 'Echo',
    language: 'English (US)',
    languageCode: 'en-US',
    gender: 'Male',
    style: 'Confident conversational podcast host',
    styleVi: 'Tự tin, tự nhiên chuẩn host podcast',
    pitch: 0.92,
    rate: 1.0,
    sampleText: 'Hey everyone! Today we are breaking down how AI video agents automate your entire creative production workflow.',
  },
  {
    id: 'voice_nova',
    name: 'Nova',
    language: 'English (Global)',
    languageCode: 'en-GB',
    gender: 'Female',
    style: 'Crisp broadcast & product launch tone',
    styleVi: 'Sắc nét, sang trọng cho ra mắt sản phẩm',
    pitch: 1.1,
    rate: 1.02,
    sampleText: 'Introducing our latest quarterly release, localized automatically across eighty-eight languages.',
  },
  {
    id: 'voice_minh_anh',
    name: 'Minh Anh',
    language: 'Tiếng Việt (VN)',
    languageCode: 'vi-VN',
    gender: 'Female',
    style: 'Tự nhiên, truyền cảm hứng, chuẩn UGC & Review',
    styleVi: 'Tự nhiên, truyền cảm hứng, chuẩn UGC & Review',
    pitch: 1.08,
    rate: 1.0,
    sampleText: 'Xin chào! Chỉ cần tải lên một bức ảnh và kịch bản, VisionStory sẽ tạo ngay video AI nói chuyện cực kỳ sống động.',
  },
  {
    id: 'voice_quang_huy',
    name: 'Quang Huy',
    language: 'Tiếng Việt (VN)',
    languageCode: 'vi-VN',
    gender: 'Male',
    style: 'Trầm ấm, chuyên nghiệp cho đào tạo & doanh nghiệp',
    styleVi: 'Trầm ấm, chuyên nghiệp cho đào tạo & doanh nghiệp',
    pitch: 0.9,
    rate: 0.98,
    sampleText: 'Chào mừng bạn đến với bản trình bày sản phẩm mới nhất được tạo tự động từ slide trên VisionStory AI.',
  },
  {
    id: 'voice_daniel',
    name: 'Daniel',
    language: 'English (UK)',
    languageCode: 'en-GB',
    gender: 'Male',
    style: 'Calm instructional & documentary narrator',
    styleVi: 'Điềm tĩnh, chuẩn đào tạo & tài liệu',
    pitch: 0.95,
    rate: 0.96,
    sampleText: 'In module three, we will walk step by step through onboarding your global customer success team.',
  },
  {
    id: 'voice_mateo',
    name: 'Mateo',
    language: 'Español (LatAm)',
    languageCode: 'es-ES',
    gender: 'Male',
    style: 'Energetic commercial & social creator',
    styleVi: 'Năng lượng cao cho quảng cáo & mạng xã hội',
    pitch: 1.0,
    rate: 1.04,
    sampleText: 'Transforma cualquier foto y guion en un video con avatar realista listo para publicar en minutos.',
  },
  {
    id: 'voice_kenji',
    name: 'Kenji',
    language: '日本語 / English',
    languageCode: 'ja-JP',
    gender: 'Male',
    style: 'Executive keynote & product demo',
    styleVi: 'Phong thái lãnh đạo công nghệ & demo sản phẩm',
    pitch: 0.94,
    rate: 1.0,
    sampleText: 'One consistent character across every angle, resolution, and language for global product launches.',
  },
];

export const AI_MODELS: AIModelInfo[] = [
  {
    id: 'v-character-4',
    apiId: 'vs_character_v4',
    name: 'V-Character 4.0',
    provider: 'VisionStory',
    category: 'avatar',
    badge: 'Native Flagship',
    resolution: '720p · 1080p · 2K',
    maxDuration: 'Up to 10 minutes',
    creditsPerUnit: '1 credit / 4s (720p)',
    summaryEn:
      "VisionStory's native talking-avatar model renders sharper faces, subtler expressions, accurate lip-sync, and natural hand and body motion from a single portrait.",
    summaryVi:
      'Mô hình avatar nói chuyện độc quyền của VisionStory tái tạo gương mặt sắc nét, biểu cảm tinh tế, nhép môi chuẩn xác và cử chỉ tay tự nhiên chỉ từ 1 bức ảnh.',
    capabilities: ['Talking Avatar', 'Single Photo Input', 'Singing Lip Sync', 'Green Screen', 'Up to 2K'],
    showcaseImage: '/assets/avatars/elena.jpg',
  },
  {
    id: 'v-character-5-pro',
    apiId: 'vs_character_v5_pro',
    name: 'V-Character 5.0 Pro',
    provider: 'VisionStory',
    category: 'video',
    badge: 'Cinema Pro',
    resolution: '720p · 1080p · 2K',
    maxDuration: '10s – 30s clips',
    creditsPerUnit: '2 credits / sec',
    summaryEn:
      'Next-gen omni-directional character & cinematic scene generator with dynamic camera tracking and studio lighting.',
    summaryVi:
      'Mô hình điện ảnh thế hệ mới hỗ trợ chuyển động máy quay tự do, ánh sáng studio và đồng nhất nhân vật.',
    capabilities: ['Generate Video', 'Reference to Video', 'Start & End Frames', 'Dynamic Camera'],
    showcaseImage: '/assets/showcase/seedance-cinema.jpg',
  },
  {
    id: 'seedance-2.5',
    apiId: 'seedance-2.5',
    name: 'Seedance 2.5',
    provider: 'ByteDance',
    category: 'video',
    badge: 'Multi-Reference',
    resolution: '1080p · 2K',
    maxDuration: '4–30s clips',
    creditsPerUnit: '2 credits / sec',
    summaryEn:
      'Turn text prompts, images, audio, video, and up to 50 references into controlled cinematic clips for ads, ecommerce, and storytelling.',
    summaryVi:
      'Biến câu lệnh văn bản, hình ảnh, âm thanh và tới 50 ảnh tham chiếu thành thước phim điện ảnh có độ nhất quán cao cho quảng cáo và kể chuyện.',
    capabilities: ['Text To Video', 'Image To Video', '30-Second Clips', 'AI Video Ads', 'Redraw Editing'],
    showcaseImage: '/assets/showcase/seedance-cinema.jpg',
  },
  {
    id: 'kling-o3',
    apiId: 'kling-o3',
    name: 'Kling O3',
    provider: 'Kuaishou',
    category: 'video',
    badge: 'True 4K · 60fps',
    resolution: '1080p · 4K 60fps',
    maxDuration: 'Up to 20s',
    creditsPerUnit: '3 credits / sec',
    summaryEn:
      "Kuaishou's flagship omni model: true 4K shots at up to 60 fps, native multilingual audio, voice cloning from reference video, and multi-shot storyboard control.",
    summaryVi:
      'Mô hình omni đầu bảng với khung hình 4K 60fps thực, âm thanh đa ngôn ngữ bản địa và điều khiển phân cảnh nhiều góc máy.',
    capabilities: ['4K 60fps', 'Native Audio', 'Multi-Shot Storyboard', 'Reference Voice'],
    showcaseImage: '/assets/showcase/music-singer.jpg',
  },
  {
    id: 'minimax-h3',
    apiId: 'minimax-h3',
    name: 'MiniMax H3',
    provider: 'MiniMax',
    category: 'video',
    badge: 'Stereo Audio',
    resolution: '1080p · 2K',
    maxDuration: 'Up to 15s',
    creditsPerUnit: '2 credits / sec',
    summaryEn:
      "MiniMax's omni-modal model: 2K clips with native stereo audio generated in one pass, plus reference control over characters, motion, and voices.",
    summaryVi:
      'Mô hình đa phương thức xuất video 2K kèm âm thanh stereo chỉ trong một lượt render, kiểm soát chặt nhân vật và chuyển động.',
    capabilities: ['2K Output', 'Native Stereo Audio', 'Motion Reference', 'Scene Revision'],
    showcaseImage: '/assets/showcase/podcast-studio.jpg',
  },
  {
    id: 'wan-3.0',
    apiId: 'wan-3.0',
    name: 'Wan 3.0',
    provider: 'Alibaba',
    category: 'video',
    badge: 'Omni-Reference',
    resolution: '720p · 1080p',
    maxDuration: '30s single-take',
    creditsPerUnit: '1.5 credits / sec',
    summaryEn:
      "Alibaba's newest model: 30-second single-take shots at up to 1080p, with Omni-Reference input — build video straight from documents, slides, and web pages.",
    summaryVi:
      'Quay liền mạch một cú máy dài 30 giây ở 1080p với đầu vào Omni-Reference từ tài liệu, slide và trang web.',
    capabilities: ['30s Single-Take', 'Doc & Slide Input', '1080p HD', 'Open Ecosystem'],
    showcaseImage: '/assets/showcase/seedance-cinema.jpg',
  },
  {
    id: 'nano-banana-2',
    apiId: 'nano-banana-2',
    name: 'Nano Banana 2',
    provider: 'Google',
    category: 'image',
    badge: 'AI Image 2K',
    resolution: '1K · 2K',
    maxDuration: 'Instant Still',
    creditsPerUnit: '1 credit / image',
    summaryEn:
      'Generate high-resolution portraits, product scenes, and campaign visuals, render text reliably, and refine results through conversational reference-guided edits.',
    summaryVi:
      'Tạo ảnh chân dung avatar, bối cảnh sản phẩm độ phân giải 2K, hiển thị chữ chuẩn xác và chỉnh sửa hội thoại thông minh.',
    capabilities: ['Prompt-to-Image', 'Reference Editing', 'Reliable Typography', '2K Portraits'],
    showcaseImage: '/assets/avatars/linh.jpg',
  },
];

export interface PricingPlan {
  id: 'free' | 'pro' | 'advanced' | 'ultra';
  name: string;
  monthlyPrice: number;
  annualMonthlyEquivalent: number;
  annualTotal: number;
  monthlyCredits: number;
  annualCredits: number;
  approxMinutes: string;
  weeklyBonus: number;
  maxLength: string;
  resolutions: string;
  concurrentTasks: number;
  cloneVoices: number;
  presentationSlides: string;
  customAvatars: string;
  popular?: boolean;
  videoGenFeaturesEn: string[];
  plusTitleEn: string;
  plusFeaturesEn: string[];
  featuresEn: string[];
  featuresVi: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualMonthlyEquivalent: 0,
    annualTotal: 0,
    monthlyCredits: 10,
    annualCredits: 10,
    approxMinutes: '≈1 minute',
    weeklyBonus: 4,
    maxLength: '30 seconds',
    resolutions: '720p',
    concurrentTasks: 1,
    cloneVoices: 0,
    presentationSlides: '—',
    customAvatars: '2 only',
    videoGenFeaturesEn: [
      '10 credits on sign up',
      'Video length up to 30 seconds',
      '160+ Stock Avatars',
      'Video resolution up to 720p',
    ],
    plusTitleEn: 'plus:',
    plusFeaturesEn: [
      'Weekly Visit Bonus: 4 credits',
      'V-Character 4.0',
    ],
    featuresEn: [
      '10 credits on sign up',
      'Video length up to 30 seconds',
      '160+ Stock Avatars',
      'Video resolution up to 720p',
      'Weekly Visit Bonus: 4 credits',
      'V-Character 4.0',
    ],
    featuresVi: [
      '10 credits khi đăng ký',
      'Thời lượng video tối đa 30 giây',
      '160+ Stock Avatars',
      'Độ phân giải video tới 720p',
      'Thưởng ghé thăm tuần: 4 credits',
      'Mô hình V-Character 4.0',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    annualMonthlyEquivalent: 8.33,
    annualTotal: 99.9,
    monthlyCredits: 120,
    annualCredits: 1440,
    approxMinutes: '≈8 minutes',
    weeklyBonus: 8,
    maxLength: '10 minutes',
    resolutions: '720p',
    concurrentTasks: 10,
    cloneVoices: 10,
    presentationSlides: '20 Slides',
    customAvatars: 'Unlimited Avatars',
    videoGenFeaturesEn: [
      '120 monthly credits',
      'Video length up to 10 minutes',
      'Credits carry over',
      'Access to all premium features',
    ],
    plusTitleEn: 'plus:',
    plusFeaturesEn: [
      'Weekly Visit Bonus: 8 credits',
      '10 Concurrent Tasks',
      'Clone 10 Voices',
      'Unlimited Avatars',
      'Buy extra credits',
      'Seedance 2.5',
      'No Watermark',
    ],
    featuresEn: [
      '120 monthly credits',
      'Video length up to 10 minutes',
      'Credits carry over',
      'Access to all premium features',
      'Weekly Visit Bonus: 8 credits',
      '10 Concurrent Tasks',
      'Clone 10 Voices',
      'Unlimited Avatars',
      'Buy extra credits',
      'Seedance 2.5',
      'No Watermark',
    ],
    featuresVi: [
      '120 credits mỗi tháng',
      'Thời lượng video tối đa 10 phút',
      'Cộng dồn credits dư sang kỳ sau',
      'Mở khóa toàn bộ tính năng cao cấp',
      'Thưởng ghé thăm tuần: 8 credits',
      '10 tác vụ song song · Clone 10 giọng',
      'Seedance 2.5 · Không watermark',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    monthlyPrice: 29.9,
    annualMonthlyEquivalent: 24.92,
    annualTotal: 299.0,
    monthlyCredits: 480,
    annualCredits: 5760,
    approxMinutes: '≈30 minutes',
    weeklyBonus: 20,
    maxLength: '10 minutes',
    resolutions: '1080P,2K',
    concurrentTasks: 10,
    cloneVoices: 20,
    presentationSlides: '50 Slides',
    customAvatars: 'Unlimited Avatars',
    popular: true,
    videoGenFeaturesEn: [
      '480 monthly credits',
      'Video length up to 10 minutes',
      'Credits carry over',
      'Video resolution up to 1080P,2K',
    ],
    plusTitleEn: 'Everything in Pro, plus:',
    plusFeaturesEn: [
      'Weekly Visit Bonus: 20 credits',
      '10 Concurrent Tasks',
      'Clone 20 Voices',
    ],
    featuresEn: [
      '480 monthly credits',
      'Video length up to 10 minutes',
      'Credits carry over',
      'Video resolution up to 1080P,2K',
      'Weekly Visit Bonus: 20 credits',
      '10 Concurrent Tasks',
      'Clone 20 Voices',
    ],
    featuresVi: [
      '480 credits mỗi tháng',
      'Thời lượng video tối đa 10 phút',
      'Cộng dồn credits dư sang kỳ sau',
      'Độ phân giải Full HD 1080P & 2K',
      'Thưởng ghé thăm tuần: 20 credits',
      '10 tác vụ song song · Clone 20 giọng',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    monthlyPrice: 99.9,
    annualMonthlyEquivalent: 83.25,
    annualTotal: 999.0,
    monthlyCredits: 1920,
    annualCredits: 23040,
    approxMinutes: '≈120 minutes',
    weeklyBonus: 60,
    maxLength: '10 minutes',
    resolutions: '1080P,2K',
    concurrentTasks: 10,
    cloneVoices: 50,
    presentationSlides: '100 Slides',
    customAvatars: 'Unlimited Avatars',
    videoGenFeaturesEn: [
      '1920 monthly credits',
      'Video length up to 10 minutes',
      'Credits carry over',
      'Video resolution up to 1080P,2K',
    ],
    plusTitleEn: 'Everything in Advanced, plus:',
    plusFeaturesEn: [
      'Weekly Visit Bonus: 60 credits',
      '10 Concurrent Tasks',
      'Clone 50 Voices',
    ],
    featuresEn: [
      '1920 monthly credits',
      'Video length up to 10 minutes',
      'Credits carry over',
      'Video resolution up to 1080P,2K',
      'Weekly Visit Bonus: 60 credits',
      '10 Concurrent Tasks',
      'Clone 50 Voices',
    ],
    featuresVi: [
      '1.920 credits mỗi tháng (5.760 trần tích lũy)',
      'Thời lượng video tối đa 10 phút',
      'Cộng dồn credits dư sang kỳ sau',
      'Độ phân giải 1080P & 2K siêu nét',
      'Thưởng ghé thăm tuần: 60 credits',
      '10 tác vụ song song · Clone 50 giọng',
    ],
  } as PricingPlan,
];

export interface CreatorToolItem {
  slug: string;
  studioTab: string;
  studioSubTool?: string;
  badge?: string;
  titleEn: string;
  titleVi: string;
  descEn: string;
  descVi: string;
  category: 'video' | 'voice' | 'image' | 'avatar';
}

export const CREATOR_TOOLS: CreatorToolItem[] = [
  {
    slug: 'ai-video-generator',
    studioTab: 'seedance',
    badge: 'Seedance 2.5',
    titleEn: 'AI Video Generator',
    titleVi: 'Tạo Video AI Điện Ảnh',
    descEn: 'Create AI-generated video clips for your projects.',
    descVi: 'Tạo thước phim AI điện ảnh cho dự án sáng tạo.',
    category: 'video',
  },
  {
    slug: 'ai-video-matting',
    studioTab: 'ai-tools',
    studioSubTool: 'bg-remove',
    titleEn: 'AI Video Matting',
    titleVi: 'Tách Nền Green Screen',
    descEn: 'Cut out your subject as a green screen video.',
    descVi: 'Tách chủ thể sang video phông xanh chuyên nghiệp.',
    category: 'video',
  },
  {
    slug: 'face-swap-video',
    studioTab: 'face-swap',
    titleEn: 'Face Swap for Video',
    titleVi: 'Hoán Đổi Khuôn Mặt Video',
    descEn: 'Instant face replacement for your video clips.',
    descVi: 'Thay thế khuôn mặt tức thì cho các đoạn video.',
    category: 'video',
  },
  {
    slug: 'viral-music',
    studioTab: 'viral-music',
    badge: 'Duet',
    titleEn: 'Viral Music',
    titleVi: 'MV Ca Nhạc Viral (Solo & Duet)',
    descEn: 'Turn your song and avatar into a viral music video.',
    descVi: 'Biến bài hát và nhân vật thành MV ca nhạc viral.',
    category: 'video',
  },
  {
    slug: 'pet-video',
    studioTab: 'ai-video',
    titleEn: 'Pet Video',
    titleVi: 'Video Thú Cưng Hài Hước',
    descEn: 'Get your pets to star in funny skits.',
    descVi: 'Đưa thú cưng của bạn thành ngôi sao hài kịch.',
    category: 'video',
  },
  {
    slug: 'ai-image',
    studioTab: 'ai-tools',
    studioSubTool: 'image-gen',
    titleEn: 'AI Image',
    titleVi: 'Tạo Ảnh AI 2K',
    descEn: 'Create high-quality images from a prompt.',
    descVi: 'Tạo hình ảnh chất lượng cao từ câu lệnh.',
    category: 'image',
  },
  {
    slug: 'face-swap-image',
    studioTab: 'face-swap',
    titleEn: 'Face Swap for Image',
    titleVi: 'Hoán Đổi Khuôn Mặt Ảnh',
    descEn: 'Instant face replacement for your images.',
    descVi: 'Ghép khuôn mặt tự nhiên cho ảnh chân dung.',
    category: 'image',
  },
  {
    slug: 'remove-background',
    studioTab: 'ai-tools',
    studioSubTool: 'bg-remove',
    titleEn: 'Remove background',
    titleVi: 'Xóa Phông Nền 1 Chạm',
    descEn: 'Remove image backgrounds in one click.',
    descVi: 'Xóa nền hình ảnh chỉ với một cú nhấp.',
    category: 'image',
  },
  {
    slug: 'extract-audio',
    studioTab: 'ai-tools',
    studioSubTool: 'audio-clean',
    titleEn: 'Extract Audio from Video',
    titleVi: 'Tách & Làm Sạch Âm Thanh',
    descEn: 'Turn a video into a downloadable audio file.',
    descVi: 'Tách âm thanh và khử nhiễu từ tệp video.',
    category: 'voice',
  },
  {
    slug: 'voice-clone',
    studioTab: 'ai-tools',
    studioSubTool: 'voice-clone',
    titleEn: 'Voice Clone',
    titleVi: 'Nhân Bản Giọng Nói',
    descEn: 'Clone any voice in seconds across 88 languages.',
    descVi: 'Nhân bản giọng nói chỉ trong vài giây với 88 ngôn ngữ.',
    category: 'voice',
  },
  {
    slug: 'text-to-speech',
    studioTab: 'ai-tools',
    studioSubTool: 'tts',
    titleEn: 'Text to Speech',
    titleVi: 'Chuyển Văn Bản Thành Giọng Đọc',
    descEn: 'Synthesize lifelike studio voiceovers from text.',
    descVi: 'Tổng hợp giọng đọc truyền cảm tự nhiên từ văn bản.',
    category: 'voice',
  },
  {
    slug: 'upscale-image',
    studioTab: 'ai-tools',
    studioSubTool: 'upscale',
    titleEn: '4x Image & Video Upscaler',
    titleVi: 'Nâng Cấp Độ Nét 4x',
    descEn: 'Enhance portraits and video frames up to crisp 4K.',
    descVi: 'Nâng cấp độ phân giải ảnh và khung hình lên 4K.',
    category: 'image',
  },
];
