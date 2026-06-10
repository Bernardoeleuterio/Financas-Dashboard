"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "@/styles/EditBalanceModal.module.css";

type EditBalanceModalProps = {
  currentBalance: number;
  onClose: () => void;
  onSave: (balance: number) => Promise<void>;
};

export function EditBalanceModal({
  currentBalance,
  onClose,
  onSave,
}: EditBalanceModalProps) {
  const [balance, setBalance] = useState(String(currentBalance));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedBalance = Number(balance.replace(",", "."));

    if (!Number.isFinite(parsedBalance)) {
      setError("Informe um saldo valido.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onSave(parsedBalance);
      onClose();
    } catch {
      setError("Nao foi possivel atualizar o saldo. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        aria-labelledby="edit-balance-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Conta</p>
            <h2 className={styles.title} id="edit-balance-title">
              Editar saldo atual
            </h2>
          </div>
          <button
            aria-label="Fechar"
            className={styles.closeButton}
            onClick={onClose}
            title="Fechar"
            type="button"
          >
            <X size={19} />
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="current-balance">
            Saldo disponível
          </label>
          <div className={styles.inputGroup}>
            <span>R$</span>
            <input
              autoFocus
              className={styles.input}
              id="current-balance"
              inputMode="decimal"
              onChange={(event) => setBalance(event.target.value)}
              placeholder="0,00"
              step="0.01"
              type="number"
              value={balance}
            />
          </div>
          <p className={styles.help}>
            As próximas receitas e despesas atualizarão este valor
            automaticamente.
          </p>

          {error ? <p className={styles.error}>{error}</p> : null}

          <footer className={styles.actions}>
            <button
              className={styles.cancelButton}
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button
              className={styles.saveButton}
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Salvando..." : "Salvar saldo"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
