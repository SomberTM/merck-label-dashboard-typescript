import {
    AppBar,
    Typography,
    Box,
    Toolbar,
    Button,
    Theme,
    Select,
    MenuItem,
    IconButton,
    SelectChangeEvent,
    InputLabel,
    FormControl,
} from '@mui/material'

import { Link } from 'react-router-dom'
import './styles.css'
import React, { useEffect } from 'react'
import { Home } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import {
    State,
    useActionCreators,
    useFetchAll,
    useFetchTeam,
} from '../../redux'
import { useTheme } from '@mui/styles'

const NavBar: React.FC = () => {
    const theme = useTheme<Theme>()

    const fetchAll = useFetchAll()

    const { team, teams } = useSelector((state: State) => ({
        team: state.team,
        teams: state.teams,
    }))

    const { setTeam } = useActionCreators()
    const fetchTeam = useFetchTeam()

    useEffect(() => {
        fetchAll()
    }, [])

    useEffect(() => {
        if (teams.length > 0 && team === '') {
            setTeam(teams[0].name)
        }
    }, [team])

    const onTeamChange = (event: SelectChangeEvent<string>) => {
        const selectedTeam = event.target.value
        // Sets the current team in the redux store
        setTeam(selectedTeam)
        // Fetches all the information for a team, includes samples, fields, label layouts.
        fetchTeam(selectedTeam)
    }

    // Makes it easy to change the variant of the navigation buttons
    const navigationButtonVariant: 'text' | 'outlined' | 'contained' =
        'outlined'

    return (
        <AppBar
            color='inherit'
            className='nav-appbar'
            variant='elevation'
            position='static'
            sx={{ borderBottom: `4px solid ${theme.palette.primary.main}` }}
        >
            <Toolbar className='nav-toolbar'>
                <Typography
                    variant='h2'
                    color='primary'
                    sx={{ fontWeight: '1' }}
                >
                    Merck Label Dashboard
                </Typography>
                <div className='nav-navigation-buttons-container'>
                    <Link to='/' className='link-button'>
                        <IconButton>
                            <Home />
                        </IconButton>
                    </Link>
                    <Link to='/samples' className='link-button'>
                        <Button variant={navigationButtonVariant}>
                            View Samples
                        </Button>
                    </Link>
                    <Link to='/samples/create' className='link-button'>
                        <Button variant={navigationButtonVariant}>
                            Create Sample
                        </Button>
                    </Link>
                    <Link to='/samples/deleted' className='link-button'>
                        <Button variant={navigationButtonVariant}>
                            View Deleted Samples
                        </Button>
                    </Link>
                    <Link to='/printers' className='link-button'>
                        <Button variant={navigationButtonVariant}>
                            Printers
                        </Button>
                    </Link>
                    <Link to='/fields' className='link-button'>
                        <Button variant={navigationButtonVariant}>
                            Edit Teams
                        </Button>
                    </Link>
                    <Link to='/editor' className='link-button'>
                        <Button variant={navigationButtonVariant}>
                            Label Editor
                        </Button>
                    </Link>

                    <Box sx={{ minWidth: '100px' }}>
                        <FormControl fullWidth>
                            <InputLabel id='select-team-label'>Team</InputLabel>
                            <Select
                                size='small'
                                value={team}
                                onChange={onTeamChange}
                                labelId='select-team-label'
                                label='Team'
                            >
                                <MenuItem value={''} color='inherit' disabled>
                                    Select a team
                                </MenuItem>
                                {teams.map((team, index) => (
                                    <MenuItem key={index} value={team.name}>
                                        {team.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
