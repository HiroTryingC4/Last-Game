import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore'
import { db, auth } from './firebase'
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
import {
  useStore,
  genId,
  subscribeAuth,
  adminLogin,
  adminLogout,
  createAdminAccount,
  changeMyPassword,
  getAdminAccess,
  type AdminRole,
  FullScreenLoader,
  type Division,
  type Milestone,
  type EventItem,
  type StaffMember,
  type NewsArticle,
  type RuleItem,
} from './store'

/* ─── one-time repair: local dev-only image paths that leaked into Firestore ─ */

const LOCAL_IMAGE_MAP: Record<string, string> = {
  'ORIGINAL.jpg': teamOriginal,
  '749981256_1582934506531124_7454687730703426001_n.jpg': teamReborn,
  'WARZIE.jpg': teamWarzie,
  'MOBILE-LEGENDS.jpg': teamAether,
  'admin-kambajon.jpeg': adminKambajon,
  'admin-papav.jpeg': adminPapaV,
  'admin-kenichi.jpeg': adminKenichi,
  'admin-kate.jpeg': adminKate,
  'admin-broker.jpeg': adminBroker,
  'admin-whiskey.jpeg': adminWhiskey,
  'green-notice.jpg': newsGreenNotice,
}

async function uploadLocalAssetToCloudinary(assetUrl: string): Promise<string> {
  const res = await fetch(assetUrl)
  const blob = await res.blob()
  const file = new File([blob], assetUrl.split('/').pop() ?? 'image.jpg', { type: blob.type })
  return uploadToCloudinary(file)
}

/* ─── cloudinary (unsigned upload — no secret needed client-side) ─ */

