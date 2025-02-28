import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Feature/authSlice"
import  skillSwapReducer from "./Feature/skillSwap"

const Store = configureStore({
      reducer:{
        auth:authReducer,
        skill:skillSwapReducer
      }
})

export default Store