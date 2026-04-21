import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Blogger, INITIAL_VIDEOS } from '@/data';

interface Props {
  bloggers: Blogger[];
  onToggleVerified: (id: number) => void;
  onBack: () => void;
  onBloggerClick: (id: number) => void;
}

const ADMIN_PASSWORD = 'admin123';

type AdminTab = 'bloggers' | 'stats' | 'reports';

export default function AdminPage({ bloggers, onToggleVerified, onBack, onBloggerClick }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [passError, setPassError] = useState(false);
  const [tab, setTab] = useState<AdminTab>('bloggers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'pending'>('all');
  const [confirmAction, setConfirmAction] = useState<{ id: number; name: string; action: 'verify' | 'unverify' } | null>(null);
  const [recentActions, setRecentActions] = useState<{ text: string; time: string }[]>([]);

  const handleLogin = () => {
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true);
      setPassError(false);
    } else {
      setPassError(true);
      setPass('');
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    onToggleVerified(confirmAction.id);
    const verb = confirmAction.action === 'verify' ? 'Выдана галочка' : 'Галочка снята';
    setRecentActions((prev) => [
      { text: `${verb}: ${confirmAction.name}`, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(0, 9),
    ]);
    setConfirmAction(null);
  };

  const filtered = bloggers.filter((b) => {
    const mq = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const mv = filterVerified === 'all' || (filterVerified === 'verified' ? b.verified : !b.verified);
    return mq && mv;
  });

  const verifiedCount = bloggers.filter((b) => b.verified).length;
  const totalSubs = bloggers.reduce((acc, b) => acc + b.subscribersNum, 0);
  const totalVideos = INITIAL_VIDEOS.length;

  // ─── Login screen ───────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(4 90% 55%)' }}>
              <Icon name="ShieldCheck" size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Панель администратора</h1>
            <p className="text-muted-foreground text-sm mt-1">Введите пароль для доступа</p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Пароль</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setPassError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Введите пароль..."
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors mb-1 ${passError ? 'border-red-400 bg-red-50' : 'border-border focus:border-foreground'}`}
            />
            {passError && <p className="text-xs text-red-500 mb-3">Неверный пароль</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl text-sm font-bold text-white mt-3 hover:opacity-90 transition-opacity"
              style={{ background: 'hsl(4 90% 55%)' }}
            >
              Войти
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3">Подсказка: admin123</p>
          </div>

          <button onClick={onBack} className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mx-auto">
            <Icon name="ArrowLeft" size={14} /> Вернуться на сайт
          </button>
        </div>
      </div>
    );
  }

  // ─── Admin Panel ────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">
      {/* Confirm dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmAction.action === 'verify' ? 'bg-green-100' : 'bg-red-100'}`}>
                <Icon name={confirmAction.action === 'verify' ? 'BadgeCheck' : 'BadgeX'} size={20} className={confirmAction.action === 'verify' ? 'text-green-600' : 'text-red-500'} />
              </div>
              <div>
                <p className="font-bold">{confirmAction.action === 'verify' ? 'Выдать верификацию' : 'Снять верификацию'}</p>
                <p className="text-sm text-muted-foreground">{confirmAction.name}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {confirmAction.action === 'verify'
                ? 'Аккаунт получит синюю галочку и будет выделен в поиске и ленте.'
                : 'Галочка будет снята с аккаунта автора.'}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity ${confirmAction.action === 'verify' ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {confirmAction.action === 'verify' ? 'Выдать' : 'Снять'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(4 90% 55%)' }}>
            <Icon name="ShieldCheck" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Панель администратора</h1>
            <p className="text-xs text-muted-foreground">волна. admin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary">
            <Icon name="ExternalLink" size={14} /> На сайт
          </button>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary">
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: 'Users', label: 'Авторов', value: bloggers.length.toString(), color: '#6366f1' },
          { icon: 'BadgeCheck', label: 'Верифицированы', value: verifiedCount.toString(), color: '#22c55e' },
          { icon: 'Clock', label: 'Ожидают', value: (bloggers.length - verifiedCount).toString(), color: 'hsl(4 90% 55%)' },
          { icon: 'Video', label: 'Видео', value: totalVideos.toString(), color: '#f59e0b' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="bg-white border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={icon} size={16} style={{ color }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-5 w-fit">
        {([['bloggers', 'Авторы', 'Users'], ['stats', 'Статистика', 'BarChart2'], ['reports', 'Лог действий', 'ClipboardList']] as const).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name={icon} size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ─── Bloggers tab ─── */}
      {tab === 'bloggers' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени или хэндлу..."
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-foreground transition-colors bg-white"
              />
            </div>
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              {([['all', 'Все'], ['verified', 'Верифицированы'], ['pending', 'Ожидают']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setFilterVerified(key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterVerified === key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="SearchX" size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Никого не найдено</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((b) => (
                <div key={b.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img src={b.avatar} className="w-12 h-12 rounded-full object-cover" alt={b.name} />
                    {b.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white" style={{ background: 'hsl(4 90% 55%)' }}>
                        <Icon name="Check" size={9} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => onBloggerClick(b.id)} className="font-semibold text-sm hover:underline">{b.name}</button>
                      {b.verified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white inline-flex items-center gap-0.5" style={{ background: 'hsl(4 90% 55%)' }}>
                          <Icon name="BadgeCheck" size={9} /> Верифицирован
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{b.handle} · {b.category}</p>
                    <p className="text-xs text-muted-foreground">{b.subscribers} подписчиков · {b.videosCount} видео</p>
                    {b.verified && b.verifiedAt && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Верифицирован: {new Date(b.verifiedAt).toLocaleDateString('ru')}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onBloggerClick(b.id)}
                      className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                      title="Открыть профиль"
                    >
                      <Icon name="ExternalLink" size={15} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setConfirmAction({ id: b.id, name: b.name, action: b.verified ? 'unverify' : 'verify' })}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        b.verified
                          ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                      }`}
                    >
                      <Icon name={b.verified ? 'BadgeX' : 'BadgeCheck'} size={14} />
                      {b.verified ? 'Снять' : 'Выдать'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Stats tab ─── */}
      {tab === 'stats' && (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-bold mb-4">Авторы по категориям</h3>
            {['Влоги', 'Технологии', 'Путешествия', 'Кино'].map((cat) => {
              const count = bloggers.filter((b) => b.category === cat).length;
              const pct = Math.round((count / bloggers.length) * 100);
              return (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat}</span>
                    <span className="text-muted-foreground">{count} авторов ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'hsl(4 90% 55%)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4">Топ авторов по подписчикам</h3>
              <div className="space-y-3">
                {[...bloggers].sort((a, b) => b.subscribersNum - a.subscribersNum).slice(0, 5).map((b, i) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-4 text-right">{i + 1}</span>
                    <img src={b.avatar} className="w-8 h-8 rounded-full object-cover" alt={b.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">{b.name}</span>
                        {b.verified && <Icon name="BadgeCheck" size={12} style={{ color: 'hsl(4 90% 55%)' }} />}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{b.subscribers}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4">Общая статистика</h3>
              <div className="space-y-3">
                {[
                  { label: 'Всего авторов', value: bloggers.length.toString() },
                  { label: 'Верифицированы', value: `${verifiedCount} (${Math.round((verifiedCount / bloggers.length) * 100)}%)` },
                  { label: 'Суммарно подписчиков', value: totalSubs.toLocaleString('ru') },
                  { label: 'Видео на платформе', value: totalVideos.toString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Log tab ─── */}
      {tab === 'reports' && (
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-bold mb-4">Последние действия</h3>
          {recentActions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Icon name="ClipboardList" size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Действий пока нет</p>
              <p className="text-xs mt-1">Выдайте или снимите верификацию — действие отобразится здесь</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActions.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'hsl(4 90% 55%)' }} />
                  <span className="text-sm text-foreground flex-1">{a.text}</span>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
