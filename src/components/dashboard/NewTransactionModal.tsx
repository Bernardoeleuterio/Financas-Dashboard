import { useState } from "react";
import { X } from "lucide-react";
import type { FormEvent } from "react";
import styles from "@/styles/NewTransactionModal.module.css";
import type { NewTransactionInput, Transaction } from "./types";

type NewTransactionModalProps = {
  categories: string[];
  creditCards: { id: string; name: string }[];
  initialTransaction?: Transaction | null;
  onClose: () => void;
  onSave: (transaction: NewTransactionInput) => Promise<void>;
  onCreateCategory: (category: string) => Promise<string | null>;
};

export function NewTransactionModal({
  categories,
  creditCards,
  initialTransaction,
  onClose,
  onSave,
  onCreateCategory,
}: NewTransactionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialTransaction?.category ?? categories[0] ?? "",
  );
  const [newCategory, setNewCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    initialTransaction?.paymentMethod ?? "Pix",
  );
  const isEditing = Boolean(initialTransaction);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await onSave({
      title: String(formData.get("title")),
      category: selectedCategory,
      debtId:
        paymentMethod === "Cartao"
          ? String(formData.get("debtId"))
          : null,
      date: String(formData.get("date")),
      amount: Number(formData.get("amount")),
      paymentMethod,
      type: String(formData.get("type")) as NewTransactionInput["type"],
    });

    onClose();
  }

  async function handleCreateCategory() {
    const formattedCategory = newCategory.trim();

    if (!formattedCategory) {
      return;
    }

    const createdCategory = await onCreateCategory(formattedCategory);

    if (!createdCategory) {
      return;
    }

    setSelectedCategory(createdCategory);
    setNewCategory("");
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        aria-labelledby="transaction-modal-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title} id="transaction-modal-title">
              {isEditing ? "Editar transacao" : "Nova transacao"}
            </h2>
            <p className={styles.description}>
              {isEditing
                ? "Atualize as informacoes deste lancamento."
                : "Registre uma receita ou despesa para atualizar o painel."}
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
              <select
                className={styles.select}
                defaultValue={initialTransaction?.type ?? "expense"}
                name="type"
              >
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
                defaultValue={initialTransaction?.numericAmount}
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
              defaultValue={initialTransaction?.title}
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
              <span className={styles.label}>Forma de pagamento</span>
              <select
                className={styles.select}
                name="paymentMethod"
                onChange={(event) => setPaymentMethod(event.target.value)}
                value={paymentMethod}
              >
                <option>Pix</option>
                <option>Cartao</option>
                <option>Dinheiro</option>
                <option>Boleto</option>
              </select>
            </label>
          </div>

          {paymentMethod === "Cartao" ? (
            <label className={styles.field}>
              <span className={styles.label}>Qual cartao foi utilizado?</span>
              <select
                className={styles.select}
                defaultValue={initialTransaction?.debtId ?? ""}
                name="debtId"
                required
              >
                <option value="">Selecione um cartao</option>
                {creditCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
                ))}
              </select>
              {creditCards.length === 0 ? (
                <span className={styles.description}>
                  Cadastre um cartao na pagina Dividas antes de registrar esta
                  compra.
                </span>
              ) : null}
            </label>
          ) : null}

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Data</span>
              <input
                className={styles.input}
                defaultValue={
                  initialTransaction?.rawDate ??
                  new Date().toISOString().slice(0, 10)
                }
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
              {isEditing ? "Salvar alteracoes" : "Salvar transacao"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
