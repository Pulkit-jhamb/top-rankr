'use client'
import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import TopRankerNavbar from "@/components/navbar";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [statistics, setStatistics] = useState<any>(null);
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch statistics
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics`)
      .then(res => {
        setStatistics(res.data.data);
      })
      .catch(err => console.error('Failed to fetch statistics:', err));

    // Fetch ongoing contests
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests`, {
      params: { status: 'active', limit: 3 }
    })
      .then(res => {
        setContests(res.data.data || []);
      })
      .catch(err => console.error('Failed to fetch contests:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopRankerNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ongoing Contests */}
        <div className="bg-white border border-black rounded p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Ongoing Contests</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading contests...</div>
          ) : contests.length === 0 ? (
            <div className="text-center text-gray-500">No ongoing contests</div>
          ) : (
            <ul className="space-y-4">
              {contests.map((contest) => (
                <li key={contest.eventId}>
                  <Link href={`/contests/${contest.eventId}`}>
                    <div className="font-bold text-black mb-1 hover:text-blue-600">
                      {contest.name} – by {contest.organizer}
                    </div>
                    <div className="text-black text-sm">
                      {contest.problems?.length || 0} Problems | Price {contest.prize || 'TBA'} | 
                      {contest.startDate ? ` Start: ${new Date(contest.startDate).toLocaleDateString()}` : ''}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white border border-black rounded p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Statistics</h2>
          {loading || !statistics ? (
            <div className="text-center text-gray-500">Loading statistics...</div>
          ) : (
            <ul className="space-y-2 text-black">
              <li>
                <span className="font-bold">{statistics.totalSubmissions?.toLocaleString()}</span> submissions | 
                <span className="font-bold">{statistics.totalUsers?.toLocaleString()}</span> registered users | 
                <span className="font-bold">{statistics.totalProblems?.toLocaleString()}</span> problems
              </li>
              <li>
                <span className="font-bold">{statistics.totalCountries}</span> Countries | 
                <span className="font-bold">{statistics.indiaUsers?.toLocaleString()}</span> users from India
              </li>
              <li>
                <span className="font-bold">{statistics.academicUsers?.toLocaleString()}</span> users from Academics | 
                <span className="font-bold">{statistics.activeUsers?.toLocaleString()}</span> active users
              </li>
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Rankers */}
          <div className="bg-white border border-black rounded overflow-hidden">
            <div className="bg-yellow-50 border-b border-black px-6 py-4">
              <h2 className="text-lg font-bold flex items-center text-black">
                <span className="mr-2">⭐</span>Top Rankers
              </h2>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-300">
              {loading || !statistics?.topRankers ? (
                <div className="col-span-3 p-4 text-center text-gray-500">Loading...</div>
              ) : statistics.topRankers.slice(0, 3).length === 0 ? (
                <div className="col-span-3 p-4 text-center text-gray-500">No rankers yet</div>
              ) : (
                statistics.topRankers.slice(0, 3).map((ranker: any, idx: number) => (
                  <div key={idx} className="p-4">
                    <div className="text-black font-medium mb-1">{ranker.name},</div>
                    <div className="text-black">{ranker.country || 'N/A'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Contributer */}
          <div className="bg-white border border-black rounded overflow-hidden">
            <div className="bg-gray-50 border-b border-black px-6 py-4">
              <h2 className="text-lg font-bold text-black">Top Contributors</h2>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-300">
              {loading || !statistics?.topContributors ? (
                <div className="col-span-3 p-4 text-center text-gray-500">Loading...</div>
              ) : statistics.topContributors.slice(0, 3).length === 0 ? (
                <div className="col-span-3 p-4 text-center text-gray-500">No contributors yet</div>
              ) : (
                statistics.topContributors.slice(0, 3).map((contributor: any, idx: number) => (
                  <div key={idx} className="p-4">
                    <div className="text-black font-medium mb-1">{contributor._id},</div>
                    <div className="text-black">{contributor.institution || 'N/A'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-300 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-[#3b9dd7] text-white font-bold text-base px-2.5 py-1 rounded">
                  TR
                </div>
                <div className="ml-2">
                  <div className="text-[#ff6b35] font-bold text-base leading-tight">Top Ranker</div>
                  <div className="text-[9px] text-gray-600 leading-tight">for optimization problem solver</div>
                </div>
              </div>
              <div className="text-xs text-black space-y-0.5 mb-4">
                <div>+91-9855764471</div>
                <div># 83, Model Town,</div>
                <div>Bhupendra Road,</div>
                <div>Patiala, Punjab - 147004,</div>
                <div>India.</div>
              </div>
              <div className="flex space-x-2.5">
                <Facebook className="w-5 h-5 text-[#3b5998] cursor-pointer" />
                <Twitter className="w-5 h-5 text-[#1da1f2] cursor-pointer" />
                <Linkedin className="w-5 h-5 text-[#0077b5] cursor-pointer" />
                <div className="w-5 h-5 bg-[#e4405f] rounded-sm cursor-pointer"></div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold mb-3 text-black text-sm">Company</h3>
              <ul className="space-y-2 text-xs text-black">
                <li><Link href="#" className="hover:text-blue-500">About US</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Credits</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Jobs / Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Become a Campus Representative</Link></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h3 className="font-bold mb-3 text-black text-sm">Developers</h3>
              <ul className="space-y-2 text-xs text-black">
                <li><Link href="#" className="hover:text-blue-500">Scoring</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Environment</Link></li>
                <li><Link href="#" className="hover:text-blue-500">FAQs</Link></li>
                <li><Link href="#" className="hover:text-blue-500">For University/ College/ Institute</Link></li>
              </ul>
            </div>

            {/* Companies */}
            <div>
              <h3 className="font-bold mb-3 text-black text-sm">Companies</h3>
              <ul className="space-y-2 text-xs text-black">
                <li><Link href="#" className="hover:text-blue-500">Solutions</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Request a Feature</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Try for Free</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Pricing</Link></li>
              </ul>
              <h3 className="font-bold mb-3 mt-6 text-black text-sm">Resource</h3>
              <ul className="space-y-2 text-xs text-black">
                <li><Link href="#" className="hover:text-blue-500">API</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Guides</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Videos</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Partners</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Events</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Tools</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-blue-500">News</Link></li>
              </ul>
            </div>

            {/* More */}
            <div>
              <h3 className="font-bold mb-3 text-black text-sm">More</h3>
              <ul className="space-y-2 text-xs text-black">
                <li><Link href="#" className="hover:text-blue-500">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Terms</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Help Center</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Site Map</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Support Us</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Contest Calendar</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-500">Discussion</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-black">
            © TopRanker.com. All Rights Reserved. TopRanker uses{' '}
            <Link href="#" className="text-blue-500 hover:underline">RR Engine©</Link> by{' '}
            <Link href="#" className="text-blue-500 hover:underline">RR Labs.</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}