import {
    Box,
    Button,
    CircularProgress,
    CircularProgressProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ImageList,
    ImageListItem,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Theme,
    Typography,
} from '@mui/material'
import * as api from '../../api'
import './styles.css'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../redux'
import { useTheme } from '@mui/styles'

// Copied from https://material-ui.com/components/progress/#circular-with-label
function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number }
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant='determinate' {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant='caption'
                    component='div'
                    color='text.secondary'
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    )
}

export interface PrintLabelsDialogProps {
    open?: boolean
    onClose?: () => void
    samples?: api.Sample[]
}

const PrintLabelsDialog: React.FC<PrintLabelsDialogProps> = ({
    open = false,
    onClose,
    samples = [],
}) => {
    const [generatedLabelsAsBase64, setGeneratedLabelsAsBase64] = useState<
        string[]
    >([])

    const [selectedLabelLayout, setSelectedLabelLayout] =
        useState<api.TeamLabel | null>(null)

    const [labelGenerationProgress, setLabelGenerationProgress] =
        useState<number>(0)
    const [isLabelGenerationInProgress, setIsLabelGenerationInProgress] =
        useState<boolean>(false)

    const [selectedPrinter, setSelectedPrinter] = useState<api.Printer | null>(
        null
    )

    const { printers, team, labelLayouts } = useSelector((state: State) => ({
        printers: state.printers,
        team: state.team,
        labelLayouts: state.labels,
    }))

    const theme = useTheme<Theme>()

    const resetState = () => {
        setGeneratedLabelsAsBase64([])
        setSelectedLabelLayout(null)
        setSelectedPrinter(null)
        setLabelGenerationProgress(0)
        setIsLabelGenerationInProgress(false)
    }

    const generateBase64Labels = async (): Promise<boolean> => {
        if (
            selectedLabelLayout === null ||
            samples.length === 0 ||
            isLabelGenerationInProgress
        )
            return false

        const progressIncrement = 100 / samples.length

        setIsLabelGenerationInProgress(true)

        const labelsAsBase64 = await Promise.all(
            samples.map(async (sample) => {
                const label = await api.generateLabel(
                    sample.id,
                    selectedLabelLayout.id
                )

                setLabelGenerationProgress((prev) =>
                    Math.min(prev + progressIncrement, 100)
                )
                return label
            })
        )

        setGeneratedLabelsAsBase64(labelsAsBase64)
        setLabelGenerationProgress(0)
        setIsLabelGenerationInProgress(false)
        return true
    }

    const printGeneratedLabels = async (): Promise<boolean> => {
        if (selectedPrinter === null || generatedLabelsAsBase64.length === 0)
            return false

        return await api.printLabels(generatedLabelsAsBase64, selectedPrinter)
    }

    const onSelectedLabelLayoutChange = (event: SelectChangeEvent<number>) => {
        setGeneratedLabelsAsBase64([])
        setLabelGenerationProgress(0)
        setIsLabelGenerationInProgress(false)
        const selectedLabelLayoutId = event.target.value as number
        const selectedLabelLayout = labelLayouts[team].find(
            (labelLayout) => labelLayout.id === selectedLabelLayoutId
        )
        setSelectedLabelLayout(selectedLabelLayout ?? null)
    }

    const onSelectedPrinterChange = (event: SelectChangeEvent<string>) => {
        const selectedPrinterIp = event.target.value as string
        const selectedPrinter = printers.find(
            (printer) => printer.ip === selectedPrinterIp
        )
        setSelectedPrinter(selectedPrinter ?? null)
    }

    const onGenerateLabelsClick = async () => {
        setGeneratedLabelsAsBase64([])
        await generateBase64Labels()
    }

    const onPrintButtonClick = async () => {
        await printGeneratedLabels()
    }

    const onDialogClose = () => {
        resetState()
        onClose?.()
    }

    return (
        <Dialog
            open={open}
            maxWidth='md'
            onClose={onDialogClose}
            fullWidth
            // This ensures that the dialog has a constant height
            // Normally it is in a flexbox so when we add the label images it
            // would adjust the height accordingly. Doing this we wont get the resizing
            // we will just get a scroll bar if the images are too big
            PaperProps={{
                sx: {
                    height: '75vh',
                },
            }}
        >
            <DialogTitle
                variant='h6'
                color='primary'
                borderColor='primary'
                borderBottom={1}
            >
                Labels
            </DialogTitle>
            <DialogContent>
                <Select
                    value={selectedLabelLayout?.id ?? ''}
                    onChange={onSelectedLabelLayoutChange}
                    variant='standard'
                >
                    <MenuItem value={''} key={-1} disabled>
                        Select a label size
                    </MenuItem>
                    {labelLayouts[team]?.map((labelLayout, index) => (
                        <MenuItem value={labelLayout.id} key={index}>
                            {labelLayout.name} ({labelLayout.width}mm x{' '}
                            {labelLayout.length}mm)
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    variant='contained'
                    disabled={
                        isLabelGenerationInProgress ||
                        selectedLabelLayout === null
                    }
                    onClick={onGenerateLabelsClick}
                >
                    Generate Labels
                </Button>

                <Select
                    value={selectedPrinter?.ip ?? ''}
                    onChange={onSelectedPrinterChange}
                    variant='standard'
                >
                    <MenuItem value={''} key={-1} disabled>
                        Select a printer
                    </MenuItem>
                    {printers.map((printer, index) => (
                        <MenuItem value={printer.ip} key={index}>
                            {printer.name} - {printer.location}
                        </MenuItem>
                    ))}
                </Select>

                <Button
                    variant='contained'
                    onClick={onPrintButtonClick}
                    disabled={
                        isLabelGenerationInProgress ||
                        selectedPrinter === null ||
                        generatedLabelsAsBase64.length === 0
                    }
                >
                    Print Labels
                </Button>

                <Paper
                    className='generated-labels-container'
                    sx={{
                        border: `2px solid ${theme.palette.primary.main}`,
                    }}
                >
                    {isLabelGenerationInProgress ? (
                        <CircularProgressWithLabel
                            value={labelGenerationProgress}
                            key={'progress'}
                        />
                    ) : (
                        <ImageList>
                            {generatedLabelsAsBase64.map((label, index) => (
                                <ImageListItem
                                    key={index}
                                    sx={{ border: '2px solid black' }}
                                >
                                    <img
                                        src={`data:image/png;base64,${label}`}
                                        alt={`Label ${index}`}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PrintLabelsDialog
