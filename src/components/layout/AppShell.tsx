"use client";

import {
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "@/styles/AppShell.module.css";

const navigation = [
  { href: "/", label: "Visao geral", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transacoes", icon: ReceiptText },
  { href: "/dividas", label: "Dividas", icon: WalletCards },
  { href: "/profile", label: "Perfil", icon: UserRound },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>
            <CircleDollarSign size={21} />
          </span>
          <span>
            <span className={styles.brandName}>FinTrack</span>
            <span className={styles.brandCaption}>Controle financeiro</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className={`${styles.navLink} ${
                  isActive(item.href) ? styles.navLinkActive : ""
                }`}
                href={item.href}
                key={item.href}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <p className={styles.brandCaption}>
            Seus dados ficam protegidos por conta.
          </p>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>

      <nav className={styles.mobileBar}>
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={`${styles.mobileLink} ${
                isActive(item.href) ? styles.mobileLinkActive : ""
              }`}
              href={item.href}
              key={item.href}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
