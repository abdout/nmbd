'use client'

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IssueType } from './type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SuccessToast } from '@/components/atom/toast';

// Status circle component
const StatusCircle: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    'pending': 'bg-gray-400',
    'stuck': 'bg-red-500',
    'in_progress': 'bg-yellow-400',
    'done': 'bg-green-500'
  };
  const colorClass = statusStyles[status] || 'bg-gray-400';

  return (
    <div className="flex justify-center">
      <div className={`w-4 h-4 rounded-full ${colorClass}`} />
    </div>
  );
};

// Priority circle component
const PriorityCircle: React.FC<{ priority: string }> = ({ priority }) => {
  const priorityStyles: Record<string, string> = {
    'high': 'bg-red-500',
    'medium': 'bg-yellow-400',
    'low': 'bg-green-500',
    'neutral': 'bg-gray-400'
  };
  const colorClass = priorityStyles[priority] || 'bg-gray-400';

  return (
    <div className="flex justify-center">
      <div className={`w-4 h-4 rounded-full ${colorClass}`} />
    </div>
  );
};

// Actions cell component
interface ActionsCellProps {
  row: { original: IssueType };
  onDelete: (id: string) => Promise<void>;
  onEdit: (issue: IssueType) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(row.original._id || '');
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={e => { e.stopPropagation(); window.location.href = `/issue/${row.original._id}`; }}>
            فتح
          </DropdownMenuItem>
          <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit(row.original); }}>
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem onClick={e => { e.stopPropagation(); handleDelete(); }} disabled={loading} className="text-red-500 hover:text-red-500">
            حذف
          </DropdownMenuItem>
          <DropdownMenuItem onClick={e => { e.stopPropagation(); window.location.href = `/issue/${row.original._id}/contribute`; }}>
            مساهمة
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const getColumns = (
  onDelete: (id: string) => Promise<void>,
  onEdit: (issue: IssueType) => void
): ColumnDef<IssueType>[] => [
  {
    accessorKey: 'repository',
    header: ({ column }) => (
      <div className="w-full text-right">
        <Button
          className='p-0 m-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          المستودع
          <ArrowUpDown className=' h-4 w-4' />
          
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const repositoryId = row.getValue('repository');
      const repositoryTitle = row.original.repositoryTitle || null;
      return (
        <div className="text-right mr-2">{repositoryTitle ? String(repositoryTitle) : 'بدون مستودع'}</div>
      );
    }
  },
  {
    accessorKey: 'issue',
    header: () => <div className="text-right">المشكلة</div>,
    cell: ({ row }) => {
      const issue = row.getValue('issue') as string;
      const tag = row.original.tag;
      return (
        <div className="">
          <span className="text-right mr-2">{issue}</span>
          {tag && (
            <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-800">
              {tag}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'club',
    header: () => <div className="text-right w-full">الامانة</div>,
    cell: ({ row }) => (
      <div className="text-right mr-2">{row.getValue('club') ? row.getValue('club') : 'لا توجد'}</div>
    )
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center w-full">الحالة</div>,
    cell: ({ row }) => <StatusCircle status={row.getValue('status') as string} />
  },
  {
    accessorKey: 'priority',
    header: () => <div className="text-center w-full">الأولوية</div>,
    cell: ({ row }) => <PriorityCircle priority={row.getValue('priority') as string} />
  },
  {
    accessorKey: 'duration',
    header: () => <div className="text-center w-full">المدة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center w-full">
        <span>{row.getValue('duration')} س</span>
      </div>
    )
  },
  {
    accessorKey: 'remark',
    header: () => <div className="text-center w-full">ملاحظة</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('remark')}</div>
    )
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-center w-full">إجراءات</div>,
    cell: ({ row }) => <ActionsCell row={row} onDelete={onDelete} onEdit={onEdit} />
  }
];

// Export columns with default empty handlers
export const columns = getColumns(
  async () => { console.warn("Delete handler not provided"); },
  () => { console.warn("Edit handler not provided"); }
);
