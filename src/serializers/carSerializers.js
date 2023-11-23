import * as yup from "yup";

export const newCarSerializer = yup.object().shape({
    licenseplate: yup.string().required(),
    color: yup.string().required(),
    brand: yup.string().required(),
});

export const carReturnSerializer = yup.object().shape({
    id: yup.number(),
    licenseplate: yup.string(),
    color: yup.string(),
    brand: yup.string(),
})

