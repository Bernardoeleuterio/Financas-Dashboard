"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!hasSupabaseConfig) {
      console.log("Erro de Configuração do Supabase (Registro):", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Definida" : "Ausente"
      });
      setError(
        "Configure as chaves do Supabase no .env.local antes de criar conta.",
      );
      return;
    }

    setIsLoading(true);

    const normalizedEmail = email.trim();

    const { data, error: registerError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (registerError) {
      setIsLoading(false);
      setError(registerError.message);
      return;
    }

    if (data.session) {
      setIsLoading(false);
      router.push("/onboarding");
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setIsLoading(false);

    if (loginError) {
      setMessage(
        "Conta criada. Confirme seu email para entrar e configurar o dashboard.",
      );
      return;
    }

    router.push("/onboarding");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.brand}>FinTrack</p>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.description}>
            Cadastre seu email e senha para comecar a usar o dashboard.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleRegister}>
          {message ? <p className={styles.message}>{message}</p> : null}
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
            {isLoading ? "Criando..." : "Criar conta"}
          </button>

          <div className={styles.links}>
            <span>Ja tem uma conta?</span>
            <Link className={styles.link} href="/auth/login">
              Entrar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
