'use client'

import React, { useEffect } from 'react'; // Import React and useEffect
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/react';
import { task } from '@/components/platform/task/type'
import Link from 'next/link'
import { useTask } from '@/components/platform/task/context'

const ActionsCell: React.FC<{ row: any }> = ({ row }) => {
  const { refreshTasks, tasks, deleteTask } = useTask();
  
  useEffect(() => {
    refreshTasks();
    console.log(tasks);
  }, []);

  const user = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>الضبط</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user._id)}
        >
          نسخ 
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/member/${user._id}`}>
            ملف
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>تجميد</DropdownMenuItem>
        <DropdownMenuItem onClick={() => user._id && deleteTask(user._id)}>حذف</DropdownMenuItem> 
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface StatusCircleProps {
  status: string;
}

const StatusCircle: React.FC<StatusCircleProps> = ({ status }) => {
  const statusColors: { [key: string]: string } = {
      'محايد': 'bg-gray-400',
      'جاري': 'bg-yellow-400',
      'تم': 'bg-green-400',
      'متوقف': 'bg-red-400',
  }; 
  const colorClass = statusColors[status] || 'bg-gray-400'; // Default color

  return (
      <div className={`w-4 h-4 rounded-full ${colorClass}`} />
  );
};

interface PriorityCircleProps {
  priority: string;
}

const PriorityCircle: React.FC<PriorityCircleProps> = ({ priority }) => {
  const priorityColors: { [key: string]: string } = {
      'محايد': 'bg-gray-400',
      'جاري': 'bg-yellow-400',
      'تم': 'bg-green-400',
      'متوقف': 'bg-red-400',
  }; 
  const colorClass = priorityColors[priority] || 'bg-gray-400'; // Default color

  return (
      <div className={`w-4 h-4 rounded-full ${colorClass}`} />
  );
};


export const columns: ColumnDef<task>[] = [
  {
    accessorKey: 'project',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            className='p-0 m-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            المشروع
            <ArrowUpDown className=' h-4 w-4' />
          </Button>
        </div>
      )
    }
  },
  {
    accessorKey: 'task',
    header: () => <div className="text-right">المهمة</div>,
  },
  {
    accessorKey: 'club',
    header: () => <div className="text-right">الامانة</div>,
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => (
        <div className="flex justify-center pl-4 items-center h-full">
            <StatusCircle status={row.getValue('status')} />
        </div>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'الأولوية',
    cell: ({ row }) => (
        <div className="flex justify-center pl-4 items-center h-full">
            <PriorityCircle priority={row.getValue('priority')} />
        </div>
    ),    
  },
  {
    accessorKey: 'duration',
    header: () => <div className="text-right">المدة</div>,    
  },
  {
    accessorKey: 'remark',
    header: () => <div className="text-right">ملاحظة</div>,
  },
  
  {
    id: 'actions',
    cell: ActionsCell // Use the new React component or custom hook function here
  }
]
