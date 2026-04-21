import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'home' | 'feed' | 'profile' | 'upload' | 'messages' | 'notifications' | 'search' | 'recommendations';

interface Video {
  id: number;
  author: string;
  handle: string;
  title: string;
  views: string;
  duration: string;
  likes: number;
  comments: number;
  reposts: number;
  thumb: string;
  avatar: string;
  liked: boolean;
  reposted: boolean;
  category: string;
  isNew: boolean;
  subscribed: boolean;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface ChatMessage {
  id: number;
  from: 'me' | 'them';
  text: string;
  time: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL_VIDEOS: Video[] = [
  { id: 1, author: 'Анна Козлова', handle: '@anna.k', title: 'Как я сняла рекламный ролик за 2 часа', views: '48 тыс', duration: '12:34', likes: 2410, comments: 4, reposts: 156, thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=5', liked: false, reposted: false, category: 'Влоги', isNew: false, subscribed: true },
  { id: 2, author: 'Макс Орлов', handle: '@max.video', title: 'Монтаж в телефоне: 5 приёмов которые изменят всё', views: '123 тыс', duration: '8:17', likes: 5820, comments: 3, reposts: 441, thumb: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=12', liked: true, reposted: false, category: 'Технологии', isNew: true, subscribed: true },
  { id: 3, author: 'Лера Смит', handle: '@lera.creates', title: 'Влог: неделя в горах без интернета', views: '89 тыс', duration: '22:05', likes: 3100, comments: 5, reposts: 212, thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=9', liked: false, reposted: false, category: 'Путешествия', isNew: true, subscribed: false },
  { id: 4, author: 'Иван Петров', handle: '@ivan.tech', title: 'Обзор камеры Sony A7C II — стоит ли покупать?', views: '67 тыс', duration: '18:42', likes: 1890, comments: 2, reposts: 78, thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=3', liked: false, reposted: false, category: 'Технологии', isNew: false, subscribed: false },
  { id: 5, author: 'Ольга Новак', handle: '@olga.film', title: 'Кинематографичная съёмка на iPhone 15', views: '201 тыс', duration: '14:58', likes: 9340, comments: 6, reposts: 887, thumb: 'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=21', liked: true, reposted: true, category: 'Кино', isNew: true, subscribed: true },
  { id: 6, author: 'Дима Лес', handle: '@dima.drone', title: 'Аэросъёмка заката над городом', views: '55 тыс', duration: '6:30', likes: 4120, comments: 3, reposts: 290, thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=17', liked: false, reposted: false, category: 'Путешествия', isNew: false, subscribed: false },
];

const VIDEO_COMMENTS: Record<number, Comment[]> = {
  1: [
    { id: 1, author: 'Макс Орлов', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Невероятно! Как вы это сделали за такое короткое время?', time: '2 ч назад', likes: 24 },
    { id: 2, author: 'Лера Смит', avatar: 'https://i.pravatar.cc/40?img=9', text: 'Отличная работа, вдохновляет попробовать самой', time: '3 ч назад', likes: 11 },
    { id: 3, author: 'Иван Петров', avatar: 'https://i.pravatar.cc/40?img=3', text: 'Какой софт для монтажа используете?', time: '5 ч назад', likes: 7 },
    { id: 4, author: 'Дима Лес', avatar: 'https://i.pravatar.cc/40?img=17', text: 'Топ контент как всегда!', time: '6 ч назад', likes: 3 },
  ],
  2: [
    { id: 1, author: 'Анна Козлова', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Приём с переходами просто огонь, уже попробовала', time: '1 ч назад', likes: 42 },
    { id: 2, author: 'Ольга Новак', avatar: 'https://i.pravatar.cc/40?img=21', text: 'Сохранила видео, буду пересматривать', time: '4 ч назад', likes: 18 },
    { id: 3, author: 'Дима Лес', avatar: 'https://i.pravatar.cc/40?img=17', text: 'Лучший туториал по мобильному монтажу что видел', time: '7 ч назад', likes: 31 },
  ],
  3: [
    { id: 1, author: 'Анна Козлова', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Красота природы потрясающая, хочу туда!', time: '30 мин назад', likes: 15 },
    { id: 2, author: 'Макс Орлов', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Как вы снимали без интернета? Никакой связи?', time: '1 ч назад', likes: 9 },
    { id: 3, author: 'Иван Петров', avatar: 'https://i.pravatar.cc/40?img=3', text: 'Завораживающие кадры!', time: '2 ч назад', likes: 5 },
    { id: 4, author: 'Ольга Новак', avatar: 'https://i.pravatar.cc/40?img=21', text: 'Подскажи куда именно ехать?', time: '3 ч назад', likes: 12 },
    { id: 5, author: 'Дима Лес', avatar: 'https://i.pravatar.cc/40?img=17', text: 'Хочу снять что-то похожее летом', time: '5 ч назад', likes: 8 },
  ],
  4: [
    { id: 1, author: 'Ольга Новак', avatar: 'https://i.pravatar.cc/40?img=21', text: 'Давно ждала такого подробного обзора!', time: '1 ч назад', likes: 19 },
    { id: 2, author: 'Лера Смит', avatar: 'https://i.pravatar.cc/40?img=9', text: 'Куплю в итоге, убедил)', time: '3 ч назад', likes: 6 },
  ],
  5: [
    { id: 1, author: 'Иван Петров', avatar: 'https://i.pravatar.cc/40?img=3', text: 'Не знал что iPhone так умеет снимать, невероятно', time: '15 мин назад', likes: 54 },
    { id: 2, author: 'Лера Смит', avatar: 'https://i.pravatar.cc/40?img=9', text: 'Урок по цветокоррекции пожалуйста!', time: '45 мин назад', likes: 37 },
    { id: 3, author: 'Анна Козлова', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Подписалась — жду новых видео', time: '2 ч назад', likes: 22 },
    { id: 4, author: 'Макс Орлов', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Ты лучший автор на платформе!', time: '4 ч назад', likes: 44 },
    { id: 5, author: 'Дима Лес', avatar: 'https://i.pravatar.cc/40?img=17', text: 'Какие настройки камеры?', time: '5 ч назад', likes: 11 },
  ],
  6: [
    { id: 1, author: 'Анна Козлова', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Такие закаты нам и не снились...', time: '1 ч назад', likes: 28 },
    { id: 2, author: 'Ольга Новак', avatar: 'https://i.pravatar.cc/40?img=21', text: 'Дрон какой модели?', time: '2 ч назад', likes: 14 },
    { id: 3, author: 'Макс Орлов', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Потрясающая картинка!', time: '4 ч назад', likes: 20 },
  ],
};

const INITIAL_MESSAGES = [
  { id: 1, name: 'Макс Орлов', text: 'Отличное видео! Как ты добился такого цвета?', time: '14:32', unread: 2, avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 2, name: 'Анна Козлова', text: 'Спасибо за подписку!', time: '11:15', unread: 0, avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: 3, name: 'Лера Смит', text: 'Коллаборация?', time: 'вчера', unread: 1, avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 4, name: 'Иван Петров', text: 'Подскажи какой штатив используешь', time: 'вчера', unread: 0, avatar: 'https://i.pravatar.cc/40?img=3' },
];

const INITIAL_CHATS: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, from: 'me', text: 'Привет! Спасибо за поддержку', time: '14:20' },
    { id: 2, from: 'them', text: 'Отличное видео! Как ты добился такого цвета?', time: '14:32' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Спасибо за подписку!', time: '11:15' },
    { id: 2, from: 'me', text: 'Давно слежу за твоими работами!', time: '11:18' },
  ],
  3: [
    { id: 1, from: 'them', text: 'Привет! Как дела?', time: '09:00' },
    { id: 2, from: 'them', text: 'Коллаборация?', time: '09:05' },
  ],
  4: [
    { id: 1, from: 'them', text: 'Подскажи какой штатив используешь', time: 'вчера' },
  ],
};

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'like', user: 'Макс Орлов', action: 'оценил ваше видео', video: 'Как я сняла рекламный ролик', time: '5 мин', avatar: 'https://i.pravatar.cc/40?img=12', read: false },
  { id: 2, type: 'subscribe', user: 'Ольга Новак', action: 'подписалась на вас', video: '', time: '23 мин', avatar: 'https://i.pravatar.cc/40?img=21', read: false },
  { id: 3, type: 'comment', user: 'Дима Лес', action: 'прокомментировал: «Шикарно снято!»', video: '', time: '1 ч', avatar: 'https://i.pravatar.cc/40?img=17', read: false },
  { id: 4, type: 'repost', user: 'Лера Смит', action: 'сделала репост вашего видео', video: 'Монтаж в телефоне', time: '3 ч', avatar: 'https://i.pravatar.cc/40?img=9', read: false },
  { id: 5, type: 'like', user: 'Иван Петров', action: 'оценил ваше видео', video: 'Влог: неделя в горах', time: '5 ч', avatar: 'https://i.pravatar.cc/40?img=3', read: true },
];

const MOBILE_NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'search', label: 'Поиск', icon: 'Search' },
  { id: 'upload', label: 'Создать', icon: 'PlusSquare' },
  { id: 'notifications', label: 'Активность', icon: 'Bell' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const DESKTOP_NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'feed', label: 'Видеолента', icon: 'Play' },
  { id: 'search', label: 'Поиск', icon: 'Search' },
  { id: 'recommendations', label: 'Рекомендации', icon: 'Sparkles' },
  { id: 'messages', label: 'Сообщения', icon: 'MessageSquare' },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  { id: 'upload', label: 'Загрузить', icon: 'Upload' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

// ─── useIsMobile ───────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
      <div className="bg-foreground text-background px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg pointer-events-auto">
        <Icon name="Check" size={14} />
        {message}
        <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100">
          <Icon name="X" size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Full Video Player ─────────────────────────────────────────────────────────

function VideoPlayer({ video, onClose, onComment, onToggleLike, onToggleRepost, onShare }: {
  video: Video;
  onClose: () => void;
  onComment: (v: Video) => void;
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  onShare: (title: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    resetControlsTimer();
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, [playing, resetControlsTimer]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
    resetControlsTimer();
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
    resetControlsTimer();
  };

  const formatTime = (pct: number) => {
    const parts = video.duration.split(':').map(Number);
    const totalSecs = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
    const cur = Math.floor((pct / 100) * totalSecs);
    const m = Math.floor(cur / 60).toString().padStart(2, '0');
    const s = (cur % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col" ref={containerRef}>
      {/* Video area */}
      <div
        className="flex-1 relative flex items-center justify-center cursor-pointer"
        onMouseMove={resetControlsTimer}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src=""
          poster={video.thumb}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
          playsInline
        />

        {/* Центральная кнопка play/pause */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Icon name="Play" size={36} className="text-white ml-2" />
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <Icon name="ChevronDown" size={24} />
            </button>
            <div className="flex-1 mx-3 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{video.title}</p>
              <p className="text-white/70 text-xs">{video.author}</p>
            </div>
            <button onClick={() => { onShare(video.title); }} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <Icon name="Share2" size={20} />
            </button>
          </div>

          {/* Bottom controls */}
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {/* Progress bar */}
            <div className="mb-3">
              <div
                className="h-1 bg-white/30 rounded-full cursor-pointer group relative"
                onClick={seek}
              >
                <div
                  className="h-full bg-white rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-white/70 text-[10px]">{formatTime(progress)}</span>
                <span className="text-white/70 text-[10px]">{video.duration}</span>
              </div>
            </div>

            {/* Buttons row */}
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white hover:opacity-80 transition-opacity">
                <Icon name={playing ? 'Pause' : 'Play'} size={26} />
              </button>
              <button onClick={toggleMute} className="text-white hover:opacity-80 transition-opacity">
                <Icon name={muted || volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'} size={22} />
              </button>
              <input
                type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-20 accent-white opacity-80"
              />
              <div className="flex-1" />
              <button
                onClick={() => onToggleLike(video.id)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${video.liked ? 'text-red-400' : 'text-white hover:text-red-400'}`}
              >
                <Icon name="Heart" size={20} />
                <span>{video.likes.toLocaleString('ru')}</span>
              </button>
              <button
                onClick={() => { onComment(video); }}
                className="flex items-center gap-1.5 text-white text-sm hover:opacity-80 transition-opacity"
              >
                <Icon name="MessageCircle" size={20} />
                <span>{video.comments}</span>
              </button>
              <button
                onClick={() => onToggleRepost(video.id)}
                className={`text-sm transition-colors ${video.reposted ? 'text-green-400' : 'text-white hover:text-green-400'}`}
              >
                <Icon name="Repeat2" size={20} />
              </button>
              <button onClick={toggleFullscreen} className="text-white hover:opacity-80 transition-opacity ml-1">
                <Icon name={fullscreen ? 'Minimize' : 'Maximize'} size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Record Page ───────────────────────────────────────────────────────────────

function RecordPage({ onPublish }: { onPublish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'record' | 'upload'>('record');
  const [recording, setRecording] = useState(false);
  const [hasStream, setHasStream] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [access, setAccess] = useState(0);
  const [step, setStep] = useState<'capture' | 'details' | 'success'>('capture');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasStream(true);
    } catch {
      setCameraError(true);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    const v = videoRef.current;
    if (v && v.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
    setHasStream(false);
  }, []);

  useEffect(() => {
    if (mode === 'record') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [mode, facingMode, startCamera, stopCamera]);

  const startRecording = () => {
    const v = videoRef.current;
    if (!v || !v.srcObject) return;
    const stream = v.srcObject as MediaStream;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setStep('details');
      stopCamera();
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleFileSelect = (f: File) => {
    if (f.type.startsWith('video/') || f.type.startsWith('image/')) {
      setSelectedFile(f);
      setStep('details');
    }
  };

  const handlePublish = () => {
    if (!title.trim()) return;
    setStep('success');
    setTimeout(() => onPublish(), 1500);
  };

  const formatTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
          <Icon name="CheckCircle" size={40} className="text-green-400" />
        </div>
        <p className="text-white text-xl font-bold mb-2">Опубликовано!</p>
        <p className="text-white/60 text-sm">Ваше видео уже в ленте</p>
      </div>
    );
  }

  if (step === 'details') {
    const previewSrc = recordedBlob
      ? URL.createObjectURL(recordedBlob)
      : selectedFile
      ? URL.createObjectURL(selectedFile)
      : null;

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button onClick={() => { setStep('capture'); setRecordedBlob(null); setSelectedFile(null); if (mode === 'record') startCamera(); }} className="text-white p-1.5">
            <Icon name="ChevronLeft" size={24} />
          </button>
          <p className="text-white font-semibold">Новое видео</p>
          <button
            onClick={handlePublish}
            disabled={!title.trim()}
            className="text-sm font-bold px-3 py-1.5 rounded-full transition-all disabled:opacity-40"
            style={{ background: title.trim() ? 'hsl(4 90% 55%)' : undefined, color: title.trim() ? 'white' : 'rgba(255,255,255,0.4)' }}
          >
            Выпустить
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Preview */}
          {previewSrc && (
            <div className="aspect-video bg-black mx-4 mt-4 rounded-xl overflow-hidden">
              <video src={previewSrc} className="w-full h-full object-cover" controls playsInline />
            </div>
          )}

          {/* Form */}
          <div className="p-4 space-y-4">
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название видео..."
                className="w-full bg-white/10 text-white placeholder-white/40 px-4 py-3 rounded-xl text-sm focus:outline-none focus:bg-white/15 transition-colors"
              />
            </div>
            <div>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Описание (необязательно)..."
                rows={3}
                className="w-full bg-white/10 text-white placeholder-white/40 px-4 py-3 rounded-xl text-sm focus:outline-none focus:bg-white/15 transition-colors resize-none"
              />
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Доступ</p>
              <div className="flex gap-2">
                {['Публичное', 'По ссылке', 'Приватное'].map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setAccess(i)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all font-medium ${access === i ? 'border-white bg-white text-black' : 'border-white/20 text-white/60 hover:border-white/50'}`}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // step === 'capture'
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex gap-1 bg-white/10 rounded-full p-1">
          <button onClick={() => setMode('record')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'record' ? 'bg-white text-black' : 'text-white/70'}`}>
            Камера
          </button>
          <button onClick={() => setMode('upload')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'upload' ? 'bg-white text-black' : 'text-white/70'}`}>
            Галерея
          </button>
        </div>
        <button
          onClick={() => { const v = videoRef.current; if (v && v.srcObject) { stopCamera(); setFacingMode((f) => f === 'user' ? 'environment' : 'user'); } }}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Icon name="RefreshCw" size={20} />
        </button>
      </div>

      {mode === 'record' ? (
        <>
          {/* Camera preview */}
          <div className="flex-1 relative mx-4 rounded-2xl overflow-hidden bg-zinc-900">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Icon name="CameraOff" size={40} className="text-white/30" />
                <p className="text-white/50 text-sm text-center px-6">Нет доступа к камере.<br />Разрешите доступ в настройках браузера.</p>
                <button onClick={startCamera} className="mt-2 px-4 py-2 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors">
                  Попробовать снова
                </button>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} />
            )}

            {/* Timer badge */}
            {recording && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-sm font-mono font-bold">{formatTimer(timer)}</span>
              </div>
            )}
          </div>

          {/* Record button */}
          <div className="flex items-center justify-center py-8 gap-8">
            <div className="w-12" />
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={!hasStream}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
            >
              {recording ? (
                <div className="w-8 h-8 rounded-md bg-red-500" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-500" />
              )}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Icon name="Image" size={22} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        /* Gallery / upload mode */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-white/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="Upload" size={28} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Выбрать из галереи</p>
              <p className="text-white/50 text-sm mt-1">MP4, MOV, AVI до 4 ГБ</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="video/*,image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
      />
    </div>
  );
}

// ─── Comments Modal ────────────────────────────────────────────────────────────

function CommentsModal({ video, comments, onClose }: {
  video: Video;
  comments: Comment[];
  onClose: () => void;
}) {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const sendComment = () => {
    if (!newComment.trim()) return;
    setLocalComments([{
      id: Date.now(), author: 'Анна Козлова',
      avatar: 'https://i.pravatar.cc/40?img=5',
      text: newComment.trim(), time: 'только что', likes: 0,
    }, ...localComments]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end md:items-end md:justify-end" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-md h-[80vh] flex flex-col rounded-t-2xl md:rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none md:h-full animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="font-semibold text-sm">Комментарии</p>
            <p className="text-xs text-muted-foreground">{localComments.length} комментариев</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {localComments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img src={c.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt={c.author} />
              <div className="flex-1">
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-3 py-2">
                  <p className="text-xs font-semibold text-foreground mb-0.5">{c.author}</p>
                  <p className="text-sm text-foreground">{c.text}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-1">
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Icon name="Heart" size={10} /> {c.likes}
                  </button>
                  <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Ответить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <img src="https://i.pravatar.cc/40?img=5" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="me" />
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendComment()}
            placeholder="Написать комментарий..."
            className="flex-1 px-3 py-2 bg-secondary rounded-full text-sm focus:outline-none"
          />
          <button
            onClick={sendComment}
            disabled={!newComment.trim()}
            className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30"
          >
            <Icon name="Send" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar (desktop) ─────────────────────────────────────────────────────────

function Sidebar({ page, setPage, unreadMessages, unreadNotifications }: {
  page: Page;
  setPage: (p: Page) => void;
  unreadMessages: number;
  unreadNotifications: number;
}) {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-border flex flex-col z-10">
      <div className="px-6 py-5 border-b border-border">
        <span className="text-xl font-bold tracking-tight text-foreground">
          волна<span style={{ color: 'hsl(4 90% 55%)' }}>.</span>
        </span>
      </div>
      <nav className="flex-1 py-4 px-3">
        {DESKTOP_NAV.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium mb-0.5 transition-all duration-150 ${
                active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
              {item.id === 'messages' && unreadMessages > 0 && (
                <span className="ml-auto text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>{unreadMessages}</span>
              )}
              {item.id === 'notifications' && unreadNotifications > 0 && (
                <span className="ml-auto text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>{unreadNotifications}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button onClick={() => setPage('profile')} className="flex items-center gap-2.5 w-full hover:opacity-80 transition-opacity">
          <img src="https://i.pravatar.cc/40?img=5" className="w-8 h-8 rounded-full object-cover" alt="avatar" />
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">Анна Козлова</p>
            <p className="text-xs text-muted-foreground truncate">@anna.k</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────────────

function MobileNav({ page, setPage, unreadNotifications, onRecord }: {
  page: Page;
  setPage: (p: Page) => void;
  unreadNotifications: number;
  onRecord: () => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-10 flex items-center safe-area-bottom">
      {MOBILE_NAV.map((item) => {
        const active = page === item.id;
        const isCreate = item.id === 'upload';
        return (
          <button
            key={item.id}
            onClick={() => isCreate ? onRecord() : setPage(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors relative ${
              isCreate ? '' : active ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {isCreate ? (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>
                <Icon name="Plus" size={22} className="text-white" />
              </div>
            ) : (
              <>
                <Icon name={item.icon} size={22} />
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <span className="absolute top-2 right-1/2 translate-x-3 -translate-y-0.5 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>{unreadNotifications}</span>
                )}
                <span className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Video Card ────────────────────────────────────────────────────────────────

function VideoCard({ video, onToggleLike, onToggleRepost, onAuthorClick, onComment, onShare, onPlay }: {
  video: Video;
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  onAuthorClick: () => void;
  onComment: (video: Video) => void;
  onShare: (title: string) => void;
  onPlay: (video: Video) => void;
}) {
  return (
    <div className="video-card bg-white border border-border rounded-lg overflow-hidden animate-fade-in">
      <div className="relative aspect-video overflow-hidden bg-muted cursor-pointer group" onClick={() => onPlay(video)}>
        <img src={video.thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
            <Icon name="Play" size={20} />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</span>
      </div>
      <div className="p-3">
        <div className="flex gap-2.5">
          <img src={video.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" alt={video.author} onClick={onAuthorClick} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => onPlay(video)}>{video.title}</p>
            <button onClick={onAuthorClick} className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5">{video.author}</button>
            <p className="text-xs text-muted-foreground">{video.views} просмотров</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
          <button
            onClick={() => onToggleLike(video.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${video.liked ? 'bg-red-50 text-red-500' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
          >
            <Icon name="Heart" size={14} />
            {video.likes.toLocaleString('ru')}
          </button>
          <button onClick={() => onComment(video)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Icon name="MessageCircle" size={14} />
            {video.comments}
          </button>
          <button
            onClick={() => onToggleRepost(video.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${video.reposted ? 'bg-green-50 text-green-600' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
          >
            <Icon name="Repeat2" size={14} />
            {video.reposts}
          </button>
          <button onClick={() => onShare(video.title)} className="ml-auto px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Icon name="Share2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────

function HomePage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[]; onToggleLike: (id: number) => void; onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void; onComment: (v: Video) => void; onShare: (t: string) => void; onPlay: (v: Video) => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Добро пожаловать</h1>
        <p className="text-muted-foreground text-sm">Новые видео от авторов, на которых вы подписаны</p>
      </div>
      <div className="relative rounded-xl overflow-hidden mb-6 cursor-pointer group h-48 md:h-64" onClick={() => onPlay(videos[4])}>
        <img src={videos[4].thumb} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          <span className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1 block">Сегодня в тренде</span>
          <h2 className="text-white text-lg md:text-2xl font-bold mb-0.5 line-clamp-1">{videos[4].title}</h2>
          <p className="text-white/70 text-xs md:text-sm">{videos[4].author} · {videos[4].views} просмотров</p>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="Play" size={18} />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {videos.slice(0, 5).map((v) => (
          <button key={v.id} onClick={() => setPage('profile')} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-border group-hover:border-foreground transition-colors overflow-hidden">
              <img src={v.avatar} className="w-full h-full object-cover" alt={v.author} />
            </div>
            <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors w-12 md:w-14 text-center truncate">{v.author.split(' ')[0]}</span>
          </button>
        ))}
        <button onClick={() => setPage('search')} className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-foreground transition-colors">
            <Icon name="Plus" size={16} className="text-muted-foreground" />
          </div>
          <span className="text-[10px] text-muted-foreground w-12 md:w-14 text-center">Найти</span>
        </button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}

function FeedPage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[]; onToggleLike: (id: number) => void; onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void; onComment: (v: Video) => void; onShare: (t: string) => void; onPlay: (v: Video) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'subscriptions' | 'new'>('all');
  const filtered = videos.filter((v) => filter === 'subscriptions' ? v.subscribed : filter === 'new' ? v.isNew : true);
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Видеолента</h1>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {([['all', 'Все'], ['subscriptions', 'Подписки'], ['new', 'Новинки']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === key ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>{label}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground"><Icon name="VideoOff" size={32} className="mx-auto mb-3 opacity-30" /><p className="text-sm">Нет видео по этому фильтру</p></div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((v) => <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />)}
        </div>
      )}
    </div>
  );
}

function SearchPage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[]; onToggleLike: (id: number) => void; onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void; onComment: (v: Video) => void; onShare: (t: string) => void; onPlay: (v: Video) => void;
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = ['Влоги', 'Технологии', 'Кино', 'Путешествия', 'Музыка', 'Спорт', 'Кулинария', 'Образование'];
  const trending = ['Монтаж видео', 'Дрон съёмка', 'iPhone камера', 'Влог формат', 'YouTube 2025'];
  const results = videos.filter((v) => {
    const mq = query.trim() === '' || v.title.toLowerCase().includes(query.toLowerCase()) || v.author.toLowerCase().includes(query.toLowerCase());
    const mc = !activeCategory || v.category === activeCategory;
    return mq && mc;
  });
  const showResults = query.trim() !== '' || activeCategory !== null;
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-5">Поиск</h1>
      <div className="relative mb-5">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск видео, авторов..." className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-foreground transition-colors" />
        {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><Icon name="X" size={14} /></button>}
      </div>
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Категории</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(activeCategory === c ? null : c)} className={`px-3 py-1.5 border rounded-full text-sm font-medium transition-all ${activeCategory === c ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground hover:bg-foreground hover:text-background'}`}>{c}</button>
          ))}
        </div>
      </div>
      {showResults ? (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Результаты {results.length > 0 ? `(${results.length})` : ''}</p>
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><Icon name="SearchX" size={28} className="mx-auto mb-2 opacity-30" /><p className="text-sm">Ничего не найдено</p></div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {results.map((v) => <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />)}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">В тренде</p>
          <div className="space-y-1">
            {trending.map((t, i) => (
              <button key={t} onClick={() => setQuery(t)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors">
                <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{t}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationsPage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[]; onToggleLike: (id: number) => void; onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void; onComment: (v: Video) => void; onShare: (t: string) => void; onPlay: (v: Video) => void;
}) {
  const tags = ['Все', 'Монтаж', 'Влоги', 'Техника', 'Путешествия'];
  const tagToCategory: Record<string, string> = { Монтаж: 'Кино', Влоги: 'Влоги', Техника: 'Технологии', Путешествия: 'Путешествия' };
  const [activeTag, setActiveTag] = useState('Все');
  const filtered = activeTag === 'Все' ? [...videos].reverse() : [...videos].reverse().filter((v) => v.category === tagToCategory[activeTag]);
  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1">Рекомендации</h1>
        <p className="text-sm text-muted-foreground">Подобрано для вас</p>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {tags.map((tag) => (
          <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeTag === tag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}>{tag}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((v) => <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />)}
      </div>
    </div>
  );
}

function MessagesPage() {
  const [active, setActive] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const [chats, setChats] = useState<Record<number, ChatMessage[]>>(INITIAL_CHATS);
  const [contacts, setContacts] = useState(INITIAL_MESSAGES);
  const sendMessage = (contactId: number) => {
    if (!msg.trim()) return;
    const newMsg: ChatMessage = { id: Date.now(), from: 'me', text: msg.trim(), time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) };
    setChats((prev) => ({ ...prev, [contactId]: [...(prev[contactId] || []), newMsg] }));
    setContacts((prev) => prev.map((c) => c.id === contactId ? { ...c, text: msg.trim(), unread: 0 } : c));
    setMsg('');
  };
  if (active !== null) {
    const chat = contacts.find((m) => m.id === active)!;
    const messages = chats[active] || [];
    return (
      <div className="animate-fade-in h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActive(null)} className="p-1.5 rounded-md hover:bg-secondary transition-colors"><Icon name="ArrowLeft" size={16} /></button>
          <img src={chat.avatar} className="w-8 h-8 rounded-full object-cover" alt={chat.name} />
          <div><p className="text-sm font-semibold">{chat.name}</p><p className="text-xs text-muted-foreground">Онлайн</p></div>
        </div>
        <div className="flex-1 bg-white border border-border rounded-lg p-4 mb-3 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`text-sm px-3 py-2 rounded-2xl max-w-xs ${m.from === 'me' ? 'bg-foreground text-background rounded-tr-sm' : 'bg-secondary text-foreground rounded-tl-sm'}`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-background/60' : 'text-muted-foreground'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(active)} placeholder="Написать сообщение..." className="flex-1 px-4 py-2.5 border border-border rounded-full text-sm focus:outline-none focus:border-foreground transition-colors" />
          <button onClick={() => sendMessage(active)} disabled={!msg.trim()} className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0 disabled:opacity-30">
            <Icon name="Send" size={15} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-5">Сообщения</h1>
      <div className="space-y-1">
        {contacts.map((m) => (
          <button key={m.id} onClick={() => { setActive(m.id); setContacts((prev) => prev.map((c) => c.id === m.id ? { ...c, unread: 0 } : c)); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left">
            <div className="relative flex-shrink-0">
              <img src={m.avatar} className="w-10 h-10 rounded-full object-cover" alt={m.name} />
              {m.unread > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>{m.unread}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground">{m.name}</p><span className="text-xs text-muted-foreground">{m.time}</span></div>
              <p className={`text-xs truncate mt-0.5 ${m.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{m.text}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const iconMap: Record<string, string> = { like: 'Heart', subscribe: 'UserPlus', comment: 'MessageCircle', repost: 'Repeat2' };
  const bgMap: Record<string, string> = { like: '#ef4444', subscribe: '#3b82f6', comment: '#22c55e', repost: '#8b5cf6' };
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        {unread > 0 && <button onClick={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Прочитать все</button>}
      </div>
      <div className="space-y-1">
        {notifications.map((n) => (
          <div key={n.id} onClick={() => setNotifications((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))} className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${n.read ? 'hover:bg-secondary' : 'bg-blue-50/60 hover:bg-blue-50'}`}>
            <div className="relative flex-shrink-0">
              <img src={n.avatar} className="w-10 h-10 rounded-full object-cover" alt={n.user} />
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center border border-border">
                <Icon name={iconMap[n.type]} size={10} style={{ color: bgMap[n.type] }} />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground"><span className="font-semibold">{n.user}</span> {n.action}</p>
              {n.video && <p className="text-xs text-muted-foreground mt-0.5 truncate">«{n.video}»</p>}
              <p className="text-xs text-muted-foreground mt-1">{n.time} назад</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'hsl(4 90% 55%)' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ setPage }: { setPage: (p: Page) => void }) {
  const [subscribed, setSubscribed] = useState(false);
  const [viewingVideo, setViewingVideo] = useState<Video | null>(null);
  return (
    <div className="animate-fade-in">
      {viewingVideo && (
        <VideoPlayer video={viewingVideo} onClose={() => setViewingVideo(null)}
          onComment={() => {}} onToggleLike={() => {}} onToggleRepost={() => {}} onShare={() => {}} />
      )}
      <div className="h-32 md:h-36 rounded-xl overflow-hidden mb-4">
        <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=60" className="w-full h-full object-cover opacity-60" alt="" />
      </div>
      <div className="flex items-end justify-between mb-5 -mt-10 px-1">
        <div className="flex items-end gap-3 md:gap-4">
          <img src="https://i.pravatar.cc/40?img=5" className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-background object-cover" alt="profile" />
          <div className="mb-1">
            <h1 className="text-lg md:text-xl font-bold">Анна Козлова</h1>
            <p className="text-sm text-muted-foreground">@anna.k</p>
          </div>
        </div>
        <button onClick={() => setSubscribed(!subscribed)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${subscribed ? 'bg-secondary text-foreground' : 'bg-foreground text-background hover:opacity-80'}`}>
          {subscribed ? 'Подписан' : 'Подписаться'}
        </button>
      </div>
      <div className="flex gap-5 mb-5 pb-5 border-b border-border">
        {[['48', 'видео'], ['12,4 тыс', 'подписчиков'], ['234', 'подписок']].map(([val, label]) => (
          <div key={label}><p className="text-lg font-bold">{val}</p><p className="text-xs text-muted-foreground">{label}</p></div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-5">Снимаю видео о путешествиях и творческом процессе. Делюсь приёмами монтажа и цветокоррекции.</p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Видео</p>
        <button onClick={() => setPage('upload')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-secondary">
          <Icon name="Plus" size={12} /> Загрузить
        </button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 md:gap-3">
        {INITIAL_VIDEOS.slice(0, 4).map((v) => (
          <div key={v.id} className="cursor-pointer group" onClick={() => setViewingVideo(v)}>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
              <img src={v.thumb} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={v.title} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-2"><Icon name="Play" size={14} /></div>
              </div>
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">{v.duration}</span>
            </div>
            <p className="text-xs font-medium line-clamp-2 text-foreground">{v.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{v.views} просмотров</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState<Page>('home');
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [commentVideo, setCommentVideo] = useState<Video | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [recording, setRecording] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [notifications] = useState(INITIAL_NOTIFICATIONS);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleLike = (id: number) =>
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v));

  const toggleRepost = (id: number) => {
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, reposted: !v.reposted, reposts: v.reposted ? v.reposts - 1 : v.reposts + 1 } : v));
    showToast('Репост добавлен');
  };

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    showToast(`Ссылка скопирована`);
  };

  const unreadMessages = INITIAL_MESSAGES.reduce((acc, m) => acc + m.unread, 0);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const cardProps = { videos, onToggleLike: toggleLike, onToggleRepost: toggleRepost, setPage, onComment: setCommentVideo, onShare: handleShare, onPlay: setPlayingVideo };

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage {...cardProps} />;
      case 'feed': return <FeedPage {...cardProps} />;
      case 'search': return <SearchPage {...cardProps} />;
      case 'recommendations': return <RecommendationsPage {...cardProps} />;
      case 'messages': return <MessagesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'upload': return isMobile
        ? <RecordPage onPublish={() => { setRecording(false); setPage('feed'); }} />
        : <DesktopUploadPage onPublish={() => setPage('feed')} />;
      case 'profile': return <ProfilePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar page={page} setPage={setPage} unreadMessages={unreadMessages} unreadNotifications={unreadNotifications} />
      )}

      {/* Main content */}
      <main className={`flex-1 min-h-screen ${!isMobile ? 'ml-56' : ''}`}>
        {/* Mobile header */}
        {isMobile && (
          <header className="sticky top-0 bg-white border-b border-border z-10 px-4 py-3 flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight">
              волна<span style={{ color: 'hsl(4 90% 55%)' }}>.</span>
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage('search')} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <Icon name="Search" size={20} />
              </button>
              <button onClick={() => setPage('messages')} className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <Icon name="MessageSquare" size={20} />
                {unreadMessages > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'hsl(4 90% 55%)' }} />}
              </button>
            </div>
          </header>
        )}

        <div className={`mx-auto px-4 py-5 md:px-6 md:py-8 max-w-5xl ${isMobile ? 'pb-24' : ''}`}>
          {renderPage()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <MobileNav page={page} setPage={setPage} unreadNotifications={unreadNotifications} onRecord={() => setRecording(true)} />
      )}

      {/* Record overlay (mobile) */}
      {recording && (
        <RecordPage onPublish={() => { setRecording(false); setPage('feed'); showToast('Видео опубликовано!'); }} />
      )}

      {/* Modals */}
      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
          onComment={(v) => { setPlayingVideo(null); setCommentVideo(v); }}
          onToggleLike={toggleLike}
          onToggleRepost={toggleRepost}
          onShare={handleShare}
        />
      )}

      {commentVideo && (
        <CommentsModal video={commentVideo} comments={VIDEO_COMMENTS[commentVideo.id] || []} onClose={() => setCommentVideo(null)} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Desktop Upload Page ───────────────────────────────────────────────────────

function DesktopUploadPage({ onPublish }: { onPublish: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [access, setAccess] = useState(0);
  const [published, setPublished] = useState(false);

  const handleFile = (f: File) => { if (f.type.startsWith('video/')) setFile(f); };
  const handlePublish = () => {
    if (!title.trim()) return;
    setPublished(true);
    setTimeout(() => { setPublished(false); onPublish(); }, 1500);
  };

  if (published) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"><Icon name="Check" size={28} className="text-green-600" /></div>
        <h2 className="text-xl font-bold mb-2">Видео опубликовано!</h2>
        <p className="text-muted-foreground text-sm">Переходим в ленту...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Загрузить видео</h1>
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 mb-6 flex flex-col items-center gap-3 transition-all cursor-pointer ${dragging ? 'border-foreground bg-secondary' : file ? 'border-green-400 bg-green-50' : 'border-border hover:border-muted-foreground'}`}
      >
        {file ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><Icon name="CheckCircle" size={24} className="text-green-600" /></div>
            <p className="text-sm font-semibold text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-muted-foreground hover:text-foreground">Выбрать другой</button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"><Icon name="Upload" size={20} className="text-muted-foreground" /></div>
            <p className="text-sm font-medium text-foreground">Перетащите файл или нажмите для выбора</p>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI до 4 ГБ</p>
            <button className="mt-1 px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-80 transition-opacity font-medium">Выбрать файл</button>
          </>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Название *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите название видео..." className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Описание</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="О чём это видео..." rows={4} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Доступ</label>
          <div className="flex gap-2">
            {['Публичное', 'По ссылке', 'Приватное'].map((opt, i) => (
              <button key={opt} onClick={() => setAccess(i)} className={`flex-1 py-2 text-xs rounded-lg border transition-all font-medium ${access === i ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}>{opt}</button>
            ))}
          </div>
        </div>
        <button onClick={handlePublish} disabled={!title.trim()} className="w-full py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-80 transition-opacity text-sm disabled:opacity-40">
          Опубликовать видео
        </button>
      </div>
    </div>
  );
}
