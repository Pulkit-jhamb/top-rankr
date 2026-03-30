"use client";

import TopRankerNavbar from "@/components/navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [problems, setProblems] = useState<any[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
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
          limit: 20,
          difficulty: difficulty === 'All' ? undefined : difficulty
        }
      });
      const problemsData = response.data.data || [];
      setProblems(problemsData);
      setFilteredProblems(problemsData);
      
      // Set pagination info from response
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1);
        setTotalProblems(response.data.pagination.total || 0);
      } else {
        setTotalPages(1);
        setTotalProblems(response.data.data?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      setProblems([]);
      setFilteredProblems([]);
      setTotalPages(1);
      setTotalProblems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProblems(problems);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = problems.filter(problem => 
      problem.name?.toLowerCase().includes(lowercaseQuery) ||
      problem.problemId?.toString().includes(lowercaseQuery) ||
      problem.owner?.toLowerCase().includes(lowercaseQuery) ||
      problem.level?.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredProblems(filtered);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 11;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 6) {
        for (let i = 1; i <= 9; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 5) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 8; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 3; i <= currentPage + 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search problems by name, ID, owner, or difficulty..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Pagination and Filters */}
        <div className="flex items-center justify-between mb-6">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &lt;&lt;
            </button>
            <button 
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-700">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-1 rounded font-medium ${
                    currentPage === page 
                      ? 'bg-blue-500 text-white' 
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &gt;&gt;
            </button>
            
            <span className="ml-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalProblems} total)
            </span>
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
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={isAuthenticated ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                    {searchQuery ? `No problems found matching "${searchQuery}"` : 'No problems found'}
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem, index) => (
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