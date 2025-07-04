// This file is auto-generated by @hey-api/openapi-ts

export type Account = {
  created_at?: string;
  updated_at?: string;
  connection_id: string;
  name: string;
  notes?: string | null;
  currency: string;
  account_type: AccountType;
  balance_offset: number;
  iban?: string | null;
  bban?: string | null;
  bic?: string | null;
  scan_code?: string | null;
  internal_id?: string | null;
  owner_name?: string | null;
  usage_type?: UsageType | null;
  iso_account_type?: IsoAccountType | null;
  id?: string;
};

export type AccountReadWithBalance = {
  connection_id: string;
  name: string;
  notes?: string | null;
  currency: string;
  account_type: AccountType;
  balance_offset: number;
  iban?: string | null;
  bban?: string | null;
  bic?: string | null;
  scan_code?: string | null;
  internal_id?: string | null;
  owner_name?: string | null;
  usage_type?: UsageType | null;
  iso_account_type?: IsoAccountType | null;
  id: string;
  balance: number;
};

export type AccountStatistics = {
  last_30d_income: number;
  last_30d_expense: number;
};

export type AccountType = "CASH" | "BANK_GOCARDLESS" | "BANK_MANUAL";

export type BodyPasswordLogin = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type ConnectionRead = {
  user_id: string;
  connection_type: ConnectionType;
  internal_id?: string | null;
  institution_id?: string | null;
  id: string;
};

export type ConnectionType = "MANUAL" | "GOCARDLESS";

export type Counterparty = {
  created_at?: string;
  updated_at?: string;
  creator_id: string;
  name: string;
  notes?: string | null;
  iban?: string | null;
  bban?: string | null;
  id?: string;
};

export type CreateGocardlessConnection = {
  institution_id: string;
};

export type CreateRequisitionResponse = {
  id: string;
  link: string;
};

export type ErrorResponse = {
  detail: string;
};

export type HttpValidationError = {
  detail?: Array<ValidationError>;
};

export type IsoAccountType =
  | "CACC"
  | "CARD"
  | "CASH"
  | "CHAR"
  | "CISH"
  | "COMM"
  | "CPAC"
  | "LLSV"
  | "LOAN"
  | "MGLD"
  | "MOMA"
  | "NREX"
  | "ODFT"
  | "ONDP"
  | "OTHR"
  | "SACC"
  | "SLRY"
  | "SVGS"
  | "TAXE"
  | "TRAN"
  | "TRAS"
  | "VACC"
  | "NFCA";

export type ImportRequisitionResponse = {
  task_id: string;
};

export type Merchant = {
  created_at?: string;
  updated_at?: string;
  name: string;
  category: string;
  match_prefix: string;
  logo_url?: string | null;
  url?: string | null;
  id?: string;
};

export type MessageResponse = {
  message: string;
};

export type ProcessingStatus = "UNPROCESSED" | "PROCESSED";

export type TaskStatus = "pending" | "success" | "failure";

export type TaskStatusResponse = {
  ready: boolean;
  status: TaskStatus;
  completed_count: number;
  total_count: number;
};

export type TransactionReadRelations = {
  account_id: string;
  amount: number;
  currency: string;
  native_amount: number;
  processing_status?: ProcessingStatus;
  opposing_name?: string | null;
  opposing_iban?: string | null;
  opposing_bban?: string | null;
  opposing_merchant_id?: string | null;
  opposing_counterparty_id?: string | null;
  opposing_account_id?: string | null;
  gocardless_id?: string | null;
  internal_id?: string | null;
  booking_time: string;
  value_time?: string | null;
  id: string;
  account: Account;
  opposing_merchant: Merchant | null;
  opposing_counterparty: Counterparty | null;
  opposing_account: Account | null;
};

export type UsageType = "PRIV" | "ORGA";

export type UserCreate = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type PasswordLoginData = {
  body: BodyPasswordLogin;
  headers: {
    "hcaptcha-token": string;
  };
  path?: never;
  query?: never;
  url: "/auth/login/password";
};

export type PasswordLoginErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type PasswordLoginError = PasswordLoginErrors[keyof PasswordLoginErrors];

export type PasswordLoginResponses = {
  /**
   * Successful Response
   */
  200: MessageResponse;
};

export type PasswordLoginResponse =
  PasswordLoginResponses[keyof PasswordLoginResponses];

export type RegisterData = {
  body: UserCreate;
  headers: {
    "hcaptcha-token": string;
  };
  path?: never;
  query?: never;
  url: "/auth/register";
};

export type RegisterErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type RegisterError = RegisterErrors[keyof RegisterErrors];

export type RegisterResponses = {
  /**
   * Successful Response
   */
  200: MessageResponse;
};

export type RegisterResponse = RegisterResponses[keyof RegisterResponses];

export type ConfirmEmailData = {
  body?: never;
  path: {
    email_token: string;
  };
  query?: never;
  url: "/auth/confirm-email/{email_token}";
};

export type ConfirmEmailErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type ConfirmEmailError = ConfirmEmailErrors[keyof ConfirmEmailErrors];

export type ConfirmEmailResponses = {
  /**
   * Successful Response
   */
  200: unknown;
};

export type RefreshTokenData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/auth/refresh";
};

export type RefreshTokenErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type RefreshTokenError = RefreshTokenErrors[keyof RefreshTokenErrors];

export type RefreshTokenResponses = {
  /**
   * Successful Response
   */
  200: MessageResponse;
};

export type RefreshTokenResponse =
  RefreshTokenResponses[keyof RefreshTokenResponses];

export type LogoutData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/auth/logout";
};

export type LogoutErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type LogoutError = LogoutErrors[keyof LogoutErrors];

