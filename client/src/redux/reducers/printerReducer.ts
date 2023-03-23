import { Printer } from '../../api'
import { PrinterActionType } from '../action-types'
import { PrinterAction } from '../actions'

const reducer = (state: Printer[] = [], action: PrinterAction) => {
    switch (action.type) {
        case PrinterActionType.FETCH_ALL:
            return action.payload
        case PrinterActionType.CREATE:
            if (state.find((printer) => printer.ip === action.payload.ip))
                return state

            return [...state, action.payload]
        case PrinterActionType.UPDATE:
            return state.map((printer) => {
                if (printer.ip === action.payload.ip) {
                    return action.payload
                }
                return printer
            })
        default:
            return state
    }
}

export default reducer
