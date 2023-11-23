import * as yup from "yup";

export const driverCarSerializer = yup.object().shape({
    name: yup.string().required(),
    cnh: yup.string().required()
});

export const driverReturnSerializer = yup.object().shape({
    id: yup.string(),
    name: yup.string(),
    cnh: yup.string()
});