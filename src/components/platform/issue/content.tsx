'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Icon } from '@iconify/react'
import { getColumns } from './coloum'
import IssueForm from './form'
import Modal from '@/components/atom/modal/modal'
import { getIssues, deleteIssue } from './action'
import { IssueType } from './type'
import { useModal } from '@/components/atom/modal/context'
import { useRouter } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { SuccessToast } from '@/components/atom/toast'

interface ContentProps {
  initialIssues: IssueType[]
}

export function Content({ initialIssues }: ContentProps) {
  const [issues, setIssues] = useState<IssueType[]>(initialIssues)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    remark: false,
    priority: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [selectedIssue, setSelectedIssue] = useState<IssueType | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null)

  const { modal, openModal, closeModal } = useModal();
  const router = useRouter();

  const refreshIssues = async () => {
    try {
      console.log('Fetching issues...');
      const response = await getIssues();
      console.log('Response from getIssues:', response);
      
      const newIssues = response.issues ?? [];
      console.log('New issues before mapping:', newIssues);
      
      const mappedIssues = newIssues.map(issue => {
        console.log('Processing issue:', issue);
        return {
          ...issue,
          _id: issue?.id || '',
          repository: issue?.repository?.id || null,
          repositoryTitle: issue?.repositoryTitle || issue?.repository?.title || null,
          issue: issue?.issue || '',
          club: issue?.club || '',
          status: issue?.status || '',
          priority: issue?.priority || '',
          duration: issue?.duration || '',
          desc: issue?.desc || '',
          label: issue?.label || '',
          tag: issue?.tag || '',
          remark: issue?.remark || ''
        };
      });
      
      console.log('Mapped issues:', mappedIssues);
      setIssues(mappedIssues);
    } catch (error) {
      console.error('Error refreshing issues:', error);
    }
  }

  const handleDelete = async (id: string) => {
    setIssueToDelete(id);
    setShowDeleteAlert(true);
  }

  const confirmDelete = async () => {
    if (issueToDelete) {
      await deleteIssue(issueToDelete);
      await refreshIssues();
      setShowDeleteAlert(false);
      setIssueToDelete(null);
      SuccessToast();
    }
  }
  
  const handleEdit = (issue: IssueType) => {
    setSelectedIssue(issue);
    openModal();
  }

  const columns = getColumns(handleDelete, handleEdit)

  const table = useReactTable({
    data: issues,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleCloseModal = async () => {
    closeModal();
    setSelectedIssue(null);
    await refreshIssues();
  }

  const handleOpenModal = () => {
    setSelectedIssue(null);
    openModal();
  }

  return (
    <>
      {/* Filters and Add Issue Button */}
      <div className='flex flex-wrap items-center justify-between gap-2 md:gap-4 py-4'>
        <div className='flex flex-wrap items-center gap-2 md:gap-4'>
          {/* Search Input */}
          <Input
            placeholder='بحث بالمشكلة ...'
            value={(table.getColumn('issue')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('issue')?.setFilterValue(event.target.value)
            }
            className='w-[180px] md:w-[200px]  h-9'
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Column visibility dropdown */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                aria-label='اختر الاعمدة'
                variant='outline'
                className='h-9 px-3 gap-2 reveal'
              >
                <MixerHorizontalIcon className='size-4' />
                <span className='hidden md:block'>الأعمدة</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className="text-right">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const arabicLabels: { [key: string]: string } = {
                    repository: 'المستودع',
                    issue: 'المشكلة',
                    club: 'الامانة',
                    status: 'الحالة',
                    priority: 'الأولوية',
                    duration: 'المدة',
                    remark: 'ملاحظة',
                    actions: 'إجراءات'
                  };
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='text-right'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {arabicLabels[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add Issue Button */}
          <Button
            variant="outline"
            className="h-9 w-9 rounded-full flex items-center justify-center p-0 mx-1.5"
            onClick={handleOpenModal}
          >
            <Icon icon="lucide:plus" className="size-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='border-t border-b rounded-none'>
        <Table className="border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="border-b border-l-0 border-r-0 px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('.actions-cell')) return;
                    router.push(`/issue/${row.original._id}`);
                  }}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-neutral-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === 'actions' ? 'actions-cell' : ''}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Issue create/edit modal */}
      {modal.open && (
        <Modal content={<IssueForm 
          onClose={handleCloseModal} 
          onSuccess={refreshIssues} 
          initialData={selectedIssue}
          isEditing={!!selectedIssue}
        />} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              لا يمكن التراجع عن هذا الإجراء بعد الحذف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse sm:justify-start">
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              حذف
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setIssueToDelete(null)}>
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Example usage in a page (server component):
// import { getIssues } from './action'
// import { Content } from './content'
//
// export default async function IssuePage() {
//   const { issues } = await getIssues()
//   return <Content initialIssues={issues} />
// }
