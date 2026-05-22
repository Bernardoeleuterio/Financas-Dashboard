import { X } from "lucide-react";
import type { FormEvent } from "react";
import styles from "@/styles/NewTransactionModal.module.css";
import type { NewTransactionInput } from "./types";

type NewTransactionModalProps = {
  onClose: () => void;
  onCreate: (transaction: NewTransactionInput) => void;
};

export function NewTransactionModal({
  onClose,
  onCreate,
}: NewTransactionModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onCreate({
      title: String(formData.get("title")),
      category: String(formData.get("category")),
      date: String(formData.get("date")),
      amount: Number(formData.get("amount")),
      type: String(formData.get("type")) as NewTransactionInput["type"],
    });

    onClose();
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        aria-labelledby="new-transaction-title"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title} id="new-transaction-title">
              Nova transacao
            </h2>
            <p className={styles.description}>
              Registre uma receita ou despesa para atualizar o painel.
            </p>
          </div>
          <button
            aria-label="Fechar modal"
            className={styles.closeButton}
            onClick={onClose}
            title="Fechar"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Tipo</span>
              <select className={styles.select} defaultValue="expense" name="type">
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Valor</span>
              <input
                className={styles.input}
                min="0.01"
                name="amount"
                placeholder="0,00"
                required
                step="0.01"
                type="number"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Descricao</span>
            <input
              className={styles.input}
              maxLength={80}
              name="title"
              placeholder="Ex: Mercado semanal"
              required
              type="text"
            />
          </label>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Categoria</span>
              <select
                className={styles.select}
                defaultValue="Alimentacao"
                name="category"
              >
                <option>Alimentacao</option>
                <option>Moradia</option>
                <option>Transporte</option>
                <option>Lazer</option>
                <option>Receita</option>
                <option>Outros</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Data</span>
              <input
                className={styles.input}
                defaultValue={new Date().toISOString().slice(0, 10)}
                name="date"
                required
                type="date"
              />
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button className={styles.primaryButton} type="submit">
              Salvar transacao
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
