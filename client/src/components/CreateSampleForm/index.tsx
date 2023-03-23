import { useSelector } from 'react-redux'
import { State, useActionCreators } from '../../redux'
import { Alert, Button, Paper, Snackbar, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import * as api from '../../api'

import './styles.css'
import PrintLabelsDialog from '../PrintLabelsDialog'

type FieldsType = Pick<api.TeamField, 'name' | 'display_name'>
type NewSampleDataType = {
    date_created: DateTime
    date_modified: DateTime
    expiration_date: DateTime
    data: Record<string, any>
}

const defaultSampleData: NewSampleDataType = {
    date_created: DateTime.now(),
    date_modified: DateTime.now(),
    expiration_date: DateTime.now(),
    data: {},
}

const requiredDateFields: FieldsType[] = [
    {
        name: 'date_created',
        display_name: 'Date Created',
    },
    {
        name: 'date_modified',
        display_name: 'Date Modified',
    },
    {
        name: 'expiration_date',
        display_name: 'Expiration Date',
    },
]

const CreateSampleForm: React.FC = () => {
    const { team, fields } = useSelector((state: State) => {
        return {
            team: state.team,
            fields: state.fields,
        }
    })

    const { createSample } = useActionCreators()

    const [allFields, setAllFields] = useState<FieldsType[]>(requiredDateFields)
    const [newSampleData, setNewSampleData] =
        useState<NewSampleDataType>(defaultSampleData)

    const [showSuccessAlert, setShowSuccessAlert] = useState(false)

    const clearSampleData = () => {
        const data = {}
        for (const field of fields[team] ?? []) {
            if (field.name.includes('date')) data[field.name] = DateTime.now()
            else data[field.name] = ''
        }
        setNewSampleData({
            ...defaultSampleData,
            data,
        })
    }

    useEffect(() => {
        if (
            team === '' ||
            !fields.hasOwnProperty(team) ||
            fields[team] === undefined
        )
            return

        clearSampleData()

        setAllFields(
            [...fields[team], ...requiredDateFields] ?? requiredDateFields
        )
    }, [team, fields])

    // If field name is keyof NewSampleDataType, then index directly with it
    // Otherwise, index with data then with field name

    const onTextFieldChange = (event: any, field: FieldsType) => {
        if (field.name in newSampleData) {
            setNewSampleData({
                ...newSampleData,
                [field.name]: DateTime.fromFormat(
                    event.target.value,
                    'yyyy-MM-dd'
                ),
            })
        } else {
            setNewSampleData({
                ...newSampleData,
                data: {
                    ...newSampleData.data,
                    [field.name]: field.name.includes('date')
                        ? DateTime.fromFormat(event.target.value, 'yyyy-MM-dd')
                        : event.target.value,
                },
            })
        }
    }

    const onClearFieldsButtonClick = () => {
        clearSampleData()
    }

    const onSubmitButtonClick = () => {
        createSample(team, newSampleData)
        setShowSuccessAlert(true)
        clearSampleData()
    }

    const [printDialogOpen, setPrintDialogOpen] = useState(false)
    const [createdSample, setCreatedSample] = useState<api.Sample | null>(null)

    const onSubmitAndPrintButtonClick = async () => {
        const sample = await api.createSample({
            ...newSampleData,
            team_name: team,
        })
        setCreatedSample(sample)
        setPrintDialogOpen(true)
        clearSampleData()
    }

    return (
        <>
            <Snackbar
                open={showSuccessAlert}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setShowSuccessAlert(false)}
            >
                <Alert
                    severity='success'
                    onClose={() => setShowSuccessAlert(false)}
                >
                    Sample successfully created
                </Alert>
            </Snackbar>
            <Paper className='sample-form-paper'>
                <form className='sample-form' autoComplete='off'>
                    {allFields.map((field, index) => (
                        <TextField
                            className='sample-form-text-field'
                            color='primary'
                            size='small'
                            margin='normal'
                            key={index}
                            label={field.display_name}
                            // Very hacky way to determine if it's a date field
                            // Proper way would be to have a field type
                            type={field.name.includes('date') ? 'date' : 'text'}
                            value={
                                newSampleData.hasOwnProperty(field.name)
                                    ? (
                                          newSampleData[field.name] as DateTime
                                      ).toFormat('yyyy-MM-dd')
                                    : field.name.includes('date')
                                    ? (
                                          newSampleData.data[
                                              field.name
                                          ] as DateTime
                                      ).toFormat('yyyy-MM-dd') ??
                                      DateTime.now().toFormat('yyyy-MM-dd')
                                    : newSampleData.data[field.name] ?? ''
                            }
                            onChange={(event) =>
                                onTextFieldChange(event, field)
                            }
                            fullWidth
                        />
                    ))}
                    <div className='sample-form-button-container'>
                        <Button
                            variant='contained'
                            style={{ marginRight: '10px' }}
                            onClick={(event) => {
                                event.preventDefault()
                                onSubmitButtonClick()
                            }}
                            type='submit'
                            fullWidth
                        >
                            Submit
                        </Button>
                        <Button
                            variant='contained'
                            onClick={(event) => {
                                event.preventDefault()
                                onSubmitAndPrintButtonClick()
                            }}
                            type='submit'
                            fullWidth
                        >
                            Submit and Print
                        </Button>
                    </div>
                    <div className='sample-form-button-container'>
                        <Button
                            variant='contained'
                            onClick={onClearFieldsButtonClick}
                            fullWidth
                        >
                            Clear Fields
                        </Button>
                    </div>
                </form>
            </Paper>
            <PrintLabelsDialog
                open={printDialogOpen}
                onClose={() => setPrintDialogOpen(false)}
                samples={createdSample !== null ? [createdSample] : []}
            />
        </>
    )
}

export default CreateSampleForm
