// This file is auto-generated by @hey-api/openapi-ts

import {
  type Options as ClientOptions,
  type TDataShape,
  type Client,
  urlSearchParamsBodySerializer,
} from "@hey-api/client-fetch";
import type {
  PasswordLoginData,
  PasswordLoginResponse,
  PasswordLoginError,
  RegisterData,
  RegisterResponse,
  RegisterError,
  ConfirmEmailData,
  ConfirmEmailError,
  RefreshTokenData,
  RefreshTokenResponse,
  RefreshTokenError,
  LogoutData,
  LogoutResponse,
  LogoutError,
  JoinWaitlistData,
  JoinWaitlistResponse,
  JoinWaitlistError,
  ConfirmWaitlistData,
  ConfirmWaitlistError,
  RootData,
  RootResponse,
  HelloWorldData,
  HelloWorldResponse,
  PingData,
  PingResponse,
  PingError,
  GetHcaptchaSitekeyData,
  GetHcaptchaSitekeyResponse,
} from "./types.gen";
import { client as _heyApiClient } from "./client.gen";

export type Options<
  TData extends TDataShape = TDataShape,
  ThrowOnError extends boolean = boolean,
> = ClientOptions<TData, ThrowOnError> & {
  /**
   * You can provide a client instance returned by `createClient()` instead of
   * individual options. This might be also useful if you want to implement a
   * custom client.
   */
  client?: Client;
  /**
   * You can pass arbitrary values through the `meta` object. This can be
   * used to access values that aren't defined as part of the SDK function.
   */
  meta?: Record<string, unknown>;
};

/**
 * Password Login
 */
export const passwordLogin = <ThrowOnError extends boolean = false>(
  options: Options<PasswordLoginData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PasswordLoginResponse,
    PasswordLoginError,
    ThrowOnError
  >({
    ...urlSearchParamsBodySerializer,
    url: "/auth/login/password",
    ...options,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...options?.headers,
    },
  });
};

/**
 * Register
 */
export const register = <ThrowOnError extends boolean = false>(
  options: Options<RegisterData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    RegisterResponse,
    RegisterError,
    ThrowOnError
  >({
    url: "/auth/register",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * Confirm Email
 */
export const confirmEmail = <ThrowOnError extends boolean = false>(
  options: Options<ConfirmEmailData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    unknown,
    ConfirmEmailError,
    ThrowOnError
  >({
    url: "/auth/confirm-email/{email_token}",
    ...options,
  });
};

/**
 * Refresh Token
 */
export const refreshToken = <ThrowOnError extends boolean = false>(
  options: Options<RefreshTokenData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    RefreshTokenResponse,
    RefreshTokenError,
    ThrowOnError
  >({
    url: "/auth/refresh",
    ...options,
  });
};

/**
 * Logout
 */
export const logout = <ThrowOnError extends boolean = false>(
  options?: Options<LogoutData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).post<
    LogoutResponse,
    LogoutError,
    ThrowOnError
  >({
    url: "/auth/logout",
    ...options,
  });
};

/**
 * Join Waitlist
 */
export const joinWaitlist = <ThrowOnError extends boolean = false>(
  options: Options<JoinWaitlistData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    JoinWaitlistResponse,
    JoinWaitlistError,
    ThrowOnError
  >({
    url: "/waitlist/join",
    ...options,
  });
};

/**
 * Confirm Waitlist
 */
export const confirmWaitlist = <ThrowOnError extends boolean = false>(
  options: Options<ConfirmWaitlistData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    unknown,
    ConfirmWaitlistError,
    ThrowOnError
  >({
    url: "/waitlist/confirm/{waitlist_token}",
    ...options,
  });
};

/**
 * Root
 */
export const root = <ThrowOnError extends boolean = false>(
  options?: Options<RootData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    RootResponse,
    unknown,
    ThrowOnError
  >({
    url: "/",
    ...options,
  });
};

/**
 * Hello World
 */
export const helloWorld = <ThrowOnError extends boolean = false>(
  options?: Options<HelloWorldData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    HelloWorldResponse,
    unknown,
    ThrowOnError
  >({
    url: "/hello",
    ...options,
  });
};

/**
 * Ping
 */
export const ping = <ThrowOnError extends boolean = false>(
  options: Options<PingData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    PingResponse,
    PingError,
    ThrowOnError
  >({
    url: "/ping",
    ...options,
  });
};

/**
 * Get Hcaptcha Sitekey
 */
export const getHcaptchaSitekey = <ThrowOnError extends boolean = false>(
  options?: Options<GetHcaptchaSitekeyData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetHcaptchaSitekeyResponse,
    unknown,
    ThrowOnError
  >({
    url: "/hcaptcha/sitekey",
    ...options,
  });
};
