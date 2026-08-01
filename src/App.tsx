import { useState, useEffect, useRef } from 'react'
import heroBg from './Images/754046187_1734048967883418_3769817680207154738_n.jpg'
import logo from './Images/LOGO-removebg-preview.png'
import teamOriginal from './Images/ORIGINAL.jpg'
import teamReborn from './Images/749981256_1582934506531124_7454687730703426001_n.jpg'
import teamWarzie from './Images/WARZIE.jpg'
import teamAether from './Images/MOBILE-LEGENDS.jpg'
import adminKambajon from './Images/admin-kambajon.jpeg'
import adminPapaV from './Images/admin-papav.jpeg'
import adminKenichi from './Images/admin-kenichi.jpeg'
import adminKate from './Images/admin-kate.jpeg'
import adminBroker from './Images/admin-broker.jpeg'
import adminWhiskey from './Images/admin-whiskey.jpeg'
import newsGreenNotice from './Images/green-notice.jpg'

/* ─── data ─────────────────────────────────────────────────── */

const teams = [
  {
    id: 'original',
    name: 'LG Original',
    tag: 'Battle Royale',
    game: 'CODM BR',
    desc: 'The founding division. Built on precision, forged in the original battle royale arena.',
    about:
      "With 119 members and counting managed by seven (7) LG Admins, Original Clan is the epitome of success of Last Game's long history in Call of Duty. Started in 2020, OG Clan became the original home of old-timey gamers, heavily skilled in battle royale games in Call of Duty Mobile.",
    active: true,
    image: teamOriginal,
  },
  {
    id: 'reborn',
    name: 'LG Reborn',
    tag: 'Multiplayer',
    game: 'CODM MP',
    desc: 'Fast rotations, sharp aim, relentless aggression. The MP flagship.',
    about:
      "With 81 members and counting managed by eight (8) LG Admins, Reborn Clan houses members skilled in multiplayer games in Call of Duty Mobile. Started in mid-2024, RB Clan remains qualified and afloat, ready to fight in combat in a moment's notice.",
    active: true,
    image: teamReborn,
  },
  {
    id: 'warzie',
    name: 'LG Warzie',
    tag: 'Warzone',
    game: 'Warzone',
    desc: 'Drop, adapt, dominate. Our Warzone squad brings elite tactical play to every match.',
    about:
      'WarZie Clan holds the largest number of members with 200 registered gamers all over the world managed by two (2) LG Admins divided into three (3) sections. Started in early 2023, WZ Clan houses members skilled in Call of Duty - Warzone.',
    active: true,
    image: teamWarzie,
  },
  {
    id: 'highrise',
    name: 'LG Highrise',
    tag: 'Open World',
    game: 'Open World Gameplay',
    desc: 'Explorers and strategists. Pushing the boundaries of what open-world competition looks like.',
    about:
      'With 50 newly registered members, HighRise will house members interested in playing open world PC games such as GTA V Roleplays and BF Siege. HighRise is the sister-clan of WarZie, where members can explore and become creative - in a place with limitless possibilities.',
    active: true,
    image: null,
  },
  {
    id: 'aether',
    name: 'LG Aether',
    tag: 'Mobile MOBA',
    game: 'Mobile Legends',
    desc: 'Mobile excellence. Aether competes at the highest tier of Mobile Legends Bang Bang.',
    about:
      "Started in mid-2026, Aether Clan will house members specialized in Mobile Legends Bang Bang. Aether is the product of Last Game's plan to expand its territories in other gaming domains.",
    active: true,
    image: teamAether,
  },
  {
    id: 'roblox',
    name: 'LG Roblox',
    tag: 'Roblox Division',
    game: 'Roblox',
    desc: 'A new frontier. LG is expanding into Roblox — more details coming soon.',
    about:
      'Soon to open, LG RIOT will house members interested in playing open world NON-PC games, such as Roblox and Minecraft.',
    active: false,
    image: null,
  },
]

