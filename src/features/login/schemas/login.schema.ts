import * as yup from "yup";

const djangoEmailRegex =
  /^([\-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[\-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|"([^"\r\\]|\\.)+")@([A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?$/i;

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .required("Bitte geben Sie eine E-Mail-Adresse ein.")
      .matches(djangoEmailRegex, "Diese E-Mail-Adresse ist leider ungültig."),
    password: yup
      .string()
      .required("Bitte geben Sie ein Passwort ein.")
      .min(8, "Passwort muss mindestens 8 Zeichen lang sein."),
  })
  .required();
