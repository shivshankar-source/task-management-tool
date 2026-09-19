import React, { useState } from 'react';
import { LogOut, User, BarChart3, Home } from 'lucide-react';

const Header = (props) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logOutUser = () => {
    localStorage.setItem('loggedInUser', '');
    props.changeUser('');
    if (props.onBackToHome) {
      props.onBackToHome();
    }
  };

  const isAdmin = !props.data;
  const userName = props.data?.name || props.data?.firstName || (props.data?.role === 'manager' ? 'Manager' : props.data?.role === 'team_member' ? 'Team Member' : 'Admin');

  return (
    <div className='flex items-end justify-between'>
      <div>
        <h1 className='text-2xl font-medium'>
          Hello <br />
          <span className='text-3xl font-semibold'>{userName} 👋</span>
        </h1>
      </div>
      
      <div className='flex items-center gap-3'>
        
        <button 
          onClick={() => {
            if (props.onNavigateHome) {
              props.onNavigateHome();
            }
          }}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg transition-all duration-300'
          title="Back to Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-semibold">Home</span>
        </button>

        
        {isAdmin && (
          <button
            onClick={() => {
              if (props.onNavigateToAnalytics) {
                props.onNavigateToAnalytics();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-lg transition-all duration-300"
            title="View Analytics"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-semibold">Analytics</span>
          </button>
        )}

        
        <button
          onClick={() => {
            if (props.onNavigateToProfile) {
              props.onNavigateToProfile();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300"
          title="View Profile"
        >
          <User className="w-5 h-5" />
          <span className="text-sm font-semibold">Profile</span>
        </button>

        
        <button
          onClick={logOutUser}
          className='flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg text-lg font-medium transition-all duration-300'
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;