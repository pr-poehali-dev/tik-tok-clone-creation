// ─── Shared types & data ──────────────────────────────────────────────────────

export interface Video {
  id: number;
  authorId: number;
  author: string;
  handle: string;
  title: string;
  description: string;
  views: string;
  viewsNum: number;
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
  publishedAt: string;
}

export interface Blogger {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  subscribers: string;
  subscribersNum: number;
  videosCount: number;
  totalViews: string;
  verified: boolean;
  verifiedAt?: string;
  joinedAt: string;
  category: string;
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface ChatMessage {
  id: number;
  from: 'me' | 'them';
  text: string;
  time: string;
}

export const BLOGGERS: Blogger[] = [
  { id: 1, name: 'Анна Козлова', handle: '@anna.k', avatar: 'https://i.pravatar.cc/150?img=5', cover: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=60', bio: 'Снимаю видео о путешествиях и творческом процессе. Делюсь приёмами монтажа и цветокоррекции. Обучаю создавать красивые ролики на обычный телефон.', subscribers: '12,4 тыс', subscribersNum: 12400, videosCount: 48, totalViews: '1,2 млн', verified: true, verifiedAt: '2024-03-15', joinedAt: '2023-01-10', category: 'Влоги' },
  { id: 2, name: 'Макс Орлов', handle: '@max.video', avatar: 'https://i.pravatar.cc/150?img=12', cover: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=60', bio: 'Мобильный оператор и монтажёр. Снимаю туториалы по съёмке и монтажу. Помогаю начинающим авторам создавать контент.', subscribers: '89 тыс', subscribersNum: 89000, videosCount: 134, totalViews: '8,7 млн', verified: true, verifiedAt: '2023-11-20', joinedAt: '2022-06-05', category: 'Технологии' },
  { id: 3, name: 'Лера Смит', handle: '@lera.creates', avatar: 'https://i.pravatar.cc/150?img=9', cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=60', bio: 'Путешественница и влогер. Объездила 47 стран с камерой. Показываю мир без прикрас и делюсь лайфхаками для бюджетных путешествий.', subscribers: '34,1 тыс', subscribersNum: 34100, videosCount: 67, totalViews: '3,4 млн', verified: false, joinedAt: '2023-04-22', category: 'Путешествия' },
  { id: 4, name: 'Иван Петров', handle: '@ivan.tech', avatar: 'https://i.pravatar.cc/150?img=3', cover: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=60', bio: 'Обзорщик техники и фото/видеооборудования. Тестирую всё, что снимает. Честные обзоры без рекламы.', subscribers: '28,7 тыс', subscribersNum: 28700, videosCount: 91, totalViews: '2,1 млн', verified: false, joinedAt: '2023-07-14', category: 'Технологии' },
  { id: 5, name: 'Ольга Новак', handle: '@olga.film', avatar: 'https://i.pravatar.cc/150?img=21', cover: 'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?w=1200&q=60', bio: 'Кинематографист и преподаватель видеопроизводства. Автор онлайн-курса по iPhone-съёмке. Снимаю клипы и короткометражки.', subscribers: '201 тыс', subscribersNum: 201000, videosCount: 212, totalViews: '22 млн', verified: true, verifiedAt: '2023-08-01', joinedAt: '2022-02-28', category: 'Кино' },
  { id: 6, name: 'Дима Лес', handle: '@dima.drone', avatar: 'https://i.pravatar.cc/150?img=17', cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=60', bio: 'Аэрооператор и пилот дрона. Снимаю города и природу с высоты птичьего полёта. Участник международных конкурсов дрон-видеографии.', subscribers: '55,3 тыс', subscribersNum: 55300, videosCount: 78, totalViews: '5,6 млн', verified: false, joinedAt: '2023-09-03', category: 'Путешествия' },
];

export const INITIAL_VIDEOS: Video[] = [
  { id: 1, authorId: 1, author: 'Анна Козлова', handle: '@anna.k', title: 'Как я сняла рекламный ролик за 2 часа', description: 'В этом видео я покажу весь процесс создания рекламного ролика с нуля — от концепции до финального монтажа. Минимум оборудования, максимум результата.', views: '48 тыс', viewsNum: 48000, duration: '12:34', likes: 2410, comments: 4, reposts: 156, thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=5', liked: false, reposted: false, category: 'Влоги', isNew: false, subscribed: true, publishedAt: '3 дня назад' },
  { id: 2, authorId: 2, author: 'Макс Орлов', handle: '@max.video', title: 'Монтаж в телефоне: 5 приёмов которые изменят всё', description: 'Разбираю 5 профессиональных приёмов монтажа, которые легко повторить прямо на телефоне. Переходы, цветокоррекция, темп — всё это в одном видео.', views: '123 тыс', viewsNum: 123000, duration: '8:17', likes: 5820, comments: 3, reposts: 441, thumb: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=12', liked: true, reposted: false, category: 'Технологии', isNew: true, subscribed: true, publishedAt: '1 день назад' },
  { id: 3, authorId: 3, author: 'Лера Смит', handle: '@lera.creates', title: 'Влог: неделя в горах без интернета', description: 'Я провела неделю в горах полностью без связи и интернета. Снимала всё на телефон. Это было лучшее решение в моей жизни — рассказываю почему.', views: '89 тыс', viewsNum: 89000, duration: '22:05', likes: 3100, comments: 5, reposts: 212, thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=9', liked: false, reposted: false, category: 'Путешествия', isNew: true, subscribed: false, publishedAt: '5 часов назад' },
  { id: 4, authorId: 4, author: 'Иван Петров', handle: '@ivan.tech', title: 'Обзор камеры Sony A7C II — стоит ли покупать?', description: 'Полный обзор Sony A7C II после двух месяцев использования. Расскажу про автофокус, видео 4K, стабилизацию и сравню с конкурентами. Честное мнение без рекламы.', views: '67 тыс', viewsNum: 67000, duration: '18:42', likes: 1890, comments: 2, reposts: 78, thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=3', liked: false, reposted: false, category: 'Технологии', isNew: false, subscribed: false, publishedAt: '1 неделю назад' },
  { id: 5, authorId: 5, author: 'Ольга Новак', handle: '@olga.film', title: 'Кинематографичная съёмка на iPhone 15', description: 'Показываю как снимать кино на iPhone 15 Pro — логарифмический профиль, цветокоррекция в DaVinci, звук и свет. Полный пайплайн от съёмки до экспорта.', views: '201 тыс', viewsNum: 201000, duration: '14:58', likes: 9340, comments: 6, reposts: 887, thumb: 'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=21', liked: true, reposted: true, category: 'Кино', isNew: true, subscribed: true, publishedAt: '2 часа назад' },
  { id: 6, authorId: 6, author: 'Дима Лес', handle: '@dima.drone', title: 'Аэросъёмка заката над городом', description: 'Съёмка заката над Москвой с дрона DJI Mini 4 Pro. Маршрут, настройки экспозиции, обработка в Lightroom. Все детали в видео.', views: '55 тыс', viewsNum: 55000, duration: '6:30', likes: 4120, comments: 3, reposts: 290, thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', avatar: 'https://i.pravatar.cc/40?img=17', liked: false, reposted: false, category: 'Путешествия', isNew: false, subscribed: false, publishedAt: '4 дня назад' },
];

export const VIDEO_COMMENTS: Record<number, Comment[]> = {
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

export const INITIAL_MESSAGES = [
  { id: 1, name: 'Макс Орлов', text: 'Отличное видео! Как ты добился такого цвета?', time: '14:32', unread: 2, avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 2, name: 'Анна Козлова', text: 'Спасибо за подписку!', time: '11:15', unread: 0, avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: 3, name: 'Лера Смит', text: 'Коллаборация?', time: 'вчера', unread: 1, avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 4, name: 'Иван Петров', text: 'Подскажи какой штатив используешь', time: 'вчера', unread: 0, avatar: 'https://i.pravatar.cc/40?img=3' },
];

export const INITIAL_CHATS: Record<number, ChatMessage[]> = {
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

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'like', user: 'Макс Орлов', action: 'оценил ваше видео', video: 'Как я сняла рекламный ролик', time: '5 мин', avatar: 'https://i.pravatar.cc/40?img=12', read: false },
  { id: 2, type: 'subscribe', user: 'Ольга Новак', action: 'подписалась на вас', video: '', time: '23 мин', avatar: 'https://i.pravatar.cc/40?img=21', read: false },
  { id: 3, type: 'comment', user: 'Дима Лес', action: 'прокомментировал: «Шикарно снято!»', video: '', time: '1 ч', avatar: 'https://i.pravatar.cc/40?img=17', read: false },
  { id: 4, type: 'repost', user: 'Лера Смит', action: 'сделала репост вашего видео', video: 'Монтаж в телефоне', time: '3 ч', avatar: 'https://i.pravatar.cc/40?img=9', read: false },
  { id: 5, type: 'like', user: 'Иван Петров', action: 'оценил ваше видео', video: 'Влог: неделя в горах', time: '5 ч', avatar: 'https://i.pravatar.cc/40?img=3', read: true },
];
