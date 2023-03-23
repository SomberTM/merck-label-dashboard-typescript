import { DateTime } from 'luxon'

export interface Sample {
    id: string
    audit_id: string
    audit_number: number
    date_created: DateTime
    date_modified: DateTime
    expiration_date: DateTime
    team_name: string
    data: {
        [key: string]: any
    }
}

export type CreateSampleRequirements = Partial<
    Omit<Sample, 'data' | 'id' | 'audit_id' | 'audit_number'>
> &
    Record<'data', Sample['data']>
export type UpdateSampleRequirements = Partial<
    Omit<Sample, 'id' | 'audit_id' | 'audit_number' | 'data'>
> &
    Record<'data', Sample['data']> &
    Record<'team_name', Sample['team_name']>
export type DeleteSampleRequirements = Pick<Sample, 'id'>

export interface Team {
    name: string
}

export type CreateTeamRequirements = Pick<Team, 'name'>
export type UpdateTeamRequirements = Pick<Team, 'name'>
export type DeleteTeamRequirements = Pick<Team, 'name'>

export interface TeamField {
    id: number
    team_name: string
    name: string
    display_name: string
}

export type CreateTeamFieldRequirements = Pick<
    TeamField,
    'team_name' | 'name' | 'display_name'
>
export type UpdateTeamFieldRequirements = Required<
    Pick<TeamField, 'id' | 'name'>
> &
    Partial<Pick<TeamField, 'display_name' | 'team_name'>>
export type DeleteTeamFieldRequirements = Pick<TeamField, 'id'>

export interface TeamLabelEntityPosition {
    x: number
    y: number
}

export interface TeamLabelEntity {
    text: string
    textSize: number
    bold: boolean
    italic: boolean
    position: TeamLabelEntityPosition
}

export interface TeamLabel {
    id: number
    team_name: string
    name: string
    width: number
    length: number
    data: TeamLabelEntity[]
}

export type CreateTeamLabelRequirements = Omit<TeamLabel, 'id'>

export type UpdateTeamLabelRequirements = Omit<TeamLabel, 'id'>

export interface Printer {
    ip: string
    name: string
    location: string
}

export type CreatePrinterRequirements = Pick<Printer, 'ip'> &
    Partial<Pick<Printer, 'name' | 'location'>>
export type UpdatePrinterRequirements = Partial<
    Pick<Printer, 'ip' | 'name' | 'location'>
>
