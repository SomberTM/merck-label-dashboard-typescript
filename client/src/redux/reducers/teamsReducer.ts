import { Team } from '../../api'
import { TeamsActionType } from '../action-types'
import { TeamsAction } from '../actions'

const reducer = (state: Team[] = [], action: TeamsAction) => {
    switch (action.type) {
        case TeamsActionType.FETCH_ALL:
            return action.payload
        case TeamsActionType.CREATE:
            if (state.find((team) => team.name === action.payload.name))
                return state
            return [...state, action.payload]
        default:
            return state
    }
}

export default reducer
