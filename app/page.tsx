'use client'
import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import TopRankerNavbar from "@/components/navbar";
import { useState, useEffect } from "react";
import axios from "axios";

interface Contest {
  _id: string;
  eventId: string;
  name: string;
  organizer?: string;
  startDate?: string;
  prize?: number;
  status?: string;
  problems?: string[];
  participantCount?: number;
}

interface Ranker {
  _id: string;
  name: string;
  country: string;
  rating: number;
  institution?: string;
}

interface Contributor {
  name: string;
  problemCount: number;
  institution: string;
}

interface Stats {
  totalSubmissions: number;
  totalUsers: number;
  totalProblems: number;
  totalCountries: number;
  indiaUsers: number;
  academicUsers: number;
  activeUsers: number;
}

export default function Page() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [topRankers, setTopRankers] = useState<Ranker[]>([]);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, contestsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contests`, {
            params: { status: 'active,ongoing', limit: 5 }
          })
        ]);

        if (statsRes.data.success) {
          const d = statsRes.data.data;
          setStats({
            totalSubmissions: d.totalSubmissions,
            totalUsers: d.totalUsers,
            totalProblems: d.totalProblems,
            totalCountries: d.totalCountries,
            indiaUsers: d.indiaUsers,
            academicUsers: d.academicUsers,
            activeUsers: d.activeUsers,
          });
          setTopRankers((d.topRankers || []).slice(0, 3));
          setTopContributors((d.topContributors || []).slice(0, 3));
        }

        if (contestsRes.data.success) {
          setContests(contestsRes.data.data || []);
        }
      } catch (err) {
        setError('Failed to load platform data. Please try again later.');
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SkeletonLine = ({ w }: { w: string }) => (
    <div className={`animate-pulse h-4 bg-gray-200 rounded ${w}`}></div>
  );

  return (
    <div className="min-h-screen bg-white">
      <TopRankerNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Ongoing Contests */}
        <div className="bg-white border border-black rounded p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Ongoing Contests</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <SkeletonLine w="w-3/4" />
                  <SkeletonLine w="w-1/2" />
                </div>
              ))}
            </div>
          ) : contests.length > 0 ? (
            <ul className="space-y-4">
              {contests.map((contest, index) => (
                <li key={contest._id || index}>
                  <Link href={`/contests/${contest.eventId}`}>
                    <div className="font-bold text-black mb-1 hover:text-blue-600 transition-colors">{contest.name} – by {contest.organizer}</div>
                    <div className="text-black text-sm">
                      {contest.problems?.length ?? 0} Problems
                      {contest.prize ? ` | Prize $${contest.prize}` : ''}
                      {contest.startDate
                        ? ` | Start: ${new Date(contest.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : ''}
                      {contest.participantCount !== undefined
                        ? ` | ${contest.participantCount} Participants`
                        : ''}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No ongoing contests at the moment.</p>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white border border-black rounded p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Statistics</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <SkeletonLine key={i} w="w-full" />)}
            </div>
          ) : stats ? (
            <ul className="space-y-2 text-black">
              <li>
                <span className="font-bold">{stats.totalSubmissions.toLocaleString()}</span> submissions |{' '}
                <span className="font-bold">{stats.totalUsers.toLocaleString()}</span> registered users |{' '}
                <span className="font-bold">{stats.totalProblems.toLocaleString()}</span> problems
              </li>
              <li>
                <span className="font-bold">{stats.totalCountries}</span> Countries |{' '}
                <span className="font-bold">{stats.indiaUsers.toLocaleString()}</span> users from India
              </li>
              <li>
                <span className="font-bold">{stats.academicUsers.toLocaleString()}</span> users from Academics |{' '}
                <span className="font-bold">{stats.activeUsers.toLocaleString()}</span> active users
              </li>
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Statistics unavailable.</p>
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
            {loading ? (
              <div className="p-4 grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <SkeletonLine w="w-full" />
                    <SkeletonLine w="w-2/3" />
                  </div>
                ))}
              </div>
            ) : topRankers.length > 0 ? (
              <div className="grid grid-cols-3 divide-x divide-gray-300">
                {topRankers.map((ranker) => (
                  <div key={ranker._id} className="p-4">
                    <div className="text-black font-medium mb-1">{ranker.name},</div>
                    <div className="text-black">{ranker.country || 'N/A'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-500 text-sm">No rankings available yet.</div>
            )}
          </div>

          {/* Top Contributors */}
          <div className="bg-white border border-black rounded overflow-hidden">
            <div className="bg-gray-50 border-b border-black px-6 py-4">
              <h2 className="text-lg font-bold text-black">Top Contributors</h2>
            </div>
            {loading ? (
              <div className="p-4 grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <SkeletonLine w="w-full" />
                    <SkeletonLine w="w-2/3" />
                  </div>
                ))}
              </div>
            ) : topContributors.length > 0 ? (
              <div className="grid grid-cols-3 divide-x divide-gray-300">
                {topContributors.map((contributor, i) => (
                  <div key={i} className="p-4">
                    <div className="text-black font-medium mb-1">{contributor.name},</div>
                    <div className="text-black">{contributor.institution || 'N/A'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-500 text-sm">No contributors yet.</div>
            )}
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