'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import TopRankerNavbar from '@/components/navbar'

export default function ContestDetailPage() {
  const params = useParams()
  const contestId = params.id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contest, setContest] = useState<any>(null)
  const [isParticipant, setIsParticipant] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [joining, setJoining] = useState(false)
  const [joinStatus, setJoinStatus] = useState<'idle'|'success'|'error'>('idle')
  const [joinMsg, setJoinMsg] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('student')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role') || 'student'
    setIsLoggedIn(!!token)
    setUserRole(role)
    fetchContest(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId])

  const fetchContest = async (token?: string | null) => {
    try {
      const headers: Record<string, string> = {}
      const t = token ?? localStorage.getItem('token')
      if (t) headers['Authorization'] = `Bearer ${t}`
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contests/${contestId}`,
        { headers }
      )
      const data = response.data.data
      setContest(data)
      setIsParticipant(!!data.isParticipant)
      setParticipantCount(data.participantCount ?? 0)
    } catch (err) {
      console.error('Failed to fetch contest:', err)
      toast.error('Failed to load contest details')
    }
  }

  const handleParticipate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to participate')
      return
    }
    setJoining(true)
    setJoinStatus('idle')
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contests/${contestId}/participate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Successfully joined the contest!')
      setIsParticipant(true)
      setParticipantCount(prev => prev + 1)
      setJoinStatus('success')
      setJoinMsg('You have successfully joined!')
      fetchContest(token)
    } catch (error: unknown) {
      const axErr = error as { response?: { data?: { message?: string } } }
      const msg = axErr.response?.data?.message || 'Failed to join contest'
      if (msg.includes('already registered')) {
        setIsParticipant(true)
        setJoinStatus('success')
        setJoinMsg('You are already registered.')
      } else {
        toast.error(msg)
        setJoinStatus('error')
        setJoinMsg(msg)
      }
    } finally {
      setJoining(false)
    }
  }

  if (!contest) return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      <div className="flex items-center justify-center mt-20 gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <div className="text-gray-600">Loading contest...</div>
      </div>
    </div>
  )

  const statusColor = (s?: string) => {
    const v = s?.toLowerCase()
    if (v === 'active' || v === 'ongoing') return 'bg-green-100 text-green-700'
    if (v === 'upcoming') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <TopRankerNavbar />

      {/* Header */}
      <div className="bg-black text-white py-6 px-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          {contest.name}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Contest Info Box */}
        <div className="bg-white border-2 border-gray-300 rounded-lg mb-6 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* Left: Contest Details */}
            <div className="lg:col-span-2 p-6 border-r-2 border-gray-300 space-y-3 text-sm">
              <div><span className="font-bold">Event ID:</span> {contest.eventId}</div>
              <div><span className="font-bold">Organizer:</span> {contest.organizer}</div>
              <div><span className="font-bold">Type:</span> {contest.type}</div>
              <div>
                <span className="font-bold">Status:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(contest.status)}`}>
                  {contest.status}
                </span>
              </div>
              {contest.startDate && (
                <div><span className="font-bold">Start:</span> {new Date(contest.startDate).toLocaleDateString()}</div>
              )}
              {contest.endDate && (
                <div><span className="font-bold">End:</span> {new Date(contest.endDate).toLocaleDateString()}</div>
              )}
              {contest.prize != null && (
                <div><span className="font-bold">Prize:</span> ${contest.prize}</div>
              )}
              <div><span className="font-bold">Participants:</span> {participantCount}</div>
            </div>

            {/* Right: Participate Section */}
            <div className="p-6 bg-gray-100 border-l border-gray-300 flex flex-col items-center justify-center gap-4">
              {userRole === 'admin' ? (
                <>
                  <div className="flex items-center gap-2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg font-semibold w-full justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Admin View Only
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Admins can view all contest details but cannot participate
                  </p>
                  <Link
                    href={`/contests/${contestId}/leaderboard`}
                    className="w-full text-center bg-gray-800 hover:bg-black text-white px-4 py-2 rounded font-medium transition"
                  >
                    View Contest Leaderboard
                  </Link>
                  <Link
                    href="/admin"
                    className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
                  >
                    Manage in Admin Panel
                  </Link>
                </>
              ) : isParticipant ? (
                <>
                  <div className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg font-semibold w-full justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You are participating
                  </div>
                  <Link
                    href={`/contests/${contestId}/leaderboard`}
                    className="w-full text-center bg-gray-800 hover:bg-black text-white px-4 py-2 rounded font-medium transition"
                  >
                    View Contest Leaderboard
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-center text-gray-800">Join this Contest</h3>
                  {!isLoggedIn ? (
                    <Link
                      href="/auth"
                      className="w-full text-center bg-gray-800 hover:bg-black text-white px-6 py-3 rounded font-medium transition"
                    >
                      Login to Participate
                    </Link>
                  ) : (
                    <button
                      onClick={handleParticipate}
                      disabled={joining}
                      className="w-full bg-gray-800 hover:bg-black disabled:opacity-60 text-white px-6 py-3 rounded font-medium transition"
                    >
                      {joining ? 'Joining...' : 'Participate'}
                    </button>
                  )}
                  {joinStatus === 'error' && (
                    <p className="text-xs text-red-600 text-center bg-red-50 border border-red-300 px-3 py-2 rounded w-full">
                      {joinMsg}
                    </p>
                  )}
                  {joinStatus === 'idle' && (
                    <p className="text-xs text-gray-500 text-center">
                      Join to unlock problem submissions
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow">
          {!isParticipant && (
            <div className="bg-yellow-50 border-b-2 border-yellow-300 px-4 py-3 flex items-center gap-2 text-yellow-800 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Join the contest first to access and submit problem solutions.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left font-bold border-r border-gray-300">Problem #</th>
                  <th className="px-3 py-3 text-left font-bold border-r border-gray-300">Problem Name</th>
                  <th className="px-3 py-3 text-left font-bold border-r border-gray-300 w-80">Submit Solution</th>
                  <th className="px-3 py-3 text-center font-bold border-r border-gray-300">
                    My Event Ranking<br />(Dimension Wise)
                  </th>
                  <th className="px-3 py-3 text-center font-bold border-r border-gray-300">
                    My Event Ranking<br />(Problem Wise)
                  </th>
                  <th className="px-3 py-3 text-center font-bold">
                    My Overall<br />Event Ranking
                  </th>
                </tr>
              </thead>
              <tbody>
                {contest.problemDetails?.length ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  contest.problemDetails.map((problem: any, index: number) => (
                    <tr key={problem.problemId} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}`}>
                      <td className="px-3 py-4 border-r border-gray-300 font-medium">
                        {problem.problemId}
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <div className="font-bold">{problem.name}</div>
                        {isParticipant ? (
                          <Link href={`/problems/${problem.problemId}`} className="text-blue-600 hover:underline text-xs">
                            Click here for more info...
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Join to access
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <div className="space-y-2">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {problem.dimensions?.map((dim: any) => (
                            <div key={dim.dimension} className="flex items-center gap-2 text-xs bg-yellow-100 p-2 rounded">
                              <span className="font-medium bg-yellow-200 px-2 py-1 rounded">For D={dim.dimension}</span>
                              {isParticipant ? (
                                <Link
                                  href={`/problems/${problem.problemId}`}
                                  className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 py-1 rounded transition text-center font-medium"
                                >
                                  Go to Problem
                                </Link>
                              ) : (
                                <span className="flex-1 bg-gray-100 border border-gray-300 text-gray-400 px-3 py-1 rounded text-center cursor-not-allowed">
                                  Locked
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <div className="space-y-2 text-center">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {problem.dimensions?.map((dim: any) => (
                            <div key={dim.dimension} className="text-xs">
                              <div className="font-bold">-</div>
                              {isParticipant && (
                                <Link href={`/problems/${problem.problemId}/submissions`} className="text-blue-600 hover:underline block">
                                  view submissions
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300 text-center">
                        <div className="font-bold text-lg">-</div>
                        <Link href={`/problems/${problem.problemId}/leaderboard`} className="text-blue-600 hover:underline text-xs block mt-1">
                          View problem ranking
                        </Link>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="font-bold text-lg">-</div>
                        <Link href={`/contests/${contestId}/leaderboard`} className="text-blue-600 hover:underline text-xs block mt-1">
                          View event leaderboard
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No problems in this contest yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}