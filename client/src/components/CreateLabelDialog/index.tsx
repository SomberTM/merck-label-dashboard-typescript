import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import {
    CreateTeamLabelRequirements,
    TeamLabel,
    createLabel,
    updateLabel,
} from '../../api'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../redux'

import './styles.css'

type Mode = 'create' | 'edit'
type SubmitBasedOnMode<T extends Mode> = T extends 'create'
    ? (label: TeamLabel) => void
    : (label: any) => void
type RequireLabelForEdit<T extends Mode> = T extends 'edit'
    ? Required<{ label: TeamLabel }>
    : Partial<{ label: TeamLabel }>

export type CreateLabelDialogProps<T extends Mode> = {
    open?: boolean
    mode?: T
    onClose?: () => void
    onSubmit?: SubmitBasedOnMode<T>
    defaultValues?: {
        name: string
        width: number
        length: number
        team_name: string
    }
} & RequireLabelForEdit<T>

function CreateLabelDialog<T extends Mode = 'create'>({
    open = false,
    mode,
    onClose,
    onSubmit,
    label,
}: CreateLabelDialogProps<T>) {
    const { team, teams } = useSelector((state: State) => ({
        team: state.team,
        teams: state.teams,
    }))

    const resetState = () => {
        setNewLabelName('')
        setNewLabelWidth(0)
        setNewLabelLength(0)
    }

    const onDialogClose = () => {
        onClose?.()
    }

    const onCreateLabelClick = async () => {
        const label: CreateTeamLabelRequirements = {
            name: newLabelName,
            width: newLabelWidth,
            length: newLabelLength,
            team_name: newLabelTeam,
            data: [],
        }
        const newLabel = await createLabel(label)
        onSubmit?.(newLabel)
        onClose?.()
        resetState()
    }

    const onUpdateLabelClick = async () => {
        const newLabel: CreateTeamLabelRequirements = {
            name: newLabelName,
            width: newLabelWidth,
            length: newLabelLength,
            team_name: newLabelTeam,
            data: label?.data ?? [],
        }
        const updatedLabel = await updateLabel(label!.id, newLabel)
        onSubmit?.(updatedLabel)
        onClose?.()
        resetState()
    }

    useEffect(() => {
        if (label) {
            setNewLabelName(label.name)
            setNewLabelWidth(label.width)
            setNewLabelLength(label.length)
            setNewLabelTeam(label.team_name ?? team)
        }
    }, [label])

    const [newLabelName, setNewLabelName] = useState(label?.name ?? '')
    const [newLabelWidth, setNewLabelWidth] = useState(label?.width ?? 0)
    const [newLabelLength, setNewLabelLength] = useState(label?.length ?? 0)
    const [newLabelTeam, setNewLabelTeam] = useState(
        label?.team_name ?? team ?? ''
    )

    return (
        <Dialog open={open} maxWidth='md' onClose={onDialogClose} fullWidth>
            <DialogTitle
                variant='h6'
                color='primary'
                borderColor='primary'
                borderBottom={1}
            >
                {mode === 'create' ? 'Create' : 'Edit'} Label
            </DialogTitle>
            <DialogContent>
                <div className='dialog-content-container'>
                    <div className='dialog-input'>
                        <Typography variant='h5' color='primary'>
                            Team:
                        </Typography>
                        <Select
                            label='team'
                            value={newLabelTeam}
                            onChange={(event) =>
                                setNewLabelTeam(event.target.value as string)
                            }
                        >
                            {teams.map((team, index) => (
                                <MenuItem key={index} value={team.name}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className='dialog-input'>
                        <Typography variant='h5' color='primary'>
                            Name:
                        </Typography>
                        <TextField
                            label='name'
                            type='text'
                            value={newLabelName}
                            onChange={(event) =>
                                setNewLabelName(event.target.value)
                            }
                        />
                    </div>
                    <div className='dialog-input'>
                        <Typography variant='h5' color='primary'>
                            Width (max 62mm)
                        </Typography>
                        <TextField
                            label='width'
                            type='number'
                            value={newLabelWidth}
                            onChange={(event) =>
                                setNewLabelWidth(
                                    Math.min(62, parseInt(event.target.value))
                                )
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        mm
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className='dialog-input'>
                        <Typography variant='h5' color='primary'>
                            Length
                        </Typography>
                        <TextField
                            label='length'
                            type='number'
                            value={newLabelLength}
                            onChange={(event) =>
                                setNewLabelLength(parseInt(event.target.value))
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        mm
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={
                        mode === 'create'
                            ? onCreateLabelClick
                            : onUpdateLabelClick
                    }
                >
                    {mode === 'create' ? 'Create Label' : 'Save Changes'}
                </Button>
                <Button onClick={onDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateLabelDialog
