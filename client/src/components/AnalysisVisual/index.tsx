import {
    Button,
    FormControl,
    Input,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { State, useActionCreators } from '../../redux'

import './styles.css'
import { Info } from '@mui/icons-material'
import { CreatePrinterRequirements } from '../../api'
import { useState } from 'react'

function PrintersPanel() {
    const printers = useSelector((state: State) => state.printers)

    const [ipAddress, setIPAddress] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [location, setLocation] = useState<string>('')

    const { createPrinter, deletePrinter } = useActionCreators()

    const onSubmitClick = (event) => {
        event.preventDefault()
        const printer: CreatePrinterRequirements = {
            ip: ipAddress,
            name,
            location,
        }
        createPrinter(printer)
    }

    return (
        <Paper className='printers-panel'>
            <div className='view-printers'>
                <div className='header'>
                    <Typography variant='h4' color='primary'>
                        Printers
                    </Typography>
                    <Tooltip
                        title='Click a printer to delete it'
                        color='primary'
                        arrow
                    >
                        <Info />
                    </Tooltip>
                </div>
                <List className='view-printers-list'>
                    {printers.map((printer) => {
                        return (
                            <ListItemButton
                                onClick={(event) => deletePrinter(printer.ip)}
                            >
                                <Typography variant='h6' color='primary'>
                                    {printer.name} - {printer.ip}
                                </Typography>
                            </ListItemButton>
                        )
                    })}
                </List>
            </div>
            <div className='create-printer'>
                <div className='header'>
                    <Typography variant='h4' color='primary'>
                        Create Printer
                    </Typography>
                </div>
                <form className='create-printer-form' onSubmit={onSubmitClick}>
                    <TextField
                        required
                        fullWidth
                        autoComplete='off'
                        size='medium'
                        label='IP Address'
                        onChange={(event) => setIPAddress(event.target.value)}
                    />
                    <TextField
                        fullWidth
                        size='medium'
                        autoComplete='off'
                        label='Name'
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                        fullWidth
                        size='medium'
                        autoComplete='off'
                        label='Location'
                        onChange={(event) => setLocation(event.target.value)}
                    />
                    <Button
                        disabled={ipAddress === ''}
                        fullWidth
                        type='submit'
                        variant='contained'
                        color='primary'
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Paper>
    )
}

export default PrintersPanel
