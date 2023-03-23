import LabelEditor from '../components/LabelEditor'
import NavBar from '../components/NavBar'

const LabelEditorPage = () => {
    return (
        <>
            <NavBar />
            <LabelEditor
                editorSize={{ width: 'max-content', height: '60vh' }}
            />
        </>
    )
}

export default LabelEditorPage
