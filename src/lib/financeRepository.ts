import type {
  Debt,
  FinancialProfile,
  NewDebtInput,
  NewTransactionInput,
  Transaction,
} from "@/components/dashboard/types";
import { supabase } from "./supabaseClient";

export type FinanceCategory = {
  id: string;
  name: string;
};

type ProfileRow = {
  full_name: string | null;
  occupation: string | null;
  age: number | null;
  current_balance: number;
  monthly_income: number;
  monthly_expenses: number | null;
  monthly_saving_goal: number | null;
  financial_goal: string | null;
  onboarding_completed: boolean;
};

type TransactionRow = {
  id: string;
  debt_id: string | null;
  description: string;
  type: "income" | "expense";
  amount: number;
  payment_method: string;
  transaction_date: string;
  categories: { name: string } | null;
};

const defaultCategories = [
  { name: "Alimentacao", type: "expense" },
  { name: "Moradia", type: "expense" },
  { name: "Transporte", type: "expense" },
  { name: "Lazer", type: "expense" },
  { name: "Receita", type: "income" },
];

const paymentMethodToDatabase: Record<string, string> = {
  Pix: "pix",
  Cartao: "card",
  Dinheiro: "cash",
  Boleto: "boleto",
};

const paymentMethodFromDatabase: Record<string, string> = {
  pix: "Pix",
  card: "Cartao",
  cash: "Dinheiro",
  boleto: "Boleto",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatTransactionDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(new Date(`${date}T00:00:00`))
    .replace(".", "");
}

function mapProfile(row: ProfileRow): FinancialProfile {
  return {
    fullName: row.full_name ?? "",
    occupation: row.occupation ?? "",
    age: row.age ?? 13,
    currentBalance: Number(row.current_balance),
    monthlyIncome: Number(row.monthly_income),
    monthlyExpenses:
      row.monthly_expenses === null ? null : Number(row.monthly_expenses),
    monthlySavingGoal:
      row.monthly_saving_goal === null
        ? null
        : Number(row.monthly_saving_goal),
    financialGoal: row.financial_goal ?? "",
  };
}

export async function getFinancialProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "full_name, occupation, age, current_balance, monthly_income, monthly_expenses, monthly_saving_goal, financial_goal, onboarding_completed",
    )
    .eq("user_id", userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw error;
  }

  if (!data?.onboarding_completed) {
    return null;
  }

  return mapProfile(data);
}

export async function saveProfile(userId: string, profile: FinancialProfile) {
  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    full_name: profile.fullName.trim(),
    occupation: profile.occupation.trim(),
    age: profile.age,
    current_balance: profile.currentBalance,
    monthly_income: profile.monthlyIncome,
    monthly_expenses: profile.monthlyExpenses,
    monthly_saving_goal: profile.monthlySavingGoal,
    financial_goal: profile.financialGoal,
    onboarding_completed: true,
  });

  if (error) {
    throw error;
  }
}

export async function getCategories(userId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("user_id", userId)
    .order("name");

  if (error) {
    throw error;
  }

  if (data.length > 0) {
    return data as FinanceCategory[];
  }

  const { data: createdCategories, error: createError } = await supabase
    .from("categories")
    .insert(
      defaultCategories.map((category) => ({
        user_id: userId,
        ...category,
      })),
    )
    .select("id, name");

  if (createError) {
    throw createError;
  }

  return createdCategories as FinanceCategory[];
}

export async function createCategory(userId: string, name: string) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: name.trim(),
      type: "both",
    })
    .select("id, name")
    .single<FinanceCategory>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, debt_id, description, type, amount, payment_method, transaction_date, categories(name)",
    )
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false })
    .returns<TransactionRow[]>();

  if (error) {
    throw error;
  }

  return data.map<Transaction>((transaction) => {
    const signal = transaction.type === "income" ? "+" : "-";
    const numericAmount = Number(transaction.amount);

    return {
      id: transaction.id,
      debtId: transaction.debt_id,
      title: transaction.description,
      category: transaction.categories?.name ?? "Sem categoria",
      date: formatTransactionDate(transaction.transaction_date),
      rawDate: transaction.transaction_date,
      amount: `${signal} ${currencyFormatter.format(numericAmount)}`,
      numericAmount,
      paymentMethod:
        paymentMethodFromDatabase[transaction.payment_method] ??
        transaction.payment_method,
      type: transaction.type,
    };
  });
}