export type LogoutResponses = {
  /**
   * Successful Response
   */
  200: MessageResponse;
};

export type LogoutResponse = LogoutResponses[keyof LogoutResponses];

export type JoinWaitlistData = {
  body?: never;
  path?: never;
  query: {
    email: string;
  };
  url: "/waitlist/join";
};

export type JoinWaitlistErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type JoinWaitlistError = JoinWaitlistErrors[keyof JoinWaitlistErrors];

export type JoinWaitlistResponses = {
  /**
   * Successful Response
   */
  200: MessageResponse;
};

export type JoinWaitlistResponse =
  JoinWaitlistResponses[keyof JoinWaitlistResponses];

export type ConfirmWaitlistData = {
  body?: never;
  path: {
    waitlist_token: string;
  };
  query?: never;
  url: "/waitlist/confirm/{waitlist_token}";
};

export type ConfirmWaitlistErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type ConfirmWaitlistError =
  ConfirmWaitlistErrors[keyof ConfirmWaitlistErrors];

export type ConfirmWaitlistResponses = {
  /**
   * Successful Response
   */
  200: unknown;
};

export type ImportGocardlessData = {
  body?: never;
  path: {
    connection_id: string;
  };
  query?: never;
  url: "/import/gocardless/{connection_id}";
};

export type ImportGocardlessErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type ImportGocardlessError =
  ImportGocardlessErrors[keyof ImportGocardlessErrors];

export type ImportGocardlessResponses = {
  /**
   * Successful Response
   */
  200: ImportRequisitionResponse;
};

export type ImportGocardlessResponse =
  ImportGocardlessResponses[keyof ImportGocardlessResponses];

export type GetTaskStatusData = {
  body?: never;
  path: {
    task_id: string;
  };
  query?: never;
  url: "/import/task/{task_id}";
};

export type GetTaskStatusErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type GetTaskStatusError = GetTaskStatusErrors[keyof GetTaskStatusErrors];

export type GetTaskStatusResponses = {
  /**
   * Successful Response
   */
  200: TaskStatusResponse;
};

export type GetTaskStatusResponse =
  GetTaskStatusResponses[keyof GetTaskStatusResponses];

export type GetTransactionsData = {
  body?: never;
  path?: never;
  query?: {
    offset?: number;
    limit?: number;
  };
  url: "/transaction";
};

export type GetTransactionsErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type GetTransactionsError =
  GetTransactionsErrors[keyof GetTransactionsErrors];

export type GetTransactionsResponses = {
  /**
   * Successful Response
   */
  200: Array<TransactionReadRelations>;
};

export type GetTransactionsResponse =
  GetTransactionsResponses[keyof GetTransactionsResponses];

export type GetAccountsData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/account";
};

export type GetAccountsErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type GetAccountsError = GetAccountsErrors[keyof GetAccountsErrors];

export type GetAccountsResponses = {
  /**
   * Successful Response
   */
  200: Array<AccountReadWithBalance>;
};

export type GetAccountsResponse =
  GetAccountsResponses[keyof GetAccountsResponses];

export type GetAccountStatisticsData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/account/statistics";
};

export type GetAccountStatisticsErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type GetAccountStatisticsError =
  GetAccountStatisticsErrors[keyof GetAccountStatisticsErrors];

export type GetAccountStatisticsResponses = {
  /**
   * Successful Response
   */
  200: AccountStatistics;
};

export type GetAccountStatisticsResponse =
  GetAccountStatisticsResponses[keyof GetAccountStatisticsResponses];

export type GetConnectionsData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/connection";
};

export type GetConnectionsErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type GetConnectionsError =
  GetConnectionsErrors[keyof GetConnectionsErrors];

export type GetConnectionsResponses = {
  /**
   * Successful Response
   */
  200: Array<ConnectionRead>;
};

export type GetConnectionsResponse =
  GetConnectionsResponses[keyof GetConnectionsResponses];

export type CreateGocardlessConnectionData = {
  body: CreateGocardlessConnection;
  path?: never;
  query?: never;
  url: "/connection/gocardless";
};

export type CreateGocardlessConnectionErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type CreateGocardlessConnectionError =
  CreateGocardlessConnectionErrors[keyof CreateGocardlessConnectionErrors];

export type CreateGocardlessConnectionResponses = {
  /**
   * Successful Response
   */
  200: CreateRequisitionResponse;
};

export type CreateGocardlessConnectionResponse =
  CreateGocardlessConnectionResponses[keyof CreateGocardlessConnectionResponses];

export type GocardlessCallbackData = {
  body?: never;
  path?: never;
  query: {
    ref: string;
  };
  url: "/connection/gocardless/callback";
};

export type GocardlessCallbackErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type GocardlessCallbackError =
  GocardlessCallbackErrors[keyof GocardlessCallbackErrors];

export type GocardlessCallbackResponses = {
  /**
   * Successful Response
   */
  200: unknown;
};

export type GetHcaptchaSitekeyData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/hcaptcha/sitekey";
};

export type GetHcaptchaSitekeyErrors = {
  /**
   * Bad Request
   */
  400: ErrorResponse;
  /**
   * Unauthorized
   */
  401: ErrorResponse;
  /**
   * Forbidden
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetHcaptchaSitekeyError =
  GetHcaptchaSitekeyErrors[keyof GetHcaptchaSitekeyErrors];

export type GetHcaptchaSitekeyResponses = {
  /**
   * Successful Response
   */
  200: MessageResponse;
};

export type GetHcaptchaSitekeyResponse =
  GetHcaptchaSitekeyResponses[keyof GetHcaptchaSitekeyResponses];

export type ClientOptions = {
  baseUrl: `${string}://${string}` | (string & {});
};
