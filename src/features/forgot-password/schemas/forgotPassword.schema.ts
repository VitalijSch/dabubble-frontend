import * as yup from "yup";

const djangoEmailRegex =
  /^([\-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[\-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|"([^"\r\\]|\\.)+")@([A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?$/i;

export const forgotPasswordSchema = yup
  .object({
    email: yup
      .string()
      .required("Bitte geben Sie eine E-Mail-Adresse ein.")
      .matches(djangoEmailRegex, "Diese E-Mail-Adresse ist leider ungültig."),
  })
  .required();

export type FormData = yup.InferType<typeof forgotPasswordSchema>;
