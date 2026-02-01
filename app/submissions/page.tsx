'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'
import Link from 'next/link'

export default function AllSubmissionsPage() {
  const router = useRouter()
  
  const [submissions, setSubmissions] = useState<any[]>([])
  const [selectedDimension, setSelectedDimension] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }

    // Fetch all user submissions
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSubmissions(res.data.data || [])
      })
      .catch(err => {
        console.error('Failed to fetch submissions:', err)
        setSubmissions([])
      })
  }, [router])

  const filteredSubmissions = selectedDimension === 'all' 
    ? submissions 
    : submissions.filter(s => s.dimension === parseInt(selectedDimension))

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
              <button 
                onClick={() => setSelectedDimension('all')}
                className={`px-4 py-2 rounded transition ${
                  selectedDimension === 'all'
                    ? 'text-blue-600 font-bold underline'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                All Dimensions
              </button>
              <button 
                onClick={() => setSelectedDimension('20')}
                className={`px-4 py-2 rounded transition ${
                  selectedDimension === '20'
                    ? 'text-blue-600 font-bold underline'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                D=20
              </button>
              <button 
                onClick={() => setSelectedDimension('50')}
                className={`px-4 py-2 rounded transition ${
                  selectedDimension === '50'
                    ? 'text-blue-600 font-bold underline'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                D=50
              </button>
              <button 
                onClick={() => setSelectedDimension('100')}
                className={`px-4 py-2 rounded transition ${
                  selectedDimension === '100'
                    ? 'text-blue-600 font-bold underline'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                D=100
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-lg shadow">
            <div className="p-6">
              <h2 className="text-3xl font-light text-gray-700 text-center mb-8">
                All My Submissions
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">PROBLEM ID</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">PROBLEM NAME</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">DIMENSION</th>
                      <th className="px-4 py-3 text-right text-gray-600 font-bold">SCORE</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">STATUS</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-bold">SUBMITTED AT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No data available</td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission, index) => (
                        <tr key={submission._id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                          <td className="px-4 py-3 text-gray-600">
                            <Link href={`/problems/${submission.problemId}`} className="text-blue-500 hover:underline font-medium">
                              {submission.problemId}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {submission.problemName || '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            D={submission.dimension}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {submission.score !== null && submission.score !== undefined ? submission.score.toFixed(6) : '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {submission.rank ? `#${submission.rank}` : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              submission.status === 'evaluated' ? 'bg-green-100 text-green-800' :
                              submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </td>
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
