import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { User, Mail, Lock, Save, Eye, EyeOff, Award, Target, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = ({ data, userRole, onBackToHome, onUserUpdated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: data?.firstName || data?.name || 'User',
    email: data?.email || 'admin@me.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Enter your current password first.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match!');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters!');
        return;
      }
    }

    try {
      const updatedUser = await apiRequest('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: formData.firstName,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined
        })
      });

      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      if (onUserUpdated) onUserUpdated(updatedUser);

      toast.success(formData.newPassword ? 'Profile and password updated successfully!' : 'Profile updated successfully!');
      setIsEditing(false);
      setFormData({
        firstName: updatedUser.name || 'User',
        email: updatedUser.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.message || 'Unable to update profile');
    }
  };

  const [employeeStats, setEmployeeStats] = useState(null);
  useEffect(() => {
    if (userRole !== 'employee') return;

    let active = true;
    const loadEmployeeStats = async () => {
      try {
        const tasks = await apiRequest('/tasks');
        const rows = Array.isArray(tasks) ? tasks : (tasks?.tasks || tasks?.data || []);
        const completed = rows.filter(task => task.status === 'completed').length;
        const failed = rows.filter(task => task.status === 'failed').length;
        const activeTasks = rows.filter(task => [
          'in_progress',
          'waiting_for_client',
          'changes_requested',
          'ready_for_review'
        ].includes(task.status)).length;
        const newTasks = rows.filter(task => task.status === 'not_started').length;

        if (active) {
          setEmployeeStats({
            totalTasks: rows.length,
            completed,
            active: activeTasks,
            failed,
            newTasks
          });
        }
      } catch (error) {
        if (active) {
          setEmployeeStats({
            totalTasks: data?.tasks?.length || 0,
            completed: data?.taskCounts?.completed || 0,
            active: data?.taskCounts?.active || 0,
            failed: data?.taskCounts?.failed || 0,
            newTasks: data?.taskCounts?.newTask || 0
          });
        }
      }
    };

    loadEmployeeStats();
    return () => { active = false; };
  }, [userRole, data]);

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl animate-floatSlow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl animate-floatSlow2" />

      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between animate-fadeInDown">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8 text-emerald-400" />
              Profile & Settings
            </h1>
            <p className="text-white/60 mt-1">Manage your account information</p>
          </div>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300"
          >
            ← Back
          </button>
        </div>

        
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 animate-fadeInUp">
          
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-emerald-500/30">
              {formData.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{formData.firstName}</h2>
              <p className="text-white/60">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${userRole === 'admin' 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }
                `}>
                  {userRole === 'admin' ? '👑 Admin' : userRole === 'manager' ? '🧑‍💼 Manager' : '👤 Employee'}
                </span>
              </div>
            </div>
          </div>

          
          {userRole === 'employee' && employeeStats && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Your Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <Target className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{employeeStats.totalTasks}</p>
                  <p className="text-xs text-white/60">Total Tasks</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{employeeStats.completed}</p>
                  <p className="text-xs text-white/60">Completed</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="w-6 h-6 text-amber-400 mb-2">🔥</div>
                  <p className="text-2xl font-bold text-white">{employeeStats.active}</p>
                  <p className="text-xs text-white/60">Active</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="w-6 h-6 text-red-400 mb-2">❌</div>
                  <p className="text-2xl font-bold text-white">{employeeStats.failed}</p>
                  <p className="text-xs text-white/60">Failed</p>
                </div>
              </div>
              
              
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Success Rate</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {employeeStats.completed + employeeStats.failed > 0
                      ? ((employeeStats.completed / (employeeStats.completed + employeeStats.failed)) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${employeeStats.completed + employeeStats.failed > 0
                        ? (employeeStats.completed / (employeeStats.completed + employeeStats.failed)) * 100
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Account Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>

            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white/70">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              />
            </div>

            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              />
            </div>

            
            {isEditing && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </h4>
                <p className="text-xs text-white/50">Leave blank to keep current password</p>

                
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                
                <div className="space-y-2">
                  <label className="text-sm text-white/70">New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
                  />
                </div>

                
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Confirm New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: data?.firstName || data?.name || 'User',
                      email: data?.email || 'admin@me.com',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeInUp">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h4 className="text-white font-semibold mb-2">Account Status</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-white/70 text-sm">Active</span>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h4 className="text-white font-semibold mb-2">Member Since</h4>
            <p className="text-white/70 text-sm">January 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
