import { useSelector } from 'react-redux'
import { State, useActionCreators } from '../../redux'

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { Add, ChevronRight, Delete, Info } from '@mui/icons-material'

import { useEffect, useState } from 'react'
import { TeamField } from '../../api'

import './styles.css'
import { DataGrid } from '@mui/x-data-grid'

import * as api from '../../api'

interface CreateTeamDialogProps {
    open: boolean
    onClose: () => void
    onSubmit: (teamName: string) => void
}

function CreateTeamDialog({ open, onClose, onSubmit }: CreateTeamDialogProps) {
    const [teamName, setTeamName] = useState('')
    const [teamNameError, setTeamNameError] = useState(false)

    const teams = useSelector((state: State) => state.teams)

    const onTeamNameChange = (event) => {
        setTeamName(event.target.value)
    }

    const onSubmitTeam = () => {
        if (teams.find((team) => team.name === teamName))
            return setTeamNameError(true)

        onSubmit(teamName)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <Snackbar
                open={teamNameError}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setTeamNameError(false)}
            >
                <Alert severity='error' onClose={() => setTeamNameError(false)}>
                    Team with name '{teamName}' already exists
                </Alert>
            </Snackbar>
            <DialogTitle>
                <Typography variant='h5' color='primary'>
                    Create Team
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin='dense'
                    id='name'
                    label='Team Name'
                    type='text'
                    onChange={onTeamNameChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmitTeam}>Submit</Button>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

function ConfirmDeleteTeamDialog({ open, onClose, onSubmit, teamName }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete team '{teamName}'?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onSubmit()
                        onClose()
                    }}
                    color='error'
                >
                    Delete
                </Button>
                <Button
                    onClick={() => {
                        onClose()
                    }}
                    color='primary'
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function FieldsGridFooterComponent({ addEmptyField, onSaveTeamFields }) {
    return (
        <Box className='fields-footer'>
            <Tooltip title='Create field' arrow>
                <Button fullWidth onClick={() => addEmptyField()}>
                    <Add />
                </Button>
            </Tooltip>
            <Divider orientation='vertical' />
            <Tooltip title='Save changes' arrow>
                <Button fullWidth onClick={() => onSaveTeamFields()}>
                    Save
                </Button>
            </Tooltip>
        </Box>
    )
}

