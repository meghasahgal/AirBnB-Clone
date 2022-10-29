import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import CreateReviewForm from "../CreateReviewForm"


const Profile = ({userId}) => {
return (
    <div>
        <CreateReviewForm/>
    </div>
)
}


export default Profile;
