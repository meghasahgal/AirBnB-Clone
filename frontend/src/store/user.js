import { csrfFetch } from "./csrf";

//Actions
const GET_USER = "reviews/GET_USER";

//Action Creators
export const getUser = (user) =>{
    return {
        type: "GET_USER",
        user
    }
}


//THUNK
