import { createSlice } from "@reduxjs/toolkit";


const skillSwpaSlice = createSlice({
    name:"skillswap",
    initialState:{
        skills:null,
         skillByUser:null,

    },
    reducers:{
        skillSwapSuccess(state,action){
        state.skills=action.payload
        console.log((action.payload,"skills"));      
        },
        getSkillsByUser(state,action){
          state.skills=action.payload
        }
    }
})
export const {skillSwapSuccess} = skillSwpaSlice.actions
export default skillSwpaSlice.reducer