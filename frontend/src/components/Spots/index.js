import {useSelector} from "react-redux";
const Spots = ()=>{
    const allSpots = useSelector(state => state.spots)
    // console.log(allSpots, "allSpots")
    const allSpotsArray = Object.values(allSpots)
    return(
        <>
        <div>
            {
            allSpotsArray.map(spot =>(
            <ul>
            <li>{spot.name}</li>
            <li>{spot.previewImage}</li>
            </ul>
            )
            )}
        </div>
    </>
    )
}

export default Spots;
