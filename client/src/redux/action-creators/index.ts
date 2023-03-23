import { Dispatch } from 'redux'
import {
    DeletedSamplesAction,
    FieldAction,
    LabelAction,
    PrinterAction,
    SampleAction,
    TeamAction,
    TeamsAction,
} from '../actions'
import {
    DeletedSampleActionType,
    FieldsActionType,
    LabelsActionType,
    PrinterActionType,
    SampleActionType,
    TeamActionType,
    TeamsActionType,
} from '../action-types'

import * as api from '../../api'

// ---------------------- SAMPLES ----------------------

export const fetchTeamsSamples = (team: string) => {
    return async (dispatch: Dispatch<SampleAction>) => {
        const samples = await api.getTeamSamples(team)

        dispatch({
            type: SampleActionType.FETCH_TEAM,
            payload: {
                team,
                samples,
            },
        })
    }
}

export const fetchAllSamples = () => {
    return async (dispatch: Dispatch<SampleAction>) => {
        const data = await api.getAllSamples()

        dispatch({
            type: SampleActionType.FETCH_ALL,
            payload: data,
        })
    }
}

export const createSample = (
    team: string,
    sample: api.CreateSampleRequirements
) => {
    return async (dispatch: Dispatch<SampleAction>) => {
        if (!sample.hasOwnProperty('team_name'))
            // @ts-ignore
            sample.team_name = team
        const data = await api.createSample(sample)

        dispatch({
            type: SampleActionType.CREATE,
            payload: {
                team,
                sample: data,
            },
        })
    }
}

export const updateSample = (
    id: string,
    sample: api.UpdateSampleRequirements
) => {
    return async (dispatch: Dispatch<SampleAction>) => {
        const data = await api.updateSample(id, sample)
        fetchTeamsSamples(data.team_name)(dispatch)
    }
}

export const deleteSample = (id: string) => {
    return async (dispatch: Dispatch<SampleAction>) => {
        const data = await api.deleteSample(id)
        fetchTeamsSamples(data.team_name)(dispatch)
    }
}

export const deleteSamples = (ids: string[]) => {
    return async (dispatch: Dispatch<SampleAction>) => {
        if (ids.length === 0) return
        const deleted = await api.deleteSamples(ids)
        fetchTeamsSamples(deleted[0].team_name)(dispatch)
    }
}

export const fetchAllDeletedSamples = () => {
    return async (dispatch: Dispatch<DeletedSamplesAction>) => {
        const data = await api.getAllDeletedSamples()
        dispatch({
            type: DeletedSampleActionType.FETCH_ALL,
            payload: data,
        })
    }
}

export const fetchTeamsDeletedSamples = (team: string) => {
    return async (dispatch: Dispatch<DeletedSamplesAction>) => {
        const data = await api.getAllDeletedSamples()
        dispatch({
            type: DeletedSampleActionType.FETCH_TEAM,
            payload: {
                team,
                samples: data[team],
            },
        })
    }
}

// ---------------------- TEAM ----------------------

export const setTeam = (team: string) => {
    return (dispatch: Dispatch<TeamAction>) => {
        dispatch({
            type: TeamActionType.SET_TEAM,
            payload: team,
        })
    }
}

export const deleteTeam = (team: string) => {
    return async (dispatch: Dispatch<TeamAction>) => {
        const data = await api.deleteTeam(team)
        fetchAllTeams()(dispatch)
    }
}

// ---------------------- TEAMS ----------------------

export const fetchAllTeams = () => {
    return async (dispatch: Dispatch<TeamsAction>) => {
        const data = await api.getAllTeams()

        dispatch({
            type: TeamsActionType.FETCH_ALL,
            payload: data,
        })
    }
}

export const createTeam = (team: api.CreateTeamRequirements) => {
    return async (dispatch: Dispatch<TeamsAction>) => {
        const data = await api.createTeam(team)

        dispatch({
            type: TeamsActionType.CREATE,
            payload: data,
        })
    }
}

// ---------------------- PRINTERS ----------------------

