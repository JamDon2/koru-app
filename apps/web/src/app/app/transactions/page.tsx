"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getTransactionsOptions,
  getAccountsOptions,
} from "api-client/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MerchantLogo } from "@/components/ui/merchant-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Receipt,
  SlidersHorizontal,
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
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type FilterState = {
  search: string;
  accountId: string;
  category: string;
  dateRange: "7d" | "30d" | "90d" | "1y" | "all";
  transactionType: "all" | "income" | "expense";
  amountMin: string;
  amountMax: string;
};

const defaultFilters: FilterState = {
  search: "",
  accountId: "",
  category: "",
  dateRange: "30d",
  transactionType: "all",
  amountMin: "",
  amountMax: "",
};

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [limit, setLimit] = useState(50);

  // Load data using React Query
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery(
    getTransactionsOptions({ query: { limit: 200 } })
  );

  const { data: accounts = [], isLoading: accountsLoading } = useQuery(
    getAccountsOptions({})
  );

  // const { data: statistics } = useQuery(getAccountStatisticsOptions({}));

  const loading = transactionsLoading || accountsLoading;

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.opposing_name?.toLowerCase().includes(searchLower) ||
          t.opposing_merchant?.name?.toLowerCase().includes(searchLower) ||
          t.opposing_counterparty?.name?.toLowerCase().includes(searchLower) ||
          t.account.name.toLowerCase().includes(searchLower)
      );
    }

    // Account filter
    if (filters.accountId) {
      filtered = filtered.filter((t) => t.account_id === filters.accountId);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (t) => t.opposing_merchant?.category === filters.category
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const days = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365,
      }[filters.dateRange];

      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((t) => new Date(t.booking_time) >= cutoffDate);
    }

    // Transaction type filter
    if (filters.transactionType !== "all") {
      if (filters.transactionType === "income") {
        filtered = filtered.filter((t) => t.amount > 0);
      } else if (filters.transactionType === "expense") {
        filtered = filtered.filter((t) => t.amount < 0);
      }
    }

    // Amount filters
    if (filters.amountMin) {
      const min = parseFloat(filters.amountMin);
      filtered = filtered.filter((t) => Math.abs(t.amount) >= min);
    }
    if (filters.amountMax) {
      const max = parseFloat(filters.amountMax);
      filtered = filtered.filter((t) => Math.abs(t.amount) <= max);
    }

    return filtered.slice(0, limit);
  }, [transactions, filters, limit]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const avgTransaction =
      filteredTransactions.length > 0
        ? filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
          filteredTransactions.length
        : 0;

    const categories = filteredTransactions.reduce(
      (acc, t) => {
        const category = t.opposing_merchant?.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      },
      {} as Record<string, number>
    );

    const topCategory = Object.entries(categories).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      totalIncome,
      totalExpenses,
      netFlow: totalIncome - totalExpenses,
      avgTransaction,
      transactionCount: filteredTransactions.length,
      topCategory: topCategory?.[0] || "None",
      topCategoryAmount: topCategory?.[1] || 0,
    };
  }, [filteredTransactions]);

  const handleExport = () => {
    const csv = [
      ["Date", "Description", "Category", "Account", "Amount", "Currency"].join(
        ","
      ),
      ...filteredTransactions.map((t) =>
        [
          new Date(t.booking_time).toISOString().split("T")[0],
          `"${t.opposing_name || t.opposing_merchant?.name || t.opposing_counterparty?.name || ""}"`,
          `"${t.opposing_merchant?.category || "Uncategorized"}"`,
          `"${t.account.name}"`,
          t.amount,
          t.currency,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-background via-background to-background/95 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted/20 rounded w-1/4"></div>
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted/20 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-muted/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-background/95 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="text-muted-foreground mt-1">
              {analytics.transactionCount} transactions •{" "}
              {filters.dateRange === "all"
                ? "All time"
                : `Last ${filters.dateRange}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-card/50 border-border/50 hover:bg-card/80"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="bg-card/50 border-border/50 hover:bg-card/80"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-300">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <PrivateText>
                  {formatCurrency(analytics.totalIncome, "EUR")}
                </PrivateText>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <PrivateText>
                  {formatCurrency(analytics.totalExpenses, "EUR")}
                </PrivateText>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">
                Net Flow
              </CardTitle>
              {analytics.netFlow >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-blue-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-blue-400" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <PrivateText>
                  <span
                    className={`${analytics.netFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {formatCurrency(analytics.netFlow, "EUR")}
                  </span>
                </PrivateText>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Average Transaction
              </CardTitle>
              <Receipt className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <PrivateText>
                  {formatCurrency(analytics.avgTransaction, "EUR")}
                </PrivateText>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Account
                  </label>
                  <select
                    value={filters.accountId}
                    onChange={(e) =>
                      setFilters({ ...filters, accountId: e.target.value })
                    }
                    className="w-full p-2 rounded-md border border-border/50 bg-background/50 text-white"
                  >
                    <option value="">All Accounts</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        dateRange: e.target.value as FilterState["dateRange"],
                      })
                    }
                    className="w-full p-2 rounded-md border border-border/50 bg-background/50 text-white"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Type
                  </label>
                  <select
                    value={filters.transactionType}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        transactionType: e.target
                          .value as FilterState["transactionType"],
                      })
                    }
                    className="w-full p-2 rounded-md border border-border/50 bg-background/50 text-white"
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Min Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={filters.amountMin}
                    onChange={(e) =>
                      setFilters({ ...filters, amountMin: e.target.value })
                    }
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Max Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="1000.00"
                    value={filters.amountMax}
                    onChange={(e) =>
                      setFilters({ ...filters, amountMax: e.target.value })
                    }
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </div>

              {/* Reset Filters */}
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

        {/* Transactions List */}
        <Card className="border-border/50 bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Transactions</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm">
                  Try adjusting your filters or date range
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`p-4 border-b border-border/30 hover:bg-card/60 transition-colors last:border-b-0 ${
                      index % 2 === 0 ? "bg-card/20" : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side: Logo and details */}
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
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
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card flex items-center justify-center ${
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

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-white truncate">
                              {transaction.opposing_account?.name ||
                                transaction.opposing_merchant?.name ||
                                transaction.opposing_counterparty?.name ||
                                transaction.opposing_name}
                            </p>
                            {transaction.opposing_merchant?.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {transaction.opposing_merchant.category}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground/60 mt-1">
                            <span>{transaction.account.name}</span>
                            <span>•</span>
                            <span>{formatDate(transaction.booking_time)}</span>
                            {transaction.gocardless_id && (
                              <>
                                <span>•</span>
                                <span className="text-green-400">Imported</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side: Amount and actions */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p
                            className={`font-semibold text-lg whitespace-nowrap ${
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
                            <p className="text-xs text-muted-foreground/60 whitespace-nowrap">
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More */}
        {filteredTransactions.length >= limit &&
          transactions.length > limit && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setLimit((prev) => prev + 50)}
                className="bg-card/50 border-border/50 hover:bg-card/80"
              >
                Load More Transactions
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
