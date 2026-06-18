'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import { useAudio }    from '@/hooks/useAudio';
import { useProfile }  from '@/hooks/useProfile';
import { ProfilePanel } from '@/components/ui/ProfilePanel';
import { TeacherModeToggle } from '@/components/ui/TeacherMark';
import { TeacherDrawingOverlay } from '@/components/ui/TeacherDrawing';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const NAV = [
  { id: 'qaida',    label: 'Qaida',    arabic: 'قاعده',  emoji: '📖', gradient: ['#1B4D6B','#2979A0'], href: '/qaida'    },
  { id: 'huroof',   label: 'Huroof',   arabic: 'حروف',   emoji: '✍️', gradient: ['#7B1FA2','#AB47BC'], href: '/huroof'   },
  { id: 'harakat',  label: 'Harakat',  arabic: 'حركات',  emoji: '🎵', gradient: ['#E65100','#FF8F00'], href: '/harakat'  },
  { id: 'kalimaat', label: 'Words',    arabic: 'كلمات',  emoji: '💬', gradient: ['#2E7D32','#43A047'], href: '/kalimaat' },
  { id: 'quran',    label: 'Quran',    arabic: 'قرآن',   emoji: '🌙', gradient: ['#1565C0','#1E88E5'], href: '/quran'    },
  { id: 'progress', label: 'Progress', arabic: 'ترقی',   emoji: '⭐', gradient: ['#BF360C','#F4511E'], href: '/progress' },
];

function Cloud({ style }) {
  return (
    <svg viewBox="0 0 120 60" style={style} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="42" rx="52" ry="28" fill="white" />
      <ellipse cx="38" cy="34" rx="34" ry="24" fill="white" />
      <ellipse cx="85" cy="36" rx="28" ry="20" fill="white" />
    </svg>
  );
}

