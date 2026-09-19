import React from 'react'

const TaskListNumbers = ({data}) => {
  const cards = [
    { value: data.taskCounts.newTask, label: 'New Task', cls: 'employee-stat employee-stat-blue' },
    { value: data.taskCounts.completed, label: 'Completed Task', cls: 'employee-stat employee-stat-green' },
    { value: data.taskCounts.active, label: 'Accepted Task', cls: 'employee-stat employee-stat-amber' },
    { value: data.taskCounts.failed, label: 'Failed Task', cls: 'employee-stat employee-stat-red' },
  ];
  return (
    <div className='flex mt-8 justify-between gap-4 flex-wrap'>
      {cards.map((card) => (
        <div key={card.label} className={`${card.cls} rounded-2xl flex-1 min-w-[220px] py-5 px-7`}>
          <h2 className='text-3xl font-bold'>{card.value}</h2>
          <h3 className='text-base mt-1 font-medium text-white/80'>{card.label}</h3>
        </div>
      ))}
    </div>
  )
}

export default TaskListNumbers
