import { z } from "zod";

export const REQUIRED_FIELD = "Le champ est obligatoire";
export const INVALID_FIELD = "Le champ est invalide";

export const INVALID_CREDENTIALS =
  "Les identifiants sont invalides ou votre compte n'est pas encore validé";

export const INVALID_EMAIL = "L'adresse email invalide";
export const EMAIL_ALREADY_TAKEN = "L'adresse email existe déjà";

export const PASSWORD_TOO_SHORT =
  "Le mot de passe doit contenir au moins 13 caractères";
export const PASSWORD_NO_LOWER =
  "Le mot de passe doit contenir au moins une lettre minuscule";
export const PASSWORD_NO_UPPER =
  "Le mot de passe doit contenir au moins une lettre majuscule";
export const PASSWORD_NO_DIGIT =
  "Le mot de passe doit contenir au moins un chiffre";
export const PASSWORD_NO_SPECIAL =
  "Le mot de passe doit contenir au moins un caractère spécial (exemple: ! @ # $ % ^ & * ( ) .)";
export const PASSWORD_INVALID_MATCH = "Les mots de passe sont différents";

export const requiredString = z.string({ required_error: REQUIRED_FIELD });
