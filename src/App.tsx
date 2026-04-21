import { useState, useRef } from 'react';
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
    { id: 6, author: 'Иван Петров', avatar: 'https://i.pravatar.cc/40?img=3', text: 'Поделюсь с друзьями обязательно', time: '6 ч назад', likes: 9 },
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

// ─── Navigation ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'feed', label: 'Видеолента', icon: 'Play' },
  { id: 'search', label: 'Поиск', icon: 'Search' },
  { id: 'recommendations', label: 'Рекомендации', icon: 'Sparkles' },
  { id: 'messages', label: 'Сообщения', icon: 'MessageSquare' },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  { id: 'upload', label: 'Загрузить', icon: 'Upload' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-foreground text-background px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
        <Icon name="Check" size={14} />
        {message}
        <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100">
          <Icon name="X" size={12} />
        </button>
      </div>
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
    const c: Comment = {
      id: Date.now(),
      author: 'Анна Козлова',
      avatar: 'https://i.pravatar.cc/40?img=5',
      text: newComment.trim(),
      time: 'только что',
      likes: 0,
    };
    setLocalComments([c, ...localComments]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-end justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-[80vh] flex flex-col rounded-tl-2xl rounded-bl-2xl animate-slide-in-right"
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
            className="flex-1 px-3 py-2 bg-secondary rounded-full text-sm focus:outline-none focus:bg-secondary/70 transition-colors"
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

// ─── Video Viewer Modal ────────────────────────────────────────────────────────

function VideoViewer({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <img src={video.thumb} className="w-full h-full object-cover opacity-60" alt={video.title} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Icon name="Play" size={28} className="text-foreground ml-1" />
            </div>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors">
            <Icon name="X" size={16} />
          </button>
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">{video.duration}</span>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base mb-1">{video.title}</h3>
          <div className="flex items-center gap-2">
            <img src={video.avatar} className="w-6 h-6 rounded-full object-cover" alt={video.author} />
            <span className="text-sm text-muted-foreground">{video.author} · {video.views} просмотров</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

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
        {NAV_ITEMS.map((item) => {
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
          <img
            src={video.avatar}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            alt={video.author}
            onClick={onAuthorClick}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => onPlay(video)}>{video.title}</p>
            <button onClick={onAuthorClick} className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5">{video.author}</button>
            <p className="text-xs text-muted-foreground">{video.views} просмотров</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
          <button
            onClick={() => onToggleLike(video.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              video.liked ? 'bg-red-50 text-red-500' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon name="Heart" size={14} />
            {video.likes.toLocaleString('ru')}
          </button>
          <button
            onClick={() => onComment(video)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Icon name="MessageCircle" size={14} />
            {video.comments}
          </button>
          <button
            onClick={() => onToggleRepost(video.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              video.reposted ? 'bg-green-50 text-green-600' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon name="Repeat2" size={14} />
            {video.reposts}
          </button>
          <button
            onClick={() => onShare(video.title)}
            className="ml-auto px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Icon name="Share2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────

function HomePage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
  onComment: (v: Video) => void;
  onShare: (title: string) => void;
  onPlay: (v: Video) => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Добро пожаловать</h1>
        <p className="text-muted-foreground text-sm">Новые видео от авторов, на которых вы подписаны</p>
      </div>
      <div className="relative rounded-xl overflow-hidden mb-8 cursor-pointer group h-64" onClick={() => onPlay(videos[4])}>
        <img src={videos[4].thumb} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <span className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">Сегодня в тренде</span>
          <h2 className="text-white text-2xl font-bold mb-1">{videos[4].title}</h2>
          <p className="text-white/70 text-sm">{videos[4].author} · {videos[4].views} просмотров</p>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="Play" size={20} />
        </div>
        <span className="absolute bottom-6 right-6 bg-black/70 text-white text-xs px-2 py-1 rounded">{videos[4].duration}</span>
      </div>
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
        {videos.slice(0, 5).map((v) => (
          <button key={v.id} onClick={() => setPage('profile')} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
            <div className="w-14 h-14 rounded-full border-2 border-border group-hover:border-foreground transition-colors overflow-hidden">
              <img src={v.avatar} className="w-full h-full object-cover" alt={v.author} />
            </div>
            <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors w-14 text-center truncate">{v.author.split(' ')[0]}</span>
          </button>
        ))}
        <button onClick={() => setPage('search')} className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-foreground transition-colors">
            <Icon name="Plus" size={18} className="text-muted-foreground" />
          </div>
          <span className="text-[10px] text-muted-foreground w-14 text-center">Найти</span>
        </button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}

function FeedPage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
  onComment: (v: Video) => void;
  onShare: (title: string) => void;
  onPlay: (v: Video) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'subscriptions' | 'new'>('all');

  const filtered = videos.filter((v) => {
    if (filter === 'subscriptions') return v.subscribed;
    if (filter === 'new') return v.isNew;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Видеолента</h1>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {([['all', 'Все'], ['subscriptions', 'Подписки'], ['new', 'Новинки']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === key ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>{label}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="VideoOff" size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Нет видео по этому фильтру</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchPage({ videos, onToggleLike, onToggleRepost, setPage, onComment, onShare, onPlay }: {
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
  onComment: (v: Video) => void;
  onShare: (title: string) => void;
  onPlay: (v: Video) => void;
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = ['Влоги', 'Технологии', 'Кино', 'Путешествия', 'Музыка', 'Спорт', 'Кулинария', 'Образование'];
  const trending = ['Монтаж видео', 'Дрон съёмка', 'iPhone камера', 'Влог формат', 'YouTube 2025'];

  const results = videos.filter((v) => {
    const matchQuery = query.trim() === '' || v.title.toLowerCase().includes(query.toLowerCase()) || v.author.toLowerCase().includes(query.toLowerCase());
    const matchCat = !activeCategory || v.category === activeCategory;
    return matchQuery && matchCat;
  });

  const showResults = query.trim() !== '' || activeCategory !== null;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Поиск</h1>
      <div className="relative mb-6">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск видео, авторов..."
          className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-foreground transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Категории</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(activeCategory === c ? null : c)}
              className={`px-3 py-1.5 border rounded-full text-sm font-medium transition-all ${activeCategory === c ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground hover:bg-foreground hover:text-background'}`}
            >{c}</button>
          ))}
        </div>
      </div>

      {showResults ? (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Результаты {results.length > 0 ? `(${results.length})` : ''}
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="SearchX" size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Ничего не найдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map((v) => (
                <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">В тренде</p>
          <div className="space-y-1">
            {trending.map((t, i) => (
              <button key={t} onClick={() => setQuery(t)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors group">
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
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
  onComment: (v: Video) => void;
  onShare: (title: string) => void;
  onPlay: (v: Video) => void;
}) {
  const tags = ['Все', 'Монтаж', 'Влоги', 'Техника', 'Путешествия'];
  const tagToCategory: Record<string, string> = { 'Монтаж': 'Кино', 'Влоги': 'Влоги', 'Техника': 'Технологии', 'Путешествия': 'Путешествия' };
  const [activeTag, setActiveTag] = useState('Все');

  const filtered = activeTag === 'Все' ? [...videos].reverse() : [...videos].reverse().filter(v => v.category === tagToCategory[activeTag]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Рекомендации</h1>
        <p className="text-sm text-muted-foreground">Подобрано специально для вас на основе интересов</p>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeTag === tag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}
          >{tag}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="Frown" size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Нет видео в этой категории</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} onComment={onComment} onShare={onShare} onPlay={onPlay} />
          ))}
        </div>
      )}
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
      <div className="animate-fade-in h-[calc(100vh-6rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActive(null)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
            <Icon name="ArrowLeft" size={16} />
          </button>
          <img src={chat.avatar} className="w-8 h-8 rounded-full object-cover" alt={chat.name} />
          <div>
            <p className="text-sm font-semibold">{chat.name}</p>
            <p className="text-xs text-muted-foreground">Онлайн</p>
          </div>
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
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(active)}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-2.5 border border-border rounded-full text-sm focus:outline-none focus:border-foreground transition-colors"
          />
          <button
            onClick={() => sendMessage(active)}
            disabled={!msg.trim()}
            className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0 disabled:opacity-30"
          >
            <Icon name="Send" size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Сообщения</h1>
      <div className="space-y-1">
        {contacts.map((m) => (
          <button
            key={m.id}
            onClick={() => { setActive(m.id); setContacts((prev) => prev.map((c) => c.id === m.id ? { ...c, unread: 0 } : c)); }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="relative flex-shrink-0">
              <img src={m.avatar} className="w-10 h-10 rounded-full object-cover" alt={m.name} />
              {m.unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>{m.unread}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <span className="text-xs text-muted-foreground">{m.time}</span>
              </div>
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

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Отметить все прочитанными
          </button>
        )}
      </div>
      <div className="space-y-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${n.read ? 'hover:bg-secondary' : 'bg-blue-50/60 hover:bg-blue-50'}`}
          >
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

function UploadPage({ onPublish }: { onPublish: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [access, setAccess] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type.startsWith('video/')) setFile(f);
  };

  const handlePublish = () => {
    if (!title.trim()) return;
    setPublished(true);
    setTimeout(() => { setPublished(false); onPublish(); }, 1500);
  };

  if (published) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Icon name="Check" size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Видео опубликовано!</h2>
        <p className="text-muted-foreground text-sm">Переходим в ленту...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Загрузить видео</h1>
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 mb-6 flex flex-col items-center gap-3 transition-all cursor-pointer ${
          dragging ? 'border-foreground bg-secondary' : file ? 'border-green-400 bg-green-50' : 'border-border hover:border-muted-foreground'
        }`}
      >
        {file ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Выбрать другой файл</button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Icon name="Upload" size={20} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Перетащите файл или нажмите для выбора</p>
              <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI до 4 ГБ</p>
            </div>
            <button className="mt-2 px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-80 transition-opacity font-medium">
              Выбрать файл
            </button>
          </>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Название *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название видео..."
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Описание</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="О чём это видео..."
            rows={4}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Доступ</label>
          <div className="flex gap-2">
            {['Публичное', 'По ссылке', 'Приватное'].map((opt, i) => (
              <button key={opt} onClick={() => setAccess(i)} className={`flex-1 py-2 text-xs rounded-lg border transition-all font-medium ${access === i ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}>{opt}</button>
            ))}
          </div>
        </div>
        <button
          onClick={handlePublish}
          disabled={!title.trim()}
          className="w-full py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-80 transition-opacity text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Опубликовать видео
        </button>
        {!title.trim() && <p className="text-xs text-muted-foreground text-center">Введите название, чтобы опубликовать</p>}
      </div>
    </div>
  );
}

function ProfilePage({ setPage }: { setPage: (p: Page) => void }) {
  const [subscribed, setSubscribed] = useState(false);
  const [viewingVideo, setViewingVideo] = useState<Video | null>(null);
  const profileVideos = INITIAL_VIDEOS.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {viewingVideo && <VideoViewer video={viewingVideo} onClose={() => setViewingVideo(null)} />}
      <div className="h-36 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-stone-200 to-stone-300">
        <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=60" className="w-full h-full object-cover opacity-60" alt="" />
      </div>
      <div className="flex items-end justify-between mb-6 -mt-10 px-1">
        <div className="flex items-end gap-4">
          <img src="https://i.pravatar.cc/40?img=5" className="w-20 h-20 rounded-full border-4 border-background object-cover" alt="profile" />
          <div className="mb-1">
            <h1 className="text-xl font-bold">Анна Козлова</h1>
            <p className="text-sm text-muted-foreground">@anna.k</p>
          </div>
        </div>
        <button
          onClick={() => setSubscribed(!subscribed)}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            subscribed ? 'bg-secondary text-foreground' : 'bg-foreground text-background hover:opacity-80'
          }`}
        >
          {subscribed ? 'Подписан' : 'Подписаться'}
        </button>
      </div>
      <div className="flex gap-6 mb-6 pb-6 border-b border-border">
        {[['48', 'видео'], ['12,4 тыс', 'подписчиков'], ['234', 'подписок']].map(([val, label]) => (
          <div key={label}>
            <p className="text-lg font-bold">{val}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-6">Снимаю видео о путешествиях и творческом процессе. Делюсь приёмами монтажа и цветокоррекции.</p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Видео</p>
        <button onClick={() => setPage('upload')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-secondary">
          <Icon name="Plus" size={12} /> Загрузить
        </button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {profileVideos.map((v) => (
          <div key={v.id} className="cursor-pointer group" onClick={() => setViewingVideo(v)}>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
              <img src={v.thumb} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={v.title} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-2">
                  <Icon name="Play" size={14} />
                </div>
              </div>
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">{v.duration}</span>
            </div>
            <p className="text-xs font-medium line-clamp-2 text-foreground group-hover:opacity-70 transition-opacity">{v.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{v.views} просмотров</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [commentVideo, setCommentVideo] = useState<Video | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleLike = (id: number) => {
    setVideos((prev) =>
      prev.map((v) => v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v)
    );
  };

  const toggleRepost = (id: number) => {
    setVideos((prev) =>
      prev.map((v) => v.id === id ? { ...v, reposted: !v.reposted, reposts: v.reposted ? v.reposts - 1 : v.reposts + 1 } : v)
    );
    showToast('Репост добавлен');
  };

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    showToast(`Ссылка на «${title.slice(0, 30)}...» скопирована`);
  };

  const unreadMessages = INITIAL_MESSAGES.reduce((acc, m) => acc + m.unread, 0);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const renderPage = () => {
    const cardProps = {
      videos,
      onToggleLike: toggleLike,
      onToggleRepost: toggleRepost,
      setPage,
      onComment: setCommentVideo,
      onShare: handleShare,
      onPlay: setPlayingVideo,
    };
    switch (page) {
      case 'home': return <HomePage {...cardProps} />;
      case 'feed': return <FeedPage {...cardProps} />;
      case 'search': return <SearchPage {...cardProps} />;
      case 'recommendations': return <RecommendationsPage {...cardProps} />;
      case 'messages': return <MessagesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'upload': return <UploadPage onPublish={() => setPage('feed')} />;
      case 'profile': return <ProfilePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar page={page} setPage={setPage} unreadMessages={unreadMessages} unreadNotifications={unreadNotifications} />
      <main className="ml-56 flex-1 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {renderPage()}
        </div>
      </main>

      {commentVideo && (
        <CommentsModal
          video={commentVideo}
          comments={VIDEO_COMMENTS[commentVideo.id] || []}
          onClose={() => setCommentVideo(null)}
        />
      )}

      {playingVideo && (
        <VideoViewer video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}