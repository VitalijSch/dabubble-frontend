// GENERATED from dabubble-backend/openapi.yaml by `pnpm api:generate`. Do not edit by hand.
export interface paths {
  "/api/v1/auth/register/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description Create an account. The user must confirm their email before they can log in. */
    post: operations["auth_register_create"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/register/validate/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * @description Check the first sign-up step (name, email, password, privacy policy) without saving.
     *
     *     The frontend calls this on "Weiter", before the avatar step, so the user sees problems like
     *     "email already in use" right away. `register` checks everything again: this is only a preview.
     */
    post: operations["auth_register_validate_create"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/verify-email/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description Confirm the email address with the `uid` and `token` from the email link. */
    post: operations["auth_verify_email_create"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/me/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description The currently logged-in user. */
    get: operations["me_retrieve"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** @enum {unknown} */
    BlankEnum: "";
    /**
     * @description * `avatar_1` - Avatar 1
     *     * `avatar_2` - Avatar 2
     *     * `avatar_3` - Avatar 3
     *     * `avatar_4` - Avatar 4
     *     * `avatar_5` - Avatar 5
     *     * `avatar_6` - Avatar 6
     * @enum {string}
     */
    DefaultAvatarEnum: "avatar_1" | "avatar_2" | "avatar_3" | "avatar_4" | "avatar_5" | "avatar_6";
    /** @description A single error message, e.g. "not logged in" or "too many requests". */
    ErrorDetail: {
      detail: string;
    };
    /**
     * @description The first sign-up step: name, email, password and privacy policy. No avatar yet.
     *
     *     Used on its own to check the first step before the user picks an avatar, and as the base of
     *     `RegisterSerializer`, so both steps follow exactly the same rules.
     */
    RegisterDetailsRequest: {
      full_name: string;
      /** Format: email */
      email: string;
      password: string;
      /** @description Must be `true`: the user has read the privacy policy. */
      accept_privacy_policy: boolean;
    };
    /** @description Field errors: one or more German messages per invalid field (RegisterDetails). */
    RegisterDetailsValidationError: {
      full_name?: string[];
      email?: string[];
      password?: string[];
      accept_privacy_policy?: string[];
      non_field_errors?: string[];
    };
    /** @description Sign-up data. Send `avatar` (an image file) or `default_avatar`, not both. */
    RegisterRequest: {
      full_name: string;
      /** Format: email */
      email: string;
      password: string;
      /** @description Must be `true`: the user has read the privacy policy. */
      accept_privacy_policy: boolean;
      /** Format: binary */
      avatar?: Blob;
      default_avatar?: components["schemas"]["DefaultAvatarEnum"];
    };
    /** @description Field errors: one or more German messages per invalid field (Register). */
    RegisterValidationError: {
      full_name?: string[];
      email?: string[];
      password?: string[];
      accept_privacy_policy?: string[];
      avatar?: string[];
      default_avatar?: string[];
      non_field_errors?: string[];
    };
    User: {
      readonly id: number;
      /**
       * Email address
       * Format: email
       */
      readonly email: string;
      full_name: string;
      /** Format: uri */
      readonly avatar: string | null;
      readonly default_avatar:
        components["schemas"]["DefaultAvatarEnum"] | components["schemas"]["BlankEnum"];
      /**
       * Mitglied seit
       * Format: date-time
       */
      readonly date_joined: string;
    };
    VerifyEmailError:
      components["schemas"]["VerifyEmailValidationError"] | components["schemas"]["ErrorDetail"];
    VerifyEmailRequest: {
      uid: string;
      token: string;
    };
    /** @description Field errors: one or more German messages per invalid field (VerifyEmail). */
    VerifyEmailValidationError: {
      uid?: string[];
      token?: string[];
      non_field_errors?: string[];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  auth_register_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegisterRequest"];
        "application/x-www-form-urlencoded": components["schemas"]["RegisterRequest"];
        "multipart/form-data": components["schemas"]["RegisterRequest"];
      };
    };
    responses: {
      /** @description Account created; a confirmation email is on its way. */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description The data is invalid. Messages per field, ready to show under the inputs. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RegisterValidationError"];
        };
      };
      /** @description Too many requests. Try again later. */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorDetail"];
        };
      };
    };
  };
  auth_register_validate_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegisterDetailsRequest"];
        "application/x-www-form-urlencoded": components["schemas"]["RegisterDetailsRequest"];
        "multipart/form-data": components["schemas"]["RegisterDetailsRequest"];
      };
    };
    responses: {
      /** @description The details are valid; continue to the avatar step. */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The data is invalid. Messages per field, ready to show under the inputs. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RegisterDetailsValidationError"];
        };
      };
      /** @description Too many requests. Try again later. */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorDetail"];
        };
      };
    };
  };
  auth_verify_email_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["VerifyEmailRequest"];
        "application/x-www-form-urlencoded": components["schemas"]["VerifyEmailRequest"];
        "multipart/form-data": components["schemas"]["VerifyEmailRequest"];
      };
    };
    responses: {
      /** @description Email confirmed; the account is active. */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description `uid`/`token` missing (field errors) or the link is invalid, expired or already used (`detail`). */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["VerifyEmailError"];
        };
      };
      /** @description Too many requests. Try again later. */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorDetail"];
        };
      };
    };
  };
  me_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Not logged in. */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorDetail"];
        };
      };
    };
  };
}
