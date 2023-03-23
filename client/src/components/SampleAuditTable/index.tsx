import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { DateTime } from 'luxon'

import * as api from '../../api'
import { State, useActionCreators } from '../../redux'

import './styles.css'

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

interface SampleAuditTableProps {
    sampleId: string
}

const SampleAuditTable: React.FC<SampleAuditTableProps> = ({ sampleId }) => {
    const { team, fields } = useSelector((state: State) => {
        return {
            team: state.team,
            fields: state.fields,
        }
    })

    const {
        fetchAllDeletedSamples,
        fetchAllFields,
        fetchTeamsDeletedSamples,
        fetchTeamsFields,
    } = useActionCreators()

    const [samples, setSamples] = useState<api.Sample[]>([])

    useEffect(() => {
        if (team === undefined || team === '') {
            fetchAllDeletedSamples()
            fetchAllFields()
        } else {
            fetchTeamsDeletedSamples(team)
            fetchTeamsFields(team)
        }
        api.getAuditSamples(sampleId).then((samples) => {
            setSamples(samples)
        })
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

    // const [itemsPerPage, setItemsPerPage] = useState(10)

    return (
        <>
            <div className='data-grid-container'>
                <DataGrid
                    className='data-grid'
                    rows={samples ?? []}
                    columns={[
                        constantGridColumns[0],
                        ...dynamicGridColDefs,
                        ...constantGridColumns.slice(1),
                    ]}
                    autoPageSize
                    // pageSize={itemsPerPage}
                    // rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    // onPageSizeChange={(pageSize) => setItemsPerPage(pageSize)}
                    isCellEditable={(params) => false}
                    disableRowSelectionOnClick
                />
            </div>
        </>
    )
}

export default SampleAuditTable