const CLOUDINARY_CLOUD_NAME = 'qmblivaq'
const CLOUDINARY_UPLOAD_PRESET = 'lastgame_admin'

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Cloudinary upload failed (${res.status}): ${body}`)
  }
  const data = await res.json()
  return data.secure_url as string
}

/* ─── shared styles ─────────────────────────────────────────── */

const inputCls =
  'w-full bg-[#0B0B0D] border border-[#232328] px-3 py-2.5 text-sm text-[#E8E8E6] focus:outline-none focus:border-[#C9A227] transition-colors'
const labelCls = 'block text-[10px] tracking-[0.18em] uppercase text-[#666] mb-2'
const btnGold =
  'px-5 py-2.5 bg-[#C9A227] text-[#0B0B0D] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#dbb82f] transition-colors duration-200'
const btnGhost =
  'px-5 py-2.5 border border-[#232328] text-[#888] text-xs tracking-[0.15em] uppercase hover:border-[#C9A227] hover:text-[#C9A227] transition-colors duration-200'
const btnDanger =
  'border border-[#3a1a1a] text-[#c25c5c] text-[10px] tracking-[0.1em] uppercase hover:bg-[#c25c5c] hover:text-[#0B0B0D] transition-colors duration-200'

function mono(children: React.ReactNode) {
  return <span style={{ fontFamily: 'DM Mono, monospace' }}>{children}</span>
}

/* ─── login gate ────────────────────────────────────────────── */

function firebaseAuthErrorMessage(err: unknown): string {
  const code = err instanceof Error && 'code' in err ? String((err as { code: string }).code) : ''
  if (code === 'auth/invalid-email') return 'Enter a valid email address.'
  if (code === 'auth/too-many-requests') return 'Too many attempts. Wait a bit and try again.'
  if (code === 'auth/network-request-failed') return 'Network error — check your connection.'
  return 'Incorrect email or password.'
}

function AdminLogin({ rejectedMessage }: { rejectedMessage?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(rejectedMessage ?? null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await adminLogin(email, password)
      // onAuthStateChanged in AdminApp picks up the signed-in user automatically
    } catch (err) {
      setError(firebaseAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Last Game" className="w-16 h-16 object-contain mb-4" />
          <div
            className="text-[10px] tracking-[0.4em] uppercase text-[#444] mb-1"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Last Game
          </div>
          <h1
            className="text-2xl font-bold text-[#E8E8E6]"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Admin Log In
          </h1>
        </div>

        <form onSubmit={submit} className="border border-[#1E1E23] bg-[#0D0D10] p-8 space-y-5">
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              autoFocus
              className={inputCls}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              placeholder="you@lastgame.gg"
            />
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <input
              type="password"
              className={inputCls}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              placeholder="••••••••••"
            />
            {error && <p className="text-xs text-[#c25c5c] mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={submitting} className={`${btnGold} w-full disabled:opacity-60`}>
            {submitting ? 'Logging In…' : 'Log In'}
          </button>
          <a
            href="#/"
            className="block text-center text-[10px] tracking-[0.15em] uppercase text-[#444] hover:text-[#C9A227] transition-colors"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            ← Back to Site
          </a>
        </form>

        <p className="text-[11px] text-[#3a3a40] text-center mt-6 leading-relaxed">
          Accounts are managed in the Firebase console (Authentication → Users) — add or remove
          admins there.
        </p>
      </div>
    </div>
  )
}

/* ─── field primitives ──────────────────────────────────────── */

type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'image' | 'paragraphs'

interface FieldDef {
  key: string
  label: string
  type: FieldType
  options?: string[]
  help?: string
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 shrink-0 bg-[#111115] border border-[#232328] overflow-hidden flex items-center justify-center">
        {uploading ? (
          <span className="text-[9px] text-[#C9A227]" style={{ fontFamily: 'DM Mono, monospace' }}>
            …
          </span>
        ) : value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[9px] text-[#3a3a40]" style={{ fontFamily: 'DM Mono, monospace' }}>
            None
          </span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input
          type="text"
          className={inputCls}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL…"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="block w-full text-[11px] text-[#666] file:mr-3 file:py-1.5 file:px-3 file:border file:border-[#232328] file:bg-transparent file:text-[#888] file:text-[10px] file:uppercase file:tracking-wider hover:file:border-[#C9A227] hover:file:text-[#C9A227] disabled:opacity-50"
        />
        {uploading && (
          <p className="text-[11px] text-[#C9A227]">Uploading to Cloudinary…</p>
        )}
        {error && <p className="text-[11px] text-[#c25c5c]">{error}</p>}
      </div>
    </div>
  )
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: any
  onChange: (v: any) => void
}) {
  return (
    <div>
      <label className={labelCls}>{field.label}</label>

      {field.type === 'text' && (
        <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}

      {field.type === 'textarea' && (
        <textarea
          className={`${inputCls} min-h-[90px] resize-y`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'paragraphs' && (
        <textarea
          className={`${inputCls} min-h-[140px] resize-y`}
          value={Array.isArray(value) ? value.join('\n') : ''}
          onChange={(e) => onChange(e.target.value.split('\n'))}
          placeholder="One paragraph per line…"
        />
      )}

      {field.type === 'select' && (
        <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <label className="inline-flex items-center gap-2.5 text-sm text-[#E8E8E6] cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-[#C9A227]"
          />
          {field.help}
        </label>
      )}

      {field.type === 'image' && <ImageField value={value} onChange={onChange} />}

      {field.help && field.type !== 'checkbox' && (
        <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed">{field.help}</p>
      )}
    </div>
  )
}

function sanitizeDraft(fields: FieldDef[], draft: Record<string, any>) {
  const out = { ...draft }
  for (const f of fields) {
    if (f.type === 'paragraphs' && Array.isArray(out[f.key])) {
      out[f.key] = out[f.key].map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    }
    if (f.type === 'text' && typeof out[f.key] === 'string') {
      out[f.key] = out[f.key].trim()
    }
  }
  return out
}

/* ─── generic CRUD manager ──────────────────────────────────── */

interface ColumnDef {
  key: string
  label: string
  render?: (item: Record<string, any>) => React.ReactNode
}

function CrudManager<T extends { id: string }>({
  title,
  description,
  items,
  setItems,
  fields,
  columns,
  makeEmpty,
  recordLabel,
}: {
  title: string
  description: string
  items: T[]
  setItems: (v: T[]) => void
  fields: FieldDef[]
  columns: ColumnDef[]
  makeEmpty: () => Omit<T, 'id'>
  recordLabel: (item: T) => string
}) {
  const [draft, setDraft] = useState<Record<string, any> | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setDraft({ ...makeEmpty(), id: genId() })
    setIsNew(true)
  }

  function openEdit(item: T) {
    setDraft({ ...item })
    setIsNew(false)
  }

  function save() {
    if (!draft) return
    const clean = sanitizeDraft(fields, draft) as unknown as T
    if (isNew) setItems([clean, ...items])
    else setItems(items.map((i) => (i.id === clean.id ? clean : i)))
    setDraft(null)
  }

  function remove(item: T) {
    if (window.confirm(`Delete "${recordLabel(item)}"? This can't be undone.`)) {
      setItems(items.filter((i) => i.id !== item.id))
    }
  }

  return (
    <div>
      <ModuleHeader title={title} description={description}>
        <button type="button" onClick={openNew} className={btnGold}>
          + Add New
        </button>
      </ModuleHeader>

      <div className="border border-[#1A1A1E]">
        <div className="hidden md:grid gap-3 px-5 py-3 border-b border-[#1A1A1E] bg-[#0D0D10]">
          <div
            className="grid text-[10px] tracking-[0.15em] uppercase text-[#555]"
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 110px` }}
          >
            {columns.map((c) => (
              <div key={c.key}>{c.label}</div>
            ))}
            <div>Actions</div>
          </div>
        </div>

        {items.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[#444]">
            Nothing here yet — click "Add New" to create the first one.
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-[#1A1A1E] last:border-b-0 hover:bg-[#0D0D10] transition-colors"
          >
            {/* desktop: compact row */}
            <div
              className="hidden md:grid gap-3 px-5 py-4 items-center"
              style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 110px` }}
            >
              {columns.map((c) => (
                <div key={c.key} className="text-sm text-[#ccc] truncate">
                  {c.render ? c.render(item as Record<string, any>) : String((item as any)[c.key] ?? '—')}
                </div>
              ))}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 border border-[#232328] text-[#888] text-[10px] tracking-[0.1em] uppercase hover:border-[#C9A227] hover:text-[#C9A227] transition-colors duration-200"
                >
                  Edit
                </button>
                <button type="button" onClick={() => remove(item)} className={`px-3 py-1.5 ${btnDanger}`}>
                  Delete
                </button>
              </div>
            </div>

            {/* mobile: stacked card */}
            <div className="md:hidden px-4 py-4 space-y-2.5">
              {columns.map((c) => (
                <div key={c.key} className="flex items-start justify-between gap-3">
                  <span
                    className="text-[9px] tracking-[0.15em] uppercase text-[#555] pt-0.5 shrink-0"
                    style={{ fontFamily: 'DM Mono, monospace' }}
                  >
                    {c.label}
                  </span>
                  <span className="text-sm text-[#ccc] text-right break-words min-w-0">
                    {c.render ? c.render(item as Record<string, any>) : String((item as any)[c.key] ?? '—')}
                  </span>
                </div>
              ))}
              <div className="flex gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="flex-1 py-2 border border-[#232328] text-[#888] text-[10px] tracking-[0.1em] uppercase hover:border-[#C9A227] hover:text-[#C9A227] transition-colors duration-200"
                >
                  Edit
                </button>
                <button type="button" onClick={() => remove(item)} className={`flex-1 py-2 ${btnDanger}`}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <FormModal title={isNew ? `New — ${title}` : `Edit — ${title}`} onClose={() => setDraft(null)}>
          <div className="space-y-5">
            {fields.map((f) => (
              <FieldInput
                key={f.key}
                field={f}
                value={draft[f.key]}
                onChange={(v) => setDraft({ ...draft, [f.key]: v })}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={save} className={btnGold}>
              Save
            </button>
            <button type="button" onClick={() => setDraft(null)} className={btnGhost}>
              Cancel
            </button>
          </div>
        </FormModal>
      )}
    </div>
  )
}

function ModuleHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h2
          className="text-2xl font-bold text-[#E8E8E6] mb-1.5"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          {title}
        </h2>
        <p className="text-sm text-[#666] max-w-xl leading-relaxed">{description}</p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}

