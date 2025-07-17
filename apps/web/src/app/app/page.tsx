import { getAccountStatistics, getAccounts, getTransactions } from "api-client";
import { getRequestConfig } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MerchantLogo } from "@/components/ui/merchant-logo";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
} from "lucide-react";
import PrivateText from "@/components/ui/private-text";

// We need to prevent static generation, since the API is not available at build time
export const dynamic = "force-dynamic";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getAccountIcon = (type: string) => {
  switch (type) {
    case "CACC":
      return <Wallet className="h-5 w-5" />;
    case "SVGS":
      return <PiggyBank className="h-5 w-5" />;
    case "CARD":
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

export default async function Dashboard() {
  const config = await getRequestConfig();

  // Fetch real data from API
  const transactionsResult = await getTransactions({
    ...config,
    query: { limit: 5 },
  });

  const transactions = transactionsResult.data;

  const accountsResult = await getAccounts({
    ...config,
  });

  const accounts = accountsResult.data;

  const statisticsResult = await getAccountStatistics({
    ...config,
  });

  const statistics = statisticsResult.data;

  // Calculate metrics from real data
  const totalBalance =
    accounts?.reduce((sum, account) => sum + account.balance, 0) ?? 0;

  return (
    <div className="from-background via-background to-background/95 min-h-full bg-gradient-to-br p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <Card className="gap-2 border-sky-500/40 bg-gradient-to-br from-sky-500/10 to-blue-600/10 py-4 md:gap-4 md:py-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0 md:px-6">
              <CardTitle className="text-sm font-medium text-sky-300">
                Total Balance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="text-2xl font-bold text-white md:text-3xl">
                <PrivateText>{formatCurrency(totalBalance, "EUR")}</PrivateText>
              </div>
              <p className="mt-1 text-xs text-sky-300/80">
                Across {accounts?.length} accounts
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-green-600/10 py-4 md:gap-4 md:py-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0 md:px-6">
              <CardTitle className="text-sm font-medium text-emerald-300">
                Monthly Income
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="text-2xl font-bold text-white md:text-3xl">
                <PrivateText>
                  {formatCurrency(statistics?.last_30d_income ?? 0, "EUR")}
                </PrivateText>
              </div>
              <p className="mt-1 text-xs text-emerald-300/80">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="gap-2 border-red-500/40 bg-gradient-to-br from-red-500/10 to-rose-600/10 py-4 md:gap-4 md:py-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0 md:px-6">
              <CardTitle className="text-sm font-medium text-red-300">
                Monthly Expenses
              </CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="text-2xl font-bold text-white md:text-3xl">
                <PrivateText>
                  {formatCurrency(statistics?.last_30d_expense ?? 0, "EUR")}
                </PrivateText>
              </div>
              <p className="mt-1 text-xs text-red-300/80">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Accounts */}
          <Card className="min-w-0 gap-2 md:gap-4 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Accounts</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0 space-y-3">
              {accounts?.map((account) => (
                <div
                  key={account.id}
                  className="bg-card/50 border-border/50 hover:bg-card/80 group min-w-0 rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex flex-col space-y-3 xl:flex-row xl:items-start xl:justify-between xl:space-y-0">
                    {/* Left side: Icon, name, and type */}
                    <div className="flex min-w-0 items-center space-x-3 xl:flex-1">
                      <div className="bg-muted/20 group-hover:bg-muted/30 rounded-full p-2 transition-colors">
                        {getAccountIcon(account.iso_account_type ?? "")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">
                          {account.name}
                        </p>
                        <p className="text-muted-foreground/60 text-xs">
                          {account.iso_account_type === "CACC"
                            ? "Checking"
                            : account.iso_account_type === "SVGS"
                              ? "Savings"
                              : account.iso_account_type === "CARD"
                                ? "Credit"
                                : "Account"}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Amount */}
                    <div className="xl:ml-4 xl:flex-shrink-0 xl:text-right">
                      <p
                        className={`whitespace-nowrap text-lg font-semibold ${
                          account.balance >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        <PrivateText>
                          {formatCurrency(account.balance, account.currency)}
                        </PrivateText>
                      </p>
                    </div>
                  </div>

                  {/* IBAN - always at bottom */}
                  {account.iban && (
                    <div className="min-w-0 xl:mt-2">
                      <p className="text-muted-foreground/60 truncate text-xs">
                        <PrivateText
                          dots={15}
                          prefix={account.iban?.slice(0, 2)}
                        >
                          {account.iban}
                        </PrivateText>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="min-w-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Transactions
                {transactionsResult.error && (
                  <span className="ml-2 text-sm text-red-400">
                    (Error loading)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
              {transactions?.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  {transactionsResult.error
                    ? "Error loading transactions. Try refreshing the page."
                    : "No transactions found. Connect your bank account to see transactions."}
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions?.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-card/30 border-border/30 hover:bg-card/60 min-w-0 rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        {/* Left side: Logo and transaction details */}
                        <div className="flex min-w-0 flex-1 items-center space-x-4">
                          <div className="relative">
                            <MerchantLogo
                              merchantName={
                                transaction.opposing_merchant?.name ||
                                transaction.opposing_counterparty?.name ||
                                transaction.opposing_name ||
                                ""
                              }
                              logoUrl={
                                transaction.opposing_merchant?.logo_url ??
                                undefined
                              }
                            />
                            <div
                              className={`border-card absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                transaction.amount > 0
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {transaction.amount > 0 ? (
                                <ArrowUpRight className="h-3 w-3 text-white" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-white">
                              {transaction.opposing_account?.name ||
                                transaction.opposing_merchant?.name ||
                                transaction.opposing_counterparty?.name ||
                                transaction.opposing_name}
                            </p>
                            <p className="text-muted-foreground/60 text-xs">
                              {transaction.account.name} •{" "}
                              {transaction.opposing_merchant?.category ||
                                "Uncategorized"}{" "}
                              • {formatDate(transaction.booking_time)}
                            </p>
                          </div>
                        </div>

                        {/* Right side: Amount and original currency if different */}
                        <div className="text-right">
                          <p
                            className={`whitespace-nowrap text-lg font-semibold ${
                              transaction.amount > 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            <PrivateText>
                              {transaction.amount > 0 ? "+" : ""}
                              {formatCurrency(
                                transaction.native_amount,
                                transaction.account.currency
                              )}
                            </PrivateText>
                          </p>
                          {transaction.currency !==
                            transaction.account.currency && (
                            <p className="text-muted-foreground/60 whitespace-nowrap text-xs">
                              <PrivateText>
                                {formatCurrency(
                                  transaction.amount,
                                  transaction.currency
                                )}
                              </PrivateText>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
