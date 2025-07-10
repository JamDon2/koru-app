"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAccountsOptions,
  getTransactionsOptions,
} from "api-client/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MerchantLogo } from "@/components/ui/merchant-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  PiggyBank,
  Wallet,
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Copy,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState, useMemo } from "react";
import PrivateText from "@/components/ui/private-text";

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

const getAccountIcon = (type: string | null | undefined) => {
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

const getAccountTypeName = (type: string | null | undefined) => {
  switch (type) {
    case "CACC":
      return "Checking";
    case "SVGS":
      return "Savings";
    case "CARD":
      return "Credit Card";
    default:
      return "Account";
  }
};

const getAccountTypeColor = (type: string | null | undefined) => {
  switch (type) {
    case "CACC":
      return "from-blue-500/10 to-sky-600/10 border-blue-500/40";
    case "SVGS":
      return "from-green-500/10 to-emerald-600/10 border-green-500/40";
    case "CARD":
      return "from-purple-500/10 to-violet-600/10 border-purple-500/40";
    default:
      return "from-gray-500/10 to-slate-600/10 border-gray-500/40";
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

type FilterState = {
  search: string;
  accountType: string;
  currency: string;
  sortBy: "name" | "balance" | "type";
  sortOrder: "asc" | "desc";
  showZeroBalance: boolean;
};

const defaultFilters: FilterState = {
  search: "",
  accountType: "",
  currency: "",
  sortBy: "balance",
  sortOrder: "desc",
  showZeroBalance: true,
};

export default function AccountsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Load data using React Query
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useQuery(getAccountsOptions({}));

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery(
    getTransactionsOptions({ query: { limit: 100 } })
  );

  // const { data: statistics } = useQuery(getAccountStatisticsOptions({}));

  const loading = accountsLoading || transactionsLoading;

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    let filtered = [...accounts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (account) =>
          account.name.toLowerCase().includes(searchLower) ||
          account.iban?.toLowerCase().includes(searchLower) ||
          account.owner_name?.toLowerCase().includes(searchLower)
      );
    }

    // Account type filter
    if (filters.accountType) {
      filtered = filtered.filter(
        (account) => account.iso_account_type === filters.accountType
      );
    }

    // Currency filter
    if (filters.currency) {
      filtered = filtered.filter(
        (account) => account.currency === filters.currency
      );
    }

    // Show zero balance filter
    if (!filters.showZeroBalance) {
      filtered = filtered.filter((account) => account.balance !== 0);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "balance":
          comparison = a.balance - b.balance;
          break;
        case "type":
          comparison = (a.iso_account_type || "").localeCompare(
            b.iso_account_type || ""
          );
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [accounts, filters]);

  // Calculate totals
  const accountSummary = useMemo(() => {
    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );
    const positiveAccounts = accounts.filter((account) => account.balance > 0);
    const negativeAccounts = accounts.filter((account) => account.balance < 0);

    const currencies = [
      ...new Set(accounts.map((account) => account.currency)),
    ];
    const accountTypes = [
      ...new Set(
        accounts.map((account) => account.iso_account_type).filter(Boolean)
      ),
    ];

    return {
      totalBalance,
      totalAccounts: accounts.length,
      positiveAccounts: positiveAccounts.length,
      negativeAccounts: negativeAccounts.length,
      currencies,
      accountTypes,
    };
  }, [accounts]);

  // Get recent transactions for selected account
  const accountTransactions = useMemo(() => {
    if (!selectedAccount) return [];
    return transactions
      .filter((t) => t.account_id === selectedAccount)
      .slice(0, 5);
  }, [transactions, selectedAccount]);

  const toggleBalanceVisibility = (accountId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(accountId)) {
      newHidden.delete(accountId);
    } else {
      newHidden.add(accountId);
    }
    setHiddenBalances(newHidden);
  };

  if (loading) {
    return (
      <div className="from-background via-background to-background/95 min-h-full bg-gradient-to-br p-6">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="bg-muted/20 h-8 w-1/4 rounded"></div>
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted/20 h-32 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-muted/20 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-background/95 min-h-full bg-gradient-to-br p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">Accounts</h1>
            <p className="text-muted-foreground mt-1">
              {accountSummary.totalAccounts} accounts •{" "}
              {accountSummary.currencies.join(", ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-card/50 border-border/50 hover:bg-card/80"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchAccounts()}
              className="bg-card/50 border-border/50 hover:bg-card/80"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 md:gap-6">
          <Card className="border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-sky-600/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <PrivateText>
                  {formatCurrency(
                    accountSummary.totalBalance,
                    accountSummary.currencies[0] || "EUR"
                  )}
                </PrivateText>
              </div>
              <p className="mt-1 text-xs text-blue-300/80">
                Across all accounts
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-green-600/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-300">
                Active Accounts
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {accountSummary.positiveAccounts}
              </div>
              <p className="mt-1 text-xs text-emerald-300/80">
                With positive balance
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/40 bg-gradient-to-br from-red-500/10 to-rose-600/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">
                Overdrawn
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {accountSummary.negativeAccounts}
              </div>
              <p className="mt-1 text-xs text-red-300/80">
                Accounts with negative balance
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-violet-600/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Account Types
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {accountSummary.accountTypes.length}
              </div>
              <p className="mt-1 text-xs text-purple-300/80">
                Different account types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Filter className="mr-2 h-5 w-5" />
                Filters & Sorting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search accounts..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="bg-background/50 border-border/50 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    Account Type
                  </label>
                  <select
                    value={filters.accountType}
                    onChange={(e) =>
                      setFilters({ ...filters, accountType: e.target.value })
                    }
                    className="border-border/50 bg-background/50 w-full rounded-md border p-2 text-white"
                  >
                    <option value="">All Types</option>
                    <option value="CACC">Checking</option>
                    <option value="SVGS">Savings</option>
                    <option value="CARD">Credit Card</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    Currency
                  </label>
                  <select
                    value={filters.currency}
                    onChange={(e) =>
                      setFilters({ ...filters, currency: e.target.value })
                    }
                    className="border-border/50 bg-background/50 w-full rounded-md border p-2 text-white"
                  >
                    <option value="">All Currencies</option>
                    {accountSummary.currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sortBy: e.target.value as FilterState["sortBy"],
                      })
                    }
                    className="border-border/50 bg-background/50 w-full rounded-md border p-2 text-white"
                  >
                    <option value="balance">Balance</option>
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sortOrder: e.target.value as FilterState["sortOrder"],
                      })
                    }
                    className="border-border/50 bg-background/50 w-full rounded-md border p-2 text-white"
                  >
                    <option value="desc">High to Low</option>
                    <option value="asc">Low to High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    Options
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showZeroBalance}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          showZeroBalance: e.target.checked,
                        })
                      }
                      className="border-border/50 bg-background/50 rounded"
                    />
                    <span className="text-muted-foreground text-sm">
                      Show zero balances
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(defaultFilters)}
                  className="bg-background/50 border-border/50 hover:bg-card/80"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accounts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredAccounts.map((account) => (
            <Card
              key={account.id}
              className={`bg-gradient-to-br ${getAccountTypeColor(account.iso_account_type)} cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedAccount === account.id ? "ring-2 ring-blue-500/50" : ""
              }`}
              onClick={() =>
                setSelectedAccount(
                  selectedAccount === account.id ? null : account.id
                )
              }
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-background/20 rounded-full p-2">
                      {getAccountIcon(account.iso_account_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">
                        {account.name}
                      </CardTitle>
                      <p className="text-muted-foreground/60 mt-1 text-sm">
                        {getAccountTypeName(account.iso_account_type)} •{" "}
                        {account.currency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBalanceVisibility(account.id);
                      }}
                      className="hover:bg-background/20 h-8 w-8 p-0"
                    >
                      {hiddenBalances.has(account.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Balance */}
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      account.balance >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    <PrivateText>
                      {formatCurrency(account.balance, account.currency)}
                    </PrivateText>
                  </p>
                </div>

                {/* Account Details */}
                <div className="space-y-2 border-t border-white/10 pt-2">
                  {account.iban && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground/60">IBAN:</span>
                      <div className="flex items-center space-x-2">
                        <code className="bg-background/20 rounded px-2 py-1 text-xs">
                          <PrivateText dots={15}>{account.iban}</PrivateText>
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(account.iban!);
                          }}
                          className="hover:bg-background/20 h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {account.owner_name && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground/60">Owner:</span>
                      <span className="text-right text-white">
                        {account.owner_name}
                      </span>
                    </div>
                  )}

                  {account.bic && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground/60">BIC:</span>
                      <code className="bg-background/20 rounded px-2 py-1 text-xs">
                        {account.bic}
                      </code>
                    </div>
                  )}
                </div>

                {/* Recent Transactions (when selected) */}
                {selectedAccount === account.id &&
                  accountTransactions.length > 0 && (
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="mb-3 text-sm font-medium text-white">
                        Recent Activity
                      </h4>
                      <div className="space-y-2">
                        {accountTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="bg-background/10 flex items-center justify-between rounded p-2"
                          >
                            <div className="flex min-w-0 flex-1 items-center space-x-2">
                              <div className="relative flex-shrink-0">
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
                                  className="h-6 w-6"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs text-white">
                                  {transaction.opposing_merchant?.name ||
                                    transaction.opposing_counterparty?.name ||
                                    transaction.opposing_name}
                                </p>
                                <p className="text-muted-foreground/60 text-xs">
                                  {formatDate(transaction.booking_time)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-sm font-medium ${
                                  transaction.amount > 0
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                <PrivateText>
                                  {transaction.amount > 0 ? "+" : ""}
                                  {formatCurrency(
                                    transaction.native_amount,
                                    account.currency
                                  )}
                                </PrivateText>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAccounts.length === 0 && (
          <Card className="border-border/50 bg-card/30">
            <CardContent className="py-12 text-center">
              <Wallet className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium text-white">
                No accounts found
              </p>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters or connect a new bank account
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
