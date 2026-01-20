'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon?: string;
  highlight?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/home"},
  { label: "About", href: "/about" },
  { label: "Problems", href: "/problems" },
  { label: "Contests", href: "/contests" },
  { label: "Leaderboard", href: "/leadership" },
  { label: "Contribute", href: "/contribute"},
  { label: "Statistics", href: "/statistics" },
  { label: "Discuss", href: "/discuss" },
];

export default function TopRankerNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName') || localStorage.getItem('email') || 'User';
    setIsAuthenticated(!!token);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    router.push('/auth');
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-[#d1d5db] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="rounded bg-[#1e90ff] px-2 py-1 text-lg font-bold text-white shadow-sm">
            TR
          </div>
          <div className="leading-tight text-[#f97316]">
            <div className="text-xl font-semibold">Top</div>
            <div className="text-xl font-semibold">Ranker</div>
          </div>
        </div>

        <nav className="hidden gap-3 md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded border border-[#d1d5db] px-4 py-2 text-sm font-medium shadow-sm ${
                item.highlight ? "bg-[#1e90ff] text-white" : "bg-white text-gray-800"
              }`}
            >
              {item.icon && (
                <span className="text-base leading-none text-gray-600">
                  {item.icon}
                </span>
              )}
              {item.label}      
            </Link>
          ))}
          
          {/* Profile or Sign In */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 text-white font-bold shadow-lg hover:shadow-xl transition-shadow"
                  title={userName}
                >
                  <span className="w-full text-center text-sm">{getInitials(userName)}</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                    <Link
                      href="/user_profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/my-submissions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Submissions
                    </Link>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded border border-red-300 bg-white px-4 py-2 text-sm font-medium shadow-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 rounded border border-[#d1d5db] px-4 py-2 text-sm font-medium shadow-sm bg-white text-gray-800"
            >
              sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
