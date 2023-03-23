import { Sample } from '../../api'
import { DeletedSampleActionType } from '../action-types'
import { DeletedSamplesAction } from '../actions'

const reducer = (
    state: Record<string, Sample[]> = {},
    action: DeletedSamplesAction
) => {
    switch (action.type) {
        case DeletedSampleActionType.FETCH_ALL:
            return action.payload
        case DeletedSampleActionType.FETCH_TEAM:
            return { ...state, [action.payload.team]: action.payload.samples }
        default:
            return state
    }
}

export default reducer
