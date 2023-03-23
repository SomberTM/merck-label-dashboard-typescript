import { useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SampleAuditTable from '../components/SampleAuditTable'

const ViewSampleAuditPage = () => {
    const { id } = useParams()

    return (
        <>
            <NavBar />
            <SampleAuditTable sampleId={id as string} />
        </>
    )
}

export default ViewSampleAuditPage
