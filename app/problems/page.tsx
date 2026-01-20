"use client";

import TopRankerNavbar from "@/components/navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRankings, setUserRankings] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    fetchProblems();
    
    if (token) {
      fetchUserRankings();
    }
  }, [currentPage, difficulty]);

  const fetchUserRankings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems/user/rankings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserRankings(response.data.data || {});
    } catch (error) {
      console.error('Failed to fetch user rankings:', error);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problems`, {
        params: {
          page: currentPage,
          limit: 10,
          difficulty: difficulty
        }
      });
      setProblems(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      setProblems([
        {
          problemId: "302",
          name: "Opti1",
          level: "Easy",
          cc: "��",
          owner: "JC Bansal, SAU, New Delhi.",
          dimensions: [
            { dimension: 20, submissions: 36 },
            { dimension: 50, submissions: 34 },
            { dimension: 100, submissions: 25 },
          ],
          totalSubmissions: 95,
        },
        {
          problemId: "301",
          name: "Opti2",
          level: "Medium",
          cc: "��",
          owner: "MK Tiwari, IIT Kgp.",
          dimensions: [
            { dimension: 20, submissions: 36 },
            { dimension: 50, submissions: 34 },
            { dimension: 100, submissions: 25 },
          ],
          totalSubmissions: 95,
        },
        {
          problemId: "300",
          name: "Opti3",
          level: "Hard",
          cc: "��",
          owner: "Manoj Thakur, IIT Mandi.",
          dimensions: [
            { dimension: 20, submissions: 36 },
            { dimension: 50, submissions: 34 },
            { dimension: 100, submissions: 25 },
          ],
          totalSubmissions: 95,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSolveProblem = (problemId: string) => {
    if (!isAuthenticated) {
      alert('Please login to solve problems!');
      router.push('/auth');
      return;
    }
    router.push(`/problems/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-black text-white px-6 py-3 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <h1 className="text-2xl font-bold">Problems</h1>
        </div>

        {/* Pagination and Filters */}
        <div className="flex items-center justify-between mb-6">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">
              &lt;
            </button>
            <span className="px-3 py-1 text-gray-700">Previous</span>
            <button className="px-3 py-1 bg-blue-500 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">4</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">5</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">6</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">7</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">8</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">9</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">10</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">11</button>
            <span className="px-3 py-1 text-gray-700">Next</span>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">
              &gt;
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-6 text-black">
            {/* Difficulty Filter */}
            <div className="bg-white border border-gray-300 px-4 py-2 rounded">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 text-sm" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Difficulty</span>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="difficulty" checked={difficulty === "All"} onChange={() => setDifficulty("All")} />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="difficulty" checked={difficulty === "Easy"} onChange={() => setDifficulty("Easy")} />
                    <span>Easy</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="difficulty" checked={difficulty === "Medium"} onChange={() => setDifficulty("Medium")} />
                    <span>Medium</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="difficulty" checked={difficulty === "Hard"} onChange={() => setDifficulty("Hard")} />
                    <span>Hard</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white border border-gray-300 px-4 py-2 rounded">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 text-sm" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Status</span>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="status" checked={status === "All"} onChange={() => setStatus("All")} />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="status" checked={status === "Solved"} onChange={() => setStatus("Solved")} />
                    <span>Solved</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="status" checked={status === "Unsolved"} onChange={() => setStatus("Unsolved")} />
                    <span>Unsolved</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sorted By */}
            <button className="bg-white border border-gray-300 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">
              Sorted By
            </button>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white border border-black overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 border-b border-black">
                <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Problem #</th>
                <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Problem Name</th>
                <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Level</th>
                <th className="px-4 py-3 text-center font-bold text-black border-r border-black">CC</th>
                <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Owner</th>
                <th className="px-4 py-3 text-left font-bold text-black border-r border-black">Problem Dimension</th>
                <th className="px-4 py-3 text-center font-bold text-black border-r border-black">Total Participations (Problem Dim Wise)</th>
                {isAuthenticated && (
                  <th className="px-4 py-3 text-center font-bold text-black border-r border-black">My Ranking</th>
                )}
                <th className="px-4 py-3 text-center font-bold text-black">Total Participations (Problem Wise)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAuthenticated ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                    Loading problems...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={isAuthenticated ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                    No problems found
                  </td>
                </tr>
              ) : (
                problems.map((problem, index) => (
                  <tr key={problem.problemId} className={`border-b border-black ${index % 2 === 0 ? "bg-[#f5f5dc]" : "bg-[#e6f3ff]"}`}>
                    <td className="px-4 py-6 font-bold text-black border-r border-black align-top">{problem.problemId}</td>
                    <td className="px-4 py-6 border-r border-black align-top">
                      <div className="font-bold text-black">{problem.name}</div>
                      <Link href={`/problems/${problem.problemId}`} className="text-blue-600 text-xs hover:underline">
                        Click here for More info...
                      </Link>
                    </td>
                    <td className="px-4 py-6 font-bold text-black border-r border-black align-top">{problem.level}</td>
                    <td className="px-4 py-6 text-center border-r border-black align-top text-2xl">{problem.cc}</td>
                    <td className="px-4 py-6 text-black border-r border-black align-top text-sm">
                      {problem.owner}
                    </td>
                    <td className="px-4 py-6 border-r border-black align-top">
                      {problem.dimensions?.map((dim: any, i: number) => (
                        <div key={i} className={`px-2 py-2 text-sm text-black ${i < problem.dimensions.length - 1 ? "border-b border-gray-300" : ""}`}>
                          D={dim.dimension}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-6 border-r border-black align-top">
                      {problem.dimensions?.map((dim: any, i: number) => (
                        <div key={i} className={`px-2 py-2 text-center text-sm text-black ${i < problem.dimensions.length - 1 ? "border-b border-gray-300" : ""}`}>
                          {dim.submissions}
                        </div>
                      ))}
                    </td>
                    {isAuthenticated && (
                      <td className="px-4 py-6 border-r border-black align-top">
                        {problem.dimensions?.map((dim: any, i: number) => {
                          const problemRanking = userRankings[problem.problemId];
                          const dimensionRank = problemRanking?.dimension_ranks?.[dim.dimension];
                          const dimensionTotal = problemRanking?.dimension_totals?.[dim.dimension];
                          return (
                            <div key={i} className={`px-2 py-2 text-center text-sm font-semibold ${i < problem.dimensions.length - 1 ? "border-b border-gray-300" : ""}`}>
                              {dimensionRank ? (
                                <span className="text-blue-600">#{dimensionRank}{dimensionTotal ? `/${dimensionTotal}` : ''}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          );
                        })}
                      </td>
                    )}
                    <td className="px-4 py-6 align-top">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="font-bold text-black text-lg mb-2">{problem.totalSubmissions || 0}</div>
                        <Link href={`/problems/${problem.problemId}/leaderboard`} className="text-blue-600 text-xs hover:underline mb-3">
                          View all rankers of the Problem
                        </Link>
                        <button 
                          onClick={() => handleSolveProblem(problem.problemId)}
                          className="bg-gray-200 border border-black px-4 py-1.5 rounded text-black text-sm font-medium hover:bg-gray-300"
                        >
                          Solve Problem
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}