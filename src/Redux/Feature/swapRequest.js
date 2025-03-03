import { createSlice } from "@reduxjs/toolkit";

const swaprequestSlice = createSlice({
    name:"request",
    initialState:{
        receiverId:"",
    },
    reducers : {
        requstReceiver(state,action){
            console.log(action.payload);
            
            state.receiverId = action.payload
        }
    }
})
export const {requstReceiver} = swaprequestSlice.actions
export default swaprequestSlice.reducer