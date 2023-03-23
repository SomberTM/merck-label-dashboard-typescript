import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import {
    DataGrid,
    GridColDef,
    GridRowId,
    GridToolbar,
    GridToolbarContainer,
} from '@mui/x-data-grid'
import { Button } from '@mui/material'
import { Delete, NoteAdd, Refresh, History } from '@mui/icons-material'

import { DateTime } from 'luxon'

import { Sample } from '../../api'
import { State, useActionCreators } from '../../redux'

import './styles.css'

interface SamplesTableToolbarProps {
    selectedSamples: Sample[]
}

const SamplesTableToolbar: React.FC<SamplesTableToolbarProps> = ({
    selectedSamples,
}) => {
    const team = useSelector((state: State) => state.team)
    const { fetchTeamsDeletedSamples } = useActionCreators()

    return (
        <GridToolbarContainer>
            <GridToolbar />

            <Button
                startIcon={<Refresh />}
                onClick={() => fetchTeamsDeletedSamples(team)}
            >
                Refresh Samples
            </Button>
        </GridToolbarContainer>
    )
}

const constantGridColumns: GridColDef[] = [
    {
        field: 'id',
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
            return DateTime.fromISO(params.value as string).toJSDate()
        },
    },
]

const DeletedSamplesTable: React.FC = () => {
    const { team, deletedSamples, fields } = useSelector((state: State) => {
        return {
            team: state.team,
            deletedSamples: state.deletedSamples,
            fields: state.fields,
        }
    })

    const {
        fetchAllDeletedSamples,
        fetchAllFields,
        fetchTeamsDeletedSamples,
        fetchTeamsFields,
    } = useActionCreators()

    useEffect(() => {
        if (team === undefined || team === '') {
            fetchAllDeletedSamples()
            fetchAllFields()
        } else {
            fetchTeamsDeletedSamples(team)
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
    }, [team, fields])

    const [dynamicGridColDefs, setDynamicGridColDefs] = useState<GridColDef[]>(
        []
    )

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
            })
        }

        setDynamicGridColDefs(dynamicGridColDefs)
    }

    const [selectedSamples, setSelectedSamples] = useState<Sample[]>([])

    const onSelectionChange = (newSelection: GridRowId[]) => {
        const newSelectedSamples: Sample[] = []
        for (const sample of deletedSamples[team] ?? []) {
            if (newSelection.includes(sample.id)) {
                newSelectedSamples.push(sample)
            }
        }
        setSelectedSamples(newSelectedSamples)
    }

    // const [itemsPerPage, setItemsPerPage] = useState(10)

    return (
        <>
            <div className='data-grid-container'>
                <DataGrid
                    className='data-grid'
                    rows={deletedSamples[team] ?? []}
                    columns={[
                        constantGridColumns[0],
                        ...dynamicGridColDefs,
                        ...constantGridColumns.slice(1),
                    ]}
                    onRowSelectionModelChange={onSelectionChange}
                    autoPageSize
                    // pageSize={itemsPerPage}
                    // rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    // onPageSizeChange={(pageSize) => setItemsPerPage(pageSize)}
                    components={{
                        Toolbar: SamplesTableToolbar,
                    }}
                    componentsProps={{
                        toolbar: { selectedSamples },
                    }}
                    checkboxSelection
                />
            </div>
        </>
    )
}

export default DeletedSamplesTable
