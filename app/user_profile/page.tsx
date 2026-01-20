import React from 'react';
import Navbar from '../../components/navbar';

const UserProfile = () => {
  // Activity data for the heatmap - representing activity over the last year
  const generateActivityData = () => {
    const months = [
      'November', 'December', 'January', 'February', 'March', 
      'April', 'May', 'June', 'July', 'August', 'September', 'October'
    ];
    
    const activities = {};
    months.forEach(month => {
      // Generate 4-5 weeks of data per month
      const weeksCount = month === 'November' || month === 'October' ? 5 : 4;
      activities[month] = Array.from({ length: weeksCount }, () => 
        // Each week has 7 days
        Array.from({ length: 7 }, () => 
          Math.floor(Math.random() * 5) // 0-4 activity levels
        )
      );
    });
    
    return activities;
  };

  const activityData = generateActivityData();

  const getColorClass = (level) => {
    switch(level) {
      case 0: return 'bg-[#ebedf0]';
      case 1: return 'bg-[#c6e48b]';
      case 2: return 'bg-[#7bc96f]';
      case 3: return 'bg-[#239a3b]';
      case 4: return 'bg-[#196127]';
      default: return 'bg-[#ebedf0]';
    }
  };

  const problems = ['AACZ', 'BUNNIES', 'DTPOLY', 'HQNP', 'METEORS', 'POWERCAR', 'STUN'];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar />
      
      <div className="mx-auto max-w-[1400px] px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">User Profile</h1>
          
          <div className="flex gap-20">
            {/* Left Column - Profile Info */}
            <div className="flex-shrink-0 w-[280px]">
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop" 
                  alt="Profile" 
                  className="w-full rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">[Rampage] Blue.Mary</h2>
                <p className="text-gray-600 text-base">@xilinx</p>
                
                <div className="space-y-3 text-sm text-gray-700 pt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>China, Shanghai</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Joined Dec 2009</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>World Leader (2528.1 points)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Institution: Fudan University</span>
                  </div>
                </div>
                
                <div className="pt-5">
                  <a 
                    href="https://www.topcoder.com/members/Blue.Mary" 
                    className="text-blue-600 hover:text-blue-700 text-sm hover:underline break-all"
                  >
                    https://www.topcoder.com/members/Blue.Mary
                  </a>
                </div>
                
                <div className="pt-4 text-sm text-gray-600">
                  Congratulations to Ma Zhihao, Gao Xi & Tang Dongjian for winning silver medal in ICPC Finals 2017.
                </div>
              </div>
            </div>
            
            {/* Right Column - Activity and Stats */}
            <div className="flex-1 min-w-0">
              {/* Activity Heatmap */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Activity over the last year</h3>
                
                <div className="overflow-x-auto">
                  <div className="flex gap-[2px] items-end">
                    {Object.entries(activityData).map(([month, weeks]) => (
                      <div key={month} className="flex flex-col items-center gap-2">
                        <div className="flex gap-[2px]">
                          {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[2px]">
                              {week.map((day, dayIndex) => (
                                <div 
                                  key={dayIndex} 
                                  className={`w-[10px] h-[10px] rounded-[2px] ${getColorClass(day)}`}
                                  title={`${month} - Week ${weekIndex + 1}, Day ${dayIndex + 1}: ${day} contributions`}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-gray-500 whitespace-nowrap">
                          {month}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Legend squares */}
                  <div className="flex gap-[2px] mt-6">
                    <div className={`w-[10px] h-[10px] rounded-[2px] ${getColorClass(1)}`} />
                    <div className={`w-[10px] h-[10px] rounded-[2px] ${getColorClass(2)}`} />
                    <div className={`w-[10px] h-[10px] rounded-[2px] ${getColorClass(3)}`} />
                    <div className={`w-[10px] h-[10px] rounded-[2px] ${getColorClass(4)}`} />
                  </div>
                </div>
              </div>
              
              {/* Effectiveness Section */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Effectiveness</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-base">Problems solved</span>
                    <span className="ml-auto text-gray-900 text-base">3505</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-700 text-base">Solutions submitted</span>
                    <span className="ml-auto text-gray-900 text-base">6182</span>
                  </div>
                </div>
              </div>
              
              {/* Problems Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Problems</h3>
                <p className="text-sm text-gray-600 mb-4">List of solved classical problems:</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {problems.map((problem) => (
                    <a 
                      key={problem}
                      href={`#${problem}`}
                      className="text-blue-600 hover:text-blue-700 hover:underline text-base font-medium"
                    >
                      {problem}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;