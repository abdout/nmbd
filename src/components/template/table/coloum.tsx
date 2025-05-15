'use client'

import React, { useState } from 'react';
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
import { member } from '../../platform/member/type'
import Link from 'next/link'
import { deleteMember } from '@/components/platform/member/action'
import { DeleteToast, ErrorToast } from '@/components/atom/toast'

interface ActionsProps {
  row: {
    original: member;
  }
}

const ActionsCell: React.FC<ActionsProps> = ({ row }) => {
  const user = row.original;
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle member deletion with server action
  const handleDelete = async (id: string) => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      const result = await deleteMember(id);
      
      if (result.success) {
        DeleteToast("تم حذف العضو بنجاح");
        // Page will refresh automatically due to the refresh interval
      } else {
        ErrorToast(result.error || "فشلت عملية الحذف");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      ErrorToast("حدث خطأ أثناء محاولة حذف العضو");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <Link href={`/dashboard/profile?id=${user._id}`}>
            ملف
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isDeleting} onClick={() => handleDelete(user._id)}>
          {isDeleting ? "جاري الحذف..." : "حذف"}
        </DropdownMenuItem> 
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<member>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            className='p-0 m-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            الاسم
            <ArrowUpDown className=' h-4 w-4' />
          </Button>
        </div>
      )
    }
  },
  {
    accessorKey: 'address',
    header: () => <div className="text-right">العنوان</div>,
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div className="text-right">
          {address}
        </div>
      );
    },
  },
  {
    accessorKey: 'gender',
    header: () => <div className="text-right">النوع</div>,
  },
  {
    accessorKey: 'rank',
    header: () => <div className="text-right">التخصص</div>,
    cell: ({ row }) => {
      const rank = row.getValue('rank');
      return (
        <div className="text-right">
          {rank ? String(rank) : 'لا يوجد'}
        </div>
      );
    }
  },
  {
    accessorKey: 'skill',
    header: () => <div className="text-right">المهارة</div>,
    cell: ({ row }) => {
      const skill = row.getValue('skill');
      return (
        <div className="text-right">
          {skill ? String(skill) : 'لا توجد'}
        </div>
      );
    }
  },
  {
    accessorKey: 'interest',
    header: () => <div className="text-right">الاهتمام</div>,
    cell: ({ row }) => {
      const interest = row.getValue('interest');
      return (
        <div className="text-right">
          {interest ? String(interest) : 'لا يوجد'}
        </div>
      );
    }
  },
  {
    accessorKey: 'dob',
    header: () => <div className="text-right">العمر</div>,    
  },
  {
    accessorKey: 'contact',
    header: () => <div className="text-right">الاتصال</div>,
    cell: ({ row }) => {
      const { phone, whatsapp } = row.original.contact || {};

      return (
        <div className='flex gap-2'>
          {phone && <a href={phone}>
            <Icon icon='ph:phone-call-thin' width={20} className='reveal'/>
            </a>}
          {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
            <Icon icon='ph:whatsapp-logo-thin' width={20} className='reveal' />
          </a>}
        </div>
      )
    },
  },
  
  {
    id: 'actions',
    cell: ActionsCell
  }
]
