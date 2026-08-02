import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { db, auth } from './firebase'
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

/* ─── types ─────────────────────────────────────────────────── */

export interface Division {
  id: string
  name: string
  tag: string
  game: string
  desc: string
  about: string
  active: boolean
  image: string | null
}

export interface Milestone {
  id: string
  year: string
  month: string
  title: string
  desc: string
  featured?: boolean
}

export interface EventItem {
  id: string
  name: string
  division: string
  date: string
  status: 'upcoming' | 'past'
  location: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
  division: string
  photo: string
}

export interface NewsArticle {
  id: string
  headline: string
  excerpt: string
  body: string[]
  date: string
  tag: string
  thumb: string
  containThumb?: boolean
}

export interface RuleItem {
  id: string
  title: string
  desc: string
}

export interface SiteSettings {
  activeDivisionsStat: string
  membersStat: string
  estYearStat: string
  heroTagline: string
  heroSubtext: string
  discordUrl: string
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  tryoutFormUrl: string
}

/* ─── id helper ─────────────────────────────────────────────── */

let idCounter = 0
export function genId(): string {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`
}

/* ─── default / seed data (mirrors the original hardcoded site) ─ */

const DEFAULT_DIVISIONS: Division[] = [
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

const DEFAULT_MILESTONES: Milestone[] = [
  { id: genId(), year: '2019', month: 'Oct', title: 'Call of Duty Mobile Is Ready to Download in App Store', desc: '' },
  { id: genId(), year: '2019', month: 'Dec', title: 'First & Original Squad', desc: 'Kambajon, Shiro, Lyric, Alesthesia' },
  { id: genId(), year: '2020', month: 'Mar', title: 'Global Pandemic Announced', desc: '' },
  { id: genId(), year: '2020', month: 'Jun 16', title: 'Last Game Is Born — OG Squad Assembled', desc: 'Kambajon, Rency, Shidorima, Montach, Draken, Patatas, Cheas, etc.', featured: true },
  { id: genId(), year: '2020', month: 'Dec', title: 'LG Celebrates 1st Christmas Party', desc: '' },
  { id: genId(), year: '2021', month: 'Jan', title: 'Last Game Joins Scrims & Tournaments', desc: '', featured: true },
  { id: genId(), year: '2021', month: 'Jun', title: 'LG Celebrates 1st Clan Anniversary', desc: '', featured: true },
  { id: genId(), year: '2021', month: 'Jul', title: '1st Clan Event — The Floor Is Lava', desc: '', featured: true },
  { id: genId(), year: '2021', month: 'Dec', title: '2nd Christmas Party', desc: '' },
  { id: genId(), year: '2022', month: 'Jan', title: 'LG Minecraft & Last Island Adventures', desc: '', featured: true },
  { id: genId(), year: '2022', month: 'Mar', title: 'LG Creates "Clan Dares"', desc: '', featured: true },
  { id: genId(), year: '2023', month: 'Feb', title: 'LG WarZie Is Born — LG Reaches 80 Members', desc: 'Kambajon, Kate, Whiskey, PapaV, PapaDoe, PapaKit, XaioLie, Neil, Mavy, etc.', featured: true },
  { id: genId(), year: '2023', month: 'Mar', title: 'First WZ Clan War', desc: 'LG WarZie Clan', featured: true },
  { id: genId(), year: '2023', month: 'Mar', title: 'LG Creates "Mega Dares" — Kill a Live Streamer', desc: '', featured: true },
  { id: genId(), year: '2023', month: 'Apr', title: 'LG vs. Sister-Clans — A Major Clan Issue', desc: '"The scar of the issue has taught Last Game the importance of keeping a low profile, which we still practice up to date."' },
  { id: genId(), year: '2023', month: 'Dec', title: 'Last Game — Original Squad First Meet Up', desc: 'Kambajon, Draken, Trixia' },
  { id: genId(), year: '2024', month: 'Jan', title: 'LG Support Group Is Born', desc: 'Kambajon, Neil', featured: true },
  { id: genId(), year: '2024', month: 'Feb', title: 'LG Reborn Is Born — Room for MP Players', desc: 'Bels, Quinn, Luna, Kioshi, Leslie, Kier, August, Ickin, Jaypol, Larry, Unemployed Group, etc.', featured: true },
  { id: genId(), year: '2024', month: 'Jun', title: 'LG Celebrates 4th Clan Anniversary', desc: '' },
  { id: genId(), year: '2024', month: 'Jul', title: 'First Mass Recruitment — LG Reaches 100+ Members', desc: 'Sey, Oro, Peanut, Weecha, Bia, Coffee, Echo, Amir, Shobe, Toji, PopDio, Notorious, etc.', featured: true },
  { id: genId(), year: '2024', month: 'Dec', title: '3rd Christmas Party — LG Celebrates Its Expansion & Welcomes New Members', desc: '', featured: true },
  { id: genId(), year: '2025', month: 'Jun', title: 'LG Celebrates 5th Clan Anniversary', desc: '' },
  { id: genId(), year: '2025', month: 'Jul', title: 'Second Mass Recruitment — LG Reaches 300+ Members', desc: 'L, Freyaa, Novaasin, Josh, Rai, Yuri, Inzhagi, Renko, Ryu, Chang, Obito, etc.', featured: true },
  { id: genId(), year: '2025', month: 'Jul', title: 'LG Admin Is Established', desc: 'Formed to accommodate the rising population — Clan Masters, Vice Clan Masters, Clan Managers & Clan Treasurer.', featured: true },
  { id: genId(), year: '2025', month: 'Aug', title: 'LG Creates "Scrim Dares"', desc: '', featured: true },
  { id: genId(), year: '2025', month: 'Sep', title: 'First MP Scrimmage', desc: 'LG Reborn Clan', featured: true },
  { id: genId(), year: '2025', month: 'Nov', title: 'First BR Scrimmage', desc: 'LG Original Clan', featured: true },
  { id: genId(), year: '2025', month: 'Dec', title: '4th Christmas Party — New Admins, New Members & New Opportunities', desc: '', featured: true },
  { id: genId(), year: '2026', month: 'Jun', title: 'LG Celebrates 6th Clan Anniversary — LG Reaches 600+ Members', desc: '', featured: true },
  { id: genId(), year: '2026', month: 'Jun', title: 'LG Support Group Officially Withdraws From Last Game', desc: '', featured: true },
  { id: genId(), year: '2026', month: 'Jul', title: 'LG Aether & LG Highrise Are Born', desc: '-members to follow-', featured: true },
]

const DEFAULT_EVENTS: EventItem[] = [
  { id: genId(), name: 'LG Original — CODM BR Tryouts', division: 'LG Original', date: 'Aug 10, 2025', status: 'upcoming', location: 'Online — Open Recruitment' },
  { id: genId(), name: 'LG Aether — Mobile Legends Tryouts', division: 'LG Aether', date: 'Aug 18, 2025', status: 'upcoming', location: 'Online — Open Recruitment' },
  { id: genId(), name: 'LG Warzie — Warzone Tryouts', division: 'LG Warzie', date: 'Aug 4, 2025', status: 'upcoming', location: 'Online — Open Recruitment' },
  { id: genId(), name: 'CODM MP Summer Championship', division: 'LG Reborn', date: 'Jul 20, 2025', status: 'past', location: 'Online — Regional' },
  { id: genId(), name: 'Open World Showcase — Season 1', division: 'LG Highrise', date: 'Jun 28, 2025', status: 'past', location: 'Online — Invitational' },
]

const DEFAULT_STAFF: StaffMember[] = [
  { id: genId(), name: 'Kambajon', role: 'Founder', division: 'Organization', photo: adminKambajon },
  { id: genId(), name: 'Papa V', role: 'LG Original Clan Master', division: 'LG Original', photo: adminPapaV },
  { id: genId(), name: 'Kenichi', role: 'LG Reborn Clan Master', division: 'LG Reborn', photo: adminKenichi },
  { id: genId(), name: 'Kate', role: 'LG Warzie Clan Master', division: 'LG Warzie', photo: adminKate },
  { id: genId(), name: 'Broker', role: 'LG Aether Clan Master', division: 'LG Aether', photo: adminBroker },
  { id: genId(), name: 'Whiskey', role: 'LG Highrise Clan Master', division: 'LG Highrise', photo: adminWhiskey },
]

const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: genId(),
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
    id: genId(),
    headline: 'LG Aether Qualifies for SEA Regional Championship',
    excerpt:
      'After a dominant performance in the open bracket, LG Aether has secured their slot at the upcoming Southeast Asia Regional Championship for Mobile Legends.',
    body: [
      'After a dominant run through the open bracket, LG Aether has officially secured their slot at the upcoming Southeast Asia Regional Championship for Mobile Legends: Bang Bang.',
      'The roster dropped only one game across the entire qualifier stage, closing out the final series with a commanding 3-0 sweep. Draft discipline and rotations around the jungle were the deciding factor across every series.',
      'LG Aether now shifts focus to scrim blocks ahead of the regional stage, with the full bracket announcement expected in the coming weeks.',
    ],
    date: 'Jul 18, 2025',
    tag: 'LG Aether',
    thumb: 'https://images.unsplash.com/photo-1759692788195-b95da1f4a04c?w=600&h=340&fit=crop&auto=format',
  },
  {
    id: genId(),
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
    thumb: 'https://images.unsplash.com/photo-1782177526317-df5cfc6bf88d?w=600&h=340&fit=crop&auto=format',
  },
  {
    id: genId(),
    headline: 'Warzone Sunday Series — Week 11 Recap',
    excerpt:
      "LG Warzie finished top 5 in last weekend's Sunday Series. A breakdown of the squad's rotations, kills, and strategy in the closing circles.",
    body: [
      'LG Warzie closed out Week 11 of the Sunday Series with a top-5 finish, their best placement of the split so far.',
      'The squad leaned on aggressive early-game rotations, converting two early-circle fights into stack advantages that carried through to the closing circles. A disciplined final-circle read sealed the placement points needed to climb the standings.',
      'Week 12 kicks off this Sunday, with LG Warzie sitting just outside the top 3 in the overall series standings.',
    ],
    date: 'Jun 30, 2025',
    tag: 'LG Warzie',
    thumb: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=600&h=340&fit=crop&auto=format',
  },
  {
    id: genId(),
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
    thumb: 'https://images.unsplash.com/photo-1604171256342-9945bfa74c4e?w=600&h=340&fit=crop&auto=format',
  },
]

const DEFAULT_RULES: RuleItem[] = [
  { id: genId(), title: 'Respect Everyone', desc: 'No toxicity, harassment, or discrimination. Treat every member with respect, win or lose.' },
  { id: genId(), title: 'Keep It Fun', desc: "We compete hard, but we never forget why we're here — to enjoy the game together." },
  { id: genId(), title: 'Stay Active', desc: "Show up for scrims, events, and clan activities. Give a heads-up if you can't make it." },
  { id: genId(), title: 'No Drama', desc: 'Settle disagreements privately and respectfully. The clan comes before ego.' },
  { id: genId(), title: 'Represent LG Well', desc: 'Whatever you do under the LG name reflects on all of us — in-game and out.' },
  { id: genId(), title: 'Help Each Other Grow', desc: 'New members, veterans, casuals, competitors — we all lift each other up.' },
]

const DEFAULT_SETTINGS: SiteSettings = {
  activeDivisionsStat: '6',
  membersStat: '500+',
  estYearStat: '2019',
  heroTagline: 'Six divisions. One family.',
  heroSubtext:
    'A friendly multi-game community for players who want to compete, laugh, and grow together — across every platform, every title.',
  discordUrl: '#',
  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#',
  tryoutFormUrl: '#',
}

/* ─── legacy localStorage reader (one-time import into Firestore only) ─ */

const STORAGE_PREFIX = 'lg_admin_'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/* ─── firestore sync helpers ─────────────────────────────────── */

function subscribeCollection<T>(name: string, cb: (items: T[]) => void, onError: (err: Error) => void) {
  return onSnapshot(
    collection(db, name),
    (snap) => cb(snap.docs.map((d) => d.data() as T)),
    (err) => onError(err),
  )
}

async function syncCollection<T extends { id: string }>(name: string, prev: T[], next: T[]) {
  const prevMap = new Map(prev.map((i) => [i.id, i]))
  const nextIds = new Set(next.map((i) => i.id))

  const ops: Promise<void>[] = []
  for (const item of next) {
    const old = prevMap.get(item.id)
    if (!old || JSON.stringify(old) !== JSON.stringify(item)) {
      ops.push(setDoc(doc(db, name, item.id), item))
    }
  }
  for (const item of prev) {
    if (!nextIds.has(item.id)) ops.push(deleteDoc(doc(db, name, item.id)))
  }
  await Promise.all(ops)
}

function batchSetCollection<T extends { id: string }>(batch: ReturnType<typeof writeBatch>, name: string, items: T[]) {
  for (const item of items) batch.set(doc(db, name, item.id), item)
}

/* ─── context ───────────────────────────────────────────────── */

interface StoreValue {
  divisions: Division[]
  setDivisions: (v: Division[]) => void
  milestones: Milestone[]
  setMilestones: (v: Milestone[]) => void
  events: EventItem[]
  setEvents: (v: EventItem[]) => void
  staff: StaffMember[]
  setStaff: (v: StaffMember[]) => void
  news: NewsArticle[]
  setNews: (v: NewsArticle[]) => void
  rules: RuleItem[]
  setRules: (v: RuleItem[]) => void
  settings: SiteSettings
  setSettings: (v: SiteSettings) => void
  loading: boolean
  error: string | null
  hasAnyData: boolean
  importLocalDataToFirestore: () => Promise<void>
  seedDefaultsToFirestore: () => Promise<void>
}

const StoreContext = createContext<StoreValue | null>(null)

type LoadedFlags = {
  divisions: boolean
  milestones: boolean
  events: boolean
  staff: boolean
  news: boolean
  rules: boolean
  settings: boolean
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [divisions, setDivisionsState] = useState<Division[]>([])
  const [milestones, setMilestonesState] = useState<Milestone[]>([])
  const [events, setEventsState] = useState<EventItem[]>([])
  const [staff, setStaffState] = useState<StaffMember[]>([])
  const [news, setNewsState] = useState<NewsArticle[]>([])
  const [rules, setRulesState] = useState<RuleItem[]>([])
  const [settings, setSettingsState] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState<LoadedFlags>({
    divisions: false,
    milestones: false,
    events: false,
    staff: false,
    news: false,
    rules: false,
    settings: false,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onError(context: string) {
      return (err: Error) => {
        console.error(`[firestore:${context}]`, err)
        setError(
          `Couldn't load "${context}" from Firestore (${err.message}). Check that Firestore is enabled and the security rules are published.`,
        )
      }
    }

    const unsubs = [
      subscribeCollection<Division>(
        'divisions',
        (v) => {
          setDivisionsState(v)
          setLoaded((l) => ({ ...l, divisions: true }))
        },
        onError('divisions'),
      ),
      subscribeCollection<Milestone>(
        'milestones',
        (v) => {
          setMilestonesState(v)
          setLoaded((l) => ({ ...l, milestones: true }))
        },
        onError('milestones'),
      ),
      subscribeCollection<EventItem>(
        'events',
        (v) => {
          setEventsState(v)
          setLoaded((l) => ({ ...l, events: true }))
        },
        onError('events'),
      ),
      subscribeCollection<StaffMember>(
        'staff',
        (v) => {
          setStaffState(v)
          setLoaded((l) => ({ ...l, staff: true }))
        },
        onError('staff'),
      ),
      subscribeCollection<NewsArticle>(
        'news',
        (v) => {
          setNewsState(v)
          setLoaded((l) => ({ ...l, news: true }))
        },
        onError('news'),
      ),
      subscribeCollection<RuleItem>(
        'rules',
        (v) => {
          setRulesState(v)
          setLoaded((l) => ({ ...l, rules: true }))
        },
        onError('rules'),
      ),
      onSnapshot(
        doc(db, 'settings', 'site'),
        (snap) => {
          if (snap.exists()) setSettingsState(snap.data() as SiteSettings)
          setLoaded((l) => ({ ...l, settings: true }))
        },
        onError('settings'),
      ),
    ]
    return () => unsubs.forEach((u) => u())
  }, [])

  const loading = !Object.values(loaded).every(Boolean)
  const hasAnyData = loading
    ? true
    : divisions.length > 0 ||
      milestones.length > 0 ||
      events.length > 0 ||
      staff.length > 0 ||
      news.length > 0 ||
      rules.length > 0

  function setDivisions(next: Division[]) {
    syncCollection('divisions', divisions, next).catch(console.error)
  }
  function setMilestones(next: Milestone[]) {
    syncCollection('milestones', milestones, next).catch(console.error)
  }
  function setEvents(next: EventItem[]) {
    syncCollection('events', events, next).catch(console.error)
  }
  function setStaff(next: StaffMember[]) {
    syncCollection('staff', staff, next).catch(console.error)
  }
  function setNews(next: NewsArticle[]) {
    syncCollection('news', news, next).catch(console.error)
  }
  function setRules(next: RuleItem[]) {
    syncCollection('rules', rules, next).catch(console.error)
  }
  function setSettings(next: SiteSettings) {
    setDoc(doc(db, 'settings', 'site'), next).catch(console.error)
  }

  async function importLocalDataToFirestore() {
    const batch = writeBatch(db)
    batchSetCollection(batch, 'divisions', loadFromStorage('divisions', DEFAULT_DIVISIONS))
    batchSetCollection(batch, 'milestones', loadFromStorage('milestones', DEFAULT_MILESTONES))
    batchSetCollection(batch, 'events', loadFromStorage('events', DEFAULT_EVENTS))
    batchSetCollection(batch, 'staff', loadFromStorage('staff', DEFAULT_STAFF))
    batchSetCollection(batch, 'news', loadFromStorage('news', DEFAULT_NEWS))
    batchSetCollection(batch, 'rules', loadFromStorage('rules', DEFAULT_RULES))
    batch.set(doc(db, 'settings', 'site'), loadFromStorage('settings', DEFAULT_SETTINGS))
    await batch.commit()
  }

  async function seedDefaultsToFirestore() {
    const batch = writeBatch(db)
    batchSetCollection(batch, 'divisions', DEFAULT_DIVISIONS)
    batchSetCollection(batch, 'milestones', DEFAULT_MILESTONES)
    batchSetCollection(batch, 'events', DEFAULT_EVENTS)
    batchSetCollection(batch, 'staff', DEFAULT_STAFF)
    batchSetCollection(batch, 'news', DEFAULT_NEWS)
    batchSetCollection(batch, 'rules', DEFAULT_RULES)
    batch.set(doc(db, 'settings', 'site'), DEFAULT_SETTINGS)
    await batch.commit()
  }

  return (
    <StoreContext.Provider
      value={{
        divisions,
        setDivisions,
        milestones,
        setMilestones,
        events,
        setEvents,
        staff,
        setStaff,
        news,
        setNews,
        rules,
        setRules,
        settings,
        setSettings,
        loading,
        error,
        hasAnyData,
        importLocalDataToFirestore,
        seedDefaultsToFirestore,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}

export function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-2 h-2 bg-[#C9A227] rotate-45 animate-pulse" />
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-[#444]"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          Loading
        </span>
      </div>
    </div>
  )
}

/* ─── admin auth (real Firebase Auth — email/password) ───────── */

export function subscribeAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb)
}

export async function adminLogin(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export function adminLogout(): Promise<void> {
  return signOut(auth)
}
