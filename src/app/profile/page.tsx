"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FinancialProfileModal } from "@/components/dashboard/FinancialProfileModal";
import type { FinancialProfile } from "@/components/dashboard/types";
import {
  getSavedFinancialProfile,
  saveFinancialProfile,
} from "@/lib/financialProfileStorage";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Profile.module.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number | null | undefined) {
  return value === null || value === undefined
    ? "Nao informado"
    : currencyFormatter.format(value);
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!hasSupabaseConfig) {
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login");
        return;
      }

      setUser(data.user);
      setProfile(getSavedFinancialProfile(data.user.id));
    }

    loadProfile();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  function handleSaveProfile(updatedProfile: FinancialProfile) {
    setProfile(updatedProfile);
    saveFinancialProfile(updatedProfile, user?.id);
    setIsEditingProfile(false);
  }

  const initials =
    profile?.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.topbar}>
          <Link className={styles.backLink} href="/">
            Voltar para dashboard
          </Link>
        </div>

        <article className={styles.card}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Minha conta</h1>
              <p className={styles.description}>
                Veja suas informacoes pessoais e financeiras salvas neste
                navegador.
              </p>
            </div>
            <span className={styles.avatar}>{initials}</span>
          </header>

          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Dados basicos</h2>
            <div className={styles.grid}>
              <div className={styles.info}>
                <p className={styles.label}>Nome</p>
                <p className={styles.value}>
                  {profile?.fullName || "Nao informado"}
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Email</p>
                <p className={styles.value}>{user?.email || "Nao informado"}</p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Ocupacao</p>
                <p className={styles.value}>
                  {profile?.occupation || "Nao informado"}
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Idade</p>
                <p className={styles.value}>
                  {profile?.age ? `${profile.age} anos` : "Nao informado"}
                </p>
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Resumo financeiro</h2>
            <div className={styles.grid}>
              <div className={styles.info}>
                <p className={styles.label}>Saldo atual</p>
                <p className={styles.value}>
                  {formatCurrency(profile?.currentBalance)}
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Renda mensal</p>
                <p className={styles.value}>
                  {formatCurrency(profile?.monthlyIncome)}
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Gastos mensais</p>
                <p className={styles.value}>
                  {formatCurrency(profile?.monthlyExpenses)}
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Meta mensal</p>
                <p className={styles.value}>
                  {formatCurrency(profile?.monthlySavingGoal)}
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.label}>Objetivo</p>
                <p className={styles.value}>
                  {profile?.financialGoal || "Nao informado"}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditingProfile(true)}
              type="button"
            >
              Editar perfil financeiro
            </button>
            <button
              className={styles.signOutButton}
              onClick={handleSignOut}
              type="button"
            >
              Sair da conta
            </button>
          </div>
        </article>
      </section>

      {isEditingProfile ? (
        <FinancialProfileModal
          initialProfile={profile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleSaveProfile}
        />
      ) : null}
    </main>
  );
}
