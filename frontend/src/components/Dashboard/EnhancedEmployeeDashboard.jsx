import React, { useContext, useEffect, useState } from 'react';
import HeaderEnhanced from '../other/HeaderEnhanced';
import TaskListNumbers from '../other/TaskListNumbers';
import { AuthContext } from '../../context/AuthProvider';
import { Search, Filter, X } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import toast from 'react-hot-toast';
import NewTask from '../TaskList/NewTask';
import AcceptTask from '../TaskList/AcceptTask';
import CompleteTask from '../TaskList/CompleteTask';
import FailedTask from '../TaskList/FailedTask';

const EnhancedEmployeeDashboard = (props) => {
  const [userData] = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState({ ...(props.data || {}), tasks: [], taskCounts: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    let active = true;
    let timer;

    async function loadTasks(showLoading = true) {
      try {
        if (showLoading) setLoading(true);
        const result = await apiRequest('/tasks');
        const rows = Array.isArray(result) ? result : (result.tasks || result.data || []);
        const tasks = rows.map(task => ({
          ...task,
          id: task._id || task.id,
          taskTitle: task.title || task.taskTitle || 'Untitled task',
          taskDescription: task.description || task.taskDescription || '',
          taskDate: task.dueDate || task.taskDate,
          category: task.category || task.status || 'General',
          newTask: task.status === 'not_started',
          active: task.status === 'in_progress' || task.status === 'waiting_for_client' || task.status === 'changes_requested' || task.status === 'ready_for_review',
          completed: task.status === 'completed',
          failed: false
        }));
        if (active) setEmployeeData({ ...(props.data || {}), tasks, taskCounts: {
          newTask: tasks.filter(t => t.newTask).length,
          active: tasks.filter(t => t.active).length,
          completed: tasks.filter(t => t.completed).length,
          failed: 0
        }});
      } catch (error) {
        if (active && showLoading) toast.error(error.message || 'Unable to load tasks');
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }

    loadTasks(true);
    const refreshOnFocus = () => loadTasks(false);
    window.addEventListener('focus', refreshOnFocus);
    timer = window.setInterval(() => loadTasks(false), 5000);

    return () => {
      active = false;
      window.removeEventListener('focus', refreshOnFocus);
      window.clearInterval(timer);
    };
  }, [props.data]);
  const filteredTasks = employeeData?.tasks?.filter(task => {
    const matchesSearch = task.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'new' && task.newTask) ||
                         (filterStatus === 'active' && task.active) ||
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'failed' && task.failed);

    return matchesSearch && matchesStatus;
  }) || [];
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.taskDate || 0) - new Date(a.taskDate || 0);
    } else if (sortBy === 'title') {
      return (a.taskTitle || "").localeCompare(b.taskTitle || "");
    } else if (sortBy === 'category') {
      return (a.category || "").localeCompare(b.category || "");
    }
    return 0;
  });

  const filterButtons = [
    { value: 'all', label: 'All Tasks', activeClass: 'employee-filter-active-blue' },
    { value: 'new', label: 'New', activeClass: 'employee-filter-active-blue' },
    { value: 'active', label: 'Active', activeClass: 'employee-filter-active-amber' },
    { value: 'completed', label: 'Completed', activeClass: 'employee-filter-active-green' },
    { value: 'failed', label: 'Failed', activeClass: 'employee-filter-active-red' }
  ];

  return (
    <div className='employee-theme min-h-screen p-6 md:p-10'>
      <HeaderEnhanced
        changeUser={props.changeUser}
        data={employeeData}
        onBackToHome={props.onBackToHome}
        onNavigateHome={props.onNavigateHome}
        onNavigateToProfile={props.onNavigateToProfile}
      />
      <TaskListNumbers data={employeeData} />
      
      
      <div className="mt-8 space-y-4 animate-fadeInUp">
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search tasks by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="employee-input w-full pl-12 pr-12 py-4 rounded-xl text-white placeholder-white/45 focus:outline-none transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Filter:</span>
          </div>
          
          {filterButtons.map(btn => (
            <button
              key={btn.value}
              onClick={() => setFilterStatus(btn.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${filterStatus === btn.value ? `${btn.activeClass} text-white` : 'employee-filter text-white/75 hover:text-white'}
              `}
            >
              {btn.label}
              {btn.value === 'all' && ` (${employeeData?.tasks?.length || 0})`}
              {btn.value === 'new' && ` (${employeeData?.taskCounts?.newTask || 0})`}
              {btn.value === 'active' && ` (${employeeData?.taskCounts?.active || 0})`}
              {btn.value === 'completed' && ` (${employeeData?.taskCounts?.completed || 0})`}
              {btn.value === 'failed' && ` (${employeeData?.taskCounts?.failed || 0})`}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-white/60">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="employee-select px-4 py-2 rounded-lg text-white text-sm focus:outline-none cursor-pointer"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        
        <div className="text-sm text-white/55">
          Showing {sortedTasks.length} of {employeeData?.tasks?.length || 0} tasks
        </div>
      </div>

      
      <div id='tasklist' className='employee-task-scroll mt-8 flex items-center justify-start gap-5 flex-nowrap py-5'>
        {loading ? (
          <div className="employee-empty w-full text-center py-20">Loading tasks...</div>
        ) : sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => {
            if (task.completed) {
              return <CompleteTask key={index} data={task} />;
            } else if (task.failed) {
              return <FailedTask key={index} data={task} />;
            } else if (task.active) {
              return <AcceptTask key={index} data={task} onChanged={() => window.location.reload()} />;
            } else if (task.newTask) {
              return <NewTask key={index} data={task} onChanged={() => window.location.reload()} />;
            }
            return null;
          })
        ) : (
          <div className="employee-empty w-full text-center py-20">
            <div className="text-white/55 text-lg">
              {searchTerm || filterStatus !== 'all' 
                ? 'No tasks match your search or filter criteria' 
                : 'No tasks assigned yet'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedEmployeeDashboard;
