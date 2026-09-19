import React from "react";

const LandingPage = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-900 relative overflow-hidden">
      
      <div className="pointer-events-none absolute -top-28 -left-28 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl animate-floatSlow" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl animate-floatSlow2" />

      
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-emerald-500/20 backdrop-blur-sm animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            TaskFlow
          </h1>
        </div>

        <button
          onClick={onNavigateToLogin}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/40"
        >
          Login
        </button>
      </nav>

      
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 animate-fadeInUp">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Manage Your Tasks <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Smarter & Faster
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 mt-6 leading-relaxed">
            TaskFlow helps teams collaborate, assign tasks, and track progress —
            all in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={onNavigateToLogin}
              className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
            >
              Get Started →
            </button>

            <button className="bg-white/10 hover:bg-white/15 px-8 py-3 rounded-lg font-semibold transition-all duration-300 border border-white/20 backdrop-blur-sm hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Easy Task Assignment
            </h3>
            <p className="text-gray-300 mt-3">
              Assign tasks to employees in seconds with clear titles, deadlines,
              and categories.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-5">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Live Progress Updates
            </h3>
            <p className="text-gray-300 mt-3">
              View active, new, completed and failed tasks with real-time task
              counters.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-5">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Team Productivity Boost
            </h3>
            <p className="text-gray-300 mt-3">
              Keep your team focused and organized with a clean dashboard
              experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
