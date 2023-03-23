import { TeamLabel } from '../../api'
import { LabelsActionType } from '../action-types'
import { LabelAction } from '../actions'

const reducer = (
    state: Record<string, TeamLabel[]> = {},
    action: LabelAction
) => {
    switch (action.type) {
        case LabelsActionType.FETCH_ALL:
            return action.payload
        case LabelsActionType.FETCH_TEAM:
            return {
                ...state,
                [action.payload.team]: action.payload.labels,
            }
        case LabelsActionType.CREATE:
            if (
                state[action.payload.team_name].find(
                    (label) =>
                        label.width === action.payload.width &&
                        label.length === action.payload.length
                )
            )
                return state
            return {
                ...state,
                [action.payload.team_name]: [
                    ...state[action.payload.team_name],
                    action.payload,
                ],
            }
        default:
            return state
    }
}

export default reducer
