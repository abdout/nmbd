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
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useFilter } from './filter'
// import { ShadcnDailog } from '@/components/atom/dailog'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@iconify/react'
import { useModal } from '@/components/atom/modal/context'
import Create from '@/components/platform/task/create'
import Modal from '@/components/atom/modal/modal'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function Content<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    gender: false,
    dob: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [page, setPage] = useState(0)
  const loadMoreRef = useRef(null)

  const PAGE_SIZE = 20

  const table = useReactTable({
    data,
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

  const statusOptions = useFilter('status')
  // const priorityOptions = useFilter('priority')
  const statusColumn = table.getColumn('status')
  // const priorityColumn = table.getColumn('priority')

  // const [ setOpen] = useState(false)

  // const handleClose = () => {
  //   setOpen(false)
  // }

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

  const { modal, openModal, closeModal } = useModal()

  const handleCloseModal = () => {
    closeModal()
  }

  return (
    <>
      {modal.open && modal.id === null && <Modal content={<Create onClose={handleCloseModal} />} />}
      <Button
        size='icon'
        className="fixed bottom-8 right-8 rounded-full bg-black reveal-less shadow-lg w-12 h-12"
        onClick={() => openModal(null)}
      >
        <Icon icon="ic:sharp-plus" width={30} />
      </Button>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-2 md:gap-4'>
        <div className='flex gap-2 py-4'>

          <Input
            placeholder='بحث بالاسم ...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='w-40'
          />
        </div>

        {/* Mobile filter trigger */}
        <div className='block sm:hidden'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost'>
                <Icon icon='mdi:filter' width={30} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className='flex flex-col gap-4'>


                {/* Filters inside modal */}
                {statusColumn && (
                  <DataTableFacetedFilter
                    column={statusColumn}
                    title='الحالة'
                    options={statusOptions}
                    onFilterChange={(filterValue) => {
                      statusColumn.setFilterValue(filterValue)
                    }}
                  />
                )}
                {/* {skillColumn && (
                  <DataTableFacetedFilter
                    column={skillColumn}
                    title='مهارة'
                    options={skillOptions}
                    onFilterChange={(filterValue) => {
                      skillColumn.setFilterValue(filterValue)
                    }}
                  />
                )} */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label='اختر الاعمدة'
                      variant='outline'
                      className='ml-auto hidden gap-2 lg:flex reveal'
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
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Desktop filters */}
        <div className='hidden gap-4 sm:flex'>
          {statusColumn && (
            <DataTableFacetedFilter
              column={statusColumn}
              title='الحالة'
              options={statusOptions}
              onFilterChange={(filterValue) => {
                statusColumn.setFilterValue(filterValue)
              }}
            />
          )}
          {/* {skillColumn && (
            <DataTableFacetedFilter
              column={skillColumn}
              title='مهارة'
              options={skillOptions}
              onFilterChange={(filterValue) => {
                skillColumn.setFilterValue(filterValue)
              }}
            />
          )} */}
        </div>

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label='اختر الاعمدة'
              variant='outline'
              className='ml-auto hidden gap-2 lg:flex reveal'
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
              visibleRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
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
    </>
  )
}
