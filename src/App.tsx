import { useState } from 'react';
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
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  { id: 1, author: 'Анна Козлова', handle: '@anna.k', title: 'Как я сняла рекламный ролик за 2 часа', views: '48 тыс', duration: '12:34', likes: 2410, comments: 87, reposts: 156, thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=5', liked: false, reposted: false },
  { id: 2, author: 'Макс Орлов', handle: '@max.video', title: 'Монтаж в телефоне: 5 приёмов которые изменят всё', views: '123 тыс', duration: '8:17', likes: 5820, comments: 203, reposts: 441, thumb: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=12', liked: true, reposted: false },
  { id: 3, author: 'Лера Смит', handle: '@lera.creates', title: 'Влог: неделя в горах без интернета', views: '89 тыс', duration: '22:05', likes: 3100, comments: 94, reposts: 212, thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=9', liked: false, reposted: false },
  { id: 4, author: 'Иван Петров', handle: '@ivan.tech', title: 'Обзор камеры Sony A7C II — стоит ли покупать?', views: '67 тыс', duration: '18:42', likes: 1890, comments: 131, reposts: 78, thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=3', liked: false, reposted: false },
  { id: 5, author: 'Ольга Новак', handle: '@olga.film', title: 'Кинематографичная съёмка на iPhone 15', views: '201 тыс', duration: '14:58', likes: 9340, comments: 320, reposts: 887, thumb: 'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=21', liked: true, reposted: true },
  { id: 6, author: 'Дима Лес', handle: '@dima.drone', title: 'Аэросъёмка заката над городом', views: '55 тыс', duration: '6:30', likes: 4120, comments: 67, reposts: 290, thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=17', liked: false, reposted: false },
];

const MESSAGES = [
  { id: 1, name: 'Макс Орлов', text: 'Отличное видео! Как ты добился такого цвета?', time: '14:32', unread: 2, avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 2, name: 'Анна Козлова', text: 'Спасибо за подписку!', time: '11:15', unread: 0, avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: 3, name: 'Лера Смит', text: 'Коллаборация?', time: 'вчера', unread: 1, avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 4, name: 'Иван Петров', text: 'Подскажи какой штатив используешь', time: 'вчера', unread: 0, avatar: 'https://i.pravatar.cc/40?img=3' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'like', user: 'Макс Орлов', action: 'оценил ваше видео', video: 'Как я сняла рекламный ролик', time: '5 мин', avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 2, type: 'subscribe', user: 'Ольга Новак', action: 'подписалась на вас', video: '', time: '23 мин', avatar: 'https://i.pravatar.cc/40?img=21' },
  { id: 3, type: 'comment', user: 'Дима Лес', action: 'прокомментировал: «Шикарно снято!»', video: '', time: '1 ч', avatar: 'https://i.pravatar.cc/40?img=17' },
  { id: 4, type: 'repost', user: 'Лера Смит', action: 'сделала репост вашего видео', video: 'Монтаж в телефоне', time: '3 ч', avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 5, type: 'like', user: 'Иван Петров', action: 'оценил ваше видео', video: 'Влог: неделя в горах', time: '5 ч', avatar: 'https://i.pravatar.cc/40?img=3' },
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

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
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
                active
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
              {item.id === 'messages' && (
                <span className="ml-auto text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>3</span>
              )}
              {item.id === 'notifications' && (
                <span className="ml-auto text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>5</span>
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

function VideoCard({ video, onToggleLike, onToggleRepost, onAuthorClick }: {
  video: Video;
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  onAuthorClick: () => void;
}) {
  return (
    <div className="video-card bg-white border border-border rounded-lg overflow-hidden animate-fade-in">
      <div className="relative aspect-video overflow-hidden bg-muted cursor-pointer group">
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
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 cursor-pointer hover:opacity-70 transition-opacity">{video.title}</p>
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
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
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
          <button className="ml-auto px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Icon name="Share2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────

function HomePage({ videos, onToggleLike, onToggleRepost, setPage }: {
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Добро пожаловать</h1>
        <p className="text-muted-foreground text-sm">Новые видео от авторов, на которых вы подписаны</p>
      </div>
      <div className="relative rounded-xl overflow-hidden mb-8 cursor-pointer group h-64">
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
          <button key={v.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
            <div className="w-14 h-14 rounded-full border-2 border-border group-hover:border-foreground transition-colors overflow-hidden">
              <img src={v.avatar} className="w-full h-full object-cover" alt={v.author} />
            </div>
            <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors w-14 text-center truncate">{v.author.split(' ')[0]}</span>
          </button>
        ))}
        <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center">
            <Icon name="Plus" size={18} className="text-muted-foreground" />
          </div>
          <span className="text-[10px] text-muted-foreground w-14 text-center">Найти</span>
        </button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} />
        ))}
      </div>
    </div>
  );
}

function FeedPage({ videos, onToggleLike, onToggleRepost, setPage }: {
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'subscriptions' | 'new'>('all');
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
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} />
        ))}
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const categories = ['Влоги', 'Технологии', 'Кино', 'Путешествия', 'Музыка', 'Спорт', 'Кулинария', 'Образование'];
  const trending = ['Монтаж видео', 'Дрон съёмка', 'iPhone камера', 'Влог формат', 'YouTube 2025'];
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Поиск</h1>
      <div className="relative mb-6">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск видео, авторов..."
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-foreground transition-colors"
        />
      </div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Категории</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} className="px-3 py-1.5 border border-border rounded-full text-sm text-foreground hover:bg-foreground hover:text-background transition-all">{c}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">В тренде</p>
        <div className="space-y-1">
          {trending.map((t, i) => (
            <button key={t} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors group">
              <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
              <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{t}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendationsPage({ videos, onToggleLike, onToggleRepost, setPage }: {
  videos: Video[];
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  setPage: (p: Page) => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Рекомендации</h1>
        <p className="text-sm text-muted-foreground">Подобрано специально для вас на основе интересов</p>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {['Монтаж', 'Влоги', 'Техника', 'Путешествия'].map((tag, i) => (
          <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium border ${i === 0 ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'}`}>{tag}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {[...videos].reverse().map((v) => (
          <VideoCard key={v.id} video={v} onToggleLike={onToggleLike} onToggleRepost={onToggleRepost} onAuthorClick={() => setPage('profile')} />
        ))}
      </div>
    </div>
  );
}

function MessagesPage() {
  const [active, setActive] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  if (active !== null) {
    const chat = MESSAGES.find((m) => m.id === active)!;
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
          <div className="flex justify-end">
            <div className="bg-foreground text-background text-sm px-3 py-2 rounded-2xl rounded-tr-sm max-w-xs">Привет! Спасибо за поддержку</div>
          </div>
          <div className="flex justify-start">
            <div className="bg-secondary text-foreground text-sm px-3 py-2 rounded-2xl rounded-tl-sm max-w-xs">{chat.text}</div>
          </div>
          <div className="flex justify-end">
            <div className="bg-foreground text-background text-sm px-3 py-2 rounded-2xl rounded-tr-sm max-w-xs">Снимаю в логарифмическом профиле, потом цветокоррекция в Premiere</div>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-2.5 border border-border rounded-full text-sm focus:outline-none focus:border-foreground transition-colors"
          />
          <button className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0">
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
        {MESSAGES.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
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
  const iconMap: Record<string, string> = { like: 'Heart', subscribe: 'UserPlus', comment: 'MessageCircle', repost: 'Repeat2' };
  const bgMap: Record<string, string> = { like: '#ef4444', subscribe: '#3b82f6', comment: '#22c55e', repost: '#8b5cf6' };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Отметить все прочитанными</button>
      </div>
      <div className="space-y-1">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
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
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [access, setAccess] = useState(0);

  return (
    <div className="animate-fade-in max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Загрузить видео</h1>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={`border-2 border-dashed rounded-xl p-12 mb-6 flex flex-col items-center gap-3 transition-all cursor-pointer ${
          dragging ? 'border-foreground bg-secondary' : 'border-border hover:border-muted-foreground'
        }`}
      >
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
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Название</label>
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
        <button className="w-full py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-80 transition-opacity text-sm">
          Опубликовать видео
        </button>
      </div>
    </div>
  );
}

function ProfilePage({ setPage: _setPage }: { setPage: (p: Page) => void }) {
  const [subscribed, setSubscribed] = useState(false);
  const profileVideos = VIDEOS.slice(0, 4);

  return (
    <div className="animate-fade-in">
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
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Видео</p>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {profileVideos.map((v) => (
          <div key={v.id} className="cursor-pointer group">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
              <img src={v.thumb} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={v.title} />
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
  const [videos, setVideos] = useState<Video[]>(VIDEOS);

  const toggleLike = (id: number) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v
      )
    );
  };

  const toggleRepost = (id: number) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, reposted: !v.reposted, reposts: v.reposted ? v.reposts - 1 : v.reposts + 1 } : v
      )
    );
  };

  const renderPage = () => {
    const props = { videos, onToggleLike: toggleLike, onToggleRepost: toggleRepost, setPage };
    switch (page) {
      case 'home': return <HomePage {...props} />;
      case 'feed': return <FeedPage {...props} />;
      case 'search': return <SearchPage />;
      case 'recommendations': return <RecommendationsPage {...props} />;
      case 'messages': return <MessagesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'upload': return <UploadPage />;
      case 'profile': return <ProfilePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar page={page} setPage={setPage} />
      <main className="ml-56 flex-1 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
