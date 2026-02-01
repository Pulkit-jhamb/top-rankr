'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import TopRankerNavbar from '@/components/navbar'

export default function ContestDetailPage() {
  const params = useParams()
  const contestId = params.id
  const [contest, setContest] = useState<any>(null)
  const [eventCode, setEventCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests/${contestId}`);
      setContest(response.data.data);
    } catch (err) {
      console.error('Failed to fetch contest:', err);
      toast.error('Failed to load contest details');
    }
  }

  const handleParticipate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to participate');
      return;
    }

    if (!eventCode.trim()) {
      toast.error('Please enter event code');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contests/${contestId}/participate`,
        { eventCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Successfully joined the contest!');
      setShowCodeInput(false);
      fetchContest();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join contest');
    }
  }

  if (!contest) return <div className="p-8 text-center">Loading contest...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      {/* Header */}
      <div className="bg-black text-white py-6 px-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          Contests
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Contest Info Box */}
        <div className="bg-white border-2 border-gray-300 rounded-lg mb-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left: Contest Details */}
            <div className="lg:col-span-2 p-6 border-r-2 border-gray-300">
              <div className="space-y-3">
                <div>
                  <span className="font-bold">Event ID:</span> {contest.eventId}
                </div>
                <div>
                  <span className="font-bold">Organizer:</span> {contest.organizer}
                </div>
                <div>
                  <span className="font-bold">Type:</span> {contest.type}
                </div>
                <div>
                  <span className="font-bold">From:</span> {contest.from}
                </div>
                <div>
                  <span className="font-bold">Price:</span> {contest.price}
                </div>
              </div>
            </div>

            {/* Right: Participate Section */}
            <div className="p-6 bg-blue-50 flex flex-col items-center justify-center">
              <h3 className="font-bold mb-4 text-center">To Participate</h3>
              {!showCodeInput ? (
                <button
                  onClick={() => setShowCodeInput(true)}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded font-medium transition mb-3"
                >
                  Enter Event Code
                </button>
              ) : (
                <div className="w-full space-y-3">
                  <input
                    type="text"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                    placeholder="Event Code"
                    className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    onClick={handleParticipate}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  >
                    Participate
                  </button>
                </div>
              )}
              <div className="text-center text-sm mt-4 text-gray-600">
                Contact organizers for Event Code
              </div>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr className="bg-gray-200">
                  <th className="px-3 py-3 text-left font-bold border-r border-gray-300">Problem #</th>
                  <th className="px-3 py-3 text-left font-bold border-r border-gray-300">Problem Name</th>
                  <th className="px-3 py-3 text-left font-bold border-r border-gray-300 w-80">Submit Solution</th>
                  <th className="px-3 py-3 text-center font-bold border-r border-gray-300">
                    My Event Ranking<br />(Problem Dimention Wise)
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
                {contest.problemDetails?.map((problem: any, index: number) => (
                  <tr key={problem.problemId} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}`}>
                    <td className="px-3 py-4 border-r border-gray-300 font-medium">
                      {problem.problemId}
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <div className="font-bold">{problem.name}</div>
                      <a href={`/problems/${problem.problemId}`} className="text-blue-600 hover:underline text-xs">
                        Click here for More info...
                      </a>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <div className="space-y-2">
                        {problem.dimensions?.map((dim: any) => (
                          <div key={dim.dimension} className="flex items-center gap-2 text-xs bg-yellow-100 p-2 rounded">
                            <span className="font-medium bg-yellow-200 px-2 py-1 rounded">For D={dim.dimension}</span>
                            <a 
                              href={`/problems/${problem.problemId}`}
                              className="flex-1 bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded transition text-center"
                            >
                              Go to Problem
                            </a>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <div className="space-y-2 text-center">
                        {problem.dimensions?.map((dim: any) => (
                          <div key={dim.dimension} className="text-xs">
                            <div className="font-bold">-</div>
                            <a href={`/problems/${problem.problemId}`} className="text-blue-600 hover:underline block">view submissions</a>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300 text-center">
                      <div className="font-bold text-lg">-</div>
                      <a href={`/problems/${problem.problemId}`} className="text-blue-600 hover:underline text-xs block mt-1">
                        View all rankers
                      </a>
                    </td>
                    <td className="px-3 py-4 text-center">
                      {index === 0 && (
                        <div>
                          <div className="font-bold text-lg">-</div>
                          <a href={`/contests/${contestId}/leaderboard`} className="text-blue-600 hover:underline text-xs block mt-1">
                            View event leaderboard
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}