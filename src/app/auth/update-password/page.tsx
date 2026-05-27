"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Auth.module.css";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!hasSupabaseConfig) {
      setError("Configure as chaves do Supabase no .env.local.");
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Senha atualizada com sucesso.");
    setTimeout(() => router.push("/auth/login"), 1200);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.brand}>FinTrack</p>
          <h1 className={styles.title}>Nova senha</h1>
          <p className={styles.description}>
            Defina uma nova senha para recuperar o acesso.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleUpdatePassword}>
          {message ? <p className={styles.message}>{message}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}

          <label className={styles.field}>
            <span className={styles.label}>Nova senha</span>
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
            {isLoading ? "Salvando..." : "Atualizar senha"}
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
