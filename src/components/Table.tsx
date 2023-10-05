import * as React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getShortAddress } from '@/lib/utils'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

type Offer = {
  price: string
  quantity: number,
  floorDifference: string,
  from: string
}

const defaultData: Offer[] = [
  {
    price: '1.3',
    quantity: 1,
    floorDifference: '2',
    from: '0x5e7b8177b0d3bc1847db2f8b3cb8dd9466400932'
  },
  {
    price: '0.8',
    quantity: 1,
    floorDifference: '3',
    from: '0xc1d457128dEcAE1CC092728262469Ee796F1Ac45'
  },
  {
    price: '1.1',
    quantity: 1,
    floorDifference: '1',
    from: '0x5e7b8177b0d3bc1847db2f8b3cb8dd9466400932'
  },
  {
    price: '0.6',
    quantity: 1,
    floorDifference: '4',
    from: '0xc1d457128dEcAE1CC092728262469Ee796F1Ac45'
  }
]

const columnHelper = createColumnHelper<Offer>()

const columns = [
  columnHelper.accessor('price', {
    header: () => 'Price',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('quantity', {
    header: () => 'Quantity',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('floorDifference', {
    header: () => <span>Floor Difference</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('from', {
    header: 'From',
    footer: info => info.column.id,
    cell: info => getShortAddress(info.renderValue() ?? '')
  }),
]

export const Table = () => {
  const [data, setData] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-scroll ">
      <table className='w-full'>
        <thead className=''>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="whitespace-nowrap p-2 border-solid border-white border-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='h-[40px] overflow-y-scroll'>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2 border-solid border-white border-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
      {/* <div className="h-4" /> */}
      {/* <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}
    </div>
  )
}

