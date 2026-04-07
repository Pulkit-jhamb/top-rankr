'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import TopRankerNavbar from '@/components/navbar'

type Tab = 'dashboard' | 'users' | 'submissions' | 'contributions' | 'add-contest' | 'add-problem'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>

const API = process.env.NEXT_PUBLIC_API_URL

function authHeaders() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  return { Authorization: `Bearer ${t}` }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ stats }: { stats: AnyObj }) {
  const cards = [
    { label: 'Total Users',       value: stats.totalUsers       ?? '—', color: 'bg-blue-50 border-blue-300' },
    { label: 'Total Problems',    value: stats.totalProblems    ?? '—', color: 'bg-yellow-50 border-yellow-300' },
    { label: 'Total Contests',    value: stats.totalContests    ?? '—', color: 'bg-green-50 border-green-300' },
    { label: 'Total Submissions', value: stats.totalSubmissions ?? '—', color: 'bg-purple-50 border-purple-300' },
    { label: 'Active Contests',   value: stats.activeContests   ?? '—', color: 'bg-red-50 border-red-300' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(c => (
        <div key={c.label} className={`border-2 rounded-lg p-4 ${c.color}`}>
          <div className="text-3xl font-bold text-black">{c.value}</div>
          <div className="text-sm text-gray-600 mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Users ───────────────────────────────────────────────────────────────────
function Users() {
  const [users, setUsers]       = useState<AnyObj[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [totalPages, setTP]     = useState(1)
  const [selected, setSelected] = useState<AnyObj | null>(null)
  const [detail, setDetail]     = useState<AnyObj | null>(null)

  const load = (p = 1, q = search) => {
    setLoading(true)
    axios.get(`${API}/api/admin/users`, {
      headers: authHeaders(),
      params: { page: p, limit: 20, search: q },
    }).then(r => {
      setUsers(r.data.data || [])
      setTP(r.data.pagination?.pages || 1)
    }).catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  const openUser = (u: AnyObj) => {
    setSelected(u)
    axios.get(`${API}/api/admin/users/${u._id}`, { headers: authHeaders() })
      .then(r => setDetail(r.data.data))
      .catch(() => toast.error('Failed to load user detail'))
  }

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { setPage(1); load(1, search) } }}
          placeholder="Search by name, email, institution…"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button onClick={() => { setPage(1); load(1, search) }}
          className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-sm">Search</button>
      </div>

      {loading ? <p className="text-gray-400 py-8 text-center">Loading…</p> : (
        <div className="bg-white border border-black overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 border-b border-black">
              <tr>
                {['Name','Email','Country','Institution','Submissions','Problems','Global Rank','Actions'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-black border-r border-gray-300 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} className={`border-b border-gray-200 ${i % 2 === 0 ? 'bg-[#f5f5dc]' : 'bg-white'}`}>
                  <td className="px-3 py-2 font-semibold text-black border-r border-gray-200">{u.name || '—'}</td>
                  <td className="px-3 py-2 text-gray-600 border-r border-gray-200 text-xs">{u.email}</td>
                  <td className="px-3 py-2 border-r border-gray-200">{u.country || '—'}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-xs">{u.institution || '—'}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">{u.totalSubmissions}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">{u.problemsAttempted}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">{u.globalRank ?? '—'}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => openUser(u)} className="text-blue-600 hover:underline text-xs">View</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-3 items-center">
        <button disabled={page === 1} onClick={() => { setPage(p => { load(p - 1); return p - 1 })}
          } className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40">Prev</button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => { setPage(p => { load(p + 1); return p + 1 })}
          } className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40">Next</button>
      </div>

      {/* User detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSelected(null); setDetail(null) }}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-black">{selected.name || selected.email}</h3>
              <button onClick={() => { setSelected(null); setDetail(null) }} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            {!detail ? <p className="text-gray-400">Loading…</p> : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[['Email', detail.user?.email], ['Country', detail.user?.country], ['Institution', detail.user?.institution], ['Role', detail.user?.role]].map(([k, v]) => (
                    <div key={k as string}><span className="font-semibold text-gray-700">{k}: </span><span className="text-black">{v || '—'}</span></div>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">Contests Joined ({detail.contests?.length ?? 0})</h4>
                  <div className="flex flex-wrap gap-1">
                    {detail.contests?.map((c: AnyObj) => (
                      <span key={c._id} className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-xs text-black">{c.name}</span>
                    ))}
                    {detail.contests?.length === 0 && <span className="text-gray-400 text-sm">None</span>}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">Recent Submissions ({detail.submissions?.length ?? 0})</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-gray-200">
                      <thead className="bg-gray-100"><tr>
                        <th className="px-2 py-1 text-left border-r border-gray-200">Problem</th>
                        <th className="px-2 py-1 text-left border-r border-gray-200">Dimension</th>
                        <th className="px-2 py-1 text-left border-r border-gray-200">Score</th>
                        <th className="px-2 py-1 text-left">Date</th>
                      </tr></thead>
                      <tbody>
                        {detail.submissions?.slice(0, 10).map((s: AnyObj) => (
                          <tr key={s._id} className="border-b border-gray-100">
                            <td className="px-2 py-1 border-r border-gray-200 font-medium">{s.problemId}</td>
                            <td className="px-2 py-1 border-r border-gray-200">D={s.dimension}</td>
                            <td className="px-2 py-1 border-r border-gray-200">{s.score?.toFixed?.(4) ?? s.score}</td>
                            <td className="px-2 py-1 text-gray-500">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                        {detail.submissions?.length === 0 && (
                          <tr><td colSpan={4} className="px-2 py-3 text-center text-gray-400">No submissions</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Submissions ─────────────────────────────────────────────────────────────
function Submissions() {
  const [subs, setSubs]       = useState<AnyObj[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [totalPages, setTP]   = useState(1)
  const [problem, setProblem] = useState('')
  const [user, setUser]       = useState('')

  const load = (p = 1) => {
    setLoading(true)
    axios.get(`${API}/api/admin/submissions`, {
      headers: authHeaders(),
      params: { page: p, limit: 30, problem, user },
    }).then(r => {
      setSubs(r.data.data || [])
      setTP(r.data.pagination?.pages || 1)
    }).catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={problem} onChange={e => setProblem(e.target.value)} placeholder="Filter by problem ID" className="border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none w-48" />
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="Filter by user name" className="border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none w-48" />
        <button onClick={() => { setPage(1); load(1) }} className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-sm">Filter</button>
        <button onClick={() => { setProblem(''); setUser(''); setPage(1); load(1) }} className="border border-gray-300 bg-white hover:bg-gray-50 text-black px-4 py-2 rounded text-sm">Clear</button>
      </div>

      {loading ? <p className="text-gray-400 py-8 text-center">Loading…</p> : (
        <div className="bg-white border border-black overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 border-b border-black">
              <tr>
                {['Problem','User','Dimension','Score','f(x)','Date'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-black border-r border-gray-300 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((s, i) => (
                <tr key={s._id} className={`border-b border-gray-200 ${i % 2 === 0 ? 'bg-[#f5f5dc]' : 'bg-white'}`}>
                  <td className="px-3 py-2 font-semibold text-black border-r border-gray-200">
                    <Link href={`/problems/${s.problemId}`} className="text-blue-600 hover:underline">{s.problemId}</Link>
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-xs">{s.userName || s.userId}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">D={s.dimension}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200 font-medium">{typeof s.score === 'number' ? s.score.toFixed(4) : s.score}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200 text-xs">{typeof s.fx === 'number' ? s.fx.toFixed(6) : '—'}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex gap-2 mt-3 items-center">
        <button disabled={page === 1} onClick={() => { setPage(p => p - 1); load(page - 1) }} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40">Prev</button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => { setPage(p => p + 1); load(page + 1) }} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40">Next</button>
      </div>
    </div>
  )
}

// ─── Add Contest ──────────────────────────────────────────────────────────────
function ContestField({ label, k, type = 'text', placeholder = '', value, onChange }: {
  label: string, k: string, type?: string, placeholder?: string,
  value: string, onChange: (k: string, v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(k, e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
    </div>
  )
}

function AddContest() {
  const [form, setForm] = useState({
    eventId: '', name: '', organizer: '', type: 'Open',
    status: 'upcoming', prize: '', startDate: '', endDate: '',
    problems: '', eventCode: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.eventId || !form.name || !form.organizer) {
      toast.error('Event ID, Name and Organizer are required'); return
    }
    setSaving(true)
    try {
      await axios.post(`${API}/api/admin/contests`, {
        ...form,
        prize: form.prize ? Number(form.prize) : undefined,
        problems: form.problems ? form.problems.split(',').map(s => s.trim()).filter(Boolean) : [],
      }, { headers: authHeaders() })
      toast.success('Contest created!')
      setForm({ eventId: '', name: '', organizer: '', type: 'Open', status: 'upcoming', prize: '', startDate: '', endDate: '', problems: '', eventCode: '' })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to create contest')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ContestField label="Event ID *" k="eventId" placeholder="e.g. CONF-2026" value={form.eventId} onChange={set} />
        <ContestField label="Contest Name *" k="name" placeholder="e.g. Spring Optimization 2026" value={form.name} onChange={set} />
        <ContestField label="Organizer *" k="organizer" placeholder="University / Lab name" value={form.organizer} onChange={set} />
        <ContestField label="Event Code" k="eventCode" placeholder="Optional access code" value={form.eventCode} onChange={set} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none">
            {['Open','Invitational','Academic','Corporate'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none">
            {['upcoming','active','ongoing','ended','closed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <ContestField label="Prize ($)" k="prize" type="number" placeholder="0" value={form.prize} onChange={set} />
        <ContestField label="Start Date" k="startDate" type="datetime-local" value={form.startDate} onChange={set} />
        <ContestField label="End Date" k="endDate" type="datetime-local" value={form.endDate} onChange={set} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Problem IDs (comma-separated)</label>
        <textarea value={form.problems} onChange={e => set('problems', e.target.value)} rows={2} placeholder="e.g. TR-001, TR-002, TR-003"
          className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
      </div>
      <button onClick={submit} disabled={saving}
        className="bg-gray-800 hover:bg-black disabled:opacity-60 text-white px-6 py-2 rounded font-medium transition">
        {saving ? 'Creating…' : 'Create Contest'}
      </button>
    </div>
  )
}

// ─── Add Problem ─────────────────────────────────────────────────────────────
function ProblemField({ label, k, type = 'text', placeholder = '', value, onChange }: {
  label: string, k: string, type?: string, placeholder?: string,
  value: string, onChange: (k: string, v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(k, e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
    </div>
  )
}

function AddProblem() {
  const [form, setForm] = useState({
    problemId: '', name: '', level: 'Medium', type: 'Minimization',
    category: '', tags: '', description: '',
    formula: '', constraint: '', boundsMin: '-10', boundsMax: '10',
    globalMinimum: '0', dimensions: '10,20,30', status: 'active',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.problemId || !form.name) {
      toast.error('Problem ID and Name are required'); return
    }
    setSaving(true)
    try {
      await axios.post(`${API}/api/admin/problems`, {
        ...form,
        boundsMin:     Number(form.boundsMin),
        boundsMax:     Number(form.boundsMax),
        globalMinimum: Number(form.globalMinimum),
        dimensions:    form.dimensions.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)),
        tags:          form.tags.split(',').map(s => s.trim()).filter(Boolean),
      }, { headers: authHeaders() })
      toast.success('Problem created!')
      setForm({ problemId: '', name: '', level: 'Medium', type: 'Minimization', category: '', tags: '', description: '', formula: '', constraint: '', boundsMin: '-10', boundsMax: '10', globalMinimum: '0', dimensions: '10,20,30', status: 'active' })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to create problem')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ProblemField label="Problem ID *" k="problemId" placeholder="e.g. TR-010" value={form.problemId} onChange={set} />
        <ProblemField label="Problem Name *" k="name" placeholder="e.g. Rastrigin Function" value={form.name} onChange={set} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
          <select value={form.level} onChange={e => set('level', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none">
            {['Easy','Medium','Hard'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none">
            {['Minimization','Maximization','Multi-Objective'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <ProblemField label="Category" k="category" placeholder="e.g. Continuous Optimization" value={form.category} onChange={set} />
        <ProblemField label="Tags (comma-separated)" k="tags" placeholder="e.g. unimodal, noisy" value={form.tags} onChange={set} />
        <ProblemField label="Dimensions (comma-separated)" k="dimensions" placeholder="10,20,30" value={form.dimensions} onChange={set} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none">
            {['active','inactive','draft'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <ProblemField label="Bounds Min" k="boundsMin" type="number" value={form.boundsMin} onChange={set} />
        <ProblemField label="Bounds Max" k="boundsMax" type="number" value={form.boundsMax} onChange={set} />
        <ProblemField label="Global Minimum" k="globalMinimum" type="number" value={form.globalMinimum} onChange={set} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Problem description…"
          className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Fitness Formula</label>
        <textarea value={form.formula} onChange={e => set('formula', e.target.value)} rows={2} placeholder="e.g. f(x) = …"
          className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-mono" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Constraint</label>
        <input value={form.constraint} onChange={e => set('constraint', e.target.value)} placeholder="e.g. -10 ≤ xi ≤ 10"
          className="w-full border border-gray-300 rounded px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
      </div>
      <button onClick={submit} disabled={saving}
        className="bg-gray-800 hover:bg-black disabled:opacity-60 text-white px-6 py-2 rounded font-medium transition">
        {saving ? 'Creating…' : 'Create Problem'}
      </button>
    </div>
  )
}

// ─── Contributions ──────────────────────────────────────────────────────────
function Contributions() {
  const [contribs, setContribs]           = useState<AnyObj[]>([])
  const [loading, setLoading]             = useState(true)
  const [statusFilter, setStatusFilter]   = useState('pending')
  const [page, setPage]                   = useState(1)
  const [totalPages, setTP]               = useState(1)
  const [accepting, setAccepting]         = useState<AnyObj | null>(null)
  const [rejecting, setRejecting]         = useState<AnyObj | null>(null)
  const [rejectReason, setRejectReason]   = useState('')
  const [saving, setSaving]               = useState(false)
  const [acceptForm, setAcceptForm]       = useState({
    problemId: '', level: 'Medium', type: 'Minimization', category: '',
    dimensions: '10,20,30', boundsMin: '-10', boundsMax: '10',
    globalMinimum: '0', formula: '', constraint: '', contestId: '',
  })

  const load = (p = 1, s = statusFilter) => {
    setLoading(true)
    axios.get(`${API}/api/admin/contributions`, {
      headers: authHeaders(),
      params: { page: p, limit: 20, status: s },
    }).then(r => {
      setContribs(r.data.data || [])
      setTP(r.data.pagination?.pages || 1)
    }).catch(() => toast.error('Failed to load contributions'))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  const openAccept = (c: AnyObj) => {
    setAccepting(c)
    setAcceptForm(f => ({ ...f, formula: c.fitnessFormula || '', constraint: c.constraint || '', level: c.level || 'Medium' }))
  }

  const doAccept = async () => {
    if (!acceptForm.problemId.trim()) { toast.error('Problem ID is required'); return }
    setSaving(true)
    try {
      await axios.post(`${API}/api/admin/contributions/${accepting!._id}/accept`, {
        problemId:     acceptForm.problemId.trim(),
        level:         acceptForm.level,
        type:          acceptForm.type,
        category:      acceptForm.category,
        dimensions:    acceptForm.dimensions.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0),
        boundsMin:     Number(acceptForm.boundsMin),
        boundsMax:     Number(acceptForm.boundsMax),
        globalMinimum: Number(acceptForm.globalMinimum),
        formula:       acceptForm.formula,
        constraint:    acceptForm.constraint,
      }, { headers: authHeaders() })
      if (acceptForm.contestId.trim()) {
        await axios.post(`${API}/api/admin/contests/${acceptForm.contestId.trim()}/add-problem`,
          { problemId: acceptForm.problemId.trim() }, { headers: authHeaders() }
        ).catch(() => {})
      }
      toast.success('Problem created!')
      setAccepting(null)
      load(page)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to accept')
    } finally { setSaving(false) }
  }

  const doReject = async () => {
    setSaving(true)
    try {
      await axios.post(`${API}/api/admin/contributions/${rejecting!._id}/reject`,
        { reason: rejectReason }, { headers: authHeaders() })
      toast.success('Contribution rejected.')
      setRejecting(null); setRejectReason('')
      load(page)
    } catch { toast.error('Failed to reject') }
    finally { setSaving(false) }
  }

  const sColor: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800 border-yellow-300',
    accepted: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['pending', 'accepted', 'rejected', ''].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); load(1, s) }}
            className={`px-4 py-1.5 rounded text-sm font-medium border transition ${
              statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-400 py-8 text-center">Loading…</p> : (
        <div className="space-y-4">
          {contribs.length === 0 && (
            <div className="bg-white border border-gray-200 rounded px-6 py-10 text-center text-gray-400">
              No {statusFilter || ''} contributions found.
            </div>
          )}
          {contribs.map(c => (
            <div key={c._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-black">{c.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${sColor[c.status] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>{c.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      c.level === 'Easy' ? 'bg-green-50 text-green-700 border-green-300' :
                      c.level === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                      'bg-red-50 text-red-700 border-red-300'
                    }`}>{c.level}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    By <span className="font-medium text-gray-700">{c.submitterName || c.submitterEmail || 'Unknown'}</span>
                    {c.submittedAt && <> · {new Date(c.submittedAt).toLocaleDateString()}</>}
                    {c.status === 'accepted' && c.problemId && <> · Problem ID: <span className="font-medium text-green-700">{c.problemId}</span></>}
                    {c.status === 'rejected' && c.reason && <> · Reason: <span className="text-red-600">{c.reason}</span></>}
                  </p>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{c.description}</p>
                  <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    <p className="text-xs text-gray-500 font-medium mb-1">Fitness Formula:</p>
                    <p className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{c.fitnessFormula}</p>
                    {c.constraint && <p className="text-xs text-gray-500 mt-1">Constraint: {c.constraint}</p>}
                  </div>
                </div>
                {c.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => openAccept(c)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium">Accept</button>
                    <button onClick={() => { setRejecting(c); setRejectReason('') }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4 items-center">
        <button disabled={page === 1} onClick={() => { setPage(p => p - 1); load(page - 1) }} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40">Prev</button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => { setPage(p => p + 1); load(page + 1) }} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40">Next</button>
      </div>

      {/* Accept Modal */}
      {accepting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">Accept: {accepting.name}</h3>
              <button onClick={() => setAccepting(null)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[['Problem ID *', 'problemId', 'text', 'e.g. TR-010'], ['Category', 'category', 'text', 'e.g. Continuous'], ['Dimensions', 'dimensions', 'text', '10,20,30'], ['Global Minimum', 'globalMinimum', 'number', '0'], ['Bounds Min', 'boundsMin', 'number', '-10'], ['Bounds Max', 'boundsMax', 'number', '10']].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input type={type} value={acceptForm[key as keyof typeof acceptForm]} placeholder={ph}
                      onChange={e => setAcceptForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-black focus:outline-none" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Level</label>
                  <select value={acceptForm.level} onChange={e => setAcceptForm(f => ({ ...f, level: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-black focus:outline-none">
                    {['Easy','Medium','Hard'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                  <select value={acceptForm.type} onChange={e => setAcceptForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-black focus:outline-none">
                    {['Minimization','Maximization','Multi-Objective'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fitness Formula (Python-executable)</label>
                <textarea value={acceptForm.formula} rows={3} onChange={e => setAcceptForm(f => ({ ...f, formula: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-mono text-black focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Constraint</label>
                <input value={acceptForm.constraint} onChange={e => setAcceptForm(f => ({ ...f, constraint: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Also add to Contest (Event ID, optional)</label>
                <input value={acceptForm.contestId} placeholder="e.g. CONF-2026" onChange={e => setAcceptForm(f => ({ ...f, contestId: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-black focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={doAccept} disabled={saving}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded font-medium text-sm">
                  {saving ? 'Creating…' : 'Accept & Create Problem'}
                </button>
                <button onClick={() => setAccepting(null)} className="border border-gray-300 px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejecting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-black mb-3">Reject: {rejecting.name}</h3>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Reason (optional)</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
              placeholder="e.g. Duplicate of existing problem, formula unclear…"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={doReject} disabled={saving}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-2 rounded font-medium text-sm">
                {saving ? 'Rejecting…' : 'Confirm Reject'}
              </button>
              <button onClick={() => setRejecting(null)} className="border border-gray-300 px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab]     = useState<Tab>('dashboard')
  const [stats, setStats] = useState<AnyObj>({})
  const [ready] = useState(() =>
    typeof window !== 'undefined' &&
    !!localStorage.getItem('token') &&
    localStorage.getItem('role') === 'admin'
  )

  useEffect(() => {
    if (!ready) { router.replace('/auth'); return }
    axios.get(`${API}/api/admin/stats`, { headers: authHeaders() })
      .then(r => setStats(r.data.data || {}))
      .catch(() => {})
  }, [ready, router])

  if (!ready) return null

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard',     label: 'Dashboard' },
    { id: 'users',         label: 'Users' },
    { id: 'submissions',   label: 'Submissions' },
    { id: 'contributions', label: 'Contributions' },
    { id: 'add-contest',   label: 'Add Contest' },
    { id: 'add-problem',   label: 'Add Problem' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="bg-black text-white px-6 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Link href="/home" className="text-sm text-gray-300 hover:text-white">← Back to site</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b-2 border-gray-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 text-sm font-medium border-b-2 transition -mb-0.5 ${
                tab === t.id
                  ? 'border-black text-black bg-white'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === 'dashboard'     && <Dashboard stats={stats} />}
          {tab === 'users'           && <Users />}
          {tab === 'submissions'     && <Submissions />}
          {tab === 'contributions'   && <Contributions />}
          {tab === 'add-contest'     && <AddContest />}
          {tab === 'add-problem'     && <AddProblem />}
        </div>
      </main>
    </div>
  )
}
