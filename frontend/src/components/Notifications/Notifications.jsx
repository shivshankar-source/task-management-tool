import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';

const Notifications = ({ userRole, employeeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (userRole === 'employee' && employeeData?.id) {
      const savedNotifs = localStorage.getItem(`notifications_${employeeData.id}`);
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        generateNotifications();
      }
    }
  }, [userRole, employeeData?.id]);
  const generateNotifications = () => {
    if (!employeeData?.tasks) return;

    const notifs = [];
    const today = new Date().toISOString().split('T')[0];
    const existingNotifs = notifications.reduce((acc, n) => {
      acc[n.id] = n.read;
      return acc;
    }, {});

    employeeData.tasks.forEach(task => {
      if (task.newTask) {
        const id = `new-${task.taskTitle}-${task.taskDate}`;
        notifs.push({
          id,
          type: 'new',
          title: 'New Task Assigned',
          message: `You have a new task: "${task.taskTitle}"`,
          time: task.taskDate || today,
          read: existingNotifs[id] || false,
          icon: '📋'
        });
      }
      if (task.active && task.taskDate) {
        const taskDate = new Date(task.taskDate);
        const todayDate = new Date(today);
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (task.taskDate === today) {
          const id = `due-${task.taskTitle}-${task.taskDate}`;
          notifs.push({
            id,
            type: 'warning',
            title: 'Task Due Today',
            message: `"${task.taskTitle}" is due today!`,
            time: task.taskDate,
            read: existingNotifs[id] || false,
            icon: '⏰'
          });
        } else if (taskDate <= tomorrow && taskDate > todayDate) {
          const id = `due-soon-${task.taskTitle}-${task.taskDate}`;
          notifs.push({
            id,
            type: 'info',
            title: 'Task Due Soon',
            message: `"${task.taskTitle}" is due on ${task.taskDate}`,
            time: task.taskDate,
            read: existingNotifs[id] || false,
            icon: '📅'
          });
        }
      }
      if (task.completed) {
        const id = `completed-${task.taskTitle}-${task.taskDate}`;
        notifs.push({
          id,
          type: 'success',
          title: 'Task Completed',
          message: `You completed "${task.taskTitle}"`,
          time: task.taskDate || today,
          read: existingNotifs[id] || false,
          icon: '✅'
        });
      }
    });

    const updatedNotifs = notifs.slice(0, 10);
    setNotifications(updatedNotifs);
    if (employeeData?.id) {
      localStorage.setItem(`notifications_${employeeData.id}`, JSON.stringify(updatedNotifs));
    }
  };
  useEffect(() => {
    if (userRole === 'employee' && employeeData?.tasks) {
      generateNotifications();
    }
  }, [employeeData?.tasks?.length, employeeData?.taskCounts]);
  useEffect(() => {
    if (employeeData?.id && notifications.length > 0) {
      localStorage.setItem(`notifications_${employeeData.id}`, JSON.stringify(notifications));
    }
  }, [notifications, employeeData?.id]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    const updatedNotifs = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifs);
    if (employeeData?.id) {
      localStorage.setItem(`notifications_${employeeData.id}`, JSON.stringify(updatedNotifs));
    }
  };

  const clearAll = () => {
    setNotifications([]);
    if (employeeData?.id) {
      localStorage.removeItem(`notifications_${employeeData.id}`);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/30 bg-emerald-500/10';
      case 'warning': return 'border-amber-500/30 bg-amber-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      case 'new': return 'border-purple-500/30 bg-purple-500/10';
      default: return 'border-white/10 bg-white/5';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-slate-900 border border-white/20 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl z-50 overflow-hidden animate-fadeInDown">
          
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-xs text-white/50">{unreadCount} unread</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          
          {notifications.length > 0 && (
            <div className="p-3 border-b border-white/10 flex gap-2">
              <button
                onClick={markAllAsRead}
                className="flex-1 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>
          )}

          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`
                      p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer
                      ${!notif.read ? 'bg-white/5' : ''}
                    `}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      
                      <div className={`
                        flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl
                        border ${getNotificationColor(notif.type)}
                      `}>
                        {notif.icon}
                      </div>

                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`
                            text-sm font-semibold
                            ${notif.read ? 'text-white/60' : 'text-white'}
                          `}>
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className={`
                          text-xs mt-1 line-clamp-2
                          ${notif.read ? 'text-white/40' : 'text-white/60'}
                        `}>
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/40">{notif.time}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No notifications</p>
                <p className="text-white/30 text-xs mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
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

export default Notifications;
