<script setup lang="ts">
  import { QInputProps } from "quasar";
  import { useI18n } from "vue-i18n";

  import { useUsersStore, IUser } from "../store/usersStore";

  const usersStore = useUsersStore();
  const { t } = useI18n({ useScope: "global" });

  interface IReactiveData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    visibility: QInputProps["type"];
  }
  const r = reactive<IReactiveData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    visibility: "password",
  });

  defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: "toLogin"): void;
  }>();

  function Registration() {
    const data: IUser = {
      name: r.name,
      username: r.username,
      email: r.email,
      password: r.password,
    };
    usersStore.registration(data);
  }

  function changeTypeEdit() {
    if (r.visibility == "password") {
      r.visibility = "text";
    } else {
      r.visibility = "password";
    }
  }

  function isValidEmail(val: string) {
    return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(val) || t("regValidEmail");
  }
  function isValidPassword(val: string) {
    return val.length >= 6 || t("regValidPassword");
  }
  function isBiggerThan50(val: string, field: string) {
    return val.length != 50 || t("regValidLength", { field: field });
  }
</script>

<template>
  <q-form class="row justify-center" @submit.prevent="Registration">
    <q-card
      bordered
      class="q-pa-sm shadow-10"
      square
      :style="$q.dark.isActive ? '' : 'background: #eee'"
    >
      <q-card-section>
        <p class="login col-12 text-h6 text-left">{{ $t("registration") }}</p>
      </q-card-section>
      <q-separator color="secondary" inset />
      <q-card-section>
        <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
          <q-input
            v-model="r.name"
            bottom-slots
            color="secondary"
            counter
            :label="$t('name')"
            maxlength="50"
            outlined
            reactive-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('isRequired', { field: 'name' }),
              (val) => isBiggerThan50(val, 'name'),
            ]"
            type="text"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.name = ''" />
            </template>
            <template #hint>{{ $t("regName") }}</template>
          </q-input>
          <q-input
            v-model="r.username"
            bottom-slots
            color="secondary"
            counter
            :label="$t('username')"
            maxlength="50"
            outlined
            reactive-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('isRequired', { field: 'username' }),
              (val) => isBiggerThan50(val, 'username'),
            ]"
            type="text"
          >
            <template #prepend>
              <q-icon name="account_circle" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.username = ''" />
            </template>
            <template #hint>{{ $t("regUsername") }}</template>
          </q-input>
          <q-input
            v-model="r.email"
            bottom-slots
            color="secondary"
            :label="$t('email')"
            lazy-rules
            outlined
            reactive-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('isRequired', { field: 'email' }),
              isValidEmail,
            ]"
            type="email"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.email = ''" />
            </template>
            <template #hint>{{ $t("regEmail") }}</template>
          </q-input>
          <q-input
            v-model="r.password"
            bottom-slots
            color="secondary"
            :label="$t('regPassword')"
            lazy-rules
            outlined
            reactive-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('isRequired', { field: 'password' }),
              isValidPassword,
            ]"
            :type="r.visibility"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.password = ''" />
            </template>
            <template #hint>{{ $t("regPasswordHint") }}</template>

            <template #after>
              <q-btn
                v-if="r.visibility == 'password'"
                dense
                flat
                icon="visibility"
                round
                @click="changeTypeEdit()"
              ></q-btn>
              <q-btn
                v-else
                dense
                flat
                icon="visibility_off"
                round
                @click="changeTypeEdit()"
              ></q-btn>
            </template>
          </q-input>
          <q-input
            v-model="r.confirmPassword"
            bottom-slots
            color="secondary"
            :label="$t('confirmPass')"
            lazy-rules
            outlined
            reactive-rules
            :rules="[(val) => (val && val === r.password) || $t('matchPassword')]"
            :type="r.visibility"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.confirmPassword = ''" />
            </template>

            <template #after>
              <q-btn
                v-if="r.visibility == 'password'"
                dense
                flat
                icon="visibility"
                round
                @click="changeTypeEdit()"
              ></q-btn>
              <q-btn
                v-else
                dense
                flat
                icon="visibility_off"
                round
                @click="changeTypeEdit()"
              ></q-btn>
            </template>
          </q-input>
          <q-btn
            class="full-width"
            color="secondary"
            :label="$t('registration')"
            type="submit"
          ></q-btn>
          <q-btn
            class="full-width"
            color="secondary"
            flat
            :label="$t('backToLogin')"
            @click="$emit('toLogin')"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<style lang="scss" scoped></style>
