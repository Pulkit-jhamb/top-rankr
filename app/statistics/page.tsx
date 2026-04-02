'use client'
import TopRankerNavbar from '@/components/navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics`)
      .then(res => {
        if (res.data.success) setStatistics(res.data.data);
        else setError('Failed to load statistics.');
      })
      .catch(err => {
        console.error('Failed to fetch statistics:', err);
        setError('Failed to load statistics. Please try again.');
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      
      {/* Header Banner */}
      <div className="bg-black text-white py-6 px-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Statistics
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>
        )}

        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Platform Statistics</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="p-6 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : !statistics ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.totalSubmissions?.toLocaleString() || 0}</div>
                <div className="text-gray-700">Total Submissions</div>
              </div>
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">{statistics.totalUsers?.toLocaleString() || 0}</div>
                <div className="text-gray-700">Registered Users</div>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">{statistics.totalProblems?.toLocaleString() || 0}</div>
                <div className="text-gray-700">Problems</div>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{statistics.totalCountries || 0}</div>
                <div className="text-gray-700">Countries</div>
              </div>
              <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-2">{statistics.indiaUsers?.toLocaleString() || 0}</div>
                <div className="text-gray-700">Users from India</div>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{statistics.academicUsers?.toLocaleString() || 0}</div>
                <div className="text-gray-700">Academic Users</div>
              </div>
              <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">{statistics.activeUsers?.toLocaleString() || 0}</div>
                <div className="text-gray-700">Active Users</div>
              </div>
            </div>
          )}
        </div>

        {!loading && statistics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Rankers */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-yellow-50 border-b border-gray-300 px-6 py-4">
                <h2 className="text-lg font-bold text-black">⭐ Top Rankers</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {(statistics.topRankers || []).slice(0, 5).map((r: any, i: number) => (
                  <li key={i} className="px-6 py-3 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-black mr-2">#{i + 1}</span>
                      <span className="text-black">{r.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">{r.country || 'N/A'}</div>
                  </li>
                ))}
                {(!statistics.topRankers || statistics.topRankers.length === 0) && (
                  <li className="px-6 py-4 text-gray-500 text-sm">No rankings yet.</li>
                )}
              </ul>
            </div>

            {/* Top Contributors */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
                <h2 className="text-lg font-bold text-black">Top Contributors</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {(statistics.topContributors || []).slice(0, 5).map((c: any, i: number) => (
                  <li key={i} className="px-6 py-3 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-black mr-2">#{i + 1}</span>
                      <span className="text-black">{c.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">{c.problemCount} problems | {c.institution || 'N/A'}</div>
                  </li>
                ))}
                {(!statistics.topContributors || statistics.topContributors.length === 0) && (
                  <li className="px-6 py-4 text-gray-500 text-sm">No contributors yet.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
