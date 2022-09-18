import { Action } from "../actions"
import { ActionTypes } from "../action-types"

interface BundlesState {
  [key: string]: {
    loading: boolean,
    code: string,
    error: string
  } | undefined
}

const initialState: BundlesState = {}

const reducer = (state: BundlesState = initialState, action: Action): BundlesState => {
  switch(action.type) {
    case ActionTypes.BUNDLE_START:
      return {
        ...state,
        [action.payload.cellId]: {
          loading: true,
          code: '',
          error: ''
        }
      }
    case ActionTypes.BUNDLE_COMPLETE:
      return {
        ...state,
        [action.payload.cellId]: {
          loading: false,
          code: action.payload.bundle.code,
          error: action.payload.bundle.error
        }
      }
    default:
      return state
  }
}

export default reducer