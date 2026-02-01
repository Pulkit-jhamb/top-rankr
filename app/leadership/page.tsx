'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('users') // users, countries, problemSetters, institutions
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when tab changes
  }, [activeTab]);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, currentPage]);

  const fetchLeaderboard = async () => {
    try {
      const endpoint = activeTab === 'users' ? 'users' : 
                      activeTab === 'countries' ? 'countries' : 
                      activeTab === 'problemSetters' ? 'problem-setters' : 'institutions';
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard/${endpoint}`, {
        params: activeTab === 'users' ? { page: currentPage, limit: 50 } : {}
      });
      
      setData(response.data.data || []);
      
      // Set pagination info (only users endpoint has pagination)
      if (activeTab === 'users' && response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1);
        setTotalItems(response.data.pagination.total || 0);
      } else {
        // Other tabs show all data in one page
        setTotalPages(1);
        setTotalItems(response.data.data?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setData([]);
      setTotalPages(1);
      setTotalItems(0);
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

  const renderContent = () => {
    switch(activeTab) {
      case 'users':
        return <UsersLeaderboard data={data} currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={handlePageChange} onPrevious={handlePrevious} onNext={handleNext} getPageNumbers={getPageNumbers} />
      case 'countries':
        return <CountriesLeaderboard data={data} currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={handlePageChange} onPrevious={handlePrevious} onNext={handleNext} getPageNumbers={getPageNumbers} />
      case 'problemSetters':
        return <ProblemSettersLeaderboard data={data} currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={handlePageChange} onPrevious={handlePrevious} onNext={handleNext} getPageNumbers={getPageNumbers} />
      case 'institutions':
        return <InstitutionsLeaderboard data={data} currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={handlePageChange} onPrevious={handlePrevious} onNext={handleNext} getPageNumbers={getPageNumbers} />
    }
  }

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
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded transition ${
                activeTab === 'users' 
                  ? 'text-blue-600 font-bold underline' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('countries')}
              className={`px-4 py-2 rounded transition ${
                activeTab === 'countries' 
                  ? 'text-blue-600 font-bold underline' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Countries
            </button>
            <button
              onClick={() => setActiveTab('problemSetters')}
              className={`px-4 py-2 rounded transition ${
                activeTab === 'problemSetters' 
                  ? 'text-blue-600 font-bold underline' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Problem setters
            </button>
            <button
              onClick={() => setActiveTab('institutions')}
              className={`px-4 py-2 rounded transition ${
                activeTab === 'institutions' 
                  ? 'text-blue-600 font-bold underline' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Institutions
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
    </>
  )
}

// Users Leaderboard Component
function UsersLeaderboard({ data, currentPage, totalPages, totalItems, onPageChange, onPrevious, onNext, getPageNumbers }: { 
  data: any[], 
  currentPage: number, 
  totalPages: number, 
  totalItems: number,
  onPageChange: (page: number) => void,
  onPrevious: () => void,
  onNext: () => void,
  getPageNumbers: () => (number | string)[]
}) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-6">
          Problem Solvers' Hall of Fame
        </h2>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-6 items-center">
          <button 
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &lt;&lt;
          </button>
          <button 
            onClick={onPrevious}
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
                onClick={() => onPageChange(page as number)}
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
            onClick={onNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
          <button 
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &gt;&gt;
          </button>
          
          <span className="ml-4 text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalItems} total users)
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Rank</th>
                <th className="px-4 py-3 text-left font-bold border-r border-gray-300">User</th>
                <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Country</th>
                <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Institution</th>
                <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Rating</th>
                <th className="px-4 py-3 text-left font-bold border-r border-gray-300">Problems</th>
                <th className="px-4 py-3 text-left font-bold">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                data.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}`}>
                    <td className="px-4 py-3 border-r border-gray-300 font-medium">{item.rank}</td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      <a href={`/user_profile`} className="text-blue-600 hover:underline font-medium">{item.name}</a>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">{item.country}</td>
                    <td className="px-4 py-3 border-r border-gray-300">{item.institution}</td>
                    <td className="px-4 py-3 border-r border-gray-300 font-bold">{item.rating?.toFixed(1) || 0}</td>
                    <td className="px-4 py-3 border-r border-gray-300">{item.problemsSolved || 0}</td>
                    <td className="px-4 py-3">{item.totalSubmissions || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Countries Leaderboard Component
function CountriesLeaderboard({ data, currentPage, totalPages, totalItems, onPageChange, onPrevious, onNext, getPageNumbers }: { 
  data: any[], 
  currentPage: number, 
  totalPages: number, 
  totalItems: number,
  onPageChange: (page: number) => void,
  onPrevious: () => void,
  onNext: () => void,
  getPageNumbers: () => (number | string)[]
}) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-8">
          Country Ranks
        </h2>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-6 items-center">
            <button 
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &lt;&lt;
            </button>
            <button 
              onClick={onPrevious}
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
                  onClick={() => onPageChange(page as number)}
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
              onClick={onNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
            <button 
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &gt;&gt;
            </button>
            
            <span className="ml-4 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalItems} total countries)
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">COUNTRY</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">USERS</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">AVG RATING</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">TOTAL RATING</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">SUBMISSIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                data.map((country, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                    <td className="px-4 py-3 text-gray-600">{country.rank}</td>
                    <td className="px-4 py-3">
                      <span className="text-blue-500 font-medium">
                        {country.country}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{country.totalUsers}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{country.avgRating?.toFixed(1) || 0}</td>
                    <td className="px-4 py-3 text-right font-medium">{country.totalRating?.toFixed(1) || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{country.totalSubmissions || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Problem Setters Leaderboard Component
function ProblemSettersLeaderboard({ data, currentPage, totalPages, totalItems, onPageChange, onPrevious, onNext, getPageNumbers }: { 
  data: any[], 
  currentPage: number, 
  totalPages: number, 
  totalItems: number,
  onPageChange: (page: number) => void,
  onPrevious: () => void,
  onNext: () => void,
  getPageNumbers: () => (number | string)[]
}) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-8">
          Problem-Setter Ranks
        </h2>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-6 items-center">
            <button 
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &lt;&lt;
            </button>
            <button 
              onClick={onPrevious}
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
                  onClick={() => onPageChange(page as number)}
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
              onClick={onNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
            <button 
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &gt;&gt;
            </button>
            
            <span className="ml-4 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalItems} total setters)
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">NAME</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">INSTITUTION</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">PROBLEMS</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">SUBMISSIONS</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">ACCEPTANCE</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                data.map((setter, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                    <td className="px-4 py-3 text-gray-600">{setter.rank}</td>
                    <td className="px-4 py-3">
                      {setter.name ? (
                        <span className="text-blue-500 font-medium">
                          {setter.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{setter.institution || 'N/A'}</td>
                    <td className="px-4 py-3 text-right font-medium">{setter.totalProblems || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{setter.totalSubmissions || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{setter.avgAcceptanceRate?.toFixed(1) || 0}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Institutions Leaderboard Component
function InstitutionsLeaderboard({ data, currentPage, totalPages, totalItems, onPageChange, onPrevious, onNext, getPageNumbers }: { 
  data: any[], 
  currentPage: number, 
  totalPages: number, 
  totalItems: number,
  onPageChange: (page: number) => void,
  onPrevious: () => void,
  onNext: () => void,
  getPageNumbers: () => (number | string)[]
}) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-6">
          Institutions Ranks
        </h2>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-6 items-center">
            <button 
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &lt;&lt;
            </button>
            <button 
              onClick={onPrevious}
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
                  onClick={() => onPageChange(page as number)}
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
              onClick={onNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
            <button 
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &gt;&gt;
            </button>
            
            <span className="ml-4 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalItems} total institutions)
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">INSTITUTION</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">COUNTRY</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">USERS</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">AVG RATING</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">TOTAL RATING</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">SUBMISSIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                data.map((inst, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                    <td className="px-4 py-3 text-gray-600">{inst.rank}</td>
                    <td className="px-4 py-3">
                      <span className="text-blue-500 font-medium">
                        {inst.institution}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inst.country || 'N/A'}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{inst.totalUsers}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{inst.avgRating?.toFixed(1) || 0}</td>
                    <td className="px-4 py-3 text-right font-medium">{inst.totalRating?.toFixed(1) || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{inst.totalSubmissions || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