function SoundBanner({ onDismiss }) {
  return (
    <motion.div
      initial={{ y: -60 }} animate={{ y: 0 }} exit={{ y: -60 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
      style={{ background: 'linear-gradient(90deg,#FF8F00,#FF6F00)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
    >
      <span className="font-bold text-white text-sm" style={{ fontFamily: 'Fredoka One, cursive' }}>
        🔊 Tap anywhere to enable sounds!
      </span>
      <button onClick={onDismiss}
        className="text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>✕</button>
    </motion.div>
  );
}

export default function AppShell({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [showSoundBanner, setShowSoundBanner] = useState(false);
  const [showProfile, setShowProfile]         = useState(false);
  const { progress }              = useProgress();
  const { unlockAudio, isSupported } = useAudio();
  const { profile }               = useProfile();
  const { user }                  = useUser();
  const role = user?.publicMetadata?.role ?? 'student';

  const activeNav = NAV.find(n => pathname?.startsWith(n.href)) ?? NAV[0];

  useEffect(() => {
    if (!isSupported) return;
    const t = setTimeout(() => setShowSoundBanner(true), 2000);
    return () => clearTimeout(t);
  }, [isSupported]);

  const handleFirstTap = () => { unlockAudio(); setShowSoundBanner(false); };

  const navigate = (href) => router.push(href);

  return (
    <div className="app-shell sky-bg" onClick={handleFirstTap}>
      <AnimatePresence>
        {showSoundBanner && <SoundBanner onDismiss={() => { unlockAudio(); setShowSoundBanner(false); }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar flex-col w-64 shrink-0 shadow-2xl"
        style={{ background: 'linear-gradient(180deg,#0d2d40 0%,#1B4D6B 60%,#0d3349 100%)', position: 'relative', overflow: 'hidden', zIndex: 200 }}>
        <Cloud style={{ position:'absolute', top:'-10px', right:'-20px', width:'140px', opacity:0.06 }} />
        <Cloud style={{ position:'absolute', bottom:'80px', left:'-30px', width:'120px', opacity:0.05 }} />

        <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'linear-gradient(135deg,#FFD54F,#FF8F00)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>☪️</div>
            <div>
              <h1 className="font-extrabold text-white leading-tight" style={{ fontFamily: 'Fredoka One, cursive', fontSize: '20px' }}>
                Madani Qaida
              </h1>
              <p style={{ fontFamily:'IndoPak Nastaleeq,serif', color:'#FFD54F', fontSize:'15px', direction:'rtl' }}>مدنى قاعده</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,213,79,0.15)', border: '1.5px solid rgba(255,213,79,0.4)' }}>
            <motion.span className="text-2xl" animate={{ rotate: [0,15,-15,0] }} transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}>⭐</motion.span>
            <div>
              <div className="font-extrabold text-xl leading-none" style={{ color:'#FFD54F', fontFamily:'Fredoka One, cursive' }}>{progress.totalStars}</div>
              <div className="text-xs opacity-60 text-white" style={{ fontFamily:'Nunito, sans-serif' }}>stars earned</div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 px-3 py-2 rounded-2xl"
            style={{ backgroundColor:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.2)' }}>
            <UserButton afterSignOutUrl="/sign-in" />
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-sm leading-tight text-white truncate" style={{ fontFamily:'Fredoka One, cursive' }}>
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'My Account'}
              </div>
              <div className="text-xs opacity-50 text-white capitalize" style={{ fontFamily:'Nunito, sans-serif' }}>
                {role} account
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(item => {
            const isActive = activeNav.id === item.id;
            return (
              <motion.button key={item.id} onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                style={{
                  background: isActive ? `linear-gradient(90deg,${item.gradient[0]},${item.gradient[1]})` : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                }}
                whileHover={!isActive ? { backgroundColor:'rgba(255,255,255,0.08)' } : {}}
                whileTap={{ scale:0.97 }}>
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-white text-sm leading-tight truncate" style={{ fontFamily:'Fredoka One, cursive' }}>{item.label}</div>
                  <div className="text-xs opacity-60 text-white" style={{ fontFamily:'IndoPak Nastaleeq,serif', direction:'rtl', fontSize:'13px' }}>{item.arabic}</div>
                </div>
                {isActive && (
                  <motion.div className="w-2 h-2 rounded-full bg-yellow-300"
                    animate={{ scale:[1,1.5,1] }} transition={{ duration:1, repeat:Infinity }} />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t text-center" style={{ borderColor:'rgba(255,255,255,0.1)' }}>
          <div className="mb-2 flex justify-center"><TeacherModeToggle /></div>
          {role === 'admin' && (
            <button onClick={() => router.push('/admin')}
              className="mb-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition"
              style={{ backgroundColor:'rgba(139,92,246,0.25)', border:'1.5px solid rgba(139,92,246,0.5)', color:'#c4b5fd', fontFamily:'Fredoka One, cursive' }}>
              ⚙️ Admin Panel
            </button>
          )}
          <p className="text-xs opacity-40 text-white" style={{ fontFamily:'Nunito, sans-serif' }}>Traditional Indo-Pak Madani Qaida Method</p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ position:'relative', overflow:'hidden' }}>
        <TeacherDrawingOverlay />

        {/* Mobile sticky header */}
        <header className="mobile-header"
          style={{ background:`linear-gradient(135deg,${activeNav.gradient[0]},${activeNav.gradient[1]})`, zIndex:200, position:'relative', overflow:'hidden', flexShrink:0 }}>
          <Cloud style={{ position:'absolute', top:'-5px', right:'-10px', width:'100px', opacity:0.12 }} />
          <div style={{ display:'flex', alignItems:'center', gap:8, position:'relative', zIndex:1 }}>
            <span style={{ fontSize:'28px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{activeNav.emoji}</span>
            <div>
              <div style={{ fontFamily:'Fredoka One,cursive', fontSize:'16px', fontWeight:900, color:'white', lineHeight:1.2 }}>{activeNav.label}</div>
              <div style={{ fontFamily:'IndoPak Nastaleeq,serif', color:'#FFD54F', fontSize:'13px', direction:'rtl', lineHeight:1 }}>{activeNav.arabic}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, position:'relative', zIndex:1 }}>
            <TeacherModeToggle compact />
            {role === 'admin' && (
              <button onClick={() => router.push('/admin')}
                style={{ fontSize:'18px', background:'rgba(139,92,246,0.3)', border:'1.5px solid rgba(139,92,246,0.6)', borderRadius:10, padding:'4px 7px', cursor:'pointer', lineHeight:1 }}
                title="Admin Panel">
                ⚙️
              </button>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 8px', borderRadius:20, backgroundColor:'rgba(255,255,255,0.2)', border:'1.5px solid rgba(255,255,255,0.4)' }}>
              <span style={{ fontSize:'15px' }}>⭐</span>
              <span style={{ color:'#FFD54F', fontFamily:'Fredoka One,cursive', fontSize:'15px', fontWeight:900 }}>{progress.totalStars}</span>
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        <main className="page-scroll flex-1">{children}</main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 border-t"
        style={{ background:'linear-gradient(0deg,#0d2d40,#1B4D6B)', borderColor:'rgba(255,213,79,0.3)', zIndex:200 }}>
        <div style={{ display:'flex', height:'100%', overflowX:'auto', overflowY:'hidden', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', scrollbarWidth:'none', msOverflowStyle:'none' }}>
          {NAV.map(item => {
            const isActive = activeNav.id === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.href)}
                style={{ flex:'0 0 calc(100% / 6)', minWidth:64, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, position:'relative', border:'none', background:'transparent', cursor:'pointer', padding:'6px 0', scrollSnapAlign:'start' }}>
                {isActive && (
                  <motion.div layoutId="mobileActiveTab"
                    style={{ position:'absolute', top:4, bottom:4, left:4, right:4, borderRadius:14, background:`linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})` }}
                    transition={{ type:'spring', stiffness:400, damping:30 }} />
                )}
                <span style={{ fontSize:'22px', lineHeight:1, position:'relative', zIndex:1 }}>{item.emoji}</span>
                <span style={{ fontSize:'10px', fontFamily:'Fredoka One, cursive', color:isActive?'#FFD54F':'#94A3B8', lineHeight:1, position:'relative', zIndex:1, whiteSpace:'nowrap' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
