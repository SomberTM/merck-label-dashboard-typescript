export enum SampleActionType {
    FETCH_ALL = 'SAMPLE_FETCH_ALL',
    FETCH_TEAM = 'SAMPLE_FETCH_TEAM',
    CREATE = 'SAMPLE_CREATE',
}

export enum DeletedSampleActionType {
    FETCH_ALL = 'DELETED_SAMPLE_FETCH_ALL',
    FETCH_TEAM = 'DELETED_SAMPLE_FETCH_TEAM',
}

export enum PrinterActionType {
    FETCH_ALL = 'PRINTER_FETCH_ALL',
    CREATE = 'PRINTER_CREATE',
    UPDATE = 'PRINTER_UPDATE',
}

export enum TeamActionType {
    SET_TEAM = 'TEAM_SET_TEAM',
}

export enum TeamsActionType {
    FETCH_ALL = 'TEAMS_FETCH_ALL',
    CREATE = 'TEAMS_CREATE',
}

export enum FieldsActionType {
    FETCH_ALL = 'FIELDS_FETCH_ALL',
    FETCH_TEAM = 'FIELDS_FETCH_TEAM',
    CREATE = 'FIELDS_CREATE',
    UPDATE = 'FIELDS_UPDATE',
}

export enum LabelsActionType {
    FETCH_ALL = 'LABEL_FETCH_ALL',
    FETCH_TEAM = 'LABEL_FETCH_TEAM',
    CREATE = 'LABEL_CREATE',
}
