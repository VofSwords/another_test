import { defineStore } from "pinia";
import type { Account } from "~/types/account";

export const useAccountStore = defineStore(
  "accounts",
  () => {
    // Используем обычный объект для индексации
    const accountsIndex = ref<Record<string, Account>>({});

    // Предоставляем computed для работы с массивом
    const accounts = computed(() => Object.values(accountsIndex.value));

    function updateAccount(account: Account) {
      accountsIndex.value[account.id] = account;
    }

    function deleteAccount(id: string) {
      delete accountsIndex.value[id];
    }

    function getAccountById(id: string) {
      return accountsIndex.value[id];
    }

    return {
      accountsIndex,
      accounts,
      updateAccount,
      deleteAccount,
      getAccountById,
    };
  },
  {
    persist: true,
  }
);