function FormModal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0D0D10] border border-[#1E1E23] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-lg font-bold text-[#E8E8E6]"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center bg-[#0B0B0D] border border-[#232328] text-[#888] hover:text-[#C9A227] hover:border-[#C9A227] transition-colors duration-200"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Badge({ tone, children }: { tone: 'gold' | 'green' | 'muted'; children: React.ReactNode }) {
  const cls =
    tone === 'gold'
      ? 'text-[#C9A227] border-[#C9A22730] bg-[#C9A22715]'
      : tone === 'green'
        ? 'text-[#5FAE81] border-[#5FAE8130] bg-[#5FAE8115]'
        : 'text-[#666] border-[#232328] bg-transparent'
  return (
    <span
      className={`inline-block text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 border ${cls}`}
      style={{ fontFamily: 'DM Mono, monospace' }}
    >
      {children}
    </span>
  )
}

/* ─── dashboard ──────────────────────────────────────────────── */

interface BrokenImage {
  collection: 'divisions' | 'staff' | 'news'
  id: string
  field: 'image' | 'photo' | 'thumb'
  label: string
  url: string
}

function RepairImagesPanel() {
  const { divisions, staff, news } = useStore()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const broken: BrokenImage[] = useMemo(() => {
    const items: BrokenImage[] = []
    for (const d of divisions) {
      if (d.image && !d.image.startsWith('http')) {
        items.push({ collection: 'divisions', id: d.id, field: 'image', label: d.name, url: d.image })
      }
    }
    for (const s of staff) {
      if (s.photo && !s.photo.startsWith('http')) {
        items.push({ collection: 'staff', id: s.id, field: 'photo', label: s.name, url: s.photo })
      }
    }
    for (const n of news) {
      if (n.thumb && !n.thumb.startsWith('http')) {
        items.push({ collection: 'news', id: n.id, field: 'thumb', label: n.headline, url: n.thumb })
      }
    }
    return items
  }, [divisions, staff, news])

  if (broken.length === 0) return null

  async function run() {
    setRunning(true)
    setError(null)
    setProgress(0)
    try {
      for (const item of broken) {
        const filename = item.url.split('/').pop() ?? ''
        const asset = LOCAL_IMAGE_MAP[filename]
        if (asset) {
          const cloudUrl = await uploadLocalAssetToCloudinary(asset)
          await setDoc(doc(db, item.collection, item.id), { [item.field]: cloudUrl }, { merge: true })
        }
        setProgress((p) => p + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Repair failed. Try again.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="border border-[#c25c5c30] bg-[#c25c5c08] p-6 mb-8">
      <div
        className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#c25c5c] border border-[#c25c5c30] bg-[#c25c5c15] px-2.5 py-1 mb-4"
        style={{ fontFamily: 'DM Mono, monospace' }}
      >
        {broken.length} Broken Image{broken.length === 1 ? '' : 's'}
      </div>
      <h3
        className="text-lg font-bold text-[#E8E8E6] mb-2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        Some images point to local dev paths
      </h3>
      <p className="text-sm text-[#888] leading-relaxed mb-5 max-w-2xl">
        These were imported from a browser that had local file paths instead of real image URLs —
        they work on your machine's dev server but break once deployed. This re-uploads the
        original images to Cloudinary and fixes the affected records.
      </p>
      <button type="button" onClick={run} disabled={running} className={`${btnGold} disabled:opacity-60`}>
        {running ? `Fixing… (${progress}/${broken.length})` : `Fix ${broken.length} Image${broken.length === 1 ? '' : 's'}`}
      </button>
      {error && <p className="text-xs text-[#c25c5c] mt-3">{error}</p>}
    </div>
  )
}

function ImportDataBanner() {
  const { importLocalDataToFirestore, seedDefaultsToFirestore } = useStore()
  const [busy, setBusy] = useState<'local' | 'defaults' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(kind: 'local' | 'defaults') {
    setBusy(kind)
    setError(null)
    try {
      if (kind === 'local') await importLocalDataToFirestore()
      else await seedDefaultsToFirestore()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed. Try again.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="border border-[#C9A22730] bg-[#C9A22708] p-6 mb-8">
      <div
        className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#C9A227] border border-[#C9A22730] bg-[#C9A22715] px-2.5 py-1 mb-4"
        style={{ fontFamily: 'DM Mono, monospace' }}
      >
        First-Time Setup
      </div>
      <h3
        className="text-lg font-bold text-[#E8E8E6] mb-2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        This Firestore project is empty
      </h3>
      <p className="text-sm text-[#888] leading-relaxed mb-5 max-w-2xl">
        Bring in content to get started: import whatever you already had in this browser (from
        before Firebase was connected), or start from the site's original starter content.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => run('local')}
          disabled={busy !== null}
          className={`${btnGold} disabled:opacity-60`}
        >
          {busy === 'local' ? 'Importing…' : 'Import This Browser’s Data'}
        </button>
        <button
          type="button"
          onClick={() => run('defaults')}
          disabled={busy !== null}
          className={`${btnGhost} disabled:opacity-60`}
        >
          {busy === 'defaults' ? 'Importing…' : 'Use Starter Content Instead'}
        </button>
      </div>
      {error && <p className="text-xs text-[#c25c5c] mt-3">{error}</p>}
    </div>
  )
}

function Dashboard({ onNavigate }: { onNavigate: (m: ModuleId) => void }) {
  const { divisions, milestones, events, staff, news, rules, hasAnyData } = useStore()
  const upcoming = events.filter((e) => e.status === 'upcoming')

  const cards: { label: string; value: number; module: ModuleId }[] = [
    { label: 'Divisions', value: divisions.length, module: 'divisions' },
    { label: 'Milestones', value: milestones.length, module: 'milestones' },
    { label: 'Upcoming Events', value: upcoming.length, module: 'events' },
    { label: 'News Articles', value: news.length, module: 'news' },
    { label: 'Admin Roster', value: staff.length, module: 'staff' },
    { label: 'Community Rules', value: rules.length, module: 'rules' },
  ]

  return (
    <div>
      <ModuleHeader
        title="Dashboard"
        description="A snapshot of everything on the public site. Click any card to jump to that module."
      />
      {!hasAnyData && <ImportDataBanner />}
      <RepairImagesPanel />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1E]">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => onNavigate(c.module)}
            className="bg-[#0D0D10] hover:bg-[#111115] p-6 text-left transition-colors duration-200 group"
          >
            <div
              className="text-3xl font-bold text-[#E8E8E6] group-hover:text-[#C9A227] transition-colors duration-200 mb-1"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {c.value}
            </div>
            <div
              className="text-[10px] tracking-[0.15em] uppercase text-[#555]"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {c.label}
            </div>
          </button>
        ))}
      </div>

      {upcoming.length > 0 && (
        <div className="mt-10">
          <div className={labelCls}>Next Up</div>
          <div className="border border-[#1A1A1E] divide-y divide-[#1A1A1E]">
            {upcoming.slice(0, 5).map((e) => (
              <div key={e.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-5 py-3.5">
                <div className="min-w-0">
                  <div className="text-sm text-[#E8E8E6] truncate">{e.name}</div>
                  <div className="text-xs text-[#555]">{e.division}</div>
                </div>
                {mono(<span className="text-xs text-[#C9A227] shrink-0">{e.date}</span>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── divisions ──────────────────────────────────────────────── */

function DivisionsManager() {
  const { divisions, setDivisions } = useStore()
  return (
    <CrudManager<Division>
      title="Divisions"
      description="The 6 division cards on the public site — name, tagline, bio, banner image, and active status."
      items={divisions}
      setItems={setDivisions}
      makeEmpty={() => ({
        name: '',
        tag: '',
        game: '',
        desc: '',
        about: '',
        active: true,
        image: null,
      })}
      recordLabel={(d) => d.name}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'game', label: 'Game' },
        {
          key: 'active',
          label: 'Status',
          render: (d) => (d.active ? <Badge tone="green">Active</Badge> : <Badge tone="muted">Coming Soon</Badge>),
        },
      ]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', help: 'e.g. "LG Original"' },
        { key: 'tag', label: 'Tag', type: 'text', help: 'Short label under the name, e.g. "Battle Royale"' },
        { key: 'game', label: 'Game', type: 'text', help: 'Eyebrow above the title, e.g. "CODM BR"' },
        { key: 'desc', label: 'Card Blurb', type: 'textarea', help: 'One line, shown on the division card.' },
        { key: 'about', label: 'Full Bio', type: 'textarea', help: 'Shown in the division modal only.' },
        { key: 'image', label: 'Banner Image', type: 'image' },
        { key: 'active', label: '', type: 'checkbox', help: 'Active (visible, not "Coming Soon")' },
      ]}
    />
  )
}

/* ─── milestones ─────────────────────────────────────────────── */

function MilestonesManager() {
  const { milestones, setMilestones } = useStore()
  const sorted = useMemo(
    () => [...milestones].sort((a, b) => a.year.localeCompare(b.year) || a.month.localeCompare(b.month)),
    [milestones],
  )
  return (
    <CrudManager<Milestone>
      title="Milestones"
      description="The clan's timeline, grouped by year on the public site. Sorted here by year, then month."
      items={sorted}
      setItems={setMilestones}
      makeEmpty={() => ({ year: '', month: '', title: '', desc: '', featured: false })}
      recordLabel={(m) => m.title}
      columns={[
        { key: 'year', label: 'Year' },
        { key: 'month', label: 'Month' },
        { key: 'title', label: 'Title' },
        {
          key: 'featured',
          label: 'Highlight',
          render: (m) => (m.featured ? <Badge tone="gold">Featured</Badge> : <Badge tone="muted">Normal</Badge>),
        },
      ]}
      fields={[
        { key: 'year', label: 'Year', type: 'text', help: 'e.g. "2025"' },
        { key: 'month', label: 'Month', type: 'text', help: 'e.g. "Jul", or "Jun 16" for an exact date' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'desc', label: 'Detail', type: 'textarea', help: 'Optional — member list or a quote.' },
        { key: 'featured', label: '', type: 'checkbox', help: 'Featured (gold highlight on the timeline)' },
      ]}
    />
  )
}

/* ─── events ─────────────────────────────────────────────────── */

function EventsManager() {
  const { events, setEvents, divisions } = useStore()
  const divisionNames = divisions.map((d) => d.name)
  return (
    <CrudManager<EventItem>
      title="Events"
      description="Tryouts and tournaments. Status controls whether it lists under Upcoming or Past."
      items={events}
      setItems={setEvents}
      makeEmpty={() => ({
        name: '',
        division: divisionNames[0] ?? '',
        date: '',
        status: 'upcoming',
        location: '',
      })}
      recordLabel={(e) => e.name}
      columns={[
        { key: 'name', label: 'Event' },
        { key: 'division', label: 'Division' },
        { key: 'date', label: 'Date' },
        {
          key: 'status',
          label: 'Status',
          render: (e) => (e.status === 'upcoming' ? <Badge tone="gold">Upcoming</Badge> : <Badge tone="muted">Past</Badge>),
        },
      ]}
      fields={[
        { key: 'name', label: 'Event Name', type: 'text' },
        { key: 'division', label: 'Division', type: 'select', options: divisionNames },
        { key: 'date', label: 'Date', type: 'text', help: 'e.g. "Aug 10, 2025"' },
        { key: 'status', label: 'Status', type: 'select', options: ['upcoming', 'past'] },
        { key: 'location', label: 'Location', type: 'text', help: 'e.g. "Online — Open Recruitment"' },
      ]}
    />
  )
}

/* ─── admin roster (staff) ───────────────────────────────────── */

function StaffManager() {
  const { staff, setStaff, divisions } = useStore()
  const divisionNames = ['Organization', ...divisions.map((d) => d.name)]
  return (
    <CrudManager<StaffMember>
      title="Admin Roster"
      description="Cards shown in the Admin Team section, and inside each division's modal."
      items={staff}
      setItems={setStaff}
      makeEmpty={() => ({ name: '', role: '', division: divisionNames[0] ?? '', photo: '' })}
      recordLabel={(s) => s.name}
      columns={[
        {
          key: 'photo',
          label: 'Photo',
          render: (s) =>
            s.photo ? (
              <img src={s.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#111115] border border-[#232328]" />
            ),
        },
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'division', label: 'Division' },
      ]}
      fields={[
        { key: 'name', label: 'In-Game Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text', help: 'e.g. "LG Original Clan Master" or "Founder"' },
        { key: 'division', label: 'Division', type: 'select', options: divisionNames },
        { key: 'photo', label: 'Photo', type: 'image' },
      ]}
    />
  )
}

/* ─── news ───────────────────────────────────────────────────── */

function NewsManager() {
  const { news, setNews } = useStore()
  const existingTags = useMemo(() => Array.from(new Set(news.map((n) => n.tag))).sort(), [news])
  return (
    <div>
      <CrudManager<NewsArticle>
        title="News & Announcements"
        description="Articles shown on the public News section. The first 2 (by list order here) render as featured."
        items={news}
        setItems={setNews}
        makeEmpty={() => ({
          headline: '',
          excerpt: '',
          body: [''],
          date: '',
          tag: existingTags[0] ?? 'Organization',
          thumb: '',
          containThumb: false,
        })}
        recordLabel={(n) => n.headline}
        columns={[
          { key: 'headline', label: 'Headline' },
          { key: 'tag', label: 'Category' },
          { key: 'date', label: 'Date' },
        ]}
        fields={[
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea', help: 'One-line teaser on the card.' },
          { key: 'body', label: 'Body', type: 'paragraphs', help: 'One paragraph per line.' },
          { key: 'date', label: 'Date', type: 'text', help: 'e.g. "Aug 2, 2026"' },
          {
            key: 'tag',
            label: 'Category',
            type: 'text',
            help: `Existing: ${existingTags.join(', ') || 'none yet'} — type a new one to create it.`,
          },
          { key: 'thumb', label: 'Thumbnail', type: 'image' },
          {
            key: 'containThumb',
            label: '',
            type: 'checkbox',
            help: 'Poster mode — show the full image (for graphics with text, not photos)',
          },
        ]}
      />
      <div className="mt-14 pt-10 border-t border-[#1A1A1E]">
        <CategoriesManager />
      </div>
    </div>
  )
}

function CategoriesManager() {
  const { news, setNews } = useStore()
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [reassignTo, setReassignTo] = useState('')

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const n of news) counts.set(n.tag, (counts.get(n.tag) ?? 0) + 1)
    return Array.from(counts.entries()).map(([tag, count]) => ({ tag, count }))
  }, [news])

  function startRename(tag: string) {
    setRenaming(tag)
    setRenameValue(tag)
  }

  function commitRename(oldTag: string) {
    const next = renameValue.trim()
    if (!next || next === oldTag) {
      setRenaming(null)
      return
    }
    setNews(news.map((n) => (n.tag === oldTag ? { ...n, tag: next } : n)))
    setRenaming(null)
  }

  function startDelete(tag: string) {
    setDeleting(tag)
    setReassignTo(tags.find((t) => t.tag !== tag)?.tag ?? '')
  }

  function commitDelete(tag: string) {
    if (!reassignTo) return
    setNews(news.map((n) => (n.tag === tag ? { ...n, tag: reassignTo } : n)))
    setDeleting(null)
  }

  return (
    <div>
      <ModuleHeader
        title="Categories"
        description={`Tags used across News articles — rename one and every article updates, or delete one by reassigning its articles elsewhere. ${tags.length} in use.`}
      />
      <div className="border border-[#1A1A1E] divide-y divide-[#1A1A1E]">
        {tags.map(({ tag, count }) => (
          <div key={tag} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5">
            {renaming === tag ? (
              <input
                autoFocus
                className={`${inputCls} sm:max-w-xs`}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitRename(tag)}
              />
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-[#E8E8E6]">{tag}</span>
                {mono(
                  <span className="text-[10px] text-[#555]">
                    {count} article{count === 1 ? '' : 's'}
                  </span>,
                )}
              </div>
            )}

            <div className="flex gap-2 shrink-0">
              {renaming === tag ? (
                <>
                  <button type="button" onClick={() => commitRename(tag)} className={btnGold}>
                    Save
                  </button>
                  <button type="button" onClick={() => setRenaming(null)} className={btnGhost}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => startRename(tag)}
                    className="px-3 py-1.5 border border-[#232328] text-[#888] text-[10px] tracking-[0.1em] uppercase hover:border-[#C9A227] hover:text-[#C9A227] transition-colors duration-200"
                  >
                    Rename
                  </button>
                  <button type="button" onClick={() => startDelete(tag)} className={`px-3 py-1.5 ${btnDanger}`}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {deleting && (
        <FormModal title={`Delete "${deleting}"`} onClose={() => setDeleting(null)}>
          <p className="text-sm text-[#888] leading-relaxed mb-5">
            {tags.find((t) => t.tag === deleting)?.count ?? 0} article(s) use this category. Pick
            another category to move them to before deleting.
          </p>
          <FieldInput
            field={{
              key: 'reassignTo',
              label: 'Move articles to',
              type: 'select',
              options: tags.filter((t) => t.tag !== deleting).map((t) => t.tag),
            }}
            value={reassignTo}
            onChange={setReassignTo}
          />
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => commitDelete(deleting)} className={btnGold} disabled={!reassignTo}>
              Reassign &amp; Delete
            </button>
            <button type="button" onClick={() => setDeleting(null)} className={btnGhost}>
              Cancel
            </button>
          </div>
        </FormModal>
      )}
    </div>
  )
}

/* ─── rules ──────────────────────────────────────────────────── */

function RulesManager() {
  const { rules, setRules } = useStore()
  return (
    <CrudManager<RuleItem>
      title="Community Rules"
      description="The 6-item rules grid on the public site."
      items={rules}
      setItems={setRules}
      makeEmpty={() => ({ title: '', desc: '' })}
      recordLabel={(r) => r.title}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'desc', label: 'Description' },
      ]}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'desc', label: 'Description', type: 'textarea' },
      ]}
    />
  )
}

