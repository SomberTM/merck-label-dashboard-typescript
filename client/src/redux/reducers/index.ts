import { combineReducers } from 'redux'

import samplesReducer from './sampleReducer'
import deletedSamplesReducer from './deletedSamplesReducer'
import teamReducer from './teamReducer'
import teamsReducer from './teamsReducer'
import printersReducer from './printerReducer'
import fieldsReducer from './fieldsReducer'
import labelsReducer from './labelsReducer'

const reducers = combineReducers({
    printers: printersReducer,
    samples: samplesReducer,
    deletedSamples: deletedSamplesReducer,
    team: teamReducer,
    teams: teamsReducer,
    fields: fieldsReducer,
    labels: labelsReducer,
})

export default reducers

export type SampleState = ReturnType<typeof samplesReducer>
export type TeamState = ReturnType<typeof teamReducer>
export type PrinterState = ReturnType<typeof printersReducer>
export type TeamsState = ReturnType<typeof teamsReducer>
export type FieldsState = ReturnType<typeof fieldsReducer>

export type State = ReturnType<typeof reducers>
