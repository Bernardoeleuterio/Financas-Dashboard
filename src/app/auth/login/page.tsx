"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSavedFinancialProfile } from "@/lib/financialProfileStorage";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!hasSupabaseConfig) {
      setError("Configure as chaves do Supabase no .env.local antes de entrar.");
      return;
    }

    setIsLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    const savedProfile = getSavedFinancialProfile(data.user?.id);

    router.push(savedProfile ? "/" : "/onboarding");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.brand}>FinTrack</p>
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.description}>
            Acesse sua conta para continuar acompanhando suas financas.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error ? <p className={styles.error}>{error}</p> : null}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Senha</span>
            <input
              className={styles.input}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button className={styles.button} disabled={isLoading} type="submit">
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.links}>
            <Link className={styles.link} href="/auth/register">
              Criar conta
            </Link>
            <Link className={styles.link} href="/auth/forgot-password">
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
