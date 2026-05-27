"use client";

import Link from "next/link";
import { useState } from "react";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!hasSupabaseConfig) {
      setError(
        "Configure as chaves do Supabase no .env.local antes de recuperar senha.",
      );
      return;
    }

    setIsLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/update-password`,
      },
    );

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Enviamos um link de recuperacao para o seu email.");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.brand}>FinTrack</p>
          <h1 className={styles.title}>Recuperar senha</h1>
          <p className={styles.description}>
            Informe seu email para receber o link de redefinicao.
          </p>
        </div>

        <form className={styles.form} onSubmit={handlePasswordReset}>
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

          <button className={styles.button} disabled={isLoading} type="submit">
            {isLoading ? "Enviando..." : "Enviar link"}
          </button>

          <div className={styles.links}>
            <Link className={styles.link} href="/auth/login">
              Voltar para login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
