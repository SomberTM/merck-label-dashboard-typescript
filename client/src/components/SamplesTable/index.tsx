import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import {
    DataGrid,
    GridColDef,
    GridRowId,
    GridToolbar,
    GridToolbarContainer,
} from '@mui/x-data-grid'
import { Button, Checkbox, FormControl, Typography } from '@mui/material'
import { Delete, NoteAdd, Refresh, History } from '@mui/icons-material'

import { DateTime } from 'luxon'

import { Link } from 'react-router-dom'

import * as api from '../../api'
import { State, useActionCreators } from '../../redux'

import './styles.css'
import PrintLabelsDialog from '../PrintLabelsDialog'

const constantGridColumns: GridColDef[] = [
    {
        field: 'audit_id',
        headerName: 'ID',
        width: 150,
        editable: false,
    },
    {
        field: 'date_created',
        headerName: 'Date Created',
        flex: 0.6,
        type: 'date',
        editable: false,
        valueGetter(params) {
            // return DateTime.fromISO(params.value as string).toFormat(
            //     'MM/dd/yyyy'
            // )
            return DateTime.fromISO(params.value as string).toJSDate()
        },
    },
    {
        field: 'date_modified',
        headerName: 'Date Modified',
        flex: 0.6,
        type: 'date',
        editable: false,
        valueGetter(params) {
            // return DateTime.fromISO(params.value as string).toFormat(
            //     'MM/dd/yyyy'
            // )
            return DateTime.fromISO(params.value as string).toJSDate()
        },
    },
    {
        field: 'expiration_date',
        headerName: 'Expiration Date',
        flex: 0.6,
        type: 'date',
        editable: true,
        valueGetter(params) {
            // return DateTime.fromISO(params.value as string).toFormat(
            //     'MM/dd/yyyy'
            // )
            return DateTime.fromISO(params.value as string).toJSDate()
        },
        valueParser(value, params) {
            if (params === undefined) return
            const date = DateTime.fromJSDate(value).toISO()
            params.row.expiration_date = date
            return date
        },
    },
]

function isSampleExpired(sample: api.Sample) {
    if (!sample || !sample.expiration_date) return false

    if (sample.expiration_date instanceof DateTime) {
        return sample.expiration_date.toJSDate() < new Date(Date.now())
    } else {
        return (
            DateTime.fromISO(sample.expiration_date).toJSDate() <
            new Date(Date.now())
        )
    }
}

interface SamplesTableToolbarProps {
    selectedSamples: api.Sample[]
    onGenerateLabelsClick: () => void
    setFilterExpired: (bool: boolean) => void
}