const milestones = [
  { year: '2019', month: 'Oct', title: 'Call of Duty Mobile Is Ready to Download in App Store', desc: '' },
  { year: '2019', month: 'Dec', title: 'First & Original Squad', desc: 'Kambajon, Shiro, Lyric, Alesthesia' },

  { year: '2020', month: 'Mar', title: 'Global Pandemic Announced', desc: '' },
  { year: '2020', month: 'Jun 16', title: 'Last Game Is Born — OG Squad Assembled', desc: 'Kambajon, Rency, Shidorima, Montach, Draken, Patatas, Cheas, etc.', featured: true },
  { year: '2020', month: 'Dec', title: 'LG Celebrates 1st Christmas Party', desc: '' },

  { year: '2021', month: 'Jan', title: 'Last Game Joins Scrims & Tournaments', desc: '', featured: true },
  { year: '2021', month: 'Jun', title: 'LG Celebrates 1st Clan Anniversary', desc: '', featured: true },
  { year: '2021', month: 'Jul', title: '1st Clan Event — The Floor Is Lava', desc: '', featured: true },
  { year: '2021', month: 'Dec', title: '2nd Christmas Party', desc: '' },

  { year: '2022', month: 'Jan', title: 'LG Minecraft & Last Island Adventures', desc: '', featured: true },
  { year: '2022', month: 'Mar', title: 'LG Creates "Clan Dares"', desc: '', featured: true },

  { year: '2023', month: 'Feb', title: 'LG WarZie Is Born — LG Reaches 80 Members', desc: 'Kambajon, Kate, Whiskey, PapaV, PapaDoe, PapaKit, XaioLie, Neil, Mavy, etc.', featured: true },
  { year: '2023', month: 'Mar', title: 'First WZ Clan War', desc: 'LG WarZie Clan', featured: true },
  { year: '2023', month: 'Mar', title: 'LG Creates "Mega Dares" — Kill a Live Streamer', desc: '', featured: true },
  { year: '2023', month: 'Apr', title: 'LG vs. Sister-Clans — A Major Clan Issue', desc: '"The scar of the issue has taught Last Game the importance of keeping a low profile, which we still practice up to date."' },
  { year: '2023', month: 'Dec', title: 'Last Game — Original Squad First Meet Up', desc: 'Kambajon, Draken, Trixia' },

  { year: '2024', month: 'Jan', title: 'LG Support Group Is Born', desc: 'Kambajon, Neil', featured: true },
  { year: '2024', month: 'Feb', title: 'LG Reborn Is Born — Room for MP Players', desc: 'Bels, Quinn, Luna, Kioshi, Leslie, Kier, August, Ickin, Jaypol, Larry, Unemployed Group, etc.', featured: true },
  { year: '2024', month: 'Jun', title: 'LG Celebrates 4th Clan Anniversary', desc: '' },
  { year: '2024', month: 'Jul', title: 'First Mass Recruitment — LG Reaches 100+ Members', desc: 'Sey, Oro, Peanut, Weecha, Bia, Coffee, Echo, Amir, Shobe, Toji, PopDio, Notorious, etc.', featured: true },
  { year: '2024', month: 'Dec', title: '3rd Christmas Party — LG Celebrates Its Expansion & Welcomes New Members', desc: '', featured: true },

  { year: '2025', month: 'Jun', title: 'LG Celebrates 5th Clan Anniversary', desc: '' },
  { year: '2025', month: 'Jul', title: 'Second Mass Recruitment — LG Reaches 300+ Members', desc: 'Elyzza, Freyaa, Novaasin, Josh, Rai, Yuri, Inzhagi, Renko, Ryu, Chang, Obito, etc.', featured: true },
  { year: '2025', month: 'Jul', title: 'LG Admin Is Established', desc: 'Formed to accommodate the rising population — Clan Masters, Vice Clan Masters, Clan Managers & Clan Treasurer.', featured: true },
  { year: '2025', month: 'Aug', title: 'LG Creates "Scrim Dares"', desc: '', featured: true },
  { year: '2025', month: 'Sep', title: 'First MP Scrimmage', desc: 'LG Reborn Clan', featured: true },
  { year: '2025', month: 'Nov', title: 'First BR Scrimmage', desc: 'LG Original Clan', featured: true },
  { year: '2025', month: 'Dec', title: '4th Christmas Party — New Admins, New Members & New Opportunities', desc: '', featured: true },

  { year: '2026', month: 'Jun', title: 'LG Celebrates 6th Clan Anniversary — LG Reaches 600+ Members', desc: '', featured: true },
  { year: '2026', month: 'Jun', title: 'LG Support Group Officially Withdraws From Last Game', desc: '', featured: true },
  { year: '2026', month: 'Jul', title: 'LG Aether & LG Highrise Are Born', desc: '-members to follow-', featured: true },
]

const events = [
  {
    id: 1,
    name: 'LG Original — CODM BR Tryouts',
    division: 'LG Original',
    date: 'Aug 10, 2025',
    status: 'upcoming',
    location: 'Online — Open Recruitment',
  },
  {
    id: 2,
    name: 'LG Aether — Mobile Legends Tryouts',
    division: 'LG Aether',
    date: 'Aug 18, 2025',
    status: 'upcoming',
    location: 'Online — Open Recruitment',
  },
  {
    id: 3,
    name: 'LG Warzie — Warzone Tryouts',
    division: 'LG Warzie',
    date: 'Aug 4, 2025',
    status: 'upcoming',
    location: 'Online — Open Recruitment',
  },
  {
    id: 4,
    name: 'CODM MP Summer Championship',
    division: 'LG Reborn',
    date: 'Jul 20, 2025',
    status: 'past',
    location: 'Online — Regional',
  },
  {
    id: 5,
    name: 'Open World Showcase — Season 1',
    division: 'LG Highrise',
    date: 'Jun 28, 2025',
    status: 'past',
    location: 'Online — Invitational',
  },
]

const staff = [
  {
    name: 'Kambajon',
    role: 'Founder',
    division: 'Organization',
    photo: adminKambajon,
  },
  {
    name: 'Papa V',
    role: 'LG Original Clan Master',
    division: 'LG Original',
    photo: adminPapaV,
  },
  {
    name: 'Kenichi',
    role: 'LG Reborn Clan Master',
    division: 'LG Reborn',
    photo: adminKenichi,
  },
  {
    name: 'Kate',
    role: 'LG Warzie Clan Master',
    division: 'LG Warzie',
    photo: adminKate,
  },
  {
    name: 'Broker',
    role: 'LG Aether Clan Master',
    division: 'LG Aether',
    photo: adminBroker,
  },
  {
    name: 'Whiskey',
    role: 'LG Highrise Clan Master',
    division: 'LG Highrise',
    photo: adminWhiskey,
  },
]

