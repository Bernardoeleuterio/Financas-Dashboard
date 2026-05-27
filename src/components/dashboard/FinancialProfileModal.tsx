import { X } from "lucide-react";
import type { FormEvent } from "react";
import styles from "@/styles/FinancialProfileModal.module.css";
import type { FinancialProfile } from "./types";

type FinancialProfileModalProps = {
  initialProfile: FinancialProfile | null;
  onClose: () => void;
  onSave: (profile: FinancialProfile) => void;
};

function optionalNumber(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue ? Number(normalizedValue) : null;
}

export function FinancialProfileModal({
  initialProfile,
  onClose,
  onSave,
}: FinancialProfileModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSave({
      fullName: String(formData.get("fullName")),
      occupation: String(formData.get("occupation")),
      age: Number(formData.get("age")),
      currentBalance: Number(formData.get("currentBalance")),
      monthlyIncome: Number(formData.get("monthlyIncome")),
      monthlyExpenses: optionalNumber(formData.get("monthlyExpenses")),
      monthlySavingGoal: optionalNumber(formData.get("monthlySavingGoal")),
      financialGoal: String(formData.get("financialGoal")),
    });
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        aria-labelledby="financial-profile-title"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Configuracao inicial</p>
            <h2 className={styles.title} id="financial-profile-title">
              Conte um pouco sobre sua vida financeira
            </h2>
            <p className={styles.description}>
              Essas respostas personalizam os cards do dashboard. Depois vamos
              salvar isso no banco junto com sua conta.
            </p>
          </div>
          <button
            aria-label="Fechar"
            className={styles.closeButton}
            onClick={onClose}
            title="Fechar"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionHeader}>
            <p className={styles.step}>Dados basicos</p>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Nome</span>
            <input
              className={styles.input}
              defaultValue={initialProfile?.fullName}
              maxLength={80}
              name="fullName"
              placeholder="Ex: Bernardo Eleuterio"
              required
              type="text"
            />
          </label>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Profissao ou ocupacao</span>
              <input
                className={styles.input}
                defaultValue={initialProfile?.occupation}
                maxLength={80}
                name="occupation"
                placeholder="Ex: Desenvolvedor"
                required
                type="text"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Idade</span>
              <input
                className={styles.input}
                defaultValue={initialProfile?.age}
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
            <p className={styles.step}>Entrevista financeira</p>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Qual seu saldo atual?</span>
              <input
                className={styles.input}
                defaultValue={initialProfile?.currentBalance}
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
              <span className={styles.label}>Quanto voce recebe por mes?</span>
              <input
                className={styles.input}
                defaultValue={initialProfile?.monthlyIncome}
                inputMode="decimal"
                min="0"
                name="monthlyIncome"
                placeholder="Ex: 3200"
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
                defaultValue={initialProfile?.monthlyExpenses ?? ""}
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
                defaultValue={initialProfile?.monthlySavingGoal ?? ""}
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
              defaultValue={initialProfile?.financialGoal ?? "Criar reserva"}
              name="financialGoal"
            >
              <option>Criar reserva</option>
              <option>Quitar dividas</option>
              <option>Comprar algo importante</option>
              <option>Investir mais</option>
              <option>Organizar gastos</option>
            </select>
          </label>

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              onClick={onClose}
              type="button"
            >
              Agora nao
            </button>
            <button className={styles.primaryButton} type="submit">
              Salvar perfil
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
