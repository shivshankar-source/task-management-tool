import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, Filter, RefreshCw, CalendarPlus, UserRoundCog, CheckCircle2, RotateCcw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../../utils/api';
import HeaderEnhanced from '../other/HeaderEnhanced';
import SearchableSelect from '../common/SearchableSelect';

const input = 'w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50';

export default function ManagerDashboard({ data, changeUser, onBackToHome, onNavigateHome, onNavigateToProfile }) {
  const [engagements, setEngagements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [members, setMembers] = useState([]);
  const [metrics, setMetrics] = useState({ open: 0, overdue: 0, dueToday: 0, waitingForClient: 0, readyForReview: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [engagementForm, setEngagementForm] = useState({ clientId: '', serviceTypeId: '', title: '', period: '', startDate: '' });
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [assigningTaskId, setAssigningTaskId] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [e, t, c, s, u, m] = await Promise.all([
        apiRequest('/engagements'), apiRequest('/tasks'), apiRequest('/clients'), apiRequest('/services'),
        apiRequest('/users'), apiRequest('/tasks/dashboard')
      ]);
      setEngagements(Array.isArray(e) ? e : []);
      setTasks(Array.isArray(t) ? t : []);
      setClients(Array.isArray(c) ? c : []);
      setServices(Array.isArray(s) ? s : []);
      setMembers((Array.isArray(u) ? u : []).filter(user => String(user.role || '').trim().toLowerCase() === 'team_member' && user.isActive !== false));
      setMetrics(m || {});
    } catch (e) { toast.error(e.message || 'Unable to load manager data'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filteredClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    return clients.filter(c => !q || String(c.name || '').toLowerCase().includes(q) || String(c.email || '').toLowerCase().includes(q));
  }, [clients, clientSearch]);

  const selectedClient = clients.find(c => String(c._id) === String(engagementForm.clientId));

  const filteredTasks = useMemo(() => tasks.filter(t => {
    const q = search.toLowerCase();
    const matches = !q || [t.title, t.description, t.status, t.assignedTo?.name, t.engagementId?.title].some(v => String(v || '').toLowerCase().includes(q));
    const status = filter === 'review' ? t.status === 'ready_for_review' : filter === 'open' ? t.status !== 'completed' : filter === 'completed' ? t.status === 'completed' : true;
    return matches && status;
  }), [tasks, search, filter]);

  const reviewTasks = useMemo(() => tasks.filter(t => t.status === 'ready_for_review'), [tasks]);

  const createEngagement = async (e) => {
    e.preventDefault();
    if (!engagementForm.clientId) { toast.error('Please select a client'); return; }
    if (!engagementForm.serviceTypeId) { toast.error('Please select a service'); return; }
    try {
      await apiRequest('/engagements', { method: 'POST', body: JSON.stringify(engagementForm) });
      setEngagementForm({ clientId: '', serviceTypeId: '', title: '', period: '', startDate: '' });
      toast.success('Engagement created and template tasks generated');
      load();
    } catch (e) { toast.error(e.message); }
  };

  const updateStatus = async (task, status) => {
    try {
      await apiRequest(`/tasks/${task._id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      toast.success(`Task ${status.replaceAll('_', ' ')}`);
      load();
    } catch (e) { toast.error(e.message); }
  };

  const assign = async (task, assignedTo) => {
    if (!assignedTo) {
      toast.error('Please select a team member');
      return;
    }
    try {
      setAssigningTaskId(task._id);
      const savedTask = await apiRequest(`/tasks/${task._id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedTo })
      });
      setTasks(current => current.map(item => String(item._id) === String(task._id) ? savedTask : item));
      toast.success(`Task assigned to ${savedTask.assignedTo?.name || 'team member'}`);
      await load();
    } catch (e) {
      toast.error(e.message || 'Task assignment failed');
    } finally {
      setAssigningTaskId('');
    }
  };

  const updateDueDate = async (task, dueDate) => {
    try { await apiRequest(`/tasks/${task._id}`, { method: 'PATCH', body: JSON.stringify({ dueDate }) }); toast.success('Deadline updated'); load(); }
    catch (e) { toast.error(e.message); }
  };

  const generateNext = async (engagement) => {
    try {
      const result = await apiRequest(`/engagements/${engagement._id}/generate-next`, { method: 'POST' });
      toast.success(result.created ? 'Next period generated' : 'Next period already exists');
      load();
    } catch (e) { toast.error(e.message); }
  };

  const statCards = [
    ['Open Tasks', metrics.open || 0, 'manager-stat manager-stat-blue'],
    ['Overdue', metrics.overdue || 0, 'manager-stat manager-stat-red'],
    ['Due Today', metrics.dueToday || 0, 'manager-stat manager-stat-amber'],
    ['Waiting for Client', metrics.waitingForClient || 0, 'manager-stat manager-stat-amber'],
    ['Waiting for Review', metrics.readyForReview || 0, 'manager-stat manager-stat-green']
  ];

  return <div className="manager-theme min-h-screen p-6 md:p-10">
    <HeaderEnhanced changeUser={changeUser} data={{ ...(data || {}), name: data?.name || 'Manager' }} onBackToHome={onBackToHome} onNavigateHome={onNavigateHome} onNavigateToProfile={onNavigateToProfile} />

    <div className="grid md:grid-cols-5 gap-4 mt-8">
      {statCards.map(([label, value, cls]) => <div key={label} className={`${cls} rounded-xl p-5`}><p className="text-white/75 text-sm">{label}</p><p className="text-3xl font-bold mt-2">{value}</p></div>)}
    </div>

    {reviewTasks.length > 0 && (
      <section className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-emerald-300 text-sm font-semibold">Action required</p>
            <h2 className="text-lg font-bold text-white">{reviewTasks.length} task{reviewTasks.length === 1 ? '' : 's'} waiting for your review</h2>
            <p className="text-sm text-white/60 mt-1">Employee submissions are routed here after they select “Submit Review”.</p>
          </div>
          <button onClick={() => setFilter('review')} className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold">Open review queue</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {reviewTasks.slice(0, 4).map(task => (
            <span key={task._id} className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-sm text-white/80">{task.title} · {task.assignedTo?.name || 'Unassigned'}</span>
          ))}
          {reviewTasks.length > 4 && <span className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-sm text-white/50">+{reviewTasks.length - 4} more</span>}
        </div>
      </section>
    )}

    <div className="mt-8 grid lg:grid-cols-2 gap-5">
      <section className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Create Engagement</h2><RefreshCw className="w-5 h-5 text-white/50 cursor-pointer" onClick={load}/></div>
        <form onSubmit={createEngagement} className="space-y-2">
          <div className="relative">
            <button type="button" className={`${input} text-left flex items-center justify-between`} onClick={()=>setClientPickerOpen(v=>!v)} aria-haspopup="listbox" aria-expanded={clientPickerOpen}>
              <span className={selectedClient ? 'text-white' : 'text-white/40'}>{selectedClient?.name || 'Select client'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${clientPickerOpen ? 'rotate-180' : ''}`} />
            </button>
            {clientPickerOpen && (
              <div className="absolute z-30 mt-1 w-full rounded-lg border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-white/10">
                  <input autoFocus className={input} placeholder="Search clients..." value={clientSearch} onChange={e=>setClientSearch(e.target.value)} />
                </div>
                <div className="max-h-56 overflow-y-auto p-1" role="listbox">
                  {filteredClients.map(c=><button type="button" key={c._id} className={`w-full text-left px-3 py-2 rounded-md hover:bg-white/10 ${String(c._id)===String(engagementForm.clientId) ? 'bg-emerald-500/15 text-emerald-300' : 'text-white'}`} onClick={()=>{setEngagementForm({...engagementForm,clientId:c._id});setClientPickerOpen(false);setClientSearch('')}}><span className="block font-medium">{c.name}</span>{c.email && <span className="block text-xs text-white/40">{c.email}</span>}</button>)}
                  {!filteredClients.length && <p className="px-3 py-3 text-sm text-white/50">No clients found.</p>}
                </div>
              </div>
            )}
          </div>
          <SearchableSelect required value={engagementForm.serviceTypeId} onChange={value=>setEngagementForm({...engagementForm,serviceTypeId:value})} options={services.map(s=>({value:s._id,label:s.name,secondary:s.description}))} placeholder="Select service" searchPlaceholder="Search services..." />
          <input required className={input} placeholder="Engagement title" value={engagementForm.title} onChange={e=>setEngagementForm({...engagementForm,title:e.target.value})}/>
          <input required className={input} placeholder="Period (e.g. 2026-09)" value={engagementForm.period} onChange={e=>setEngagementForm({...engagementForm,period:e.target.value})}/>
          <input required type="date" className={input} value={engagementForm.startDate} onChange={e=>setEngagementForm({...engagementForm,startDate:e.target.value})}/>
          <button className="btn flex items-center justify-center gap-2"><CalendarPlus className="w-4 h-4"/>Create Engagement</button>
        </form>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">My Engagements</h2>
        <div className="manager-engagement-scroll space-y-3">{engagements.map(e=><div key={e._id} className="p-3 rounded-lg bg-black/20 border border-white/10 flex items-center justify-between gap-3"><div><p className="font-semibold">{e.title}</p><p className="text-xs text-white/50">{e.clientId?.name || 'Client'} · {e.period}</p></div><button onClick={()=>generateNext(e)} className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-400/20 text-blue-300 text-xs">Generate Next</button></div>)}{!engagements.length&&!loading&&<p className="text-white/50">No engagements assigned.</p>}</div>
      </section>
    </div>

    <div className="mt-8 space-y-4">
      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"/><input className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40" placeholder="Search tasks by title, description, status, or employee..." value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<X className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer" onClick={()=>setSearch('')}/>}</div>
      <div className="flex gap-3 flex-wrap"><Filter className="w-4 h-4 mt-2 text-white/60"/>{[['all','All'],['open','Open'],['review','Waiting for Review'],['completed','Completed']].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={`manager-filter px-4 py-2 rounded-lg border ${filter===v ? (v==='completed'||v==='review' ? 'manager-filter-green' : 'manager-filter-blue') : 'text-white/70'}`}>{l}</button>)}</div>
    </div>

    <div className="manager-task-grid mt-6 grid lg:grid-cols-2 gap-5">
      {filteredTasks.map(task=><div key={task._id} className="manager-task-card bg-white/5 rounded-xl p-5">
        <div className="flex justify-between gap-3"><div><p className={`text-xs font-medium capitalize ${task.status==='completed'||task.status==='ready_for_review' ? 'text-emerald-300' : task.status==='waiting_for_client'||task.status==='changes_requested' ? 'text-amber-300' : task.status==='in_progress' ? 'text-blue-300' : 'text-white/60'}`}>{task.status.replaceAll('_',' ')}</p><h3 className="text-xl font-semibold mt-1">{task.title}</h3><p className="text-sm text-white/60 mt-1">{task.description || 'No description'}</p></div><UserRoundCog className="text-blue-300"/></div>
        <p className="text-xs text-white/50 mt-4">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'} · Assigned: {task.assignedTo?.name || 'Unassigned'}</p>
        {task.status === 'ready_for_review' && task.submissionNote && <div className="mt-3 rounded-lg border border-emerald-400/15 bg-emerald-500/5 p-3"><p className="text-[11px] uppercase tracking-wide text-emerald-300/80">Employee submission</p><p className="text-sm text-white/75 mt-1">{task.submissionNote}</p></div>}
        <div className="mt-4 flex flex-wrap gap-2">
          <input type="date" title="Set deadline" className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg" value={task.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : ''} onChange={e=>updateDueDate(task,e.target.value)} />
          <SearchableSelect value={task.assignedTo?._id || ''} onChange={value=>assign(task,value)} options={members.map(m=>({value:m._id,label:m.name || m.email,secondary:m.email}))} placeholder="Assign team member" searchPlaceholder="Search team members..." className="min-w-56" disabled={assigningTaskId === task._id} />
          {task.status==='ready_for_review' && <><button onClick={()=>updateStatus(task,'completed')} className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 flex gap-1 items-center"><CheckCircle2 className="w-4 h-4"/>Approve</button><button onClick={()=>updateStatus(task,'changes_requested')} className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/20 flex gap-1 items-center"><RotateCcw className="w-4 h-4"/>Send Back</button></>}
        </div>
      </div>)}
    </div>
  </div>;
}
