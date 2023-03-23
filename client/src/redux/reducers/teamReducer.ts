import { TeamActionType } from '../action-types'
import { TeamAction } from '../actions'

const reducer = (state: string = '', action: TeamAction) => {
    switch (action.type) {
        case TeamActionType.SET_TEAM:
            return action.payload
        default:
            return state
    }
}

export default reducer
