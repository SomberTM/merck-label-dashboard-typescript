import { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { useFetchAll } from '../redux'

const RootPage = () => {
    /**
     * Root page will fetch ALL data from the server and
     * populate the redux store with it.
     */

    const fetchAll = useFetchAll()

    useEffect(() => {
        fetchAll()
    }, [])

    return (
        <>
            <NavBar />
        </>
    )
}

export default RootPage

{
    /* <div>
{
    state.samples.hasOwnProperty(state.team) ?
    state.samples[state.team].map((sample, _) => 
        <div key={_}>
            {JSON.stringify(sample, null, 2)}
        </div>
    )
    : <></>
}
</div>
<div>
{
    state.fields.hasOwnProperty(state.team) ?
    state.fields[state.team].map((field, _) => 
        <div key={_}>
            {JSON.stringify(field, null, 2)}
        </div>
    )
    : <></>
}
</div> */
}
