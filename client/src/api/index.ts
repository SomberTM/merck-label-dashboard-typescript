import axios from 'axios'
import {
    Team,
    CreateTeamRequirements,
    UpdateTeamRequirements,
    Sample,
    CreateSampleRequirements,
    UpdateSampleRequirements,
    TeamField,
    CreateTeamFieldRequirements,
    TeamLabel,
    CreateTeamLabelRequirements,
    UpdateTeamLabelRequirements,
    Printer,
    CreatePrinterRequirements,
    UpdatePrinterRequirements,
    UpdateTeamFieldRequirements,
} from './types'

const baseURL = 'http://localhost:7777' as const

const baseSamplesURL = `${baseURL}/samples` as const
const baseDeletedSamplesURL = `${baseURL}/deleted_samples` as const
const baseTeamsURL = `${baseURL}/teams` as const
const basePrintersURL = `${baseURL}/printers` as const
const baseFieldsURL = `${baseURL}/fields` as const
const baseLabelsURL = `${baseURL}/labels` as const

// * @route /teams

/**
 * @returns All teams currently in the database that are not deleted
 */
async function getAllTeams(): Promise<Team[]> {
    const { data: teams } = await axios.get(baseTeamsURL)
    return teams
}

/**
 *
 * @param info
 * @returns The new team that was created
 */
async function createTeam(info: CreateTeamRequirements): Promise<Team> {
    const { data: newTeam } = await axios.post(baseTeamsURL, info)
    return newTeam
}

/**
 * All this does is change a teams name
 * @param team
 * @returns The updated team
 */
async function updateTeam(
    team_name: string,
    team: UpdateTeamRequirements
): Promise<Team> {
    const { data: updatedTeam } = await axios.patch(
        `${baseTeamsURL}/${team_name}`,
        team
    )
    return updatedTeam
}

/**
 *
 * @param team_name
 * @returns The team that was deleted
 */
async function deleteTeam(team_name: string): Promise<Team> {
    const { data } = await axios.delete(`${baseTeamsURL}/${team_name}`)
    return data
}

// ----------------------------------------

// * @route /samples

/**
 *
 * @returns A key value pair of team names and their samples
 */
async function getAllSamples(): Promise<Record<string, Sample[]>> {
    const { data } = await axios.get(baseSamplesURL)
    return data
}

async function getSample(id: string): Promise<Sample> {
    const { data: sample } = await axios.get(`${baseSamplesURL}/`, {
        params: {
            id,
        },
    })
    return sample
}

async function getTeamSamples(team: string): Promise<Sample[]> {
    const { data: samples } = await axios.get(`${baseSamplesURL}/`, {
        params: {
            team,
        },
    })
    return samples
}

async function getTeamSample(team: string, id: string): Promise<Sample> {
    const { data: sample } = await axios.get(`${baseSamplesURL}/`, {
        params: {
            team,
            id,
        },
    })
    return sample
}

async function getAuditSamples(id: string): Promise<Sample[]> {
    const { data: samples } = await axios.get(`${baseSamplesURL}/${id}/audit`)
    return samples
}

async function createSample(sample: CreateSampleRequirements): Promise<Sample> {
    const { data: newSample } = await axios.post(`${baseSamplesURL}`, sample)
    return newSample
}

async function updateSample(
    id: string,
    sample: UpdateSampleRequirements
): Promise<Sample> {
    const { data: updatedSample } = await axios.patch(
        `${baseSamplesURL}/${id}`,
        sample
    )
    return updatedSample
}

async function deleteSample(id: string): Promise<Sample> {
    const { data: deletedSample } = await axios.delete(
        `${baseSamplesURL}/${id}`
    )
    return deletedSample
}

async function deleteSamples(ids: string[]): Promise<Sample[]> {
    const { data: deletedSamples } = await axios.delete(`${baseSamplesURL}`, {
        data: {
            ids,
        },
    })
    return deletedSamples
}

async function getAllDeletedSamples(): Promise<Record<string, Sample[]>> {
    const { data: samples } = await axios.get(`${baseDeletedSamplesURL}`)
    return samples
}

// ----------------------------------------

// * @route /fields

async function getAllFields(): Promise<Record<string, TeamField[]>> {
    const { data: fields } = await axios.get(baseFieldsURL)
    return fields
}

