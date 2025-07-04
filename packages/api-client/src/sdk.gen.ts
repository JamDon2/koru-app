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
  ImportGocardlessData,
  ImportGocardlessResponse,
  ImportGocardlessError,
  GetTaskStatusData,
  GetTaskStatusResponse,
  GetTaskStatusError,
  GetTransactionsData,
  GetTransactionsResponse,
  GetTransactionsError,
  GetAccountsData,
  GetAccountsResponse,
  GetAccountsError,
  GetAccountStatisticsData,
  GetAccountStatisticsResponse,
  GetAccountStatisticsError,
  GetConnectionsData,
  GetConnectionsResponse,
  GetConnectionsError,
  CreateGocardlessConnectionData,
  CreateGocardlessConnectionResponse,
  CreateGocardlessConnectionError,
  GocardlessCallbackData,
  GocardlessCallbackError,
  GetHcaptchaSitekeyData,
  GetHcaptchaSitekeyResponse,
  GetHcaptchaSitekeyError,
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
 * Import Gocardless
 */
export const importGocardless = <ThrowOnError extends boolean = false>(
  options: Options<ImportGocardlessData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    ImportGocardlessResponse,
    ImportGocardlessError,
    ThrowOnError
  >({
    url: "/import/gocardless/{connection_id}",
    ...options,
  });
};

/**
 * Get Task Status
 */
export const getTaskStatus = <ThrowOnError extends boolean = false>(
  options: Options<GetTaskStatusData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetTaskStatusResponse,
    GetTaskStatusError,
    ThrowOnError
  >({
    url: "/import/task/{task_id}",
    ...options,
  });
};

/**
 * Get Transactions
 */
export const getTransactions = <ThrowOnError extends boolean = false>(
  options: Options<GetTransactionsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetTransactionsResponse,
    GetTransactionsError,
    ThrowOnError
  >({
    url: "/transaction",
    ...options,
  });
};

/**
 * Get Accounts
 */
export const getAccounts = <ThrowOnError extends boolean = false>(
  options: Options<GetAccountsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetAccountsResponse,
    GetAccountsError,
    ThrowOnError
  >({
    url: "/account",
    ...options,
  });
};

/**
 * Get Account Statistics
 */
export const getAccountStatistics = <ThrowOnError extends boolean = false>(
  options: Options<GetAccountStatisticsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetAccountStatisticsResponse,
    GetAccountStatisticsError,
    ThrowOnError
  >({
    url: "/account/statistics",
    ...options,
  });
};

/**
 * Get Connections
 */
export const getConnections = <ThrowOnError extends boolean = false>(
  options: Options<GetConnectionsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetConnectionsResponse,
    GetConnectionsError,
    ThrowOnError
  >({
    url: "/connection",
    ...options,
  });
};

/**
 * Create Gocardless Connection
 */
export const createGocardlessConnection = <
  ThrowOnError extends boolean = false,
>(
  options: Options<CreateGocardlessConnectionData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    CreateGocardlessConnectionResponse,
    CreateGocardlessConnectionError,
    ThrowOnError
  >({
    url: "/connection/gocardless",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * Gocardless Callback
 */
export const gocardlessCallback = <ThrowOnError extends boolean = false>(
  options: Options<GocardlessCallbackData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    unknown,
    GocardlessCallbackError,
    ThrowOnError
  >({
    url: "/connection/gocardless/callback",
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
    GetHcaptchaSitekeyError,
    ThrowOnError
  >({
    url: "/hcaptcha/sitekey",
    ...options,
  });
};
