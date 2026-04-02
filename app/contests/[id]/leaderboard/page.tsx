'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import TopRankerNavbar from '@/components/navbar'

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  email: string
  country: string
  institution: string
  totalScore: number
  problemsScored: number
  totalProblems: number
  participantCount: number
}

export default function ContestLeaderboardPage() {
  const params = useParams()
  const contestId = params.id as string
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [contestName, setContestName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests/${contestId}`, { headers })
      .then(res => setContestName(res.data.data?.name || contestId))
      .catch(() => {})

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests/${contestId}/leaderboard`)
      .then(res => {
        setLeaderboard(res.data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load leaderboard. Please try again.')
        setLoading(false)
      })
  }, [contestId])

  const filtered = searchQuery.trim()
    ? leaderboard.filter(e =>
        e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.institution?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leaderboard

  const rankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>
    if (rank === 2) return <span className="text-2xl">🥈</span>
    if (rank === 3) return <span className="text-2xl">🥉</span>
    return <span className="font-bold text-gray-700">#{rank}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <TopRankerNavbar />

      {/* Header */}
      <div className="bg-black text-white py-6 px-8">
        <Link href={`/contests/${contestId}`} className="text-gray-400 hover:text-white text-sm mb-1 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contest
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3 mt-1">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
          </svg>
          {contestName ? `${contestName} — Leaderboard` : 'Contest Leaderboard'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, country, or institution..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Loading leaderboard...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchQuery ? `No participants match "${searchQuery}"` : 'No participants yet. Be the first to join!'}
          </div>
        ) : (
          <>
            {/* Summary bar */}
            {leaderboard.length > 0 && (
              <div className="mb-4 flex items-center gap-6 text-sm text-gray-600">
                <span><strong>{leaderboard.length}</strong> participants</span>
                <span><strong>{leaderboard[0]?.totalProblems}</strong> problems</span>
                {searchQuery && <span className="text-blue-600">{filtered.length} result(s) found</span>}
              </div>
            )}

            <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center font-bold border-r border-gray-300 w-20">Rank</th>
                      <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Name</th>
                      <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Country</th>
                      <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Institution</th>
                      <th className="px-4 py-3 text-center font-bold border-r border-gray-300">Problems Scored</th>
                      <th className="px-4 py-3 text-center font-bold">Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry, index) => (
                      <tr
                        key={entry.userId}
                        className={`border-b border-gray-300 transition hover:bg-blue-50 ${
                          index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-3 text-center border-r border-gray-300">
                          {rankBadge(entry.rank)}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-300 font-medium">
                          {entry.name}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-300 text-gray-600 text-sm">
                          {entry.country || '—'}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-300 text-gray-600 text-sm">
                          {entry.institution || '—'}
                        </td>
                        <td className="px-4 py-3 text-center border-r border-gray-300">
                          <span className={`font-semibold ${entry.problemsScored === entry.totalProblems ? 'text-green-600' : 'text-gray-700'}`}>
                            {entry.problemsScored}
                          </span>
                          <span className="text-gray-400">/{entry.totalProblems}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-blue-600 text-lg">
                            {entry.totalScore.toFixed(4)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
