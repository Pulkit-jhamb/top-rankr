import TopRankerNavbar from '@/components/navbar'

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopRankerNavbar />
      
      {/* Header Banner */}
      <div className="bg-black text-white py-6 px-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Statistics
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-black">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">203,922</div>
              <div className="text-gray-700">Total Submissions</div>
            </div>
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">54,815</div>
              <div className="text-gray-700">Registered Users</div>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">6,397</div>
              <div className="text-gray-700">Problems</div>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">120</div>
              <div className="text-gray-700">Countries</div>
            </div>
            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">20,000</div>
              <div className="text-gray-700">Users from India</div>
            </div>
            <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600 mb-2">50,000</div>
              <div className="text-gray-700">Academic Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
