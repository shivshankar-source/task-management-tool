import React from 'react';
import { AlertCircle } from 'lucide-react';
const FailedTask = ({data,onOpen}) => <div onClick={()=>onOpen?.(data)} role='button' tabIndex={0} className='cursor-pointer employee-task-card employee-task-failed flex-shrink-0 h-full w-[300px] p-5 rounded-2xl'>
  <div className='flex justify-between items-center'><h3 className='employee-task-status employee-status-failed'>FAILED</h3><h4 className='text-sm text-white/70'>{data.taskDate?new Date(data.taskDate).toLocaleDateString():'—'}</h4></div>
  <div className='mt-4'><span className='employee-priority'>Priority: <b>{data.priority || 'Medium'}</b></span></div>
  <h2 className='mt-5 text-2xl font-semibold text-white'>{data.taskTitle}</h2><p className='text-sm mt-2 text-white/70'>{data.taskDescription || 'No description'}</p>
  <div className='mt-6'><button className='employee-task-action employee-action-red'><AlertCircle className='w-3.5 h-3.5'/>Failed</button></div>
</div>;
export default FailedTask;
