import { X } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import type { Debt, NewDebtInput } from "@/components/dashboard/types";
import styles from "@/styles/DebtModal.module.css";

type NewDebtModalProps = {
  initialDebt?: Debt | null;
  onClose: () => void;
  onSave: (debt: NewDebtInput) => Promise<void>;
};

export function NewDebtModal({
  initialDebt,
  onClose,
  onSave,
}: NewDebtModalProps) {
  const [debtType, setDebtType] = useState<Debt["debtType"]>(
    initialDebt?.debtType ?? "installment",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isCard = debtType === "credit_card";

    await onSave({
      debtType,
      creditor: String(formData.get("creditor")),
      description: String(formData.get("description")),
      totalAmount: isCard ? null : Number(formData.get("totalAmount")),
      installmentAmount: isCard
        ? null
        : Number(formData.get("installmentAmount")),
      totalInstallments: isCard
        ? null
        : Number(formData.get("totalInstallments")),
      paidInstallments: isCard
        ? null
        : Number(formData.get("paidInstallments")),
      dueDay: isCard ? Number(formData.get("dueDay")) : null,
      nextDueDate: isCard
        ? null
        : String(formData.get("nextDueDate")) || null,
      notes: String(formData.get("notes")) || null,
    });

    onClose();
  }

  return (
    <div className={styles.overlay}>
      <section className={styles.modal} role="dialog">
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {initialDebt ? "Editar compromisso" : "Adicionar compromisso"}
            </h2>
            <p className={styles.description}>
              Cadastre uma divida parcelada ou um cartao de credito.
            </p>
          </div>
          <button
            aria-label="Fechar"
            className={styles.close}
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Tipo</span>
            <select
              className={styles.input}
              disabled={Boolean(initialDebt)}
              onChange={(event) =>
                setDebtType(event.target.value as Debt["debtType"])
              }
              value={debtType}
            >
              <option value="installment">Divida parcelada</option>
              <option value="credit_card">Cartao de credito</option>
            </select>
          </label>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>
                {debtType === "credit_card" ? "Nome do cartao" : "Onde e a divida?"}
              </span>
              <input
                className={styles.input}
                defaultValue={initialDebt?.creditor}
                name="creditor"
                placeholder={
                  debtType === "credit_card"
                    ? "Ex: Nubank, Inter"
                    : "Ex: Banco, loja, pessoa"
                }
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Descricao</span>
              <input
                className={styles.input}
                defaultValue={initialDebt?.description}
                name="description"
                placeholder={
                  debtType === "credit_card"
                    ? "Ex: Cartao principal"
                    : "Ex: Financiamento do notebook"
                }
                required
              />
            </label>
          </div>

          {debtType === "installment" ? (
            <>
              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.label}>Valor total</span>
                  <input
                    className={styles.input}
                    defaultValue={initialDebt?.totalAmount ?? ""}
                    min="0.01"
                    name="totalAmount"
                    required
                    step="0.01"
                    type="number"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Valor da parcela</span>
                  <input
                    className={styles.input}
                    defaultValue={initialDebt?.installmentAmount ?? ""}
                    min="0.01"
                    name="installmentAmount"
                    required
                    step="0.01"
                    type="number"
                  />
                </label>
              </div>

              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.label}>Total de parcelas</span>
                  <input
                    className={styles.input}
                    defaultValue={initialDebt?.totalInstallments ?? ""}
                    min="1"
                    name="totalInstallments"
                    required
                    type="number"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Parcelas ja pagas</span>
                  <input
                    className={styles.input}
                    defaultValue={initialDebt?.paidInstallments ?? 0}
                    min="0"
                    name="paidInstallments"
                    required
                    type="number"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Proximo vencimento</span>
                <input
                  className={styles.input}
                  defaultValue={initialDebt?.nextDueDate ?? ""}
                  name="nextDueDate"
                  type="date"
                />
              </label>
            </>
          ) : (
            <label className={styles.field}>
              <span className={styles.label}>Dia de vencimento da fatura</span>
              <input
                className={styles.input}
                defaultValue={initialDebt?.dueDay ?? ""}
                max="31"
                min="1"
                name="dueDay"
                placeholder="Ex: 10"
                required
                type="number"
              />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Observacoes</span>
            <textarea
              className={styles.textarea}
              defaultValue={initialDebt?.notes ?? ""}
              maxLength={500}
              name="notes"
              placeholder="Informacoes opcionais"
            />
          </label>

          <div className={styles.actions}>
            <button className={styles.cancel} onClick={onClose} type="button">
              Cancelar
            </button>
            <button className={styles.save} type="submit">
              {initialDebt ? "Salvar alteracoes" : "Salvar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
