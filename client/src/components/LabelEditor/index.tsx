import React, { useEffect, useRef, useState } from 'react'

import { useSelector } from 'react-redux'
import { State, useActionCreators } from '../../redux'

import {
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material'
import {
    FormatBold,
    FormatBoldOutlined,
    FormatItalic,
    FormatItalicOutlined,
} from '@mui/icons-material'

import LabelText from './LabelText'

import {
    CreateTeamLabelRequirements,
    TeamLabel,
    TeamLabelEntity,
    TeamLabelEntityPosition,
} from '../../api'

import './styles.css'
import CreateLabelDialog from '../CreateLabelDialog'

const useAutoIncrement = (initialValue: number = 0) => {
    const value = useRef<number>(initialValue)
    const getValue = () => {
        value.current = value.current + 1
        return value.current
    }

    return getValue
}

/**
 * TODO:
 *   - Once a qr code is viewed on one label it wont be able to be viewed on another label
 */

export interface LabelEntityInfoStore {
    [key: string]: TeamLabelEntity
}

interface LabelEditorProps {
    /**
     * The size of the label in millimeters
     */
    labelSize?: { width: number; length: number }
    editorSize?: { width: string | number; height: string | number }
    onEntityInfoChange?: (textInfo: LabelEntityInfoStore) => void
    onSave?: (label: CreateTeamLabelRequirements) => void
    footerComponents?: React.ReactNode
    toolbarComponents?: React.ReactNode
}

const LabelEditor: React.FC<React.PropsWithChildren<LabelEditorProps>> = ({
    labelSize: initialLabelSize = { width: 0, length: 0 },
    toolbarComponents,
    footerComponents,
    editorSize = { width: 'auto', height: 'auto' },
    onEntityInfoChange = () => {},
    onSave: overrideOnSave,
}) => {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const lastMousePositionRef = useRef<{ x: number; y: number }>({
        x: 0,
        y: 0,
    })

    const autoId = useAutoIncrement()

    const [labelSize, setLabelSize] = useState<{
        width: number
        length: number
    }>(initialLabelSize)

    const [entityIDs, setEntityIDs] = useState<string[]>([])

    // For performance reasons, this could be split up into a couple different states if need be
    const [entities, setEntities] = useState<LabelEntityInfoStore>({})
    const [qrCodeID, setQRCodeID] = useState<string | null>(null)

    const { team, labels } = useSelector((state: State) => state)

    const [currentlyEditingLabel, setCurrentlyEditingLabel] =
        useState<TeamLabel | null>(null)

    const [selectedEntityID, setSelectedEntityID] = useState<string | null>(
        null
    )

    const [isSelectedEntityHeld, setIsSelectedEntityHeld] =
        useState<boolean>(false)

    // Radius used when searching for nearby text in px
    const [alignmentSearchRadius, setAlignmentSearchRadius] =
        useState<number>(10)

    // Text used when adding new text
    const [newText, setNewText] = useState<string>('New Text')

    // (Font) Size used when adding new text
    const [newTextSize, setNewTextSize] = useState<number>(16)

    const [newBoldStatus, setNewBoldStatus] = useState<boolean>(false)

    const [newItalicStatus, setNewItalicStatus] = useState<boolean>(false)

    const { deleteLabel, updateLabel, fetchTeamsLabels } = useActionCreators()

    const onSave = async (label: CreateTeamLabelRequirements) => {
        if (overrideOnSave) {
            return overrideOnSave(label)
        }
        updateLabel(currentlyEditingLabel!.id, label)
    }

    useEffect(() => {
        if (editorRef.current) {
            lastMousePositionRef.current = {
                x: editorRef.current.offsetLeft,
                y: editorRef.current.offsetTop,
            }
        }
    }, [])

    useEffect(() => {
        if (team) {
            fetchTeamsLabels(team)
            clearLabel()
        }
    }, [team])

    useEffect(() => {
        onEntityInfoChange(entities)
    }, [entities])

    const updateLastMousePosition = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        lastMousePositionRef.current = { x: event.clientX, y: event.clientY }
    }

    const findNearbyText = (
        currentTextPosition: TeamLabelEntityPosition,
        axis: 'x' | 'y',
        exclude?: string[]
    ) => {
        for (const textID of entityIDs) {
            if (exclude && exclude.includes(textID)) continue
            const text = entities[textID]

            const diff = Math.abs(
                text.position[axis] - currentTextPosition[axis]
            )

            if (diff <= alignmentSearchRadius) {
                return text.position[axis]
            }
        }
        return null
    }

    const clearLabel = () => {
        setEntityIDs([])
        setEntities({})
        setSelectedEntityID(null)
        setQRCodeID(null)
    }

    const loadLabel = (label: TeamLabel) => {
        const { data, width, length } = label

        clearLabel()

        const ids: string[] = []
        const entities: LabelEntityInfoStore = {}

        for (const entity of data) {
            const id: string = autoId().toString()
            ids.push(id)
            if (entity.text === '') {
                setQRCodeID(id)
            }
            entities[id] = entity
        }

        setSelectedEntityID(null)
        setEntityIDs(ids)
        setEntities(entities)
        setLabelSize({ width, length })
    }

    const generateText = (info?: TeamLabelEntity) => {
        const id = autoId().toString()
        const entity = {
            ...{
                text: newText,
                position: { x: 0, y: 0 },
                textSize: newTextSize,
                bold: newBoldStatus,
                italic: newItalicStatus,
            },
            ...info,
        }
        return {
            id,
            entity,
        }
    }

    const addTextEntity = (info?: TeamLabelEntity) => {
        const { id, entity } = generateText(info)

        setEntityIDs([...entityIDs, id])
        setEntities({
            ...entities,
            [id]: entity,
        })
    }

    const addQRCodeEntity = (info?: TeamLabelEntity) => {
        if (qrCodeID === null) {
            const { id, entity } = generateText(info)
            entity.text = ''
            entity.textSize = info?.textSize ?? 50

            setQRCodeID(id)
            setEntityIDs([...entityIDs, id])
            setEntities({
                ...entities,
                [id]: entity,
            })
        }
    }

    const onTextSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.currentTarget.value)

        if (selectedEntityID === null) {
            return setNewTextSize(newSize)
        }

        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                textSize: newSize,
            },
        })
    }

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedText = event.currentTarget.value

        if (selectedEntityID === null) {
            return setNewText(updatedText)
        }

        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                text: updatedText,
            },
        })
    }

    const onTextClickDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        if (isSelectedEntityHeld) return

        if (selectedEntityID !== null) {
            const selectedText = document.getElementById(selectedEntityID)
            if (selectedText !== null)
                selectedText.classList.remove('label-text-selected')
        }

        event.currentTarget.classList.add('label-text-selected')
        const textID = event.currentTarget.id

        updateLastMousePosition(event)
        setIsSelectedEntityHeld(true)
        setSelectedEntityID(textID)
    }

    const onTextClickUp = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        updateLastMousePosition(event)
        setIsSelectedEntityHeld(false)
    }

    const onTextDrag = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()

        if (!isSelectedEntityHeld) return

        const id = selectedEntityID as string
        const entity = document.getElementById(id)
        if (entity === null) return

        const editor = editorRef.current
        if (editor === null) return

        const dx = event.clientX - lastMousePositionRef.current.x
        const dy = event.clientY - lastMousePositionRef.current.y

        var x = (entities[id].position.x as number) + dx
        var y = (entities[id].position.y as number) + dy

        if (event.shiftKey) {
            var nearbyTextX = findNearbyText({ x, y }, 'x', [id])
            var nearbyTextY = findNearbyText({ x, y }, 'y', [id])

            if (nearbyTextX !== null) {
                x = nearbyTextX
            }

            if (nearbyTextY !== null) {
                y = nearbyTextY
            }
        }

        const editorRect = editor.getBoundingClientRect()

        // only update the position if the text will be within the editor
        if (
            x < 0 ||
            x + entity.offsetWidth > editorRect.width ||
            y < 0 ||
            y + entity.offsetHeight > editorRect.height
        )
            return

        setEntities({
            ...entities,
            [id]: {
                ...entities[id],
                position: { x, y },
            },
        })

        updateLastMousePosition(event)
    }

    const onDeleteClick = () => {
        if (selectedEntityID === null) return

        const newTextIDs = entityIDs.filter((id) => id !== selectedEntityID)

        if (selectedEntityID === qrCodeID) setQRCodeID(null)

        setSelectedEntityID(null)
        setEntityIDs(newTextIDs)
        delete entities[selectedEntityID]
        setEntities({ ...entities })
    }

    const onSaveClick = () => {
        const labelData = Object.values(entities)
        console.log(labelData)
        const label: CreateTeamLabelRequirements = {
            team_name: team,
            name: currentlyEditingLabel?.name ?? 'Unknown',
            width: labelSize.width as number,
            length: labelSize.length as number,
            data: labelData,
        }
        onSave(label)
    }

    const onEditorClick = () => {
        if (selectedEntityID !== null) {
            const selectedText = document.getElementById(selectedEntityID)
            if (selectedText !== null)
                selectedText.classList.remove('label-text-selected')
        }
        setIsSelectedEntityHeld(false)
        setSelectedEntityID(null)
    }

    const onResetPositionClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                position: {
                    x: 0,
                    y: 0,
                },
            },
        })
    }

    const onBoldClick = () => {
        if (selectedEntityID === null) return setNewBoldStatus(!newBoldStatus)

        setEntities({
            ...entities,
            [selectedEntityID]: {
                ...entities[selectedEntityID],
                bold: !entities[selectedEntityID].bold,
            },
        })
    }

    const onItalicClick = () => {
        if (selectedEntityID === null)
            return setNewItalicStatus(!newItalicStatus)

        setEntities({
            ...entities,
            [selectedEntityID]: {
                ...entities[selectedEntityID],
                italic: !entities[selectedEntityID].italic,
            },
        })
    }

    const [selectedLabelID, setSelectedLabelID] = useState<string | null>(null)

    const onSelectedLabelChange = (event: SelectChangeEvent<string | null>) => {
        if (event.target.value === null || event.target.value === '') return
        const newLabelID = event.target.value as string
        setSelectedLabelID(newLabelID)
    }

    useEffect(() => {
        const label = labels[team]?.find(
            (label) => label.id === Number(selectedLabelID!)
        )
        if (label === undefined) return
        loadLabel(label)
        setCurrentlyEditingLabel(label)
    }, [selectedLabelID])

    const [createLabelDialogOpen, setCreateLabelDialogOpen] = useState(false)
    const [editLabelDialogOpen, setEditLabelDialogOpen] = useState(false)

    const onDeleteLabelClick = () => {
        if (selectedLabelID === null) return
        const numberID = parseInt(selectedLabelID)
        deleteLabel(numberID)
        const nextLabel = labels[team].filter(
            (label) => label.id !== numberID
        )?.[0]
        if (nextLabel !== undefined) {
            setSelectedLabelID(nextLabel.id.toString())
        }
    }

    return (
        <Paper className='label-selector-and-editor' elevation={1}>
            <Paper className='label-selector-container'>
                <FormControl fullWidth>
                    <InputLabel id='select-label-label'>
                        Select a Label
                    </InputLabel>
                    <Select
                        labelId='select-label-label'
                        onChange={onSelectedLabelChange}
                        label='Select a Label'
                        value={selectedLabelID ?? ''}
                        sx={{
                            maxHeight: '50px',
                        }}
                    >
                        <MenuItem value='' disabled>
                            Select a label to edit
                        </MenuItem>
                        {(labels[team] ?? []).map((label, index) => (
                            <MenuItem value={label.id} key={index}>
                                {label.width}mm x {label.length}mm -{' '}
                                {label.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box className='label-options-footer'>
                    <Button
                        fullWidth
                        disabled={selectedLabelID === null}
                        onClick={() => setEditLabelDialogOpen(true)}
                    >
                        Edit Selected Label
                    </Button>
                    <Button
                        fullWidth
                        disabled={selectedLabelID === null}
                        onClick={onDeleteLabelClick}
                    >
                        Delete Selected Label
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => setCreateLabelDialogOpen(true)}
                    >
                        Create New Label
                    </Button>
                </Box>
            </Paper>

            <CreateLabelDialog
                open={editLabelDialogOpen}
                mode='edit'
                label={currentlyEditingLabel!}
                onSubmit={() => fetchTeamsLabels(team)}
                onClose={() => setEditLabelDialogOpen(false)}
            />

            <CreateLabelDialog
                open={createLabelDialogOpen}
                mode='create'
                onSubmit={(label) => {
                    fetchTeamsLabels(team)
                    setSelectedLabelID(label.id.toString())
                }}
                onClose={() => setCreateLabelDialogOpen(false)}
            />

            <Paper
                className='label-editor-container'
                style={{
                    width: `${editorSize.width}${
                        typeof editorSize.width === 'number' ? 'px' : ''
                    }`,
                    height: `${editorSize.height}${
                        typeof editorSize.height === 'number' ? 'px' : ''
                    }`,
                }}
                elevation={2}
            >
                <Paper className='label-editor-toolbar' elevation={3}>
                    <Button onClick={() => addTextEntity()}>Add Text</Button>

                    <Button
                        disabled={qrCodeID !== null}
                        onClick={() => addQRCodeEntity()}
                    >
                        Add QR Code
                    </Button>

                    <Button
                        disabled={selectedEntityID === null}
                        onClick={onDeleteClick}
                    >
                        Delete Text
                    </Button>

                    <Button
                        disabled={selectedEntityID === null}
                        onClick={onResetPositionClick}
                    >
                        Reset Position
                    </Button>

                    <input
                        type='number'
                        onChange={onTextSizeChange}
                        value={
                            selectedEntityID !== null
                                ? entities[selectedEntityID].textSize
                                : newTextSize
                        }
                        style={{
                            width: '5%',
                        }}
                    />

                    <Checkbox
                        onChange={onBoldClick}
                        checked={
                            selectedEntityID !== null
                                ? entities[selectedEntityID].bold
                                : newBoldStatus
                        }
                        icon={<FormatBoldOutlined />}
                        checkedIcon={<FormatBold />}
                    />

                    <Checkbox
                        onChange={onItalicClick}
                        checked={
                            selectedEntityID !== null
                                ? entities[selectedEntityID].italic
                                : newItalicStatus
                        }
                        icon={<FormatItalicOutlined />}
                        checkedIcon={<FormatItalic />}
                    />

                    {toolbarComponents}

                    <Button onClick={onSaveClick}>Save</Button>
                </Paper>

                <div
                    className='label-editor'
                    onMouseUp={onEditorClick}
                    onMouseLeave={onTextClickUp}
                    ref={editorRef}
                    style={{
                        width: `${labelSize.length}${
                            typeof labelSize.length === 'number' ? 'mm' : ''
                        }`,
                        height: `${labelSize.width}${
                            typeof labelSize.width === 'number' ? 'mm' : ''
                        }`,
                    }}
                >
                    {entityIDs.map((entityID) => {
                        const entityInfo = entities[entityID]
                        return (
                            <LabelText
                                key={entityID}
                                id={entityID}
                                position={entityInfo.position}
                                textSizePX={entityInfo.textSize}
                                bold={entityInfo.bold}
                                italic={entityInfo.italic}
                                onMouseDown={onTextClickDown}
                                onMouseUp={onTextClickUp}
                                onMouseMove={onTextDrag}
                            >
                                {entityInfo.text}
                            </LabelText>
                        )
                    })}
                    {qrCodeID !== null &&
                    entityIDs.length > 0 &&
                    entities[qrCodeID] !== undefined ? (
                        <div
                            id={qrCodeID}
                            className='label-qr-code-container'
                            style={{
                                position: 'absolute',
                                top: `${entities[qrCodeID].position.y}px`,
                                left: `${entities[qrCodeID].position.x}px`,
                                width: `${entities[qrCodeID].textSize}px`,
                                height: `${entities[qrCodeID].textSize}px`,
                                zIndex: 0,
                            }}
                            onMouseDown={onTextClickDown}
                            onMouseUp={onTextClickUp}
                            onMouseMove={onTextDrag}
                        >
                            <img
                                src={"/basic_qr_code.png"}
                                style={{
                                    userSelect: 'none',
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 0,
                                }}
                                draggable={false}
                            ></img>
                        </div>
                    ) : null}
                </div>

                <div className='label-editor-text-input-container'>
                    <input
                        className='label-editor-text-input'
                        type='text'
                        onChange={onTextChange}
                        disabled={
                            selectedEntityID !== null &&
                            selectedEntityID === qrCodeID
                        }
                        value={
                            selectedEntityID !== null
                                ? entities[selectedEntityID].text
                                : newText
                        }
                    />
                    <p>
                        <div style={{ width: '10vw', display: 'flex' }}>
                            <TextField
                                size='small'
                                type='number'
                                style={{ width: '50%' }}
                                onChange={(event) => {
                                    const newPosition = {
                                        y:
                                            selectedEntityID !== null
                                                ? entities[selectedEntityID]
                                                      .position.y
                                                : 0,
                                        x: parseInt(event.target.value),
                                    }
                                    if (selectedEntityID !== null) {
                                        setEntities({
                                            ...entities,
                                            [selectedEntityID]: {
                                                ...entities[selectedEntityID],
                                                position: newPosition,
                                            },
                                        })
                                    }
                                }}
                                value={
                                    selectedEntityID !== null
                                        ? entities[selectedEntityID].position.x
                                        : 0
                                }
                            />
                            <TextField
                                size='small'
                                type='number'
                                style={{ width: '50%' }}
                                onChange={(event) => {
                                    const newPosition = {
                                        x:
                                            selectedEntityID !== null
                                                ? entities[selectedEntityID]
                                                      .position.x
                                                : 0,
                                        y: parseInt(event.target.value),
                                    }
                                    if (selectedEntityID !== null) {
                                        setEntities({
                                            ...entities,
                                            [selectedEntityID]: {
                                                ...entities[selectedEntityID],
                                                position: newPosition,
                                            },
                                        })
                                    }
                                }}
                                value={
                                    selectedEntityID !== null
                                        ? entities[selectedEntityID].position.y
                                        : 0
                                }
                            />
                        </div>
                    </p>
                </div>

                {footerComponents ? (
                    <div className='label-editor-footer'>
                        {footerComponents}
                    </div>
                ) : (
                    <></>
                )}
            </Paper>
        </Paper>
    )
}

export default LabelEditor
