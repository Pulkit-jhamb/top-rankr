'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import TopRankerNavbar from '@/components/navbar'

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('users') // users, countries, problemSetters, institutions
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Fetch data based on active tab
    const endpoint = activeTab === 'users' ? 'global' : activeTab
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${endpoint}`)
      .then(res => setData(res.data.data || []))
      .catch(err => {
        console.error(err)
        // Load mock data
        loadMockData()
      })
  }, [activeTab])

  const loadMockData = () => {
    if (activeTab === 'users') {
      setData([
        { rank: 1, cc: '🇨🇳', name: '[Rampage] Blue.Mary', classical: '2484.2 (3505)', challenge: '43.6 (11)', score: 2527.8 },
        { rank: 2, cc: '🇮🇩', name: ':D', classical: '1108.8 (1916)', challenge: '11.0 (2)', score: 1119.7 },
        { rank: 3, cc: '🇲🇾', name: 'SourSpinach', classical: '1055.1 (2036)', challenge: '5.7 (0)', score: 1060.8 },
        { rank: 4, cc: '🇷🇺', name: 'Oleg', classical: '1010.0 (2168)', challenge: '4.3 (1)', score: 1014.3 },
        { rank: 5, cc: '🇭🇺', name: 'Robert Gerbicz', classical: '445.9 (1212)', challenge: '96.3 (17)', score: 542.2 },
        { rank: 6, cc: '🇸🇰', name: 'Hodobox', classical: '514.7 (1216)', challenge: '4.3 (0)', score: 519.0 },
        { rank: 7, cc: '🇨🇳', name: 'Lox', classical: '514.9 (796)', challenge: '3.7 (0)', score: 518.7 },
        { rank: 8, cc: '🇻🇦', name: 'Mitch Schwartz', classical: '233.8 (616)', challenge: '283.4 (81)', score: 517.2 },
        { rank: 9, cc: '🇯🇵', name: 'Min_25', classical: '466.9 (830)', challenge: '42.4 (13)', score: 509.3 },
        { rank: 10, cc: '🇨🇳', name: 'shihanyuan', classical: '439.9 (869)', challenge: '0.0 (0)', score: 439.9 }
      ])
    } else if (activeTab === 'countries') {
      setData([
        { rank: 1, cc: '🇮🇳', country: 'INDIA', users: 174519, classical: 1168900, score: 73391.3 },
        { rank: 2, cc: '🇨🇳', country: 'CHINA', users: 12856, classical: 77705, score: 20658.1 },
        { rank: 3, cc: '🇮🇩', country: 'INDONESIA', users: 8904, classical: 58027, score: 10645.9 },
        { rank: 4, cc: '🇺🇸', country: 'UNITED STATES', users: 25089, classical: 70948, score: 7192.5 },
        { rank: 5, cc: '🇵🇱', country: 'POLAND', users: 67584, classical: 57419, score: 7080.0 },
        { rank: 6, cc: '🇻🇳', country: 'VIET NAM', users: 35848, classical: 40990, score: 4927.2 },
        { rank: 7, cc: '🇭🇷', country: 'CROATIA', users: 1266, classical: 20658, score: 4903.5 },
        { rank: 8, cc: '🇧🇷', country: 'BRAZIL', users: 39256, classical: 33998, score: 4360.0 },
        { rank: 9, cc: '🇪🇬', country: 'EGYPT', users: 11794, classical: 50069, score: 3810.3 },
        { rank: 10, cc: '🇷🇺', country: 'RUSSIAN FEDERATION', users: 6217, classical: 24488, score: 3309.1 }
      ])
    } else if (activeTab === 'problemSetters') {
      setData([
        { rank: 1, cc: '🇻🇪', name: '', added: 268 },
        { rank: 2, cc: '🇨🇳', name: '[Trichromatic] XilinX', added: 267 },
        { rank: 3, cc: '🇫🇷', name: 'Adrian Kosowski', added: 104 },
        { rank: 4, cc: '🇻🇳', name: '~!(*(@*!(@^&', added: 102 },
        { rank: 5, cc: '🇮🇳', name: 'cegprakash', added: 96 },
        { rank: 6, cc: '🇻🇳', name: 'Race with time', added: 94 },
        { rank: 7, cc: '🇩🇪', name: 'Adrian Kuegel', added: 84 },
        { rank: 8, cc: '🇦🇷', name: 'Coach UTN FRSF', added: 81 },
        { rank: 9, cc: '🇮🇳', name: 'dce coders', added: 75 },
        { rank: 9, cc: '🇫🇷', name: 'Francky', added: 75 }
      ])
    } else if (activeTab === 'institutions') {
      setData([
        { rank: 1, institution: 'IIIT Allahabad', classical: 103365, challenge: 8, users: 1616, score: 8723.77 },
        { rank: 2, institution: 'Institut Teknologi Sepuluh Nopember', classical: 31661, challenge: 5, users: 955, score: 6311.23 },
        { rank: 3, institution: 'MNNIT, Allahabad', classical: 69349, challenge: 7, users: 1005, score: 4520.25 },
        { rank: 4, institution: 'IIIT Hyderabad', classical: 40480, challenge: 4, users: 774, score: 3557.95 },
        { rank: 5, institution: 'Shaoxing No.1 High School', classical: 6824, challenge: 2, users: 50, score: 3321.28 },
        { rank: 6, institution: 'Fudan University', classical: 5348, challenge: 12, users: 63, score: 3018.91 },
        { rank: 7, institution: 'Delhi College of Engineering', classical: 30120, challenge: 2, users: 425, score: 2724.12 },
        { rank: 8, institution: 'Google Inc.', classical: 8210, challenge: 3, users: 42, score: 2404.64 },
        { rank: 9, institution: 'IIT Roorkee', classical: 30732, challenge: 4, users: 571, score: 2367.68 },
        { rank: 10, institution: 'IIT Kanpur', classical: 22526, challenge: 2, users: 506, score: 2226.70 }
      ])
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'users':
        return <UsersLeaderboard data={data} />
      case 'countries':
        return <CountriesLeaderboard data={data} />
      case 'problemSetters':
        return <ProblemSettersLeaderboard data={data} />
      case 'institutions':
        return <InstitutionsLeaderboard data={data} />
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
function UsersLeaderboard({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-6">
          Problem Solvers' Hall of Fame
        </h2>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-6">
          <button className="px-3 py-2 border rounded hover:bg-gray-100">&lt;</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-100">Previous</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">1</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">2</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">3</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">4</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">5</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">6</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">7</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">8</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">9</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">10</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">11</button>
          <button className="px-3 py-2 border rounded hover:bg-gray-100">Next</button>
          <button className="px-3 py-2 border rounded hover:bg-gray-100">&gt;</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">CC</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">NAME</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">CLASSICAL</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">CHALLENGE</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                  <td className="px-4 py-3 text-gray-600">{user.rank}</td>
                  <td className="px-4 py-3 text-2xl">{user.cc}</td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-500 hover:underline">
                      {user.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{user.classical}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{user.challenge}</td>
                  <td className="px-4 py-3 text-right font-medium">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Countries Leaderboard Component
function CountriesLeaderboard({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-8">
          Country Ranks
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">CC</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">COUNTRY</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">USERS</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">CLASSICAL</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((country, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                  <td className="px-4 py-3 text-gray-600">{country.rank}</td>
                  <td className="px-4 py-3 text-2xl">{country.cc}</td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-500 hover:underline font-medium">
                      {country.country}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{country.users}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{country.classical}</td>
                  <td className="px-4 py-3 text-right font-medium">{country.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Problem Setters Leaderboard Component
function ProblemSettersLeaderboard({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-8">
          Problem-Setter Ranks
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">CC</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">NAME</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">ADDED</th>
              </tr>
            </thead>
            <tbody>
              {data.map((setter, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                  <td className="px-4 py-3 text-gray-600">{setter.rank}</td>
                  <td className="px-4 py-3 text-2xl">{setter.cc}</td>
                  <td className="px-4 py-3">
                    {setter.name ? (
                      <a href="#" className="text-blue-500 hover:underline">
                        {setter.name}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{setter.added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Institutions Leaderboard Component
function InstitutionsLeaderboard({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-b-lg shadow">
      <div className="p-6">
        <h2 className="text-3xl font-light text-gray-700 text-center mb-6">
          Institutions Ranks
        </h2>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-6">
          <button className="px-3 py-2 border rounded hover:bg-gray-100">&lt;</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-100">Previous</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">1</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">2</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">3</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">4</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">5</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">6</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">7</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">8</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">9</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">10</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">11</button>
          <button className="px-3 py-2 border rounded hover:bg-gray-100">Next</button>
          <button className="px-3 py-2 border rounded hover:bg-gray-100">&gt;</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">RANK</th>
                <th className="px-4 py-3 text-left text-gray-600 font-bold">INSTITUTION</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">CLASSICAL</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">CHALLENGE</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">USERS</th>
                <th className="px-4 py-3 text-right text-gray-600 font-bold">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((inst, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                  <td className="px-4 py-3 text-gray-600">{inst.rank}</td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-500 hover:underline">
                      {inst.institution}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{inst.classical}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{inst.challenge}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{inst.users}</td>
                  <td className="px-4 py-3 text-right font-medium">{inst.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