const EditTeamFieldsPanel: React.FC = () => {
    const {
        team: stateTeam,
        teams,
        fields,
    } = useSelector((state: State) => {
        return {
            team: state.team,
            teams: state.teams,
            fields: state.fields,
        }
    })

    const { deleteField, updateField, createTeam, setTeam, deleteTeam } =
        useActionCreators()

    const [localFields, setLocalFields] = useState<
        (TeamField & { deleted?: boolean })[]
    >([])

    useEffect(() => {
        setLocalFields(fields[stateTeam] ?? [])
    }, [stateTeam, fields])

    const onSaveTeamFields = () => {
        for (const field of localFields) {
            if (field.deleted) {
                deleteField(field.id)
            } else {
                updateField(field.id, field)
            }
        }
        setSaveChangesSuccessAlertOpen(true)
    }

    const updateLocalFieldValue = (id: number, key: string, value: any) => {
        const newFields = localFields.map((field) => {
            if (field.id === id) {
                return {
                    ...field,
                    [key]: value,
                }
            }
            return field
        })
        setLocalFields(newFields)
    }

    const addEmptyField = async () => {
        const field = await api.createTeamField({
            team_name: stateTeam,
            name: '',
            display_name: '',
        })

        setLocalFields((fields) => [...fields, field])
    }

    const processFieldRowUpdate = (newRow: TeamField, oldRow: TeamField) => {
        setLocalFields((fields) =>
            fields.map((field) => {
                if (field.id === newRow.id) {
                    return newRow
                }
                return field
            })
        )
        return newRow
    }

    const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false)
    const onCreateTeamClick = () => {
        setCreateTeamDialogOpen(true)
    }

    const [confirmDeleteTeamDialogOpen, setConfirmDeleteTeamDialogOpen] =
        useState(false)
    const onConfirmDeleteTeamClick = () => {
        setConfirmDeleteTeamDialogOpen(true)
    }

    const [saveChangesSuccessAlertOpen, setSaveChangesSuccessAlertOpen] =
        useState(false)

    const fieldsTooltipText = `
        Fields are used to specify what information is collected about a sample.
        For naming convention, the field name should be underscore seperated and all lowercase.
        For example, 'sample_type' is a valid field name. The field display name can be whatever you like. 
        It is the value displayed in the samples table and used when creating a new sample.
    `

    const fieldsGridColumnDefinitions = [
        {
            field: 'name',
            headerName: 'Field Name',
            width: 200,
            editable: true,
            flex: 1,
        },
        {
            field: 'display_name',
            headerName: 'Field Display Name',
            width: 200,
            editable: true,
            flex: 1,
        },
        {
            field: 'id',
            headerName: 'Delete',
            width: 200,
            flex: 0.4,
            editable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() =>
                        updateLocalFieldValue(params.row.id, 'deleted', true)
                    }
                >
                    <Delete />
                </IconButton>
            ),
        },
    ]

    return (
        <Box className='teams-and-fields-container'>
            <Snackbar
                open={saveChangesSuccessAlertOpen}
                onClose={() => setSaveChangesSuccessAlertOpen(false)}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity='success'
                    onClose={() => setSaveChangesSuccessAlertOpen(false)}
                >
                    Changes to team <i>{stateTeam}</i> have been saved
                </Alert>
            </Snackbar>
            <CreateTeamDialog
                open={createTeamDialogOpen}
                onClose={() => setCreateTeamDialogOpen(false)}
                onSubmit={(teamName) => {
                    createTeam({ name: teamName })
                    setTeam(teamName)
                }}
            />
            <ConfirmDeleteTeamDialog
                open={confirmDeleteTeamDialogOpen}
                onClose={() => setConfirmDeleteTeamDialogOpen(false)}
                onSubmit={() => {
                    const nextTeam = teams.filter(
                        (team) => team.name !== stateTeam
                    )?.[0]
                    setLocalFields(fields[nextTeam.name] ?? [])
                    setTeam(nextTeam?.name ?? '')
                    deleteTeam(stateTeam)
                }}
                teamName={stateTeam}
            />
            <Paper className='teams-container' elevation={3}>
                <Box className='header-with-background'>
                    <Typography variant='h4' color='primary' fontWeight={600}>
                        TEAMS
                    </Typography>
                </Box>
                <Divider />
                <MenuList className='teams-menu-list'>
                    {teams.map((team, index) => (
                        <MenuItem
                            className='team-menu-item'
                            key={index}
                            onClick={() => setTeam(team.name)}
                        >
                            <Typography variant='h6' color='primary' noWrap>
                                {team.name === stateTeam ? (
                                    <ChevronRight />
                                ) : (
                                    ''
                                )}

                                {team.name}
                            </Typography>
                        </MenuItem>
                    ))}
                </MenuList>
            </Paper>

            <Paper className='fields-container' elevation={3}>
                <Box className='header-with-background'>
                    <Typography variant='h4' color='primary' fontWeight={600}>
                        EDITING TEAM <i>{stateTeam}</i>
                    </Typography>
                </Box>
                <Divider />
                <Box className='fields-and-team-options-container'>
                    <Box className='teams-options-container'>
                        <Box className='header'>
                            <Typography variant='h5' color='primary'>
                                TEAM OPTIONS
                            </Typography>
                        </Box>
                        <Divider />
                        <Box className='teams-options'>
                            <Button fullWidth onClick={onCreateTeamClick}>
                                Create Team
                            </Button>
                            {/* 
                                Renaming teams is a bit of a problem. With the restriction that we can only append to the samples table. 
                                To rename a team, we would have to go through and 'delete' all samples with the old team name. Then, 
                                we would have to recreate all samples with the new team name. This is a bit of a pain and would
                                cause unnecessary strain on the database. It can certainly be implmeneted, but i feel it is not a priority 
                                nor something I feel like dealing with.
                            */}
                            {/* <Button fullWidth>Rename Team</Button> */}
                            <Button
                                fullWidth
                                onClick={onConfirmDeleteTeamClick}
                            >
                                Delete Team
                            </Button>
                        </Box>
                    </Box>
                    <Divider orientation='vertical' />
                    <Box className='edit-fields-container'>
                        <Box className='header'>
                            <Typography variant='h5' color='primary'>
                                TEAMS FIELDS
                                <Tooltip
                                    title={fieldsTooltipText}
                                    className='fields-info-tooltip'
                                >
                                    <Info />
                                </Tooltip>
                            </Typography>
                        </Box>
                        <Divider />
                        <DataGrid
                            experimentalFeatures={{ newEditingApi: true }}
                            sx={{ width: '100%' }}
                            rows={localFields.filter((field) => !field.deleted)}
                            columns={fieldsGridColumnDefinitions}
                            editMode='row'
                            processRowUpdate={processFieldRowUpdate}
                            components={{
                                Footer: FieldsGridFooterComponent,
                            }}
                            componentsProps={{
                                footer: {
                                    addEmptyField,
                                    onSaveTeamFields,
                                },
                            }}
                            disableSelectionOnClick
                        />
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default EditTeamFieldsPanel
