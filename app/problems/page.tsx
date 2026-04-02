'use client'

import TopRankerNavbar from '@/components/navbar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Dimension {
  dimension: number
  submissions: number
}

interface Problem {
  problemId: string
  name: string
  level: string
  ownerName?: string
  owner?: string
  totalSubmissions?: number
  dimensions?: Dimension[]
}

interface ContestGroup {
  contestId: string
  contestName: string
  status: string
  problems: Problem[]
}

interface UserRankings {
  [problemId: string]: {
    ranks: Record<string, number>
    total_participants: Record<string, number>
  }
}

function levelBadge(level: string) {
  const map: Record<string, string> = {
    Easy:   'bg-green-100 text-green-700 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Hard:   'bg-red-100 text-red-700 border-red-300',
  }
  return map[level] || 'bg-gray-100 text-gray-700 border-gray-300'
}

function ProblemTable({ problems, contestId, userRankings }: {
  problems: Problem[]
  contestId: string
  userRankings: UserRankings
}) {
  return (
    <div className="bg-white border border-black overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-200 border-b border-black">
            <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Problem #</th>
            <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Problem Name</th>
            <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Level</th>
            <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Owner</th>
            <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Dimensions</th>
            <th className="px-4 py-3 text-center font-bold text-black border-r border-black">My Ranking</th>
            <th className="px-4 py-3 text-center font-bold text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem.problemId} className={`border-b border-black ${index % 2 === 0 ? 'bg-[#f5f5dc]' : 'bg-[#e6f3ff]'}`}>
              <td className="px-4 py-4 font-bold text-black border-r border-black align-top">{problem.problemId}</td>
              <td className="px-4 py-4 border-r border-black align-top">
                <div className="font-bold text-black">{problem.name}</div>
                <Link href={`/problems/${problem.problemId}`} className="text-blue-600 text-xs hover:underline">
                  Click here for more info...
                </Link>
              </td>
              <td className="px-4 py-4 border-r border-black align-top">
                <span className={`text-xs font-semibold px-2 py-1 rounded border ${levelBadge(problem.level)}`}>
                  {problem.level}
                </span>
              </td>
              <td className="px-4 py-4 text-black border-r border-black align-top text-xs">{problem.ownerName || problem.owner || '-'}</td>
              <td className="px-4 py-4 border-r border-black align-top">
                {problem.dimensions?.map((dim, i) => (
                  <div key={i} className="text-xs text-black py-1">D={dim.dimension} <span className="text-gray-500">({dim.submissions} subs)</span></div>
                ))}
              </td>
              <td className="px-4 py-4 border-r border-black align-top text-center">
                {problem.dimensions?.map((dim, i) => {
                  const rank  = userRankings[problem.problemId]?.ranks?.[String(dim.dimension)]
                  const total = userRankings[problem.problemId]?.total_participants?.[String(dim.dimension)]
                  return (
                    <div key={i} className="text-xs py-1 font-semibold">
                      {rank ? <span className="text-blue-600">#{rank}{total ? `/${total}` : ''}</span> : <span className="text-gray-400">-</span>}
                    </div>
                  )
                })}
              </td>
              <td className="px-4 py-4 align-top text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-500">{problem.totalSubmissions ?? 0} total subs</div>
                  <Link href={`/problems/${problem.problemId}/leaderboard`} className="text-blue-600 text-xs hover:underline">View ranking</Link>
                  <Link href={`/problems/${problem.problemId}`} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded text-xs font-medium transition">Solve</Link>
                  <Link href={`/contests/${contestId}`} className="text-gray-500 text-xs hover:underline">← Contest page</Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Page() {
  const [isLoggedIn] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem('token'))
  const [groups, setGroups] = useState<ContestGroup[]>([])
  const [userRankings, setUserRankings] = useState<UserRankings>({})
  const [loading, setLoading] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem('token'))
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const headers = { Authorization: `Bearer ${token}` }
    const userId  = localStorage.getItem('userId')

    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests/my-problems`, { headers }),
      userId
        ? axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics/user/${userId}`)
            .then(r => r.data.data?.user?.problem_rankings || {})
            .catch(() => ({}))
        : Promise.resolve({}),
    ])
      .then(([contestRes, rankings]) => {
        setGroups(contestRes.data.data?.groups || [])
        setUserRankings(rankings as UserRankings)
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false))
  }, [])

  const allProblems = groups.flatMap(g => g.problems)
  const filtered = searchQuery.trim()
    ? allProblems.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.problemId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.level?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="bg-black text-white px-6 py-3 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <h1 className="text-2xl font-bold">My Contest Problems</h1>
        </div>

        {/* Not logged in */}
        {!loading && !isLoggedIn && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-gray-500 text-lg">Login to see your contest problems</p>
            <Link href="/auth" className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded font-medium transition">
              Sign In
            </Link>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading your problems...
          </div>
        )}

        {/* No contests joined */}
        {!loading && isLoggedIn && groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-lg font-semibold">No problems yet</p>
            <p className="text-gray-400 text-sm">Join a contest first to unlock its problems</p>
            <Link href="/contests" className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded font-medium transition">
              Browse Contests
            </Link>
          </div>
        )}

        {/* Problems grouped by contest */}
        {!loading && isLoggedIn && groups.length > 0 && (
          <>
            {/* Search */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search problems by name, ID, or difficulty..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-black bg-white"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Global search results */}
            {filtered !== null ? (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                  </span>
                  <button onClick={() => setSearchQuery('')} className="text-xs text-blue-600 hover:underline">Clear</button>
                </div>
                {filtered.length === 0
                  ? <p className="text-gray-400 text-sm py-8 text-center">No problems match your search.</p>
                  : <ProblemTable problems={filtered} contestId={groups[0]?.contestId} userRankings={userRankings} />
                }
              </div>
            ) : (
              /* Grouped by contest */
              groups.map(group => (
                <div key={group.contestId} className="mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-black text-white px-4 py-2 rounded-t font-bold text-sm">
                      {group.contestName}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border font-medium ${
                      group.status === 'active' || group.status === 'ongoing'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : group.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}>
                      {group.status}
                    </span>
                    <Link href={`/contests/${group.contestId}/leaderboard`} className="text-xs text-blue-600 hover:underline ml-auto">
                      View contest leaderboard →
                    </Link>
                  </div>
                  {group.problems.length === 0
                    ? <p className="text-gray-400 text-sm py-4 bg-white border border-black px-4">No problems in this contest yet.</p>
                    : <ProblemTable problems={group.problems} contestId={group.contestId} userRankings={userRankings} />
                  }
                </div>
              ))
            )}
          </>
        )}
      </main>
    </div>
  )
}