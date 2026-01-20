'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'
import Link from 'next/link'

export default function ProblemDetailsPage() {
  const params = useParams()
  const problemId = params.id
  
  const [problem, setProblem] = useState<any>(null)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}`)
      .then(res => setProblem(res.data.data))
      .catch(err => {
        console.error(err)
        setProblem({
          problemId: '302',
          name: 'Ackley Function Optimization',
          description: 'The Ackley function is a widely used benchmark function for testing optimization algorithms. It is characterized by a nearly flat outer region and a large hole at the center. The function poses a risk for optimization algorithms, particularly hill-climbing algorithms, to be trapped in one of its many local minima.',
          owner: 'JC Bansal, SAU, New Delhi',
          ownerName: 'JC Bansal',
          ownerInstitution: 'SAU, New Delhi',
          cc: '🇮🇳',
          type: 'Multi-Modal, Continuous, Differentiable',
          level: 'Easy',
          submissionDate: '23 Dec 2017',
          totalSubmissions: 95,
          fitnessFunction: {
            formula: 'f(x) = -20e^(-0.02√(1/D∑x_i²)) - e^(1/D∑cos(2πx_i)) + 20 + e',
            constraint: 'subject to -35 ≤ x_i ≤ 35. The global minimum is located at origin x* = (0,...,0) with f(x*) = 0.',
            codeFiles: {
              python: 'ackley.py',
              java: 'Ackley.java',
              cpp: 'ackley.cpp',
              c: 'ackley.c'
            }
          },
          dimensions: [
            { dimension: 20, submissions: 36 },
            { dimension: 50, submissions: 34 },
            { dimension: 100, submissions: 25 }
          ]
        })
      })
  }, [problemId])

  if (!problem) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading problem...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      
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
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              {/* Problem Header */}
              <div className="p-6 border-b-2 border-gray-300">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-black">{problem.name}</h2>
                  <div className="text-2xl">{problem.cc}</div>
                </div>
                
                <div className="space-y-2 text-black">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Problem #:</span>
                    <span>{problem.problemId}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">Owner:</span>
                    <span>{problem.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Type:</span>
                    <span>{problem.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Submission Date:</span>
                    <span>{problem.submissionDate || new Date(problem.submissionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Total Submissions:</span>
                    <span>{problem.totalSubmissions} ({problem.dimensions?.map((d: any) => d.submissions).join(' + ')})</span>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="p-6 border-b-2 border-gray-300">
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
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Python
                        </a>
                        <span className="text-black">,</span>
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Java
                        </a>
                        <span className="text-black">,</span>
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          C++
                        </a>
                        <span className="text-black">,</span>
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          C
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Back to Problem Button */}
              <div className="p-6">
                <Link 
                  href={`/problems/${problemId}`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition block text-center"
                >
                  Go to Problem Submission Page
                </Link>
              </div>
            </div>
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
