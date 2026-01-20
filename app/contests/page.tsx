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
  start?: string
  end?: string
  price: string
  participate: string
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('all') // all, open, class, conference

  useEffect(() => {
    // Fetch contests from backend
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contests`)
      .then(res => {
        setContests(res.data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        // Mock data for demo
        setContests([
          {
            eventId: 'E302',
            cc: '🇮🇳',
            name: 'SocPros 2018',
            confHomePage: 'Conf Home Page',
            organizer: 'IIT Bhubaneswar',
            type: 'Conference Event',
            start: '10 Dec 2017',
            end: '23 Dec 2017',
            price: '$1000',
            participate: 'Participate'
          },
          {
            eventId: 'E301',
            cc: '🇮🇳',
            name: 'Thapar-EST',
            organizer: 'Thapar University',
            type: 'Class Test',
            price: 'Higher Grade',
            participate: 'Participate'
          },
          {
            eventId: 'E300',
            cc: '🇮🇳',
            name: 'Thapar-MST',
            organizer: 'Thapar University',
            type: 'Class Test',
            price: 'Higher Grade',
            participate: 'Participate'
          },
          {
            eventId: 'E299',
            cc: '🇨🇳',
            name: 'China-Final',
            organizer: 'China University',
            type: 'Class Test',
            price: 'Higher Grade',
            participate: 'Participate'
          },
          {
            eventId: 'E298',
            cc: '🇺🇸',
            name: 'None',
            organizer: 'None',
            type: 'Conference Event',
            start: 'None',
            end: 'None',
            price: '$500',
            participate: 'Participate'
          },
          {
            eventId: 'E297',
            cc: '🇺🇸',
            name: 'None',
            organizer: 'None',
            type: 'Conference Event',
            start: 'None',
            end: 'None',
            price: '$300',
            participate: 'Participate'
          },
          {
            eventId: 'E296',
            cc: '🇺🇸',
            name: 'None',
            organizer: 'None',
            type: 'Conference Event',
            start: 'None',
            end: 'None',
            price: '$100',
            participate: 'Participate'
          }
        ])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-center">Loading contests...</div>

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
        <div className="flex justify-center gap-2 mb-6 text-black">
          <button className="px-3 py-2 border rounded hover:bg-gray-100">
            &lt;
          </button>
          <button className="px-3 py-2 text-black hover:bg-gray-100">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-500 text-black rounded">1</button>
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
          <button className="px-3 py-2 border rounded hover:bg-gray-100">
            &gt;
          </button>
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
                {contests.map((contest, index) => (
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
                    <td className="px-4 py-3 border-r border-gray-300">{contest.start || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-300">{contest.end || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-300 font-medium text-black">
                      {contest.price}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={`/contest/${contest.eventId}`}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
                      >
                        {contest.participate}
                      </a>
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