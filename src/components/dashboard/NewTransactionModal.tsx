import { useState } from "react";
import { X } from "lucide-react";
import type { FormEvent } from "react";
import styles from "@/styles/NewTransactionModal.module.css";
import type { NewTransactionInput } from "./types";

type NewTransactionModalProps = {
  categories: string[];
  onClose: () => void;
  onCreate: (transaction: NewTransactionInput) => void;
  onCreateCategory: (category: string) => void;
};

export function NewTransactionModal({
  categories,
  onClose,
  onCreate,
  onCreateCategory,
}: NewTransactionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? "");
  const [newCategory, setNewCategory] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onCreate({
      title: String(formData.get("title")),
      category: selectedCategory,
      date: String(formData.get("date")),
      amount: Number(formData.get("amount")),
      type: String(formData.get("type")) as NewTransactionInput["type"],
    });

    onClose();
  }

  function handleCreateCategory() {
    const formattedCategory = newCategory.trim();

    if (!formattedCategory) {
      return;
    }

    onCreateCategory(formattedCategory);
    setSelectedCategory(formattedCategory);
    setNewCategory("");
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
                name="category"
                onChange={(event) => setSelectedCategory(event.target.value)}
                value={selectedCategory}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
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

          <div className={styles.categoryCreator}>
            <label className={styles.field}>
              <span className={styles.label}>Criar categoria</span>
              <input
                className={styles.input}
                maxLength={40}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Ex: Impostos"
                type="text"
                value={newCategory}
              />
            </label>
            <button
              className={styles.addCategoryButton}
              onClick={handleCreateCategory}
              type="button"
            >
              Adicionar categoria
            </button>
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
