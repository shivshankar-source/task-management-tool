import React, { useState } from 'react';
import { ArrowRight, Clock3, Send } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import toast from 'react-hot-toast';
const AcceptTask = ({ data, onChanged }) => {
  const [busy,setBusy]=useState(false);
  const update=async(status)=>{try{setBusy(true);await apiRequest(`/tasks/${data.id}/status`,{method:'PATCH',body:JSON.stringify({status})});toast.success(status==='ready_for_review'?'Submitted for review':'Task moved to waiting for client');onChanged?.()}catch(e){toast.error(e.message)}finally{setBusy(false)}};
  const isWaiting=data.active && data.status==='waiting_for_client';
  const isReview=data.status==='ready_for_review';
  const isChanges=data.status==='changes_requested';
  return <div className='employee-task-card employee-task-active flex-shrink-0 h-full w-[300px] p-5 rounded-2xl'>
    <div className='flex justify-between items-center'><h3 className='employee-task-status employee-status-active'>{isReview?'REVIEW':isWaiting?'WAITING':'ACTIVE'}</h3><h4 className='text-sm text-white/70'>{data.taskDate?new Date(data.taskDate).toLocaleDateString():'—'}</h4></div>
    <div className='mt-4'><span className='employee-priority'>Priority: <b>{data.priority || 'Medium'}</b></span></div>
    <h2 className='mt-5 text-2xl font-semibold text-white'>{data.taskTitle}</h2><p className='text-sm mt-2 text-white/70'>{data.taskDescription || 'No description'}</p>
    <div className='flex justify-between mt-6 gap-2'>
      {isReview?<button disabled className='employee-task-action employee-action-blue opacity-70'><Send className='w-3.5 h-3.5'/>Submitted</button>:isWaiting||isChanges?<button disabled={busy} onClick={()=>update('in_progress')} className='employee-task-action employee-action-blue'><ArrowRight className='w-3.5 h-3.5'/>{busy?'Updating...':'Continue Task'}</button>:<><button disabled={busy} onClick={()=>update('waiting_for_client')} className='employee-task-action employee-action-amber'><Clock3 className='w-3.5 h-3.5'/>Waiting for Client</button><button disabled={busy} onClick={()=>update('ready_for_review')} className='employee-task-action employee-action-green'><Send className='w-3.5 h-3.5'/>Submit Review</button></>}
    </div>
  </div>;
};
export default AcceptTask;
