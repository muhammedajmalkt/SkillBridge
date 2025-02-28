import * as Yup from "yup"

export const signupValidation = Yup.object({
    name:Yup.string().min(3).required("Please enter name"),
    email:Yup.string().email("Please enter  valid e-mail").required("Enter email"),
    password:Yup.string().min(6).required(" Enter password"),
    cPassword:Yup.string().oneOf([Yup.ref("password")],"Password not match").required("Re-enter the password")
})

export const loginValidation= Yup.object({
    email:Yup.string().email("Please enter valid email").required("Enter email"),
    password:Yup.string().min(6).required("Enter password")
})