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
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-lg">
      <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
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
            <nav className="hidden items-center space-x-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                      isActive
                        ? "border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white"
                        : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation */}
            <div className="flex items-center space-x-1 md:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center rounded-lg p-2 font-medium transition-all duration-200 ${
                      isActive
                        ? "border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white"
                        : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
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