async function getTeamFields(team: string): Promise<TeamField[]> {
    const { data: fields } = await axios.get(`${baseFieldsURL}/${team}`)
    return fields
}

async function getTeamField(
    team: string,
    field_id: number | string
): Promise<TeamField> {
    const { data: field } = await axios.get(
        `${baseFieldsURL}/${team}/${field_id}`
    )
    return field
}

async function createTeamField(
    field: CreateTeamFieldRequirements
): Promise<TeamField> {
    const { data: newField } = await axios.post(baseFieldsURL, field)
    return newField
}

async function updateTeamField(
    field_id: number | string,
    field: UpdateTeamFieldRequirements
): Promise<TeamField> {
    const { data: updatedField } = await axios.patch(
        `${baseFieldsURL}/${field_id}`,
        field
    )
    return updatedField
}

async function deleteTeamField(field_id: number | string): Promise<TeamField> {
    const { data: deletedField } = await axios.delete(
        `${baseFieldsURL}/${field_id}`
    )
    return deletedField
}

// ----------------------------------------

// * @route /labe;s

async function getAllLabels(): Promise<Record<string, TeamLabel[]>> {
    const { data: labels } = await axios.get(baseLabelsURL)
    return labels
}

async function getTeamLabels(team: string): Promise<TeamLabel[]> {
    const { data: labels } = await axios.get(`${baseLabelsURL}/?team=${team}`)
    return labels
}

async function getLabel(id: number): Promise<TeamLabel> {
    const { data: label } = await axios.get(`${baseLabelsURL}/`, {
        params: {
            id,
        },
    })
    return label
}

async function createLabel(
    label: CreateTeamLabelRequirements
): Promise<TeamLabel> {
    const { data: newLabel } = await axios.post(`${baseLabelsURL}/`, label)
    return newLabel
}

async function deleteLabel(id: number): Promise<TeamLabel> {
    const { data: deletedLabel } = await axios.delete(`${baseLabelsURL}/${id}`)
    return deletedLabel
}

async function updateLabel(
    id: number,
    label: UpdateTeamLabelRequirements
): Promise<TeamLabel> {
    const { data: updatedLabel } = await axios.patch(
        `${baseLabelsURL}/${id}`,
        label
    )
    return updatedLabel
}

async function generateLabel(
    sample_id: string,
    layout_id: number
): Promise<string> {
    const { data: base64image } = await axios.post(
        `${baseLabelsURL}/generate`,
        {
            sample_id,
            layout_id,
        }
    )
    return base64image
}

async function printLabels(
    labelImages: string[],
    printer: Printer
): Promise<boolean> {
    const { data } = await axios.post(`${baseLabelsURL}/print`, {
        images: labelImages,
        printer,
    })
    return data.success
}

// ----------------------------------------

// * @route /printers

async function getAllPrinters(): Promise<Printer[]> {
    const { data: printers } = await axios.get(basePrintersURL)
    return printers
}

async function getPrinter(ip: string): Promise<Printer> {
    const { data: printer } = await axios.get(`${basePrintersURL}/${ip}`)
    return printer
}

async function createPrinter(
    printer: CreatePrinterRequirements
): Promise<Printer> {
    const { data: newPrinter } = await axios.post(basePrintersURL, printer)
    return newPrinter
}

async function updatePrinter(
    ip: string,
    printer: UpdatePrinterRequirements
): Promise<Printer> {
    const { data: updatedPrinter } = await axios.patch(
        `${basePrintersURL}/${ip}`,
        printer
    )
    return updatedPrinter
}

async function deletePrinter(ip: string): Promise<Printer> {
    const { data: deletedPrinter } = await axios.delete(
        `${basePrintersURL}/${ip}`
    )
    return deletedPrinter
}

export {
    getAllTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getAllSamples,
    getSample,
    getTeamSamples,
    getTeamSample,
    getAuditSamples,
    getAllDeletedSamples,
    createSample,
    updateSample,
    deleteSample,
    deleteSamples,
    getTeamFields,
    getTeamField,
    getAllFields,
    createTeamField,
    updateTeamField,
    deleteTeamField,
    getAllLabels,
    getLabel,
    getTeamLabels,
    createLabel,
    deleteLabel,
    updateLabel,
    generateLabel,
    printLabels,
    getAllPrinters,
    getPrinter,
    createPrinter,
    updatePrinter,
    deletePrinter,
}

export * from './types'
