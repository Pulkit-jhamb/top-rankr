'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'
import Link from 'next/link'

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.id
  
  const [problem, setProblem] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRankings, setUserRankings] = useState<any>({})
  const [solutions, setSolutions] = useState<any>({})
  const [submitting, setSubmitting] = useState<any>({})
  const [messages, setMessages] = useState<any>({})
  const [allUserRankings, setAllUserRankings] = useState<any>({})

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Fetch problem details
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}`)
      .then(res => setProblem(res.data.data))
      .catch(err => {
        console.error(err)
        // For demo purposes, use mock data if API fails
        setProblem({
          problemId: '302',
          name: 'Optimization 1',
          description: 'Asd ad ad asd asda sdsad asd asd asdsad asd asdas asd asd asd adasd ad sada d asd asd ad asd adassd asd asd ad ad asd sad ad sfads adasfrdfsdfae a asd sfgsdf asdssad ad adsadfreefvcac adsdafafg',
          owner: 'JC Bansal, SAU, New Delhi',
          ownerName: 'JC Bansal',
          ownerInstitution: 'SAU, New Delhi',
          type: 'Multi Model, Constraint, Multi Dimentional',
          level: 'Easy',
          submissionDate: '23 Dec 2017',
          totalSubmissions: '95 (36 + 34 + 25)',
          fitnessFunction: {
            formula: 'f(x) = -20e^(-0.02√(1/D∑x_i²)) - e^(1/D∑cos(2πx_i)) + 20 + e',
            constraint: 'subject to -35 ≤ x_i ≤ 35. The global minimum is located at origin x* = (0,...,0) with f(x*) = 0.',
          },
          dimensions: [
            { dimension: 20, submissions: 36 },
            { dimension: 50, submissions: 34 },
            { dimension: 100, submissions: 25 }
          ],
          topRankers: {
            20: [
              { rank: 1, username: '', country: '' },
              { rank: 2, username: '', country: '' },
              { rank: 3, username: '', country: '' }
            ],
            50: [
              { rank: 1, username: '', country: '' },
              { rank: 2, username: '', country: '' },
              { rank: 3, username: '', country: '' }
            ],
            100: [
              { rank: 1, username: '', country: '' },
              { rank: 2, username: '', country: '' },
              { rank: 3, username: '', country: '' }
            ]
          }
        })
      })
    
    // Fetch user rankings if authenticated
    if (token) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/user/rankings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          setUserRankings(res.data.data || {});
        })
        .catch(err => {
          console.error('Failed to fetch user rankings:', err);
        });
    }
  }, [problemId])

  const handleSolutionChange = (dimension: number, value: string) => {
    setSolutions((prev: any) => ({
      ...prev,
      [dimension]: value
    }));
  };

  const handleSubmit = async (dimension: number) => {
    console.log('Submit clicked for dimension:', dimension);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Solution value:', solutions[dimension]);
    
    if (!isAuthenticated) {
      setMessages((prev: any) => ({ ...prev, [dimension]: 'Please login to submit!' }));
      setTimeout(() => router.push('/auth'), 2000);
      return;
    }

    const solutionArray = solutions[dimension]?.trim();
    if (!solutionArray) {
      setMessages((prev: any) => ({ ...prev, [dimension]: 'Please enter a solution array!' }));
      return;
    }

    setSubmitting((prev: any) => ({ ...prev, [dimension]: true }));
    setMessages((prev: any) => ({ ...prev, [dimension]: 'Submitting...' }));
    
    try {
      console.log('Sending submission to:', `${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}/submit`);
      console.log('Payload:', { solution: solutionArray, dimension });
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}/submit`,
        {
          solution: solutionArray,
          dimension: dimension
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log('Submission response:', response.data);
      
      setMessages((prev: any) => ({ 
        ...prev, 
        [dimension]: `✓ Success! Score: ${response.data.score?.toFixed(6) || 'N/A'}` 
      }));
      setSolutions((prev: any) => ({ ...prev, [dimension]: '' }));
      
      // Refresh rankings after successful submission
      const token = localStorage.getItem('token');
      if (token) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/user/rankings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            setUserRankings(res.data.data || {});
          })
          .catch(err => {
            console.error('Failed to fetch user rankings:', err);
          });
      }
      
      setTimeout(() => {
        setMessages((prev: any) => ({ ...prev, [dimension]: '' }));
      }, 5000);
    } catch (error: any) {
      console.error('Submission error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);
      console.error('Full error:', JSON.stringify(error.response?.data, null, 2));
      
      const errorMsg = error.response?.data?.message || error.message || 'Submission failed!';
      setMessages((prev: any) => ({ 
        ...prev, 
        [dimension]: `✗ Error: ${errorMsg}` 
      }));
    } finally {
      setSubmitting((prev: any) => ({ ...prev, [dimension]: false }));
    }
  };

  if (!problem) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading problem...</div>
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
                  <span className="font-bold">Submission Date:</span> {problem.submissionDate || new Date(problem.submissionDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-bold">Total Submissions:</span> {problem.totalSubmissions} ({problem.dimensions?.map((d: any) => d.submissions).join(' + ')})
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-black">Optimization 1</h3>
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
                <div className="flex flex-wrap gap-2">
                  {problem.fitnessFunction?.codeFiles && (
                    <>
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">Python</a>
                      <span className="text-black">,</span>
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">Java</a>
                      <span className="text-black">,</span>
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">C++</a>
                      <span className="text-black">,</span>
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">C</a>
                    </>
                  )}
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
                  {problem.dimensions?.map((dim: any, index: number) => (
                    <tr key={dim.dimension} className={`border-b-2 border-black ${index % 2 === 0 ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={problem.dimensions.length} className="px-4 py-6 font-bold text-center border-r-2 border-black align-top">
                            {problem.problemId}
                          </td>
                          <td rowSpan={problem.dimensions.length} className="px-4 py-6 border-r-2 border-black align-top">
                            <div className="font-bold text-sm">{problem.name}</div>
                          </td>
                          <td rowSpan={problem.dimensions.length} className="px-4 py-6 text-center text-2xl border-r-2 border-black align-top">
                            {problem.cc}
                          </td>
                          <td rowSpan={problem.dimensions.length} className="px-4 py-6 text-sm border-r-2 border-black align-top">
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
                            <div className={`text-xs ${messages[dim.dimension].includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                              {messages[dim.dimension]}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center border-r-2 border-black">
                        <div className="text-sm font-bold">
                          {userRankings[String(problemId)]?.dimension_ranks?.[dim.dimension] ? (
                            `#${userRankings[String(problemId)].dimension_ranks[dim.dimension]}${userRankings[String(problemId)]?.dimension_totals?.[dim.dimension] ? `/${userRankings[String(problemId)].dimension_totals[dim.dimension]}` : ''}`
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <Link href={`/problems/${problemId}/submissions`} className="text-blue-600 hover:underline text-xs">
                          view all my submissions
                        </Link>
                      </td>
                      {index === 0 && (
                        <td rowSpan={problem.dimensions.length} className="px-4 py-6 text-center align-top">
                          <div className="text-sm font-bold mb-2">
                            {userRankings[String(problemId)]?.overall_rank ? (
                              `#${userRankings[String(problemId)].overall_rank}${userRankings[String(problemId)]?.total_participants ? `/${userRankings[String(problemId)].total_participants}` : ''}`
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
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
                    {problem.dimensions?.map((dim: any) => (
                      <tr key={dim.dimension} className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium">For D={dim.dimension}</td>
                        <td className="px-4 py-3 text-center text-gray-400">-</td>
                        <td className="px-4 py-3 text-center text-gray-400">-</td>
                        <td className="px-4 py-3 text-center text-gray-400">-</td>
                      </tr>
                    ))}
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