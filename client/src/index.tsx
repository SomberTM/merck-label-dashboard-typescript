// React imports
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Redux imports
import { Provider } from 'react-redux'
import { store } from './redux'

// MUI imports
import { createTheme, ThemeProvider } from '@mui/material/styles'

// Page imports
import RootPage from './pages/RootPage'
import EditTeamFieldsPage from './pages/EditTeamFieldsPage'
import ViewSamplesPage from './pages/ViewSamplesPage'
import CreateSamplePage from './pages/CreateSamplePage'
import ViewDeletedSamplesPage from './pages/ViewDeletedSamplesPage'
import ViewSampleAuditPage from './pages/ViewSampleAuditPage'
import LabelEditorPage from './pages/LabelEditorPage'
import PrintersPage from './pages/PrintersPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootPage />,
    },
    {
        path: '/fields',
        element: <EditTeamFieldsPage />,
    },
    {
        path: '/samples',
        element: <ViewSamplesPage />,
    },
    {
        path: '/samples/create',
        element: <CreateSamplePage />,
    },
    {
        path: '/samples/deleted',
        element: <ViewDeletedSamplesPage />,
    },
    {
        path: '/samples/audit/:id',
        element: <ViewSampleAuditPage />,
    },
    {
        path: '/editor',
        element: <LabelEditorPage />,
    },
    {
        path: '/printers',
        element: <PrintersPage />,
    },
])

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(5,133,124)',
        },
        secondary: {
            main: 'rgb(0,0,0)',
        },
    },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)
