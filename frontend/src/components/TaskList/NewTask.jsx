import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import toast from 'react-hot-toast';
const NewTask = ({ data, onChanged }) => {
  const [busy,setBusy]=useState(false);
  const update=async(status)=>{try{setBusy(true);await apiRequest(`/tasks/${data.id}/status`,{method:'PATCH',body:JSON.stringify({status})});toast.success('Task started');onChanged?.()}catch(e){toast.error(e.message)}finally{setBusy(false)}};
  return <div className='employee-task-card employee-task-new flex-shrink-0 h-full w-[300px] p-5 rounded-2xl'>
    <div className='flex justify-between items-center'><h3 className='employee-task-status'>NEW</h3><h4 className='text-sm text-white/70'>{data.taskDate?new Date(data.taskDate).toLocaleDateString():'—'}</h4></div>
    <div className='mt-4'><span className='employee-priority'>Priority: <b>{data.priority || 'Medium'}</b></span></div>
    <h2 className='mt-5 text-2xl font-semibold text-white'>{data.taskTitle}</h2><p className='text-sm mt-2 text-white/70'>{data.taskDescription || 'No description'}</p>
    <div className='mt-6'><button disabled={busy} onClick={()=>update('in_progress')} className='employee-task-action employee-action-blue'><Play className='w-3.5 h-3.5' />{busy?'Updating...':'Start Task'}</button></div>
  </div>;
};
export default NewTask;
