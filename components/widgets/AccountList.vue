<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { AccountTypeEnum } from "~/types/account";
import type { Account } from "~/types/account";

const accountStore = useAccountStore();

function handleNewAccount() {
  const newAccount: Account = {
    id: uuidv4(),
    tags: [],
    accountType: AccountTypeEnum.LOCAL,
    login: null,
    password: null,
  };

  accountStore.updateAccount(newAccount);
}

function handleUpdateAccount(account: Account) {
  accountStore.updateAccount(account);
}

function handleDeleteAccount(id: string) {
  accountStore.deleteAccount(id);
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-4">
        <div>
          <h1 class="font-bold text-2xl pb-1">Учетные записи</h1>
        </div>
        <div>
          <UButton
            icon="i-heroicons-plus-16-solid"
            size="md"
            color="primary"
            square
            variant="solid"
            @click="handleNewAccount"
          />
        </div>
      </div>
    </template>

    <div
      class="mb-4 p-3 bg-gray-50 border rounded-md text-sm text-gray-700 flex items-center gap-1"
    >
      <UIcon name="i-heroicons-question-mark-circle" class="text-lg" />

      <p>
        При добавлении меток разделяйте их точкой с запятой (;). Например:
        <code>работа;личное;важное</code>
      </p>
    </div>

    <div
      v-if="accountStore.accounts.length === 0"
      class="text-center p-4 text-gray-500"
    >
      Нет учетных записей. Нажмите "+" чтобы добавить.
    </div>

    <div v-else class="flex flex-col gap-2">
      <FeaturesAccountItem
        v-for="account in accountStore.accounts"
        :key="account.id"
        :account="account"
        @update="handleUpdateAccount"
        @delete="handleDeleteAccount"
      />
    </div>
  </UCard>
</template>
