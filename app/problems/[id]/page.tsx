'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import api from '@/lib/api'
import TopRankerNavbar from '@/components/navbar'
import Link from 'next/link'

interface DimRanking {
  best_scores: Record<string, number>;
  ranks: Record<string, number>;
  total_participants: Record<string, number>;
}

interface Dimension {
  dimension: number;
  submissions: number;
}

interface FitnessFunction {
  formula?: string;
  constraint?: string;
  codeFiles?: boolean;
}

interface LeaderboardEntry {
  name: string;
  country?: string;
  score?: number;
}

interface Problem {
  problemId: string;
  name: string;
  description?: string;
  owner?: string;
  type?: string;
  cc?: string;
  submissionDate?: string;
  totalSubmissions?: number;
  fitnessFunction?: FitnessFunction;
  dimensions?: Dimension[];
}

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.id

  const [problem, setProblem] = useState<Problem | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [isAuthenticated] = useState(() =>
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
  )
  const [userRankings, setUserRankings] = useState<Record<string, DimRanking>>({})
  const [solutions, setSolutions] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({})
  const [messages, setMessages] = useState<Record<number, string>>({})
  const [leaderboardByDim, setLeaderboardByDim] = useState<Record<number, LeaderboardEntry[]>>({})

  const refreshUserRankings = useCallback(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics/user/${userId}`)
      .then(res => setUserRankings(res.data.data?.user?.problem_rankings || {}))
      .catch(err => console.error('Failed to fetch user rankings:', err));
  }, []);

  useEffect(() => {
    // Fetch problem details
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}`)
      .then(res => {
        const p = res.data.data;
        setProblem(p);
        // Fetch top 3 leaderboard for each dimension in parallel
        if (p?.dimensions?.length) {
          const dimFetches = p.dimensions.map((d: { dimension: number }) =>
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}/leaderboard`, {
              params: { dimension: d.dimension, limit: 3 }
            }).then(r => ({ dim: d.dimension, data: r.data.data || [] }))
              .catch(() => ({ dim: d.dimension, data: [] }))
          );
          Promise.all(dimFetches).then(results => {
            const byDim: Record<number, LeaderboardEntry[]> = {};
            results.forEach(r => { byDim[r.dim] = r.data; });
            setLeaderboardByDim(byDim);
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch problem:', err);
        setFetchError(err.response?.data?.message || 'Failed to load problem. Please try again.');
      });

    if (isAuthenticated) refreshUserRankings();
  }, [problemId, isAuthenticated, refreshUserRankings])

  const handleSolutionChange = (dimension: number, value: string) => {
    setSolutions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const handleSubmit = async (dimension: number) => {
    if (!isAuthenticated) {
      setMessages(prev => ({ ...prev, [dimension]: 'Please login to submit!' }));
      setTimeout(() => router.push('/auth'), 2000);
      return;
    }

    const rawInput = solutions[dimension]?.trim();
    if (!rawInput) {
      setMessages(prev => ({ ...prev, [dimension]: 'Please enter a solution array!' }));
      return;
    }

    // Parse comma- or space-separated floats into an array
    const xValues = rawInput.split(/[\s,]+/).filter(Boolean).map(Number);
    if (xValues.some(v => !isFinite(v))) {
      setMessages(prev => ({ ...prev, [dimension]: '✗ Error: All values must be valid numbers.' }));
      return;
    }
    if (xValues.length !== dimension) {
      setMessages(prev => ({ ...prev, [dimension]: `✗ Error: Expected ${dimension} values, got ${xValues.length}.` }));
      return;
    }

    setSubmitting(prev => ({ ...prev, [dimension]: true }));
    setMessages(prev => ({ ...prev, [dimension]: 'Submitting...' }));

    try {
      const response = await api.post(
        `/api/problems/${problemId}/submit`,
        { x: xValues, dimension }
      );

      const { score, rank, submissions_remaining } = response.data;
      setMessages(prev => ({
        ...prev,
        [dimension]: `✓ Score: ${score?.toFixed(4) ?? 'N/A'} | Rank: ${rank ?? '-'} | ${submissions_remaining ?? '?'} submissions left today`
      }));
      setSolutions(prev => ({ ...prev, [dimension]: '' }));
      refreshUserRankings();

      setTimeout(() => setMessages(prev => ({ ...prev, [dimension]: '' })), 7000);
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      const errorMsg = axiosErr.response?.data?.message || 'Submission failed!';
      setMessages(prev => ({ ...prev, [dimension]: `✗ Error: ${errorMsg}` }));
    } finally {
      setSubmitting(prev => ({ ...prev, [dimension]: false }));
    }
  };

  if (fetchError) return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Failed to load problem</div>
          <div className="text-gray-500 text-sm mb-4">{fetchError}</div>
          <button onClick={() => router.back()} className="text-blue-600 underline text-sm">Go back</button>
        </div>
      </div>
    </div>
  )

  if (!problem) return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      <div className="flex items-center justify-center mt-20 gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <div className="text-gray-600">Loading problem...</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      {/* Header Banner */}
      <div className="bg-black text-white py-6 px-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Problems
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Problem Details */}
          <div className="lg:col-span-2">
            {/* Problem Info Card */}
            <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">{problem.name}</h2>
                <div className="text-2xl">{problem.cc}</div>
              </div>
              
              <div className="space-y-2 text-black text-sm">
                <div>
                  <span className="font-bold">Problem #:</span> {problem.problemId}
                </div>
                <div>
                  <span className="font-bold">Owner:</span> {problem.owner}
                </div>
                <div>
                  <span className="font-bold">Type:</span> {problem.type}
                </div>
                <div>
                  <span className="font-bold">Submission Date:</span>{' '}
                  {problem.submissionDate
                    ? (isNaN(Date.parse(problem.submissionDate))
                        ? problem.submissionDate
                        : new Date(problem.submissionDate).toLocaleDateString())
                    : 'N/A'}
                </div>
                <div>
                  <span className="font-bold">Total Submissions:</span> {problem.totalSubmissions} ({problem.dimensions?.map((d: Dimension) => d.submissions).join(' + ')})
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-black">{problem.name}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {problem.description}
              </p>

              {/* Fitness Function Formula */}
              {problem.fitnessFunction && (
                <div className="bg-gray-50 p-4 rounded border mb-6">
                  <div className="mb-4 text-center">
                    <p className="font-mono text-lg text-black">
                      {problem.fitnessFunction.formula}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    {problem.fitnessFunction.constraint}
                  </p>
                </div>
              )}

              {/* Download Links */}
              <div className="mt-6">
                <p className="font-bold mb-3 text-black">Download Fitness Function Code:</p>
                <div className="flex items-start gap-4 flex-wrap">
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}/fitness-code`}
                    download
                    className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 border border-gray-400 text-black px-4 py-2 rounded font-medium transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Python
                  </a>
                  <div className="bg-blue-50 border border-blue-300 rounded px-4 py-2 text-sm">
                    <p className="font-semibold text-blue-900 mb-1">📝 Input Format:</p>
                    <p className="text-blue-800">Enter values separated by commas or spaces</p>
                    <p className="text-blue-700 text-xs mt-1">Example: <code className="bg-blue-100 px-1 rounded font-mono">1.5, 2.3, -0.8</code></p>
                    <p className="text-red-600 text-xs font-semibold mt-1">⚠️ Do NOT use square brackets [ ]</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <table className="w-full text-black">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-black">
                    <th className="px-4 py-3 text-left font-bold border-r-2 border-black">Problem #</th>
                    <th className="px-4 py-3 text-left font-bold border-r-2 border-black">Problem Name</th>
                    <th className="px-4 py-3 text-center font-bold border-r-2 border-black">CC</th>
                    <th className="px-4 py-3 text-left font-bold border-r-2 border-black">Owner</th>
                    <th className="px-4 py-3 text-center font-bold border-r-2 border-black">Submit Solution</th>
                    <th className="px-4 py-3 text-center font-bold border-r-2 border-black">My Ranking<br/>(Problem Dimension Wise)</th>
                    <th className="px-4 py-3 text-center font-bold">My Ranking<br/>(Problem Wise)</th>
                  </tr>
                </thead>
                <tbody>
                  {problem.dimensions?.map((dim: Dimension, index: number) => (
                    <tr key={dim.dimension} className={`border-b-2 border-black ${index % 2 === 0 ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={problem.dimensions?.length ?? 1} className="px-4 py-6 font-bold text-center border-r-2 border-black align-top">
                            {problem.problemId}
                          </td>
                          <td rowSpan={problem.dimensions?.length ?? 1} className="px-4 py-6 border-r-2 border-black align-top">
                            <div className="font-bold text-sm">{problem.name}</div>
                          </td>
                          <td rowSpan={problem.dimensions?.length ?? 1} className="px-4 py-6 text-center text-2xl border-r-2 border-black align-top">
                            {problem.cc}
                          </td>
                          <td rowSpan={problem.dimensions?.length ?? 1} className="px-4 py-6 text-sm border-r-2 border-black align-top">
                            {problem.owner}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-4 border-r-2 border-black">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">For D={dim.dimension}</div>
                          <input
                            type="text"
                            value={solutions[dim.dimension] || ''}
                            onChange={(e) => handleSolutionChange(dim.dimension, e.target.value)}
                            placeholder="Solution"
                            disabled={!isAuthenticated}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmit(dim.dimension)}
                              disabled={!isAuthenticated || submitting[dim.dimension]}
                              className="bg-gray-200 hover:bg-gray-300 border border-black px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                            >
                              {submitting[dim.dimension] ? 'Submitting...' : 'Submit'}
                            </button>
                          </div>
                          {messages[dim.dimension] && (
                            <div className={`text-xs ${messages[dim.dimension].startsWith('✓') ? 'text-green-600' : messages[dim.dimension] === 'Submitting...' ? 'text-blue-600' : 'text-red-600'}`}>
                              {messages[dim.dimension]}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center border-r-2 border-black">
                        <div className="text-sm font-bold">
                          {userRankings[String(problemId)]?.ranks?.[String(dim.dimension)] ? (
                            <span className="text-blue-600">
                              #{userRankings[String(problemId)].ranks[String(dim.dimension)]}
                              {userRankings[String(problemId)]?.total_participants?.[String(dim.dimension)]
                                ? `/${userRankings[String(problemId)].total_participants[String(dim.dimension)]}`
                                : ''}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <Link href={`/problems/${problemId}/submissions`} className="text-blue-600 hover:underline text-xs">
                          view all my submissions
                        </Link>
                      </td>
                      {index === 0 && (
                        <td rowSpan={problem.dimensions?.length ?? 1} className="px-4 py-6 text-center align-top">
                          <div className="text-sm font-bold mb-2">
                            {(() => {
                              const pr = userRankings[String(problemId)];
                              if (!pr?.ranks) return <span className="text-gray-400">-</span>;
                              const ranks = Object.values(pr.ranks) as number[];
                              if (!ranks.length) return <span className="text-gray-400">-</span>;
                              const best = Math.min(...ranks);
                              return <span className="text-blue-600">#{best}</span>;
                            })()}
                          </div>
                          <Link href={`/problems/${problemId}/leaderboard`} className="text-blue-600 hover:underline text-xs">
                            View all rankers of the Problem
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded text-center">
                <button onClick={() => router.push('/auth')} className="text-blue-600 underline font-bold">
                  Please login
                </button> to submit solutions and view your rankings
              </div>
            )}
          </div>

          {/* Right Column - Top Rankers */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm overflow-hidden sticky top-6">
              <div className="bg-gray-100 px-4 py-3 border-b-2 border-gray-300">
                <h2 className="font-bold text-lg text-black">Top Ranker:</h2>
              </div>

              {/* Ranker Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-black">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="px-4 py-3 text-left font-bold bg-gray-50">
                        Rank/ Problem Dimension
                      </th>
                      <th className="px-4 py-3 text-center font-bold bg-gray-50">
                        1<sup>st</sup> Position
                      </th>
                      <th className="px-4 py-3 text-center font-bold bg-gray-50">
                        2<sup>nd</sup> Position
                      </th>
                      <th className="px-4 py-3 text-center font-bold bg-gray-50">
                        3<sup>rd</sup> Position
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {problem.dimensions?.map((dim: Dimension) => {
                      const topThree = leaderboardByDim[dim.dimension] || [];
                      return (
                        <tr key={dim.dimension} className="border-b border-gray-200">
                          <td className="px-4 py-3 font-medium">For D={dim.dimension}</td>
                          {[0, 1, 2].map(pos => (
                            <td key={pos} className="px-4 py-3 text-center text-sm">
                              {topThree[pos] ? (
                                <div>
                                  <div className="font-medium text-black">{topThree[pos].name}</div>
                                  <div className="text-gray-500 text-xs">{topThree[pos].country || ''}</div>
                                </div>
                              ) : <span className="text-gray-400">-</span>}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* View All Link */}
              <div className="p-4 border-t-2 border-gray-300 bg-gray-50">
                <Link 
                  href={`/problems/${problemId}/leaderboard`}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  View all rankers of the Problem →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}