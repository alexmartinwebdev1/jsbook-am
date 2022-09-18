import { ActionTypes } from "../action-types"
import { Action } from "../actions"
import { Cell } from "../cell"

interface CellsState {
  loading: boolean
  error: string | null
  order: string[]
  data: {
    [key: string]: Cell
  }
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {}
}

const reducer = (state: CellsState = initialState, action: Action): CellsState => {
  switch(action.type) {
    case ActionTypes.FETCH_CELLS_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ActionTypes.FETCH_CELLS_COMPLETE:
      return {
        ...state,
        order: action.payload.map(cell => cell.id),
        data: action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell
          return acc
        }, {} as CellsState['data'])
      }
    case ActionTypes.FETCH_CELLS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case ActionTypes.SAVE_CELLS_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case ActionTypes.UPDATE_CELL:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.id]: {
            ...state.data[action.payload.id],
            content: action.payload.content
          }
        }
      }
    case ActionTypes.DELETE_CELL:
      delete state.data[action.payload]
      return {
        ...state,
        order: state.order.filter(id => id !== action.payload)
      }
    case ActionTypes.MOVE_CELL:
      const targetIndex = state.order.findIndex(el => el === action.payload.id)
      if((targetIndex === 0 && action.payload.direction === 'up') ||
      (targetIndex === state.order.length -1 && action.payload.direction === 'down')) {
        return state
      }
      const order = [...state.order]
      let newOrder = []
      let i = 0
      while(i < order.length) {
        if(i === targetIndex) {
          if(action.payload.direction === 'up') {
            newOrder[i - 1] = order[i]
            newOrder[i] = order[i - 1]
            i++
          } else {
            newOrder[i] = order[i + 1]
            newOrder[i + 1] = order[i]
            i+=2
          }
        } else {
          newOrder.push(order[i])
          i++
        }
      }
      return {
        ...state,
        order: newOrder
      }
    case ActionTypes.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId()
      }

      const foundIndex = state.order.findIndex(el => el === action.payload.id)
      if(foundIndex < 0) {
        return {
          ...state,
          data: {...state.data, [cell.id]: cell},
          order: [cell.id, ...state.order]
        }
      } else {
        const afterInsertOrder = []
        let i = 0
        let doneSwitching = false
        while(i <= state.order.length) {
          if(i === foundIndex) {
            afterInsertOrder[i] = state.order[i]
            afterInsertOrder[i + 1] = cell.id
            doneSwitching = true
            i += 2
          } else {
            if(doneSwitching) {
              afterInsertOrder[i] = state.order[i - 1]
              i++
            } else {
              afterInsertOrder[i] = state.order[i]
              i++
            }
          }
        }

        return {
          ...state,
          data: {...state.data, [cell.id]: cell},
          order: afterInsertOrder
        }
      }
    default:
      return state
  }
}

const randomId = () => {
  return Math.random().toString(36).substr(2, 5)
}

export default reducer