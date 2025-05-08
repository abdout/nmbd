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
  getPaginationRowModel,
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
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { PopoverContent, Popover, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { PlusCircledIcon } from '@radix-ui/react-icons'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  statusOptions: { value: string; label: string }[]
  roleOptions: { value: string; label: string }[]
  onStatusChange: (status: string) => void
  onRoleChange: (role: string) => void
  currentStatus: string
  currentRole: string
}

export function UserTable<TData, TValue>({
  columns,
  data,
  statusOptions,
  roleOptions,
  onStatusChange,
  onRoleChange,
  currentStatus,
  currentRole
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [isRoleOpen, setIsRoleOpen] = useState(false)

  // Response filter options
  const responseOptions = [
    { value: "ALL", label: "الكل" },
    { value: "APPROVED", label: "مقبول" },
    { value: "REJECTED", label: "مرفوض" },
    { value: "NO_RESPONSE", label: "بدون رد" },
  ]

  // Handler for response filter
  const handleResponseChange = (value: string) => {
    if (value === "APPROVED") {
      onStatusChange("APPROVED");
    } else if (value === "REJECTED") {
      onStatusChange("REJECTED");
    } else if (value === "NO_RESPONSE") {
      onStatusChange("NO_RESPONSE");
    } else {
      onStatusChange("ALL");
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      {/* Filters */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='بحث بالاسم ...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>
        
        {/* Status Filter (الطلب) */}
        <Popover open={isStatusOpen} onOpenChange={setIsStatusOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <PlusCircledIcon className="mr-2 size-4" />
               الطلب
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[103px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                {statusOptions.filter(opt => opt.value === "ALL" || opt.value === "COMPLETED" || opt.value === "INCOMPLETE").map((option, index) => (
                  <>
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onStatusChange(option.value);
                        setIsStatusOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                    </CommandItem>
                    {index === 0 && <DropdownMenuSeparator />}
                  </>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Response Filter (الرد) */}
        <Popover open={isResponseOpen} onOpenChange={setIsResponseOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <PlusCircledIcon className="mr-2 size-4" />
              الرد
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[103px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                {responseOptions.map((option, index) => (
                  <>
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        handleResponseChange(option.value);
                        setIsResponseOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                    </CommandItem>
                    {index === 0 && <DropdownMenuSeparator />}
                  </>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Role Filter */}
        <Popover open={isRoleOpen} onOpenChange={setIsRoleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <PlusCircledIcon className="mr-2 size-4" />
              الدور
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[93px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                {roleOptions.map((option, index) => (
                  <>
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onRoleChange(option.value);
                        setIsRoleOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                    </CommandItem>
                    {index === 0 && <DropdownMenuSeparator />}
                  </>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Column visibility */}
        {/* 
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="اختر الاعمدة"
              variant="outline"
              className="ml-auto gap-2 lg:flex reveal"
            >
              <MixerHorizontalIcon className="mr-2 size-4" />
              اعمدة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        */}
      </div>

      {/* Table */}
      <div className='border-b pt-6'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-4 gap-4 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          السابق
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          التالي
        </Button>
      </div>
    </>
  )
} 