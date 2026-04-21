import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Video, Blogger, Comment, VIDEO_COMMENTS, INITIAL_VIDEOS } from '@/data';

interface Props {
  video: Video;
  blogger: Blogger;
  videos: Video[];
  onBack: () => void;
  onToggleLike: (id: number) => void;
  onToggleRepost: (id: number) => void;
  onAuthorClick: (bloggerId: number) => void;
  onVideoClick: (video: Video) => void;
  onShare: (title: string) => void;
}

// ─── Mini Video Player ─────────────────────────────────────────────────────────

function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
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
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) { el.requestFullscreen?.(); setFullscreen(true); }
    else { document.exitFullscreen?.(); setFullscreen(false); }
  };

  const formatTime = (pct: number) => {
    const parts = video.duration.split(':').map(Number);
    const total = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
    const cur = Math.floor((pct / 100) * total);
    return `${Math.floor(cur / 60).toString().padStart(2, '0')}:${(cur % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="relative bg-black w-full" style={{ aspectRatio: '16/9' }}>
      <video
        ref={videoRef}
        src=""
        poster={video.thumb}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        playsInline
      />

      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Icon name="Play" size={32} className="text-white ml-2" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        {/* Progress */}
        <div className="h-1 bg-white/30 rounded-full cursor-pointer mb-2" onClick={seek}>
          <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="text-white">
            <Icon name={playing ? 'Pause' : 'Play'} size={20} />
          </button>
          <button onClick={toggleMute} className="text-white">
            <Icon name={muted || volume === 0 ? 'VolumeX' : 'Volume2'} size={18} />
          </button>
          <input
            type="range" min="0" max="1" step="0.05"
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="w-16 accent-white opacity-80 hidden sm:block"
          />
          <span className="text-white/70 text-xs ml-1">{formatTime(progress)} / {video.duration}</span>
          <div className="flex-1" />
          <button onClick={toggleFullscreen} className="text-white">
            <Icon name={fullscreen ? 'Minimize' : 'Maximize'} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VideoPage ─────────────────────────────────────────────────────────────────

export default function VideoPage({
  video: initialVideo, blogger, videos, onBack,
  onToggleLike, onToggleRepost, onAuthorClick, onVideoClick, onShare,
}: Props) {
  const [video, setVideo] = useState(initialVideo);
  const [subscribedLocal, setSubscribedLocal] = useState(blogger.verified);
  const [comments, setComments] = useState<Comment[]>(VIDEO_COMMENTS[video.id] || []);
  const [newComment, setNewComment] = useState('');
  const [showAllDesc, setShowAllDesc] = useState(false);
  const [likingComment, setLikingComment] = useState<number | null>(null);

  // sync when video changes
  useEffect(() => {
    setVideo(initialVideo);
    setComments(VIDEO_COMMENTS[initialVideo.id] || []);
    setNewComment('');
    setShowAllDesc(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialVideo.id]);

  const handleLike = () => {
    onToggleLike(video.id);
    setVideo((v) => ({ ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }));
  };

  const handleRepost = () => {
    onToggleRepost(video.id);
    setVideo((v) => ({ ...v, reposted: !v.reposted, reposts: v.reposted ? v.reposts - 1 : v.reposts + 1 }));
  };

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
    setComments([c, ...comments]);
    setVideo((v) => ({ ...v, comments: v.comments + 1 }));
    setNewComment('');
  };

  const likeComment = (id: number) => {
    setLikingComment(id);
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, likes: c.likes + 1 } : c));
    setTimeout(() => setLikingComment(null), 600);
  };

  const related = INITIAL_VIDEOS.filter((v) => v.id !== video.id && (v.category === video.category || v.authorId === video.authorId)).slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 md:hidden"
      >
        <Icon name="ArrowLeft" size={16} /> Назад
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {/* Player */}
          <div className="rounded-xl overflow-hidden mb-4 bg-black">
            <VideoPlayer video={video} />
          </div>

          {/* Title + actions */}
          <h1 className="text-lg md:text-xl font-bold text-foreground mb-3 leading-snug">{video.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
            {/* Stats */}
            <p className="text-sm text-muted-foreground">{video.views} просмотров · {video.publishedAt}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                  video.liked ? 'bg-red-50 text-red-500 border-red-200' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon name="Heart" size={15} />
                {video.likes.toLocaleString('ru')}
              </button>
              <button
                onClick={handleRepost}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                  video.reposted ? 'bg-green-50 text-green-600 border-green-200' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon name="Repeat2" size={15} />
                {video.reposts}
              </button>
              <button
                onClick={() => onShare(video.title)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Icon name="Share2" size={15} />
                Поделиться
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                <Icon name="Bookmark" size={15} />
                Сохранить
              </button>
            </div>
          </div>

          {/* Author card */}
          <div className="flex items-start gap-3 mb-5 p-4 bg-secondary/50 rounded-xl">
            <button onClick={() => onAuthorClick(blogger.id)} className="flex-shrink-0">
              <div className="relative">
                <img src={blogger.avatar} className="w-12 h-12 rounded-full object-cover" alt={blogger.name} />
                {blogger.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                )}
              </div>
            </button>
            <div className="flex-1 min-w-0">
              <button onClick={() => onAuthorClick(blogger.id)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <span className="font-semibold text-foreground">{blogger.name}</span>
                {blogger.verified && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: 'hsl(4 90% 55%)' }}>✓</span>
                )}
              </button>
              <p className="text-xs text-muted-foreground">{blogger.subscribers} подписчиков</p>
            </div>
            <button
              onClick={() => setSubscribedLocal(!subscribedLocal)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                subscribedLocal
                  ? 'bg-secondary text-foreground border border-border hover:bg-secondary/70'
                  : 'text-white hover:opacity-80'
              }`}
              style={!subscribedLocal ? { background: 'hsl(4 90% 55%)' } : undefined}
            >
              {subscribedLocal ? 'Подписан' : 'Подписаться'}
            </button>
          </div>

          {/* Description */}
          <div className="mb-6 bg-secondary/50 rounded-xl p-4">
            <p className={`text-sm text-foreground leading-relaxed ${showAllDesc ? '' : 'line-clamp-3'}`}>
              {video.description}
            </p>
            <button onClick={() => setShowAllDesc(!showAllDesc)} className="text-xs font-semibold text-muted-foreground hover:text-foreground mt-1 transition-colors">
              {showAllDesc ? 'Свернуть' : 'Ещё'}
            </button>
          </div>

          {/* Comments */}
          <div>
            <h3 className="font-bold text-base mb-4">{comments.length} комментариев</h3>

            {/* New comment */}
            <div className="flex gap-3 mb-6">
              <img src="https://i.pravatar.cc/40?img=5" className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="me" />
              <div className="flex-1 flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendComment()}
                  placeholder="Написать комментарий..."
                  className="flex-1 px-4 py-2.5 border border-border rounded-full text-sm focus:outline-none focus:border-foreground transition-colors bg-white"
                />
                <button
                  onClick={sendComment}
                  disabled={!newComment.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-opacity disabled:opacity-30"
                  style={{ background: 'hsl(4 90% 55%)' }}
                >
                  <Icon name="Send" size={15} />
                </button>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-5">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.avatar} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt={c.author} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-semibold">{c.author}</span>
                      <span className="text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => likeComment(c.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${likingComment === c.id ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Icon name="Heart" size={13} />
                        {c.likes}
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Ответить</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — related */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Похожие видео</h3>
          <div className="space-y-3">
            {related.map((v) => {
              const b = { verified: [1,2,5].includes(v.authorId) };
              return (
                <button
                  key={v.id}
                  onClick={() => onVideoClick(v)}
                  className="flex gap-3 w-full text-left group hover:bg-secondary rounded-lg p-2 transition-colors -mx-2"
                >
                  <div className="relative w-36 flex-shrink-0 aspect-video rounded-md overflow-hidden bg-muted">
                    <img src={v.thumb} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={v.title} />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">{v.duration}</span>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1">{v.title}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground truncate">{v.author}</span>
                      {b.verified && <Icon name="BadgeCheck" size={12} style={{ color: 'hsl(4 90% 55%)' }} />}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.views} просмотров</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
