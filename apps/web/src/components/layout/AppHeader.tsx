"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Receipt, CreditCard } from "lucide-react";
import PrivacyToggle from "./PrivacyToggle";

const navItems = [
  {
    name: "Dashboard",
    href: "/app",
    icon: Home,
  },
  {
    name: "Transactions",
    href: "/app/transactions",
    icon: Receipt,
  },
  {
    name: "Accounts",
    href: "/app/accounts",
    icon: CreditCard,
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-black/80 backdrop-blur-lg border-b border-neutral-800 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/app" className="flex items-center">
              <Image
                src="/logos/dark_flat.png"
                alt="Koru Logo"
                width={50}
                height={50}
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center p-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <PrivacyToggle />
        </div>
      </div>
    </header>
  );
}