const news = [
  {
    id: 5,
    headline: 'Green Notice — LG Community Resumes Normal Operations',
    excerpt: 'Nothing to see here — Last Game Community has resumed normal operations.',
    body: [
      'Last Game is issuing a Green Notice: nothing to see here — Last Game Community has resumed normal operations.',
      'All scrims, events, and clan activities are proceeding as scheduled across every division.',
    ],
    date: 'Aug 1, 2026',
    tag: 'Organization',
    thumb: newsGreenNotice,
    containThumb: true,
  },
  {
    id: 1,
    headline: 'LG Aether Qualifies for SEA Regional Championship',
    excerpt:
      'After a dominant performance in the open bracket, LG Aether has secured their slot at the upcoming Southeast Asia Regional Championship for Mobile Legends.',
    body: [
      "After a dominant run through the open bracket, LG Aether has officially secured their slot at the upcoming Southeast Asia Regional Championship for Mobile Legends: Bang Bang.",
      'The roster dropped only one game across the entire qualifier stage, closing out the final series with a commanding 3-0 sweep. Draft discipline and rotations around the jungle were the deciding factor across every series.',
      'LG Aether now shifts focus to scrim blocks ahead of the regional stage, with the full bracket announcement expected in the coming weeks.',
    ],
    date: 'Jul 18, 2025',
    tag: 'LG Aether',
    thumb:
      'https://images.unsplash.com/photo-1759692788195-b95da1f4a04c?w=600&h=340&fit=crop&auto=format',
  },
  {
    id: 2,
    headline: 'LG Announces Roblox Division Coming This Fall',
    excerpt:
      'Last Game is expanding into Roblox competitive play. The new division is set to recruit in Q4 2025, with roster announcements to follow.',
    body: [
      "Last Game is officially expanding into Roblox competitive play, marking the organization's sixth division.",
      'The new division is set to begin recruitment in Q4 2025, with tryouts open to players across popular competitive Roblox titles. Roster announcements and division branding will follow once the recruitment window closes.',
      "This expansion continues LG's approach of building dedicated, independently-run divisions for each title rather than spreading a single roster across multiple games.",
    ],
    date: 'Jul 5, 2025',
    tag: 'Organization',
    thumb:
      'https://images.unsplash.com/photo-1782177526317-df5cfc6bf88d?w=600&h=340&fit=crop&auto=format',
  },
  {
    id: 3,
    headline: 'Warzone Sunday Series — Week 11 Recap',
    excerpt:
      'LG Warzie finished top 5 in last weekend\'s Sunday Series. A breakdown of the squad\'s rotations, kills, and strategy in the closing circles.',
    body: [
      'LG Warzie closed out Week 11 of the Sunday Series with a top-5 finish, their best placement of the split so far.',
      'The squad leaned on aggressive early-game rotations, converting two early-circle fights into stack advantages that carried through to the closing circles. A disciplined final-circle read sealed the placement points needed to climb the standings.',
      'Week 12 kicks off this Sunday, with LG Warzie sitting just outside the top 3 in the overall series standings.',
    ],
    date: 'Jun 30, 2025',
    tag: 'LG Warzie',
    thumb:
      'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=600&h=340&fit=crop&auto=format',
  },
  {
    id: 4,
    headline: 'LG Original Roster Update for Season 2',
    excerpt:
      'The Battle Royale division has made two roster adjustments heading into Season 2. New additions bring IGL experience from competing orgs.',
    body: [
      'The Battle Royale division has made two roster adjustments heading into Season 2 of CODM competitive play.',
      'Both incoming players bring IGL experience from competing organizations, adding shot-calling depth to a roster that already ranked among the most disciplined rotations in regional opens.',
      'LG Original begins scrim blocks next week ahead of the Season 2 qualifier window.',
    ],
    date: 'Jun 15, 2025',
    tag: 'LG Original',
    thumb:
      'https://images.unsplash.com/photo-1604171256342-9945bfa74c4e?w=600&h=340&fit=crop&auto=format',
  },
]

const rules = [
  {
    title: 'Respect Everyone',
    desc: 'No toxicity, harassment, or discrimination. Treat every member with respect, win or lose.',
  },
  {
    title: 'Keep It Fun',
    desc: "We compete hard, but we never forget why we're here — to enjoy the game together.",
  },
  {
    title: 'Stay Active',
    desc: "Show up for scrims, events, and clan activities. Give a heads-up if you can't make it.",
  },
  {
    title: 'No Drama',
    desc: 'Settle disagreements privately and respectfully. The clan comes before ego.',
  },
  {
    title: 'Represent LG Well',
    desc: 'Whatever you do under the LG name reflects on all of us — in-game and out.',
  },
  {
    title: 'Help Each Other Grow',
    desc: 'New members, veterans, casuals, competitors — we all lift each other up.',
  },
]

/* ─── helpers ───────────────────────────────────────────────── */

function GoldBar() {
  return <div className="w-10 h-px bg-[#C9A227] mb-6" />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs tracking-[0.25em] uppercase text-[#C9A227] mb-3"
      style={{ fontFamily: 'DM Mono, monospace' }}
    >
      {children}
    </p>
  )
}

