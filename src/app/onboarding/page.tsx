"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { saveProfile } from "@/lib/financeRepository";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Onboarding.module.css";

function optionalNumber(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue ? Number(normalizedValue) : null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!hasSupabaseConfig) {
        return;
      }

      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    }

    loadUser();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!userId) {
      setError("Sua sessao expirou. Entre novamente para continuar.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    setIsLoading(true);

    try {
      await saveProfile(userId, {
        fullName: String(formData.get("fullName")),
        occupation: String(formData.get("occupation")),
        age: Number(formData.get("age")),
        currentBalance: Number(formData.get("currentBalance")),
        monthlyIncome: Number(formData.get("monthlyIncome")),
        monthlyExpenses: optionalNumber(formData.get("monthlyExpenses")),
        monthlySavingGoal: optionalNumber(formData.get("monthlySavingGoal")),
        financialGoal: String(formData.get("financialGoal")),
      });
      router.push("/");
    } catch {
      setError("Nao foi possivel salvar seu perfil. Tente novamente.");
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Primeiro acesso</p>
          <h1 className={styles.title}>Vamos configurar seu dashboard</h1>
          <p className={styles.description}>
            Primeiro informe alguns dados basicos. Depois responda a entrevista
            financeira para deixar o painel mais util para voce.
          </p>
        </header>

        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.sectionHeader}>
              <p className={styles.step}>Etapa 1</p>
              <h2 className={styles.sectionTitle}>Dados basicos</h2>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Qual seu nome?</span>
              <input
                className={styles.input}
                maxLength={80}
                name="fullName"
                placeholder="Ex: Bernardo Eleuterio"
                required
                type="text"
              />
            </label>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>
                  Qual sua profissao ou ocupacao?
                </span>
                <input
                  className={styles.input}
                  maxLength={80}
                  name="occupation"
                  placeholder="Ex: Desenvolvedor"
                  required
                  type="text"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Qual sua idade?</span>
                <input
                  className={styles.input}
                  min="13"
                  name="age"
                  placeholder="Ex: 24"
                  required
                  type="number"
                />
              </label>
            </div>

            <div className={styles.divider} />

            <div className={styles.sectionHeader}>
              <p className={styles.step}>Etapa 2</p>
              <h2 className={styles.sectionTitle}>Entrevista financeira</h2>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Qual seu saldo atual?</span>
                <input
                  className={styles.input}
                  inputMode="decimal"
                  min="0"
                  name="currentBalance"
                  placeholder="Ex: 1500"
                  required
                  step="0.01"
                  type="number"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>
                  Quanto voce recebe por mes?
                </span>
                <input
                  className={styles.input}
                  inputMode="decimal"
                  min="0"
                  name="monthlyIncome"
                  placeholder="Ex: 10000"
                  required
                  step="0.01"
                  type="number"
                />
              </label>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>
                  Quanto costuma gastar por mes?
                </span>
                <input
                  className={styles.input}
                  inputMode="decimal"
                  min="0"
                  name="monthlyExpenses"
                  placeholder="Opcional, ex: 2100"
                  step="0.01"
                  type="number"
                />
                <span className={styles.hint}>
                  Se ainda nao souber, pode deixar em branco.
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>
                  Quanto quer guardar por mes?
                </span>
                <input
                  className={styles.input}
                  inputMode="decimal"
                  min="0"
                  name="monthlySavingGoal"
                  placeholder="Opcional, ex: 500"
                  step="0.01"
                  type="number"
                />
                <span className={styles.hint}>
                  Voce pode definir essa meta depois.
                </span>
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Qual seu principal objetivo?</span>
              <select
                className={styles.select}
                defaultValue="Criar reserva"
                name="financialGoal"
              >
                <option>Criar reserva</option>
                <option>Quitar dividas</option>
                <option>Comprar algo importante</option>
                <option>Investir mais</option>
                <option>Organizar gastos</option>
              </select>
            </label>

            <button
              className={styles.button}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Salvando..." : "Finalizar configuracao"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
