'use client'

import { useState, useEffect, useRef } from 'react'
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
import { DataTableFacetedFilter } from '@/components/template/table/faceted-filter'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useFilter } from './useFilter'
import { member } from './type'
import { ShadcnDailog } from '@/components/atom/dailog'
import MemberChart from './chart'
import { Icon } from '@iconify/react'
import { useModal } from "@/components/atom/modal/context"
import Modal from "@/components/atom/modal/modal"
import { Filter } from '@/components/atom/icon'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function Content<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  // Ensure data is an array
  const validData = Array.isArray(data) ? data : [];
  
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    gender: false,
    dob: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [page, setPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { modal, openModal, closeModal } = useModal()
  const loadMoreRef = useRef(null)

  const PAGE_SIZE = 20

  // Check for mobile screen on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const table = useReactTable({
    data: validData,
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

  const rankOptions = useFilter(validData as member[], 'rank')
  const skillOptions = useFilter(validData as member[], 'skill')
  const rankColumn = table.getColumn('rank')
  const skillColumn = table.getColumn('skill')

  useEffect(() => {
    setPage(0)
  }, [table.getFilteredRowModel(), columnFilters, sorting])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const filteredRows = table.getFilteredRowModel().rows
          if ((page + 1) * PAGE_SIZE < filteredRows.length) {
            setPage((prevPage) => prevPage + 1)
          }
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [page, table.getFilteredRowModel()])

  const visibleRows = table.getRowModel().rows.slice(0, (page + 1) * PAGE_SIZE)

  // Filter modal content
  const filterModalContent = (
    <div className='flex flex-col gap-4 p-4 mx-auto max-w-xs w-full'>
      <h2 className="text-xl font-semibold text-center mb-4">تصفية النتائج</h2>
      {rankColumn && (
        <DataTableFacetedFilter
          column={rankColumn}
          title='تخصص'
          options={rankOptions}
          onFilterChange={(filterValue) => {
            rankColumn.setFilterValue(filterValue)
          }}
        />
      )}
      {skillColumn && (
        <DataTableFacetedFilter
          column={skillColumn}
          title='مهارة'
          options={skillOptions}
          onFilterChange={(filterValue) => {
            skillColumn.setFilterValue(filterValue)
          }}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='اختر الاعمدة'
            variant='outline'
            className='gap-2 w-full mt-2'
          >
            <MixerHorizontalIcon className="mr-2 size-4" />
            اعمدة
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button 
        variant="default" 
        className="mt-4 w-full" 
        onClick={() => closeModal()}
      >
        تطبيق
      </Button>
    </div>
  )

  // Chart modal content
  const chartModalContent = (
    <div className="p-4 flex items-center justify-center">
      <MemberChart onClose={() => closeModal()} />
    </div>
  )

  return (
    <>
      {/* Filters */}
      <div className='flex flex-wrap items-center gap-2 md:gap-4'>
        <div className='flex gap-2 py-4 items-center'>
          <Input
            placeholder='بحث ...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='w-40 h-9'
          />
        </div>

        {/* Mobile filter trigger */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full"
              onClick={() => openModal('filter')}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => openModal('chart')}
            >
              <Icon icon='mdi:analytics' width={20} height={20} />
            </Button>
          </div>
        )}

        {/* Desktop filters */}
        {!isMobile && (
          <div className='hidden gap-4 sm:flex'>
            {rankColumn && (
              <DataTableFacetedFilter
                column={rankColumn}
                title='تخصص'
                options={rankOptions}
                onFilterChange={(filterValue) => {
                  rankColumn.setFilterValue(filterValue)
                }}
              />
            )}
            {skillColumn && (
              <DataTableFacetedFilter
                column={skillColumn}
                title='مهارة'
                options={skillOptions}
                onFilterChange={(filterValue) => {
                  skillColumn.setFilterValue(filterValue)
                }}
              />
            )}
          </div>
        )}

        {/* Column visibility and chart button as a group */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label='اختر الاعمدة'
                  variant='outline'
                  className='hidden gap-2 lg:flex reveal'
                >
                  <MixerHorizontalIcon className='mr-2 size-4' />
                  اعمدة
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full mr-1"
              onClick={() => openModal('chart')}
            >
              <Icon icon='mdi:analytics' width={24} />
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className='border-b'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
            {visibleRows.length ? (
              visibleRows.map((row) => {
                // Get member data from row
                const member = row.original as member;
                // Calculate initials for avatar fallback
                const initials = member.name
                  ? member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)
                  : "??";
                
                // Limit name to first two words
                const displayName = member.name
                  ? member.name.split(" ").slice(0, 2).join(" ")
                  : "عضو بدون اسم";
                
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => {
                      // For name column, show avatar and formatted name
                      if (cell.column.id === 'name') {
                        return (
                          <TableCell key={cell.id}>
                            <div className="flex items-center gap-3">
                              <Avatar className="hidden md:block h-6 w-6">
                                <AvatarImage src={member.image || ""} alt={member.name || "عضو"} />
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <span title={member.name}>{displayName}</span>
                            </div>
                          </TableCell>
                        );
                      }
                      // For other columns, use the default rendering
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load More Trigger */}
      {visibleRows.length < table.getFilteredRowModel().rows.length && (
        <div ref={loadMoreRef} className='text-center py-4'>
          Loading more...
        </div>
      )}

      {/* Modal */}
      {modal.open && modal.id === 'filter' && (
        <Modal content={filterModalContent} />
      )}
      {modal.open && modal.id === 'chart' && (
        <Modal content={chartModalContent} />
      )}
    </>
  )
}
