'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'
import Link from 'next/link'

export default function ProblemLeaderboardPage() {
  const params = useParams()
  const problemId = params.id
  
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState<any>(null)
  const [selectedDimension, setSelectedDimension] = useState(20)

  useEffect(() => {
    // Fetch problem details
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}`)
      .then(res => setProblem(res.data.data))
      .catch(err => console.error('Failed to fetch problem:', err))
  }, [problemId])

  useEffect(() => {
    // Fetch leaderboard for selected dimension
    setLoading(true)
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}/leaderboard`, {
      params: { dimension: selectedDimension }
    })
      .then(res => {
        setLeaderboard(res.data.data || [])
      })
      .catch(err => {
        console.error('Failed to fetch leaderboard:', err)
        setLeaderboard([])
      })
      .finally(() => setLoading(false))
  }, [problemId, selectedDimension])

  return (
    <>
      <TopRankerNavbar />
      <div className="min-h-screen bg-gray-50 text-black">
        {/* Header */}
        <div className="bg-gray-800 text-white py-6 px-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            Leaderboard
          </h1>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Tabs */}
          <div className="bg-gray-200 p-4 rounded-t-lg">
            <div className="flex gap-6">
              {[20, 50, 100].map(dim => (
                <button
                  key={dim}
                  onClick={() => setSelectedDimension(dim)}
                  className={`px-4 py-2 rounded transition ${
                    selectedDimension === dim
                      ? 'text-blue-600 font-bold underline'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  D={dim}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-lg shadow">
            <div className="p-6">
              <h2 className="text-3xl font-light text-gray-700 text-center mb-8">
                Problem #{problemId} - {problem?.name || 'Leaderboard'}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">USER</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">EMAIL</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">INSTITUTION</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">COUNTRY</th>
                      <th className="px-4 py-3 text-right text-gray-600 font-bold">SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No data available</td>
                      </tr>
                    ) : (
                      leaderboard.map((entry, index) => (
                        <tr key={entry.userId} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                          <td className="px-4 py-3 text-gray-600">{entry.rank}</td>
                          <td className="px-4 py-3">
                            <span className="text-blue-500 font-medium">{entry.userName}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{entry.userEmail}</td>
                          <td className="px-4 py-3 text-gray-600">{entry.institution || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-600">{entry.country || 'N/A'}</td>
                          <td className="px-4 py-3 text-right font-medium">{entry.score?.toFixed(6)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
