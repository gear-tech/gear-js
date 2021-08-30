import * as yup from "yup";

export const Schema = yup.object().shape({
    destination: yup.string().required("Field “Destination” must be filled"),
    payload: yup.string().required("Field “Payload” must be filled (e.g. 0x1234 or ascii data)"),
    gasLimit: yup.number().required("This field is required").min(1, "Initial value should be more than 0"),
    value: yup.number().required("This field is required").min(1, "Initial value should be more than 0")
});
