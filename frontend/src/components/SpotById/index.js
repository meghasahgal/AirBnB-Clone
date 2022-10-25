import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getSpots } from "../../store/spot";

const SpotById = () =>{
const dispatch = useDispatch();
const {spotId} = useParams();
const spot = useSelector((state) => state.spot[spotId])

    return (<div></div>)
}

export default SpotById;
