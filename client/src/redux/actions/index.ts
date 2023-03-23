import {
    FieldsActionType,
    PrinterActionType,
    SampleActionType,
    TeamActionType,
    TeamsActionType,
    LabelsActionType,
    DeletedSampleActionType,
} from '../action-types'

import { Sample, Printer, Team, TeamField, TeamLabel } from '../../api/types'

export interface PrinterFetchAllAction {
    type: PrinterActionType.FETCH_ALL
    payload: Printer[]
}

export interface PrinterCreateAction {
    type: PrinterActionType.CREATE
    payload: Printer
}

export interface PrinterUpdateAction {
    type: PrinterActionType.UPDATE
    payload: Printer
}

export type PrinterAction =
    | PrinterFetchAllAction
    | PrinterCreateAction
    | PrinterUpdateAction

export interface FetchTeamsSamplesAction {
    type: SampleActionType.FETCH_TEAM
    payload: {
        team: string
        samples: Sample[]
    }
}

export interface FetchAllSamplesAction {
    type: SampleActionType.FETCH_ALL
    payload: {
        [key: string]: Sample[]
    }
}

export interface SampleCreateAction {
    type: SampleActionType.CREATE
    payload: {
        team: string
        sample: Sample
    }
}

export type SampleAction =
    | FetchTeamsSamplesAction
    | FetchAllSamplesAction
    | SampleCreateAction

export interface FetchAllDeletedSamplesAction {
    type: DeletedSampleActionType.FETCH_ALL
    payload: Record<string, Sample[]>
}

export interface FetchTeamDeletedSamplesAction {
    type: DeletedSampleActionType.FETCH_TEAM
    payload: {
        team: string
        samples: Sample[]
    }
}

export type DeletedSamplesAction =
    | FetchAllDeletedSamplesAction
    | FetchTeamDeletedSamplesAction

export interface SetTeamAction {
    type: TeamActionType.SET_TEAM
    payload: string
}

export type TeamAction = SetTeamAction

export interface FetchAllTeamsAction {
    type: TeamsActionType.FETCH_ALL
    payload: Team[]
}

export interface CreateTeamAction {
    type: TeamsActionType.CREATE
    payload: Team
}

export type TeamsAction = FetchAllTeamsAction | CreateTeamAction

export interface FetchAllFieldsAction {
    type: FieldsActionType.FETCH_ALL
    payload: {
        [key: string]: TeamField[]
    }
}

export interface FetchTeamsFieldsAction {
    type: FieldsActionType.FETCH_TEAM
    payload: {
        team: string
        fields: TeamField[]
    }
}

export interface CreateFieldAction {
    type: FieldsActionType.CREATE
    payload: TeamField
}

export interface UpdateFieldAction {
    type: FieldsActionType.UPDATE
    payload: TeamField
}

export type FieldAction =
    | FetchAllFieldsAction
    | FetchTeamsFieldsAction
    | CreateFieldAction
    | UpdateFieldAction

export interface FetchAllLabelsAction {
    type: LabelsActionType.FETCH_ALL
    payload: Record<string, TeamLabel[]>
}

export interface FetchTeamsLabelsAction {
    type: LabelsActionType.FETCH_TEAM
    payload: {
        team: string
        labels: TeamLabel[]
    }
}

export interface CreateLabelAction {
    type: LabelsActionType.CREATE
    payload: TeamLabel
}

export type LabelAction =
    | FetchAllLabelsAction
    | FetchTeamsLabelsAction
    | CreateLabelAction
