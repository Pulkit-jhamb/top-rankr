'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'

interface Contest {
  eventId: string
  cc: string
  name: string
  confHomePage?: string
  organizer: string
  type: string
  startDate?: string
  endDate?: string
  prize?: string
  status?: string
  problems?: string[]
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalContests, setTotalContests] = useState(0)
  const [filter, setFilter] = useState('all') // all, open, class, conference

  useEffect(() => {
    fetchContests();
  }, [currentPage, filter]);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests`, {
        params: {
          page: currentPage,
          limit: 20,
          type: filter === 'all' ? undefined : filter === 'conference' ? 'Conference Event' : filter === 'class' ? 'Class Test' : filter === 'open' ? 'Open to All' : undefined
        }
      });
      setContests(response.data.data || []);
      
      // Set pagination info from response
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1);
        setTotalContests(response.data.pagination.total || 0);
      } else {
        // Fallback if pagination not provided
        setTotalPages(1);
        setTotalContests(response.data.data?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch contests:', err);
      setContests([]);
      setTotalPages(1);
      setTotalContests(0);
    } finally {
      setLoading(false);
    }
  }

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
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
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

  // Removed loading screen - data loads inline

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
        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-6 text-black items-center">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &lt;&lt;
          </button>
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={`px-4 py-2 rounded ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white' 
                    : 'border hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &gt;&gt;
          </button>
          
          <span className="ml-4 text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalContests} total contests)
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 text-black">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-300 font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded ${filter === 'open' ? 'bg-gray-300 font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Open to All
          </button>
          <button 
            onClick={() => setFilter('class')}
            className={`px-4 py-2 rounded ${filter === 'class' ? 'bg-gray-300 font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Class Test
          </button>
          <button 
            onClick={() => setFilter('conference')}
            className={`px-4 py-2 rounded ${filter === 'conference' ? 'bg-gray-300 font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Conference Event
          </button>
          <div className="ml-auto">
            <select className="px-4 py-2 border-2 border-gray-300 rounded bg-white">
              <option>Sorted By</option>
              <option>Latest</option>
              <option>Prize Money</option>
              <option>Start Date</option>
            </select>
          </div>
        </div>

        {/* Contests Table */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow text-black">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Event ID</th>
                  <th className="px-4 py-3 text-center font-bold border-r border-gray-300">CC</th>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Organizer</th>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Type</th>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Start</th>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">End</th>
                  <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Price</th>
                  <th className="px-4 py-3 text-center font-bold">Participate</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        Loading contests...
                      </div>
                    </td>
                  </tr>
                ) : contests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No contests found
                    </td>
                  </tr>
                ) : (
                  contests.map((contest, index) => (
                  <tr 
                    key={contest.eventId} 
                    className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'} hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 border-r border-gray-300 font-medium">
                      {contest.eventId}
                    </td>
                    <td className="px-4 py-3 text-center text-2xl border-r border-gray-300">
                      {contest.cc}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      <div>
                        <div className="font-bold text-black hover:underline cursor-pointer">
                          {contest.name}
                        </div>
                        {contest.confHomePage && (
                          <div className="text-sm text-black hover:underline cursor-pointer">
                            {contest.confHomePage}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">{contest.organizer}</td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      <span className={`px-2 py-1 rounded text-sm ${
                        contest.type === 'Conference Event' ? 'bg-blue-100 text-black' :
                        contest.type === 'Class Test' ? 'bg-green-100 text-black' :
                        'bg-gray-100 text-black'
                      }`}>
                        {contest.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      {contest.startDate ? new Date(contest.startDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      {contest.endDate ? new Date(contest.endDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 font-medium text-black">
                      {contest.prize || 'TBA'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={`/contests/${contest.eventId}`}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
                      >
                        Participate
                      </a>
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
  )
}