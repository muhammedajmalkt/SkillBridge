import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Feature/authSlice"
import  skillSwapReducer from "./Feature/skillSwap"
import requestReducer from "./Feature/swapRequest"

const Store = configureStore({
      reducer:{
        auth:authReducer,
        skill:skillSwapReducer,
        request:requestReducer
      }
})

export default Store