<script setup lang="ts">
import { z } from "zod";
import { AccountTypeEnum } from "~/types/account";
import type { Account, Tag } from "~/types/account";

const AccountTypes = [
  {
    name: "LDAP",
    value: AccountTypeEnum.LDAP,
  },
  {
    name: "Локальная",
    value: AccountTypeEnum.LOCAL,
  },
];

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits<{
  update: [account: Account];
  delete: [id: string];
}>();

function tagsToString(tags: Tag[]): string {
  return tags.map((tag) => tag.text).join(";");
}

function stringToTags(str: string): Tag[] {
  return str
    .split(";")
    .map((tag) => ({ text: tag.trim() }))
    .filter((tag) => tag.text !== "");
}

const state = reactive({
  id: props.account.id,
  tagString: tagsToString(props.account.tags),
  accountType: props.account.accountType,
  accLogin: props.account.login || "",
  accPassword: props.account.password || "",
});

const formRef = useTemplateRef("form");

const showPassword = computed(
  () => state.accountType === AccountTypeEnum.LOCAL
);
const accountTypeValues = Object.values<string>(AccountTypeEnum);

const tagStringSchema = computed(() =>
  z
    .string()
    .max(50, "Максимум 50 символов")
    .transform((val) => val || "")
    .refine(
      (val) => {
        if (val.length === 0) return true;

        return stringToTags(val).length > 0;
      },
      {
        message: "Ошибка обработки тегов",
      }
    )
);

const accountTypeSchema = computed(() =>
  z.string().refine(
    (val) => {
      return accountTypeValues.includes(val);
    },
    {
      message: "Выберите тип записи",
    }
  )
);

const loginSchema = computed(() =>
  z
    .string()
    .min(1, "Логин обязателен к заполнению")
    .max(100, "Максимум 100 символов")
);

const passwordSchema = computed(() =>
  showPassword.value
    ? z
        .string()
        .min(1, "Пароль обязателен к заполнению")
        .max(100, "Максимум 100 символов")
    : z
        .string()
        .optional()
        .nullable()
        .transform(() => null)
);

const schema = computed(() =>
  z.object({
    tagString: tagStringSchema.value,
    accountType: accountTypeSchema.value,
    accLogin: loginSchema.value,
    accPassword: passwordSchema.value,
  })
);

function handleSubmit() {
  const updatedAccount: Account = {
    id: state.id,
    tags: stringToTags(state.tagString),
    accountType: state.accountType as AccountTypeEnum,
    login: state.accLogin,
    password: state.accPassword,
  };

  emit("update", updatedAccount);
}

async function handleValidate() {
  if (!formRef.value) return;

  try {
    // @ts-ignore
    await formRef.value.submit(undefined);
  } catch (error) {
    console.log(error);
  }
}

function handleDelete() {
  emit("delete", state.id);
}

watch(
  () => state.accountType,
  (accountType) => {
    if (accountType === AccountTypeEnum.LOCAL) {
      state.accPassword = "";
    }
  }
);
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    ref="form"
    autocomplete="off"
    autofill="none"
    class="flex gap-2 items-start"
    @submit="handleSubmit"
  >
    <!-- Отключение автозаполнения -->
    <input type="text" style="display: none" />
    <input type="password" style="display: none" />

    <UFormGroup label="Метки" name="tagString" class="shrink-0 basis-80">
      <UInput
        v-model="state.tagString"
        autocomplete="off"
        @blur="handleValidate"
      />
    </UFormGroup>

    <UFormGroup label="Тип записи" name="accountType" class="shrink-0">
      <USelect
        v-model="state.accountType"
        :options="AccountTypes"
        option-attribute="name"
        autocomplete="off"
        @update:model-value="handleValidate"
        @change="handleValidate"
      />
    </UFormGroup>

    <UFormGroup label="Логин" name="accLogin" class="grow basis-0">
      <UInput
        v-model="state.accLogin"
        autocomplete="off"
        @blur="handleValidate"
      />
    </UFormGroup>

    <UFormGroup
      v-if="showPassword"
      label="Пароль"
      name="accPassword"
      class="grow basis-0"
    >
      <UInput
        v-model="state.accPassword"
        type="password"
        autocomplete="off"
        @blur="handleValidate"
      />
    </UFormGroup>

    <!-- Без этой кнопки, нет события submit -->
    <button type="submit" style="display: none" />

    <UButton
      icon="i-heroicons-trash"
      size="sm"
      color="red"
      square
      variant="outline"
      class="shrink-0 mt-6"
      @click="handleDelete"
    />
  </UForm>
</template>
