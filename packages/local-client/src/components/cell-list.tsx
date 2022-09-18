import './cell-list.css'
import React, { useEffect } from 'react'
import { useTypedSelector } from "../hooks/use-typed-selector"
import CellListItem from "./cell-list-item"
import AddCell from "./add-cell"
import { useActions } from '../hooks/use-actions'

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => order.map(id => data[id]))
  const { fetchCells } = useActions()

  useEffect(() => {
    fetchCells()
  }, [])

  return <div className='cell-list'>
    <AddCell forceVisible={cells.length === 0} previousCellId={null} />
    {
      cells.map(cell => {
      return <React.Fragment key={cell.id}>
        <CellListItem key={cell.id} cell={cell} />
        <AddCell previousCellId={cell.id} />
      </React.Fragment>
    })
    }
  </div>
}

export default CellList