const SamplesTableToolbar: React.FC<SamplesTableToolbarProps> = ({
    selectedSamples,
    onGenerateLabelsClick,
    setFilterExpired,
}) => {
    const team = useSelector((state: State) => state.team)
    const { fetchTeamsSamples, deleteSample } = useActionCreators()

    return (
        <GridToolbarContainer>
            <GridToolbar />
            <Button
                startIcon={<NoteAdd />}
                disabled={selectedSamples.length == 0}
                onClick={onGenerateLabelsClick}
            >
                Generate Label(s)
            </Button>
            <Button
                startIcon={<Delete />}
                disabled={selectedSamples.length == 0}
                onClick={() => {
                    for (const sample of selectedSamples) {
                        deleteSample(sample.id)
                    }
                }}
            >
                Delete Sample(s)
            </Button>
            <Button
                startIcon={<History />}
                disabled={selectedSamples.length != 1}
            >
                <Link
                    to={`/samples/audit/${selectedSamples[0]?.id!}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    View Audit Table
                </Link>
            </Button>
            <Button
                startIcon={<Refresh />}
                onClick={() => fetchTeamsSamples(team)}
            >
                Refresh Samples
            </Button>
            <FormControl>
                <Checkbox
                    onChange={(event) => {
                        setFilterExpired(event.target.checked)
                    }}
                />
            </FormControl>
            <Typography color='primary' variant='button'>
                FILTER EXPIRED
            </Typography>
        </GridToolbarContainer>
    )
}

const SamplesTable: React.FC = () => {
    const { team, samples, fields } = useSelector((state: State) => {
        return {
            team: state.team,
            samples: state.samples,
            fields: state.fields,
        }
    })

    const {
        fetchAllSamples,
        fetchAllFields,
        fetchTeamsSamples,
        fetchTeamsFields,
        updateSample,
    } = useActionCreators()

    const [isPrintLabelDialogOpen, setIsPrintLabelDialogOpen] = useState(false)

    useEffect(() => {
        if (team === undefined || team === '') {
            fetchAllSamples()
            fetchAllFields()
        } else {
            fetchTeamsSamples(team)
            fetchTeamsFields(team)
        }
    }, [])

    useEffect(() => {
        if (
            team === undefined ||
            team === '' ||
            fields === undefined ||
            fields[team] === undefined
        )
            return
        generateDynamicGridColDefs()
        // setGeneratedLabels([]);
    }, [team, fields])

    const [filterExpired, setFilterExpired] = useState<boolean>(false)

    const [dynamicGridColDefs, setDynamicGridColDefs] = useState<GridColDef[]>(
        []
    )

    /**
     * This is going to need some explanation.
     * From my understanding the material ui data grid stores the data that we pass
     * into the rows prop on their end. And since some of our data is nested in the
     * data object, we need to use the valueGetter prop to access the data. On the
     * other hand we need to use the valueParser prop to set the data. This is mainly
     * because dates are annoying and we need to convert them to ISO strings for prisma
     * but material ui accepts JS dates or formatted dates (MM/dd/yyyy). The valueGetter returns
     * the render value and the valueParser returns the value that is stored in the data/rows object
     * stored on material uis end.
     * @returns
     */
    const generateDynamicGridColDefs = () => {
        const dynamicGridColDefs: GridColDef[] = []

        if (
            team === undefined ||
            team === '' ||
            fields === undefined ||
            fields[team] === undefined
        )
            return setDynamicGridColDefs(dynamicGridColDefs)

        for (const field of fields[team]) {
            dynamicGridColDefs.push({
                field: field.name,
                headerName: field.display_name,
                flex: 1.0,
                editable: true,
                type: field.name.includes('date') ? 'date' : 'string',
                valueGetter(params) {
                    if (field.name.includes('date')) {
                        if (params.row.data[field.name] === undefined) {
                            params.row.data[field.name] = DateTime.now().toISO()
                            return DateTime.now().toJSDate()
                        }
                        return DateTime.fromISO(
                            params.row.data[field.name]
                        ).toJSDate()
                    }
                    return params.row.data[field.name] ?? 'N/A'
                },
                valueParser(value, params) {
                    if (params !== undefined) {
                        if (field.name.includes('date')) {
                            const date = DateTime.fromJSDate(value)
                            params.row.data[field.name] = date.toISO()
                        } else {
                            params.row.data[field.name] = value
                        }
                        return params.row.data[field.name]
                    }
                },
                filterable: false,
            })
        }

        setDynamicGridColDefs(dynamicGridColDefs)
    }

    const [selectedSamples, setSelectedSamples] = useState<api.Sample[]>([])

    const onSelectionChange = (newSelection: GridRowId[]) => {
        const newSelectedSamples: api.Sample[] = []
        for (const sample of samples[team] ?? []) {
            if (newSelection.includes(sample.id)) {
                newSelectedSamples.push(sample)
            }
        }
        setSelectedSamples(newSelectedSamples)
    }

    /**
     * This makes me dislike material ui a lot.
     */
    const onRowUpdate = (
        newRow: any,
        oldRow: any
    ) => {
        // we gettin funky

        for (const field of fields[team]) {
            const value = newRow[field.name];
            newRow.data[field.name] = value;
            delete newRow[field.name];
        }

        const newSampleData: api.UpdateSampleRequirements = {
            expiration_date: DateTime.fromJSDate(newRow.expiration_date),
            team_name: team,
            data: newRow.data
        }

        updateSample(oldRow.id as string, newSampleData)
        return newRow;
    }

    const onGenerateLabelsClick = async () => {
        setIsPrintLabelDialogOpen(true)
    }

    const columns = [
        constantGridColumns[0], // ID comes first
        ...dynamicGridColDefs, // Dynamic columns
        ...constantGridColumns.slice(1), // Rest of the columns (the 3 dates)
    ]

    let rows = samples[team] ? [...samples[team]] : []

    return (
        <>
            <div className='data-grid-container'>
                <DataGrid
                    className='data-grid'
                    rows={(filterExpired ? rows.filter(isSampleExpired) : rows)
                        // IMPORTANT: Until there is a better way to update a row (material-ui issue),
                        // we will simply sort by audit id, since it never changes edits
                        // wont cause re-ordering of rows.
                        .sort((a, b) => a.audit_id.localeCompare(b.audit_id))}
                    columns={columns}
                    onRowSelectionModelChange={onSelectionChange}
                    getRowId={(row) => row.id as string}
                    processRowUpdate={(newRow, oldRow) => {
                        return onRowUpdate(newRow, oldRow)
                    }}
                    onProcessRowUpdateError={(error) => { console.error(error) }}
                    autoPageSize
                    // pageSize={itemsPerPage}
                    // rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    // onPageSizeChange={(pageSize) => setItemsPerPage(pageSize)}
                    isCellEditable={(params) =>
                        params.field !== 'id' &&
                        params.field !== 'date_created' &&
                        params.field !== 'date_modified'
                    }
                    slots={{
                        toolbar: SamplesTableToolbar,
                    }}
                    slotProps={{
                        toolbar: {
                            selectedSamples,
                            onGenerateLabelsClick,
                            setFilterExpired,
                        },
                    }}
                    getRowClassName={(params) =>
                        isSampleExpired(params.row) ? 'expired' : ''
                    }
                    checkboxSelection
                    disableRowSelectionOnClick
                    editMode='row'
                />
            </div>
            <PrintLabelsDialog
                open={isPrintLabelDialogOpen}
                onClose={() => setIsPrintLabelDialogOpen(false)}
                samples={selectedSamples}
            />
        </>
    )
}

export default SamplesTable
