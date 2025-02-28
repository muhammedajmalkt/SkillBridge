import * as Yup from "yup"

export const swapValidation =Yup.object({
       offeredTitle: Yup.string().min(20, "Title must be at least 20 characters").required("Required"),
    offeredCategory: Yup.string().required("Required"),
    offeredExpireince: Yup.string().required("Required"),
    offeredDetails: Yup.string().min(20, "Must be at least 20 characters").max(500, "Max 500 characters").required("Required"),
        // offeredImage:Yup.string(),


    neededTitle: Yup.string().min(20, "Title must be at least 20 characters").required("Required"),
    neededCategory: Yup.string().required("Required"),
    neededPriority: Yup.string().required("Required"),
    neededDetails: Yup.string().min(20, "Must be at least 20 characters").max(500, "Max 500 characters").required("Required"),
        //  neededImage:Yup.string(),
        hours: Yup.number().min(1, "Min 1 hour").max(14, "Max 14 hours").required("Required"),

    
    
})

