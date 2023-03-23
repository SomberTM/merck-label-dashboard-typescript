import { useDispatch } from 'react-redux'
import * as actionCreators from './action-creators'
import { bindActionCreators } from 'redux'

export const useActionCreators = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actionCreators, dispatch)
}

export const useFetchAll = () => {
    const {
        fetchAllSamples,
        fetchAllPrinters,
        fetchAllTeams,
        fetchAllFields,
        fetchAllLabels,
    } = useActionCreators()

    return () => {
        fetchAllSamples()
        fetchAllPrinters()
        fetchAllTeams()
        fetchAllFields()
        fetchAllLabels()
    }
}

export const useFetchTeam = () => {
    const {
        fetchTeamsDeletedSamples,
        fetchTeamsFields,
        fetchTeamsLabels,
        fetchTeamsSamples,
    } = useActionCreators()

    return (teamName: string) => {
        fetchTeamsDeletedSamples(teamName)
        fetchTeamsFields(teamName)
        fetchTeamsLabels(teamName)
        fetchTeamsSamples(teamName)
    }
}

export * as actionCreators from './action-creators'
export * from './store'
export * from './reducers'
