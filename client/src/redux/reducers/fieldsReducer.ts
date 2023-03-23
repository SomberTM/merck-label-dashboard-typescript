import { TeamField } from '../../api'
import { FieldsActionType } from '../action-types'
import { FieldAction } from '../actions'

const reducer = (
    state: Record<string, TeamField[]> = {},
    action: FieldAction
) => {
    switch (action.type) {
        case FieldsActionType.FETCH_ALL:
            return action.payload
        case FieldsActionType.FETCH_TEAM:
            return {
                ...state,
                [action.payload.team]: action.payload.fields,
            }
        case FieldsActionType.CREATE:
            return {
                ...state,
                [action.payload.team_name]: [
                    ...state[action.payload.team_name],
                    action.payload,
                ],
            }
        case FieldsActionType.UPDATE:
            return {
                ...state,
                [action.payload.team_name]: state[action.payload.team_name].map(
                    (field) => {
                        if (field.name === action.payload.name) {
                            return action.payload
                        }
                        return field
                    }
                ),
            }
        default:
            return state
    }
}

export default reducer