export const fetchAllPrinters = () => {
    return async (dispatch: Dispatch<PrinterAction>) => {
        const printers = await api.getAllPrinters()

        dispatch({
            type: PrinterActionType.FETCH_ALL,
            payload: printers,
        })
    }
}

export const fetchPrinter = (ip: string) => {
    return async (dispatch: Dispatch<PrinterAction>) => {
        const printer = await api.getPrinter(ip)

        dispatch({
            type: PrinterActionType.CREATE,
            payload: printer,
        })
    }
}

export const createPrinter = (printer: api.CreatePrinterRequirements) => {
    return async (dispatch: Dispatch<PrinterAction>) => {
        const data = await api.createPrinter(printer)

        dispatch({
            type: PrinterActionType.CREATE,
            payload: data,
        })
    }
}

export const updatePrinter = (
    ip: string,
    printer: api.UpdatePrinterRequirements
) => {
    return async (dispatch: Dispatch<PrinterAction>) => {
        const data = await api.updatePrinter(ip, printer)
        dispatch({
            type: PrinterActionType.UPDATE,
            payload: data,
        })
    }
}

export const deletePrinter = (ip: string) => {
    return async (dispatch: Dispatch<PrinterAction>) => {
        const data = await api.deletePrinter(ip)
        fetchAllPrinters()(dispatch)
    }
}

// ---------------------- FIELDS ----------------------

export const fetchAllFields = () => {
    return async (dispatch: Dispatch<FieldAction>) => {
        const data = await api.getAllFields()
        dispatch({
            type: FieldsActionType.FETCH_ALL,
            payload: data,
        })
    }
}

export const fetchTeamsFields = (team: string) => {
    return async (dispatch: Dispatch<FieldAction>) => {
        const data = await api.getTeamFields(team)
        dispatch({
            type: FieldsActionType.FETCH_TEAM,
            payload: {
                team,
                fields: data,
            },
        })
    }
}

export const createField = (field: api.CreateTeamFieldRequirements) => {
    return async (dispatch: Dispatch<FieldAction>) => {
        const data = await api.createTeamField(field)
        dispatch({
            type: FieldsActionType.CREATE,
            payload: data,
        })
    }
}

export const updateField = (
    id: number,
    field: api.UpdateTeamFieldRequirements
) => {
    return async (dispatch: Dispatch<FieldAction>) => {
        const data = await api.updateTeamField(id, field)
        fetchTeamsFields(data.team_name)(dispatch)
    }
}

export const deleteField = (id: number) => {
    return async (dispatch: Dispatch<FieldAction>) => {
        const data = await api.deleteTeamField(id)
        fetchTeamsFields(data.team_name)(dispatch)
    }
}

// ---------------------- LABELS ----------------------

export const fetchAllLabels = () => {
    return async (dispatch: Dispatch<LabelAction>) => {
        const data = await api.getAllLabels()
        dispatch({
            type: LabelsActionType.FETCH_ALL,
            payload: data,
        })
    }
}

export const fetchTeamsLabels = (team: string) => {
    return async (dispatch: Dispatch<LabelAction>) => {
        const data = await api.getTeamLabels(team)
        dispatch({
            type: LabelsActionType.FETCH_TEAM,
            payload: {
                team,
                labels: data,
            },
        })
    }
}

export const createLabel = (label: api.CreateTeamLabelRequirements) => {
    return async (dispatch: Dispatch<LabelAction>) => {
        const data = await api.createLabel(label)
        dispatch({
            type: LabelsActionType.CREATE,
            payload: data,
        })
    }
}

export const updateLabel = (
    id: number,
    label: api.UpdateTeamLabelRequirements
) => {
    return async (dispatch: Dispatch<LabelAction>) => {
        const data = await api.updateLabel(id, label)
        fetchTeamsLabels(data.team_name)(dispatch)
    }
}

export const deleteLabel = (id: number) => {
    return async (dispatch: Dispatch<LabelAction>) => {
        const data = await api.deleteLabel(id)
        fetchTeamsLabels(data.team_name)(dispatch)
    }
}
