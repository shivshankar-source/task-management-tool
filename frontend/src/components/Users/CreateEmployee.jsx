import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../../utils/api';

const CreateEmployee = ({ employees = [], setEmployees }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'team_member' });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const created = {
        ...data,
        id: data._id || data.id,
        firstName: data.name,
        tasks: [],
        taskCounts: { newTask: 0, active: 0, completed: 0, failed: 0 },
      };
      const next = [...employees, created];
      setEmployees(next);
      localStorage.setItem('employees', JSON.stringify(next));
      toast.success(`${form.role === 'manager' ? 'Manager' : 'Employee'} created successfully`);
      setForm({ name: '', email: '', password: '', role: 'team_member' });
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">User management</h3>
          <p className="text-sm text-white/50">Create employees and managers for your team.</p>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600">
          {open ? 'Close' : '+ Create Employee'}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={update} required placeholder="Full name" className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white outline-none" />
          <input name="email" type="email" value={form.email} onChange={update} required placeholder="Email address" className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white outline-none" />
          <input name="password" type="password" minLength="6" value={form.password} onChange={update} required placeholder="Temporary password" className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white outline-none" />
          <select name="role" value={form.role} onChange={update} className="rounded-xl bg-slate-800 border border-white/20 px-4 py-3 text-white outline-none">
            <option value="team_member">Team Member</option>
            <option value="manager">Manager</option>
          </select>
          <button disabled={saving} type="submit" className="md:col-span-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save User'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateEmployee;