/* ─── scroll reveal ─────────────────────────────────────────── */

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/** Fades/slides in on mount rather than on scroll — for above-the-fold content like the hero. */
function Entrance({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down'
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const base = direction === 'down' ? 'reveal-down' : 'reveal'
  return <div className={`${base} ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>
}

/* ─── nav ───────────────────────────────────────────────────── */

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const navItems = ['Teams', 'Milestones', 'Events', 'News', 'Rules', 'Admin']

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-[#0B0B0D]/95 backdrop-blur-sm border-b border-[#1A1A1E]' : 'bg-transparent'
      }`}
    >
      <Entrance
        direction="down"
        className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between"
      >
        <a
          href="#hero"
          className="flex items-center gap-2 group"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Last Game"
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          />
          <span className="text-sm font-medium text-[#555] tracking-widest uppercase group-hover:text-[#888] transition-colors">
            Last Game
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative py-2 text-xs tracking-widest uppercase text-[#555] hover:text-[#E8E8E6] transition-colors duration-200 group/navlink"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {item}
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#C9A227] transition-all duration-300 group-hover/navlink:w-full" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setAdminOpen(true)}
            onMouseLeave={() => setAdminOpen(false)}
          >
            <button
              type="button"
              className="inline-flex text-xs tracking-widest uppercase px-5 py-2.5 border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B0B0D] transition-all duration-200 font-semibold"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Admin Log In
            </button>
            <AdminPopover open={adminOpen} />
          </div>

          {/* burger toggle — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden relative z-50 w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={`block h-px w-6 bg-[#E8E8E6] transition-all duration-300 ${
                open ? 'rotate-45 translate-y-[3px]' : ''
              }`}
            />
            <span
              className={`block h-px w-6 bg-[#E8E8E6] transition-all duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-px w-6 bg-[#E8E8E6] transition-all duration-300 ${
                open ? '-rotate-45 -translate-y-[3px]' : ''
              }`}
            />
          </button>
        </div>
      </Entrance>

      {/* mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out bg-[#0B0B0D]/98 backdrop-blur-sm border-b border-[#1A1A1E] ${
          open ? (adminOpen ? 'max-h-[700px]' : 'max-h-[420px]') : 'max-h-0 border-b-0'
        }`}
      >
        <div className="flex flex-col px-6 py-4">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-sm tracking-widest uppercase text-[#888] hover:text-[#E8E8E6] py-4 border-b border-[#1A1A1E] transition-colors duration-200"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {item}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setAdminOpen((v) => !v)}
            className="w-full mt-5 mb-2 text-center text-xs tracking-widest uppercase px-5 py-3 border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B0B0D] transition-all duration-200 font-semibold"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Admin Log In
          </button>
          <AdminPopoverContent
            className={`overflow-hidden transition-all duration-300 ${adminOpen ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
          />
        </div>
      </div>
    </nav>
  )
}

function AdminPopover({ open }: { open: boolean }) {
  return (
    <AdminPopoverContent
      className={`absolute right-0 top-full mt-3 w-80 max-w-[90vw] shadow-2xl origin-top-right transition-all duration-200 z-50 ${
        open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    />
  )
}

function AdminPopoverContent({ className }: { className: string }) {
  return (
    <div className={className}>
      <div className="bg-[#0D0D10] border border-[#1E1E23] p-6">
        <div
          className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#C9A227] border border-[#C9A22730] bg-[#C9A22715] px-2.5 py-1 mb-4"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          Coming Soon
        </div>

        <h3
          className="text-lg font-bold leading-none text-[#E8E8E6] mb-2"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          Admin Dashboard
        </h3>

        <p className="text-xs text-[#666] leading-relaxed">
          This is currently being enhanced. Soon, LG Admins will be able to manage divisions, post
          news, and add or remove categories directly from here.
        </p>
      </div>
    </div>
  )
}

/* ─── hero ──────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-16"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#C9A227 1px, transparent 1px), linear-gradient(90deg, #C9A227 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <Entrance className="mb-8">
          <img
            src={logo}
            alt="Last Game"
            className="mx-auto w-[clamp(140px,20vw,220px)] h-auto object-contain mb-2"
          />
          <div
            className="text-[clamp(14px,2vw,18px)] tracking-[0.5em] uppercase text-[#444]"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Last Game
          </div>
        </Entrance>

        <Entrance delay={150} className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-px bg-[#232328]" />
          <div className="w-1.5 h-1.5 bg-[#C9A227] rotate-45" />
          <div className="w-16 h-px bg-[#232328]" />
        </Entrance>

        <Entrance delay={280}>
          <p
            className="text-[clamp(20px,3.5vw,32px)] font-light text-[#E8E8E6] leading-snug mb-4 tracking-wide"
            style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 300 }}
          >
            Six divisions. One family.
            <br />
            <span className="text-[#666]">Play together. Grow together.</span>
          </p>
        </Entrance>

        <Entrance delay={400}>
          <p className="text-sm text-[#555] mb-12 max-w-md mx-auto leading-relaxed">
            A friendly multi-game community for players who want to compete, laugh, and grow
            together — across every platform, every title.
          </p>
        </Entrance>

        <Entrance delay={520} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#tryouts"
            className="px-8 py-3.5 bg-[#C9A227] text-[#0B0B0D] text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#dbb82f] transition-colors duration-200"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Join Tryouts
          </a>
          <a
            href="#teams"
            className="px-8 py-3.5 border border-[#232328] text-[#666] text-sm tracking-[0.2em] uppercase hover:border-[#C9A227] hover:text-[#C9A227] transition-all duration-200"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            View Teams
          </a>
        </Entrance>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div
          className="text-[10px] tracking-[0.3em] uppercase text-[#888]"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          Scroll
        </div>
        <div className="w-px h-10 bg-gradient-to-b from-[#888] to-transparent" />
      </div>
    </section>
  )
}

/* ─── about ─────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <Reveal>
            <SectionLabel>About the Clan</SectionLabel>
            <GoldBar />
            <h2
              className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6] mb-8"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Built on friendship,
              <br />
              <span className="text-[#C9A227]">not just frags.</span>
            </h2>
            <div className="space-y-5 text-[#666] text-[15px] leading-relaxed max-w-lg">
              <p>
                Last Game started back in 2019 as a small group of friends grinding CODM together.
                What began as one squad grew into a full clan — built less around trophies and more
                around showing up for each other, game after game.
              </p>
              <p>
                Today, LG spans six divisions across mobile and PC titles. Every division competes
                seriously, but the foundation has never changed: respect, good humor, and a clan that
                feels more like family than a roster.
              </p>
              <p>
                We've had our quiet seasons and our comeback seasons. Through all of it, LG has stayed
                exactly what it always was — a fun, welcoming place to play.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative aspect-square overflow-hidden border border-[#1A1A1E]">
              <img
                src={heroBg}
                alt="Last Game divisions"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#1A1A1E] mt-20">
          {[
            { value: '6', label: 'Active Divisions' },
            { value: '500+', label: 'Members' },
            { value: '2019', label: 'Est. Year' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="bg-[#0B0B0D] p-8 lg:p-10 h-full group hover:bg-[#111115] transition-colors">
                <div
                  className="text-[clamp(32px,4vw,52px)] font-bold text-[#E8E8E6] mb-2 group-hover:text-[#C9A227] transition-colors duration-300"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] tracking-[0.25em] uppercase text-[#444]"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── teams ─────────────────────────────────────────────────── */

function Teams() {
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null)
  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? null

  return (
    <section id="teams" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-16">
          <SectionLabel>Divisions</SectionLabel>
          <GoldBar />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6]"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Six Teams.
              <br />
              <span className="text-[#C9A227]">One Family.</span>
            </h2>
            <p className="text-sm text-[#444] max-w-xs leading-relaxed">
              Each division competes independently under its own identity — united by one big
              LG family.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1E]">
          {teams.map((team, i) => (
            <Reveal key={team.id} delay={(i % 3) * 80} className="h-full">
              <TeamCard team={team} onOpen={() => setActiveTeamId(team.id)} />
            </Reveal>
          ))}
        </div>
      </div>

      {activeTeam && <TeamModal team={activeTeam} onClose={() => setActiveTeamId(null)} />}
    </section>
  )
}

function TeamCard({ team, onOpen }: { team: (typeof teams)[0]; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      className={`relative bg-[#0B0B0D] h-full flex flex-col min-h-[240px] transition-colors duration-300 cursor-pointer text-left ${
        team.active ? 'hover:bg-[#111115]' : 'opacity-40'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative p-8 lg:p-10 flex flex-col flex-1">
        {!team.active && (
          <div
            className="absolute top-5 right-5 text-[9px] tracking-[0.25em] uppercase text-[#555] border border-[#232328] px-2 py-1"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Coming Soon
          </div>
        )}

        <div
          className="text-[10px] tracking-[0.25em] uppercase text-[#C9A227] mb-4"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          {team.game}
        </div>

        <h3
          className={`text-[28px] font-bold leading-none mb-1 transition-colors duration-300 ${
            hovered && team.active ? 'text-[#C9A227]' : 'text-[#E8E8E6]'
          }`}
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          {team.name}
        </h3>

        <div
          className="text-xs text-[#444] tracking-widest uppercase mb-5"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          {team.tag}
        </div>

        <p className="text-sm text-[#555] leading-relaxed flex-1">{team.desc}</p>

        <div
          className="text-[10px] tracking-[0.2em] uppercase text-[#C9A227] mt-5 flex items-center gap-2 group/link"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          View Division
          <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
        </div>

        {team.active && (
          <div
            className={`absolute bottom-0 left-0 h-px bg-[#C9A227] transition-all duration-500 ${
              hovered ? 'w-full' : 'w-0'
            }`}
          />
        )}
      </div>
    </div>
  )
}

function TeamModal({ team, onClose }: { team: (typeof teams)[0]; onClose: () => void }) {
  const admins = staff.filter((s) => s.division === team.name)
  const relatedEvents = events.filter((e) => e.division === team.name)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-[#0D0D10] border border-[#1E1E23]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close division"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-[#0B0B0D]/80 border border-[#232328] text-[#888] hover:text-[#C9A227] hover:border-[#C9A227] transition-colors duration-200"
        >
          <span className="text-lg leading-none">×</span>
        </button>

        {team.image && (
          <div className="relative h-56 md:h-64 overflow-hidden bg-[#111115]">
            <img
              src={team.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
            />
            <img
              src={team.image}
              alt={team.name}
              className="relative w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D10] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-8 md:p-10">
          <div
            className="text-[10px] tracking-[0.25em] uppercase text-[#C9A227] mb-4"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {team.game}
          </div>

          <h2
            className="text-[clamp(28px,4vw,40px)] font-bold leading-none text-[#E8E8E6] mb-1"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {team.name}
          </h2>
          <div
            className="text-xs text-[#444] tracking-widest uppercase mb-6"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {team.tag}
          </div>

          {!team.active && (
            <div
              className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#555] border border-[#232328] px-2 py-1 mb-6"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Coming Soon
            </div>
          )}

          <p className="text-sm text-[#666] leading-relaxed mb-8">{team.about ?? team.desc}</p>

          {admins.length > 0 && (
            <div className="mb-8">
              <div
                className="text-[10px] tracking-[0.25em] uppercase text-[#444] mb-3"
                style={{ fontFamily: 'DM Mono, monospace' }}
              >
                Division Admins
              </div>
              <div className="space-y-2">
                {admins.map((person) => (
                  <div key={person.name} className="flex items-baseline gap-3">
                    <span
                      className="text-sm font-semibold text-[#E8E8E6]"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      {person.name}
                    </span>
                    <span className="text-xs text-[#555]">{person.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedEvents.length > 0 && (
            <div>
              <div
                className="text-[10px] tracking-[0.25em] uppercase text-[#444] mb-3"
                style={{ fontFamily: 'DM Mono, monospace' }}
              >
                Events
              </div>
              <div className="space-y-3">
                {relatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-4 border-b border-[#1A1A1E] pb-3"
                  >
                    <div>
                      <div
                        className="text-sm font-semibold text-[#E8E8E6]"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        {event.name}
                      </div>
                      <div className="text-xs text-[#555]" style={{ fontFamily: 'DM Mono, monospace' }}>
                        {event.date}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 shrink-0 ${
                        event.status === 'upcoming'
                          ? 'bg-[#C9A22715] text-[#C9A227] border border-[#C9A22730]'
                          : 'bg-[#ffffff06] text-[#444] border border-[#1a1a1e]'
                      }`}
                      style={{ fontFamily: 'DM Mono, monospace' }}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── milestones — collapsible year timeline ─────────────────── */

function Milestones() {
  const years = Array.from(new Set(milestones.map((m) => m.year)))
  const [openYears, setOpenYears] = useState<Set<string>>(
    () => new Set([years[years.length - 1]]),
  )

  const toggleYear = (year: string) => {
    setOpenYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  return (
    <section id="milestones" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>Timeline</SectionLabel>
          <GoldBar />
          <h2
            className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6] mb-4"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Milestones
          </h2>
          <p className="text-sm text-[#444]">
            {milestones.length} events across {years.length} years — click a year to expand.
          </p>
        </Reveal>

        <div className="border border-[#1A1A1E] divide-y divide-[#1A1A1E]">
          {years.map((year, yi) => {
            const items = milestones.filter((m) => m.year === year)
            const isOpen = openYears.has(year)
            return (
              <Reveal key={year} delay={yi * 50}>
                <div>
                  <button
                    type="button"
                    onClick={() => toggleYear(year)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-6 py-6 text-left hover:bg-[#111115] transition-colors duration-200"
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className="text-2xl md:text-3xl font-bold text-[#E8E8E6]"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        {year}
                      </span>
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase text-[#444]"
                        style={{ fontFamily: 'DM Mono, monospace' }}
                      >
                        {items.length} {items.length === 1 ? 'event' : 'events'}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 text-[#C9A227] text-xl leading-none transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-8 space-y-6">
                        {items.map((m, i) => (
                          <div
                            key={i}
                            className={`flex gap-4 pl-4 border-l ${
                              m.featured ? 'border-[#C9A227]' : 'border-[#1E1E23]'
                            }`}
                          >
                            <div
                              className="w-16 shrink-0 text-[10px] tracking-[0.15em] uppercase text-[#C9A227] pt-0.5"
                              style={{ fontFamily: 'DM Mono, monospace' }}
                            >
                              {m.month}
                            </div>
                            <div>
                              <div
                                className={`text-sm font-semibold leading-snug ${
                                  m.featured ? 'text-[#C9A227]' : 'text-[#E8E8E6]'
                                }`}
                                style={{ fontFamily: 'Rajdhani, sans-serif' }}
                              >
                                {m.title}
                              </div>
                              {m.desc && (
                                <p className="text-xs text-[#555] mt-1 leading-relaxed">{m.desc}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── events ─────────────────────────────────────────────────── */

type FilterType = 'all' | 'upcoming' | 'past'

function Events() {
  const [filter, setFilter] = useState<FilterType>('all')
  const filtered = events.filter((e) => filter === 'all' || e.status === filter)

  return (
    <section id="events" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <SectionLabel>Schedule</SectionLabel>
            <GoldBar />
            <h2
              className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6]"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Events
            </h2>
          </div>
          <div className="flex gap-px bg-[#1A1A1E]" style={{ fontFamily: 'DM Mono, monospace' }}>
            {(['all', 'upcoming', 'past'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
                  filter === f
                    ? 'bg-[#C9A227] text-[#0B0B0D] font-semibold'
                    : 'bg-[#0B0B0D] text-[#555] hover:text-[#888]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="space-y-px">
          {filtered.map((event, i) => (
            <Reveal key={event.id} delay={Math.min(i, 6) * 50}>
              <div className="bg-[#0D0D10] hover:bg-[#111115] transition-colors duration-200 group">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_100px] items-center gap-4 px-6 lg:px-8 py-5">
                  <div>
                    <h3
                      className="text-base font-semibold text-[#E8E8E6] mb-1 group-hover:text-[#C9A227] transition-colors duration-300"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      {event.name}
                    </h3>
                    <p className="text-xs text-[#444]">{event.location}</p>
                  </div>
                  <div
                    className="text-[10px] tracking-[0.2em] uppercase text-[#444]"
                    style={{ fontFamily: 'DM Mono, monospace' }}
                  >
                    {event.division}
                  </div>
                  <div className="text-[11px] text-[#555]" style={{ fontFamily: 'DM Mono, monospace' }}>
                    {event.date}
                  </div>
                  <div className="flex justify-start md:justify-end">
                    <span
                      className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 ${
                        event.status === 'upcoming'
                          ? 'bg-[#C9A22715] text-[#C9A227] border border-[#C9A22730]'
                          : 'bg-[#ffffff06] text-[#444] border border-[#1a1a1e]'
                      }`}
                      style={{ fontFamily: 'DM Mono, monospace' }}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── staff ──────────────────────────────────────────────────── */

const STAFF_PREVIEW_COUNT = 3

function Staff() {
  const [showAll, setShowAll] = useState(false)
  const visibleStaff = showAll ? staff : staff.slice(0, STAFF_PREVIEW_COUNT)
  const hasMore = staff.length > STAFF_PREVIEW_COUNT

  return (
    <section id="admin" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-16">
          <SectionLabel>Leadership</SectionLabel>
          <GoldBar />
          <h2
            className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6]"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Admin Team
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1E]">
          {visibleStaff.map((person, i) => (
            <Reveal key={person.name} delay={(i % 3) * 80} className="h-full">
              <StaffCard person={person} />
            </Reveal>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="px-8 py-3.5 border border-[#232328] text-[#666] text-sm tracking-[0.2em] uppercase hover:border-[#C9A227] hover:text-[#C9A227] transition-all duration-200"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {showAll ? 'See Less' : 'See More'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function StaffCard({ person }: { person: (typeof staff)[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="bg-[#0B0B0D] hover:bg-[#111115] transition-colors duration-300 p-8 lg:p-10 h-full flex flex-col items-center text-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* circular photo with gold ring on hover */}
      <div
        className={`relative w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
          hovered ? 'ring-2 ring-[#C9A227] ring-offset-2 ring-offset-[#0B0B0D]' : 'ring-1 ring-[#232328] ring-offset-2 ring-offset-[#0B0B0D]'
        }`}
      >
        <img
          src={person.photo}
          alt={person.name}
          className="w-full h-full rounded-full object-cover bg-[#1A1A1E]"
        />
        {/* gold overlay tint on hover */}
        <div
          className={`absolute inset-0 rounded-full bg-[#C9A227] transition-opacity duration-300 ${
            hovered ? 'opacity-10' : 'opacity-0'
          }`}
        />
      </div>

      <h3
        className="text-xl font-bold text-[#E8E8E6] mb-1"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {person.name}
      </h3>
      <p className="text-sm text-[#C9A227] mb-1 font-medium">{person.role}</p>
      <p
        className="text-[10px] tracking-[0.2em] uppercase text-[#444]"
        style={{ fontFamily: 'DM Mono, monospace' }}
      >
        {person.division}
      </p>
    </div>
  )
}

/* ─── news ───────────────────────────────────────────────────── */

function News() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const activeArticle = news.find((a) => a.id === activeId) ?? null

  return (
    <section id="news" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <SectionLabel>Latest Updates</SectionLabel>
            <GoldBar />
            <h2
              className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6]"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              News
            </h2>
          </div>
          <a
            href="#"
            className="text-[10px] tracking-[0.25em] uppercase text-[#555] hover:text-[#C9A227] transition-colors duration-200 self-start lg:self-auto"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            All Articles →
          </a>
        </Reveal>

        {/* featured top row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#1A1A1E] mb-px">
          {news.slice(0, 2).map((article, i) => (
            <Reveal key={article.id} delay={i * 80} className="h-full">
              <NewsCard article={article} featured onRead={() => setActiveId(article.id)} />
            </Reveal>
          ))}
        </div>

        {/* smaller bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1A1A1E]">
          {news.slice(2).map((article, i) => (
            <Reveal key={article.id} delay={i * 80} className="h-full">
              <NewsCard article={article} featured={false} onRead={() => setActiveId(article.id)} />
            </Reveal>
          ))}
        </div>
      </div>

      {activeArticle && <NewsModal article={activeArticle} onClose={() => setActiveId(null)} />}
    </section>
  )
}

function NewsCard({
  article,
  featured,
  onRead,
}: {
  article: (typeof news)[0]
  featured: boolean
  onRead: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onRead}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onRead()
        }
      }}
      className="bg-[#0B0B0D] hover:bg-[#0F0F12] transition-colors duration-300 group cursor-pointer flex flex-col overflow-hidden h-full text-left"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* thumbnail */}
      <div className={`relative overflow-hidden bg-[#111115] ${featured ? 'h-52' : 'h-36'}`}>
        {article.containThumb ? (
          <>
            <img
              src={article.thumb}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
            />
            <img
              src={article.thumb}
              alt={article.headline}
              className={`relative w-full h-full object-contain transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
            />
          </>
        ) : (
          <img
            src={article.thumb}
            alt={article.headline}
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <span
            className="text-[9px] tracking-[0.2em] uppercase text-[#C9A227] bg-[#0B0B0D]/80 px-2.5 py-1 border border-[#C9A22730]"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {article.tag}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="p-6 flex flex-col flex-1">
        <div
          className="text-[10px] tracking-[0.2em] uppercase text-[#444] mb-3"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          {article.date}
        </div>
        <h3
          className={`font-bold leading-snug mb-3 transition-colors duration-300 ${
            hovered ? 'text-[#C9A227]' : 'text-[#E8E8E6]'
          } ${featured ? 'text-xl' : 'text-base'}`}
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          {article.headline}
        </h3>
        <p className="text-sm text-[#555] leading-relaxed flex-1 mb-4">{article.excerpt}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRead()
          }}
          className="text-[10px] tracking-[0.2em] uppercase text-[#C9A227] hover:text-[#dbb82f] transition-colors duration-200 flex items-center gap-2 group/link self-start"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          Read More
          <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
        </button>
      </div>
    </div>
  )
}

function NewsModal({ article, onClose }: { article: (typeof news)[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0D0D10] border border-[#1E1E23]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-[#0B0B0D]/80 border border-[#232328] text-[#888] hover:text-[#C9A227] hover:border-[#C9A227] transition-colors duration-200"
        >
          <span className="text-lg leading-none">×</span>
        </button>

        <div className="relative h-56 md:h-72 overflow-hidden bg-[#111115]">
          {article.containThumb ? (
            <>
              <img
                src={article.thumb}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
              />
              <img
                src={article.thumb}
                alt={article.headline}
                className="relative w-full h-full object-contain"
              />
            </>
          ) : (
            <img src={article.thumb} alt={article.headline} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D10] via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span
              className="text-[9px] tracking-[0.2em] uppercase text-[#C9A227] bg-[#0B0B0D]/80 px-2.5 py-1 border border-[#C9A22730]"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {article.tag}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div
            className="text-[10px] tracking-[0.2em] uppercase text-[#444] mb-3"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {article.date}
          </div>
          <h2
            className="text-[clamp(24px,4vw,34px)] font-bold leading-tight text-[#E8E8E6] mb-6"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {article.headline}
          </h2>
          <div className="space-y-4">
            {article.body.map((para, i) => (
              <p key={i} className="text-sm text-[#666] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── rules ──────────────────────────────────────────────────── */

function Rules() {
  return (
    <section id="rules" className="py-32 px-6 border-t border-[#1A1A1E]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>Community Guidelines</SectionLabel>
          <GoldBar />
          <h2
            className="text-[clamp(36px,5vw,60px)] font-bold leading-none text-[#E8E8E6] mb-4"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            House Rules
          </h2>
          <p className="text-sm text-[#444] max-w-md mx-auto leading-relaxed">
            A few simple rules keep LG a friendly, happy place to play — for every division, every
            member.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1E]">
          {rules.map((rule, i) => (
            <Reveal key={rule.title} delay={(i % 3) * 80} className="h-full">
              <div className="bg-[#0B0B0D] p-8 lg:p-10 h-full group hover:bg-[#111115] transition-colors">
                <div
                  className="text-[10px] tracking-[0.25em] uppercase text-[#C9A227] mb-4"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  className="text-lg font-semibold text-[#E8E8E6] mb-2 group-hover:text-[#C9A227] transition-colors duration-300"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {rule.title}
                </h3>
                <p className="text-sm text-[#555] leading-relaxed">{rule.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── tryouts CTA ────────────────────────────────────────────── */

function TryoutsCTA() {
  return (
    <section id="tryouts" className="py-32 px-6 border-t border-[#1A1A1E]">
      <Reveal className="max-w-7xl mx-auto text-center">
        <SectionLabel>Open Recruitment</SectionLabel>
        <GoldBar />
        <h2
          className="text-[clamp(36px,6vw,72px)] font-bold leading-none text-[#E8E8E6] mb-6"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          Come play with us.
        </h2>
        <p className="text-sm text-[#555] mb-12 max-w-md mx-auto leading-relaxed">
          We recruit across all six divisions. Whether you're competitive or just here to have fun,
          fill out the form and our admins will follow up.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#"
            className="px-10 py-4 bg-[#C9A227] text-[#0B0B0D] text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#dbb82f] transition-colors duration-200"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Apply for Tryouts
          </a>
          <span
            className="text-[10px] tracking-[0.2em] uppercase text-[#2a2a30]"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            All Divisions Open
          </span>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── footer ─────────────────────────────────────────────────── */

function Footer() {
  const socials = [
    { label: 'Discord', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Twitter / X', href: '#' },
  ]

  return (
    <footer className="border-t border-[#1A1A1E] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <img src={logo} alt="Last Game" className="w-12 h-12 object-contain mb-3" />
            <p className="text-xs text-[#444] leading-relaxed max-w-xs">
              Last Game. A friendly multi-game community playing across mobile and PC
              titles.
            </p>
          </div>
          <div>
            <div
              className="text-[10px] tracking-[0.25em] uppercase text-[#333] mb-5"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Follow
            </div>
            <div className="space-y-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex items-center gap-3 text-sm text-[#444] hover:text-[#C9A227] transition-colors duration-200 group"
                >
                  <div className="w-4 h-px bg-[#232328] group-hover:bg-[#C9A227] transition-colors duration-200" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div
              className="text-[10px] tracking-[0.25em] uppercase text-[#333] mb-5"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Quick Links
            </div>
            <div className="space-y-3">
              {[
                { label: 'Tryout Form', href: '#tryouts' },
                { label: 'View Teams', href: '#teams' },
                { label: 'Events', href: '#events' },
                { label: 'News', href: '#news' },
                { label: 'Rules', href: '#rules' },
                { label: 'Admin', href: '#admin' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 text-sm text-[#444] hover:text-[#C9A227] transition-colors duration-200 group"
                >
                  <div className="w-4 h-px bg-[#232328] group-hover:bg-[#C9A227] transition-colors duration-200" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1A1E] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-[10px] tracking-[0.2em] text-[#2a2a30]"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            © 2025 Last Game. All rights reserved.
          </p>
          <a
            href="#tryouts"
            className="text-[10px] tracking-[0.2em] uppercase text-[#444] hover:text-[#C9A227] transition-colors duration-200"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Join LG — Apply Now →
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ─── root ───────────────────────────────────────────────────── */

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-[#0B0B0D] min-h-screen">
      <Nav scrolled={scrolled} />
      <Hero />
      <About />
      <Teams />
      <Milestones />
      <Events />
      <News />
      <Staff />
      <Rules />
      <TryoutsCTA />
      <Footer />
    </div>
  )
}