export async function createTransaction(
  userId: string,
  categoryId: string,
  transaction: NewTransactionInput,
) {
  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    category_id: categoryId,
    description: transaction.title.trim(),
    type: transaction.type,
    amount: transaction.amount,
    payment_method:
      paymentMethodToDatabase[transaction.paymentMethod] ?? "pix",
    debt_id: transaction.debtId,
    transaction_date: transaction.date,
  });

  if (error) {
    throw error;
  }
}

export async function getDebts(userId: string) {
  const { data, error } = await supabase
    .from("debts")
    .select(
      "id, debt_type, creditor, description, total_amount, installment_amount, total_installments, paid_installments, due_day, next_due_date, status, notes",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map<Debt>((debt) => ({
    id: debt.id,
    debtType: debt.debt_type,
    creditor: debt.creditor,
    description: debt.description,
    totalAmount:
      debt.total_amount === null ? null : Number(debt.total_amount),
    installmentAmount:
      debt.installment_amount === null ? null : Number(debt.installment_amount),
    totalInstallments: debt.total_installments,
    paidInstallments: debt.paid_installments,
    dueDay: debt.due_day,
    nextDueDate: debt.next_due_date,
    status: debt.status,
    notes: debt.notes,
  }));
}

export async function createDebt(userId: string, debt: NewDebtInput) {
  const { error } = await supabase.from("debts").insert({
    user_id: userId,
    debt_type: debt.debtType,
    creditor: debt.creditor.trim(),
    description: debt.description.trim(),
    total_amount: debt.totalAmount,
    installment_amount: debt.installmentAmount,
    total_installments: debt.totalInstallments,
    paid_installments: debt.paidInstallments,
    due_day: debt.dueDay,
    next_due_date: debt.nextDueDate || null,
    notes: debt.notes?.trim() || null,
  });

  if (error) {
    throw error;
  }
}

export async function updateDebt(debtId: string, debt: NewDebtInput) {
  const { error } = await supabase
    .from("debts")
    .update({
      debt_type: debt.debtType,
      creditor: debt.creditor.trim(),
      description: debt.description.trim(),
      total_amount: debt.totalAmount,
      installment_amount: debt.installmentAmount,
      total_installments: debt.totalInstallments,
      paid_installments: debt.paidInstallments,
      due_day: debt.dueDay,
      next_due_date: debt.nextDueDate || null,
      notes: debt.notes?.trim() || null,
    })
    .eq("id", debtId);

  if (error) {
    throw error;
  }
}

export async function payDebtInstallment(debt: Debt) {
  if (
    debt.debtType !== "installment" ||
    debt.paidInstallments === null ||
    debt.totalInstallments === null
  ) {
    return;
  }

  const paidInstallments = Math.min(
    debt.paidInstallments + 1,
    debt.totalInstallments,
  );
  const status = paidInstallments === debt.totalInstallments ? "paid" : "active";
  const nextDueDate =
    debt.nextDueDate && status === "active"
      ? (() => {
          const date = new Date(`${debt.nextDueDate}T00:00:00`);
          date.setMonth(date.getMonth() + 1);
          return date.toISOString().slice(0, 10);
        })()
      : debt.nextDueDate;

  const { error } = await supabase
    .from("debts")
    .update({
      paid_installments: paidInstallments,
      next_due_date: nextDueDate,
      status,
    })
    .eq("id", debt.id);

  if (error) {
    throw error;
  }
}

export async function deleteDebt(debtId: string) {
  const { error } = await supabase.from("debts").delete().eq("id", debtId);

  if (error) {
    throw error;
  }
}