/* ─── site settings ──────────────────────────────────────────── */

function SiteSettingsForm() {
  const { settings, setSettings } = useStore()
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)

  function save() {
    setSettings(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fields: FieldDef[] = [
    { key: 'activeDivisionsStat', label: 'About Stat — Active Divisions', type: 'text' },
    { key: 'membersStat', label: 'About Stat — Members', type: 'text' },
    { key: 'estYearStat', label: 'About Stat — Est. Year', type: 'text' },
    { key: 'heroTagline', label: 'Hero Tagline', type: 'text' },
    { key: 'heroSubtext', label: 'Hero Supporting Text', type: 'textarea' },
    { key: 'tryoutFormUrl', label: 'Tryout Application Link', type: 'text' },
    { key: 'discordUrl', label: 'Discord Link', type: 'text' },
    { key: 'facebookUrl', label: 'Facebook Link', type: 'text' },
    { key: 'instagramUrl', label: 'Instagram Link', type: 'text' },
    { key: 'twitterUrl', label: 'Twitter / X Link', type: 'text' },
  ]

  return (
    <div>
      <ModuleHeader
        title="Site Settings"
        description="Everything hardcoded on the public site that isn't a list of records."
      />
      <div className="max-w-xl space-y-5">
        {fields.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={(draft as any)[f.key]}
            onChange={(v) => setDraft({ ...draft, [f.key]: v })}
          />
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button type="button" onClick={save} className={btnGold}>
            Save Settings
          </button>
          {saved && <span className="text-xs text-[#5FAE81]">Saved.</span>}
        </div>
      </div>
    </div>
  )
}

/* ─── my account ─────────────────────────────────────────────── */

function CreateAdminForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<AdminRole>('admin')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setBusy(true)
    try {
      await createAdminAccount(email, password, role)
      setSuccess(`${role === 'head' ? 'Head admin' : 'Admin'} account created for ${email}. Share the password with them directly — they can change it once logged in.`)
      setEmail('')
      setPassword('')
      setConfirm('')
      setRole('admin')
    } catch (err) {
      const code = err instanceof Error && 'code' in err ? String((err as { code: string }).code) : ''
      if (code === 'auth/email-already-in-use') setError('That email already has an account.')
      else if (code === 'auth/invalid-email') setError('Enter a valid email address.')
      else if (code === 'auth/weak-password') setError('Password is too weak — use at least 6 characters.')
      else setError(err instanceof Error ? err.message : 'Could not create the account. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5 border border-[#1E1E23] bg-[#0D0D10] p-6">
      <div>
        <label className={labelCls}>New Admin Email</label>
        <input
          type="email"
          className={inputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="clanmaster@lastgame.gg"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Temporary Password</label>
        <input
          type="text"
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
        />
        <p className="text-[11px] text-[#555] mt-1.5">
          Shown in plain text on purpose — you'll need to hand this to them yourself.
        </p>
      </div>
      <div>
        <label className={labelCls}>Confirm Password</label>
        <input
          type="text"
          className={inputCls}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelCls}>Role</label>
        <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
          <option value="admin">Admin — can edit all content</option>
          <option value="head">Head Admin — can also create &amp; revoke admins</option>
        </select>
      </div>
      <button type="submit" disabled={busy} className={`${btnGold} disabled:opacity-60`}>
        {busy ? 'Creating…' : 'Create Admin Account'}
      </button>
      {error && <p className="text-xs text-[#c25c5c]">{error}</p>}
      {success && <p className="text-xs text-[#5FAE81] leading-relaxed">{success}</p>}
    </form>
  )
}

function ChangePasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (next.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (next !== confirm) {
      setError("New passwords don't match.")
      return
    }
    setBusy(true)
    try {
      await changeMyPassword(current, next)
      setSuccess(true)
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      const code = err instanceof Error && 'code' in err ? String((err as { code: string }).code) : ''
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Current password is incorrect.')
      } else {
        setError(err instanceof Error ? err.message : 'Could not update your password. Try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5 border border-[#1E1E23] bg-[#0D0D10] p-6">
      <div>
        <label className={labelCls}>Current Password</label>
        <input
          type="password"
          className={inputCls}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelCls}>New Password</label>
        <input
          type="password"
          className={inputCls}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="At least 6 characters"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Confirm New Password</label>
        <input
          type="password"
          className={inputCls}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={busy} className={`${btnGold} disabled:opacity-60`}>
        {busy ? 'Updating…' : 'Update Password'}
      </button>
      {error && <p className="text-xs text-[#c25c5c]">{error}</p>}
      {success && <p className="text-xs text-[#5FAE81]">Password updated.</p>}
    </form>
  )
}

interface AdminProfile {
  uid: string
  email: string
  role: AdminRole
  addedAt?: string
}

function AdminRoster({ myRole }: { myRole: AdminRole }) {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)
  const currentUid = auth.currentUser?.uid

  useEffect(() => {
    return onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        setAdmins(
          snap.docs.map((d) => {
            const data = d.data() as { email: string; role?: AdminRole; addedAt?: string }
            return { uid: d.id, email: data.email, addedAt: data.addedAt, role: data.role === 'head' ? 'head' : 'admin' }
          }),
        )
        setLoaded(true)
      },
      (err) => {
        setError(err.message)
        setLoaded(true)
      },
    )
  }, [])

  async function revoke(uid: string) {
    if (uid === currentUid) return
    if (!window.confirm("Revoke this admin's access? They will no longer be able to log in.")) return
    setRevoking(uid)
    try {
      await deleteDoc(doc(db, 'admins', uid))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not revoke access. Try again.')
    } finally {
      setRevoking(null)
    }
  }

  if (!loaded) return null

  return (
    <div>
      <h3
        className="text-sm font-bold text-[#E8E8E6] mb-3"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        Current Admins
      </h3>
      <div className="border border-[#1A1A1E] divide-y divide-[#1A1A1E] max-w-xl">
        {admins.map((a) => (
          <div key={a.uid} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <span className="text-sm text-[#E8E8E6] flex items-center gap-2.5">
              {a.email}
              {a.role === 'head' && <Badge tone="gold">Head Admin</Badge>}
              {a.uid === currentUid && <span className="text-[10px] text-[#555]">(you)</span>}
            </span>
            {myRole === 'head' && a.uid !== currentUid && (
              <button
                type="button"
                onClick={() => revoke(a.uid)}
                disabled={revoking === a.uid}
                className={`px-3 py-1.5 disabled:opacity-60 ${btnDanger}`}
              >
                {revoking === a.uid ? 'Revoking…' : 'Revoke'}
              </button>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-[#c25c5c] mt-3">{error}</p>}
    </div>
  )
}

function AccountModule({ myRole }: { myRole: AdminRole }) {
  return (
    <div>
      <ModuleHeader
        title="My Account"
        description={
          myRole === 'head'
            ? 'See who has admin access, add new admins, or change your own password.'
            : 'Change your own password. Adding or removing admins is a Head Admin action.'
        }
      />
      <div className="space-y-10">
        <AdminRoster myRole={myRole} />

        {myRole === 'head' && (
          <div className="border-l-2 border-[#C9A227] pl-5">
            <div
              className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#C9A227] border border-[#C9A22730] bg-[#C9A22715] px-2.5 py-1 mb-3"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Head Admin Action
            </div>
            <h3
              className="text-lg font-bold text-[#E8E8E6] mb-1.5"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Create New Admin
            </h3>
            <p className="text-xs text-[#666] mb-5 max-w-md leading-relaxed">
              Grants full access to edit every division, milestone, event, news post, and setting
              — and, if made a Head Admin, to create and revoke other admins too.
            </p>
            <CreateAdminForm />
            <p className="text-[11px] text-[#555] max-w-xl leading-relaxed mt-4">
              Revoking access from the roster above removes login rights immediately — it doesn't
              delete their Firebase account outright, but they can no longer sign in to this panel.
            </p>
          </div>
        )}

        <div className="border-l-2 border-[#33333a] pl-5">
          <div
            className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#888] border border-[#33333a] bg-white/[0.03] px-2.5 py-1 mb-3"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Personal
          </div>
          <h3
            className="text-lg font-bold text-[#E8E8E6] mb-1.5"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Change My Password
          </h3>
          <p className="text-xs text-[#666] mb-5 max-w-md leading-relaxed">
            Only affects your own login — doesn't touch anyone else's access.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}

/* ─── shell ──────────────────────────────────────────────────── */

const MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'divisions', label: 'Divisions' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'events', label: 'Events' },
  { id: 'news', label: 'News' },
  { id: 'staff', label: 'Admin Roster' },
  { id: 'rules', label: 'Rules' },
  { id: 'settings', label: 'Site Settings' },
  { id: 'account', label: 'My Account' },
] as const
type ModuleId = (typeof MODULES)[number]['id']

function backToSite() {
  window.location.hash = ''
}

type Gate = 'loading' | 'unauthed' | 'rejected' | { user: User; role: AdminRole }

export default function AdminApp() {
  const [gate, setGate] = useState<Gate>('loading')
  const [active, setActive] = useState<ModuleId>('dashboard')

  useEffect(() => {
    return subscribeAuth((u) => {
      if (!u) {
        setGate('unauthed')
        return
      }
      setGate('loading')
      getAdminAccess(u.uid)
        .then((access) => {
          if (access) setGate({ user: u, role: access.role })
          else {
            adminLogout()
            setGate('rejected')
          }
        })
        .catch(() => {
          adminLogout()
          setGate('rejected')
        })
    })
  }, [])

  if (gate === 'loading') return <FullScreenLoader />
  if (gate === 'rejected') {
    return (
      <AdminLogin rejectedMessage="That account isn't an approved admin. Ask a head admin to add you from their My Account tab." />
    )
  }
  if (gate === 'unauthed') return <AdminLogin />
  const { user, role } = gate

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#E8E8E6]">
      <header className="border-b border-[#1A1A1E] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img src={logo} alt="Last Game" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
          <span
            className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            LAST GAME <span className="text-[#C9A227]">/ ADMIN</span>
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:flex items-center gap-2 whitespace-nowrap">
            <span className="text-[10px] text-[#555]" style={{ fontFamily: 'DM Mono, monospace' }}>
              {user.email}
            </span>
            {role === 'head' && <Badge tone="gold">Head Admin</Badge>}
          </span>
          <button
            type="button"
            onClick={backToSite}
            className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#666] hover:text-[#C9A227] transition-colors duration-200 whitespace-nowrap"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            ← Back to Site
          </button>
          <button
            type="button"
            onClick={() => adminLogout()}
            className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#666] hover:text-[#c25c5c] transition-colors duration-200 whitespace-nowrap"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Log Out
          </button>
        </div>
      </header>

      <nav className="border-b border-[#1A1A1E] px-4 sm:px-6 flex justify-center gap-5 sm:gap-6 overflow-x-auto">
        {MODULES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActive(m.id)}
            className={`relative py-3.5 text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-200 ${
              active === m.id ? 'text-[#C9A227]' : 'text-[#666] hover:text-[#E8E8E6]'
            }`}
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {m.label}
            {active === m.id && <span className="absolute left-0 right-0 -bottom-px h-px bg-[#C9A227]" />}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {active === 'dashboard' && <Dashboard onNavigate={setActive} />}
        {active === 'divisions' && <DivisionsManager />}
        {active === 'milestones' && <MilestonesManager />}
        {active === 'events' && <EventsManager />}
        {active === 'news' && <NewsManager />}
        {active === 'staff' && <StaffManager />}
        {active === 'rules' && <RulesManager />}
        {active === 'settings' && <SiteSettingsForm />}
        {active === 'account' && <AccountModule myRole={role} />}
      </main>
    </div>
  )
}
