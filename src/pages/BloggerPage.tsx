import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Blogger, Video, INITIAL_VIDEOS } from '@/data';

interface Props {
  blogger: Blogger;
  onBack: () => void;
  onVideoClick: (video: Video) => void;
}

export default function BloggerPage({ blogger, onBack, onVideoClick }: Props) {
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');

  const bloggerVideos = INITIAL_VIDEOS.filter((v) => v.authorId === blogger.id);

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 md:hidden">
        <Icon name="ArrowLeft" size={16} /> Назад
      </button>

      {/* Cover */}
      <div className="h-36 md:h-52 rounded-xl overflow-hidden mb-4 relative">
        <img src={blogger.cover} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="flex items-end justify-between -mt-12 px-2 mb-5">
        <div className="flex items-end gap-3 md:gap-4">
          <div className="relative">
            <img
              src={blogger.avatar}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-background object-cover"
              alt={blogger.name}
            />
            {blogger.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-background flex items-center justify-center shadow-md"
                style={{ background: 'hsl(4 90% 55%)' }}
                title="Верифицированный автор"
              >
                <Icon name="Check" size={13} className="text-white" />
              </div>
            )}
          </div>
          <div className="mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold">{blogger.name}</h1>
              {blogger.verified && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white inline-flex items-center gap-1"
                  style={{ background: 'hsl(4 90% 55%)' }}
                >
                  <Icon name="BadgeCheck" size={11} />
                  Верифицирован
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{blogger.handle}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <button className="p-2 border border-border rounded-full hover:bg-secondary transition-colors">
            <Icon name="Bell" size={17} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              subscribed
                ? 'bg-secondary text-foreground border border-border hover:bg-secondary/70'
                : 'text-white hover:opacity-80'
            }`}
            style={!subscribed ? { background: 'hsl(4 90% 55%)' } : undefined}
          >
            {subscribed ? 'Подписан' : 'Подписаться'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        {[
          { val: blogger.subscribers, label: 'подписчиков' },
          { val: blogger.videosCount.toString(), label: 'видео' },
          { val: blogger.totalViews, label: 'просмотров' },
        ].map(({ val, label }) => (
          <div key={label} className="bg-secondary/50 rounded-xl py-3">
            <p className="text-lg font-bold text-foreground">{val}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-5">
        {([['videos', 'Видео'], ['about', 'О канале']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'videos' && (
        <div>
          {bloggerVideos.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="VideoOff" size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Нет видео</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {bloggerVideos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onVideoClick(v)}
                  className="text-left group cursor-pointer"
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
                    <img src={v.thumb} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={v.title} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-2">
                        <Icon name="Play" size={14} />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{v.duration}</span>
                  </div>
                  <p className="text-sm font-semibold line-clamp-2 text-foreground group-hover:opacity-70 transition-opacity">{v.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.views} · {v.publishedAt}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="space-y-4 max-w-xl">
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Описание</p>
            <p className="text-sm text-foreground leading-relaxed">{blogger.bio}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Подробности</p>
            {[
              { icon: 'Tag', label: 'Категория', value: blogger.category },
              { icon: 'Calendar', label: 'На платформе с', value: new Date(blogger.joinedAt).toLocaleDateString('ru', { year: 'numeric', month: 'long' }) },
              { icon: 'BadgeCheck', label: 'Статус', value: blogger.verified ? 'Верифицированный автор' : 'Автор' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon name={icon} size={16} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground w-28">{label}</span>
                <span className={`text-sm font-medium ${icon === 'BadgeCheck' && blogger.verified ? '' : 'text-foreground'}`}
                  style={icon === 'BadgeCheck' && blogger.verified ? { color: 'hsl(4 90% 55%)' } : undefined}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
