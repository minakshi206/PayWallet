import { atom } from "recoil";

export type Transaction = {
type: "add" | "send";
amount: number;
date: string;
};

export type User = {
id: number; // ⭐ REQUIRED FOR PAYMENT
name: string;
isLoggedIn: boolean;
balance: number;
moneyAdded: number;
moneySent: number;
transactions: Transaction[];
};

const getInitialUser = (): User | null => {
if (typeof window === "undefined") return null;

const savedUser = localStorage.getItem("user");
if (!savedUser) return null;

const parsed = JSON.parse(savedUser);

return {
id: parsed.id ?? 1, // ⭐ important
name: parsed.name ?? "User",
isLoggedIn: parsed.isLoggedIn ?? true,
balance: parsed.balance ?? 0,
moneyAdded: parsed.moneyAdded ?? 0,
moneySent: parsed.moneySent ?? 0,
transactions: Array.isArray(parsed.transactions)
? parsed.transactions
: [],
};
};

export const userState = atom<User | null>({
key: "userState",
default: getInitialUser(),
});
