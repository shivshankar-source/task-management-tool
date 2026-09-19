import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Target,
  Activity
} from 'lucide-react';

const AnalyticsDashboard = ({ onBackToHome }) => {
  const [employees] = useContext(AuthContext);
  const stats = useMemo(() => {
    if (!employees) return null;

    const totalEmployees = employees.length;
    let totalTasks = 0;
    let completedTasks = 0;
    let activeTasks = 0;
    let failedTasks = 0;
    let newTasks = 0;

    employees.forEach(emp => {
      totalTasks += emp.tasks?.length || 0;
      completedTasks += emp.taskCounts?.completed || 0;
      activeTasks += emp.taskCounts?.active || 0;
      failedTasks += emp.taskCounts?.failed || 0;
      newTasks += emp.taskCounts?.newTask || 0;
    });

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    return {
      totalEmployees,
      totalTasks,
      completedTasks,
      activeTasks,
      failedTasks,
      newTasks,
      completionRate
    };
  }, [employees]);
  const employeePerformance = useMemo(() => {
    if (!employees) return [];
    
    return employees.map(emp => ({
      name: emp.firstName,
      total: emp.tasks?.length || 0,
      completed: emp.taskCounts?.completed || 0,
      active: emp.taskCounts?.active || 0,
      failed: emp.taskCounts?.failed || 0,
      completionRate: emp.tasks?.length > 0 
        ? ((emp.taskCounts?.completed / emp.tasks.length) * 100).toFixed(1)
        : 0
    })).sort((a, b) => b.completed - a.completed);
  }, [employees]);

  if (!stats) return null;

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl animate-floatSlow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-floatSlow2" />

      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between animate-fadeInDown">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-emerald-400" />
              Analytics Dashboard
            </h1>
            <p className="text-white/60 mt-1">Overview of team performance and task statistics</p>
          </div>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300"
          >
            ← Back
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeInUp">
          
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/30 backdrop-blur-xl p-6 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Tasks</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalTasks}</h3>
                <p className="text-xs text-white/50 mt-2">Across all employees</p>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-blue-400" />
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30 backdrop-blur-xl p-6 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Completed</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.completedTasks}</h3>
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stats.completionRate}% completion rate
                </p>
              </div>
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/30 backdrop-blur-xl p-6 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Active Tasks</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.activeTasks}</h3>
                <p className="text-xs text-white/50 mt-2">In progress</p>
              </div>
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-amber-400" />
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-400/30 backdrop-blur-xl p-6 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Team Size</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalEmployees}</h3>
                <p className="text-xs text-white/50 mt-2">Active employees</p>
              </div>
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 animate-fadeInUp">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Task Distribution
            </h3>
            
            <div className="space-y-4">
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">New Tasks</span>
                  <span className="text-sm font-semibold text-white">{stats.newTasks}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks > 0 ? (stats.newTasks / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Active Tasks</span>
                  <span className="text-sm font-semibold text-white">{stats.activeTasks}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks > 0 ? (stats.activeTasks / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Completed Tasks</span>
                  <span className="text-sm font-semibold text-white">{stats.completedTasks}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Failed Tasks</span>
                  <span className="text-sm font-semibold text-white">{stats.failedTasks}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks > 0 ? (stats.failedTasks / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            
            <div className="mt-8 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - stats.completionRate / 100)}`}
                    className="text-emerald-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{stats.completionRate}%</span>
                  <span className="text-xs text-white/60">Completed</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 animate-fadeInUp">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Employee Performance
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {employeePerformance.map((emp, index) => (
                <div 
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                        ${index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' : ''}
                        ${index === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : ''}
                        ${index > 2 ? 'bg-white/10 text-white/60' : ''}
                      `}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.name}</p>
                        <p className="text-xs text-white/50">{emp.total} total tasks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">{emp.completed}</p>
                      <p className="text-xs text-white/50">completed</p>
                    </div>
                  </div>

                  
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${emp.completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1 text-right">{emp.completionRate}% completion rate</p>

                  
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-amber-400">🔥 {emp.active} active</span>
                    <span className="text-red-400">❌ {emp.failed} failed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeInUp">
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-sm text-white/60">Pending Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.newTasks + stats.activeTasks}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm text-white/60">Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {stats.completedTasks + stats.failedTasks > 0 
                    ? ((stats.completedTasks / (stats.completedTasks + stats.failedTasks)) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-white/60">Failed Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.failedTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
