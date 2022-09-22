<script setup lang="ts">
  import { QInputProps } from "quasar";
  // import { useI18n } from "vue-i18n";
  import { useUsersStore } from "../store/usersStore";

  const usersStore = useUsersStore();
  // const { t } = useI18n({ useScope: "global" });

  interface IReactiveData {
    usernameOrEmail: string;
    password: string;
    visibility: QInputProps["type"];
  }

  // const r = reactive<IReactiveData>({
  //   usernameOrEmail: "",
  //   password: "",
  //   visibility: "password",
  // });
  const r = reactive<IReactiveData>({
    usernameOrEmail: "test",
    password: "test1234",
    visibility: "password",
  });
  defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: "toReg"): void;
  }>();

  function login() {
    usersStore.loginUser(r.usernameOrEmail, r.password);
  }

  // function validateUsernameOrEmail(val: string) {
  //   return (val && val.length > 0) || t("required");
  // }
  // function validatePassword(val: string) {
  //   return (val && val.length > 0) || t("required");
  // }

  function changeTypeEdit() {
    if (r.visibility == "password") {
      r.visibility = "text";
    } else {
      r.visibility = "password";
    }
  }
</script>

<template>
  <q-form ref="myform" class="square-card row justify-center" @submit.prevent="login">
    <q-card
      bordered
      class="q-pa-sm shadow-10"
      square
      :style="$q.dark.isActive ? '' : 'background: #eee'"
    >
      <q-card-section>
        <p class="col-12 text-h6 text-left">{{ $t("login") }}</p>
      </q-card-section>
      <q-separator color="secondary" inset />
      <q-card-section>
        <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
          <q-input
            v-model="r.usernameOrEmail"
            bottom-slots
            color="secondary"
            :label="$t('unameOrEmail')"
            outlined
            reactive-rules
            :rules="[(val) => (val && val.length > 0) || $t('required')]"
            type="text"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.usernameOrEmail = ''" />
            </template>
            <template v-if="!r.usernameOrEmail" #hint>{{ $t("loginUnameEmail") }}</template>
          </q-input>
          <q-input
            v-model="r.password"
            bottom-slots
            color="secondary"
            counter
            :label="$t('password')"
            outlined
            reactive-rules
            :rules="[(val) => (val && val.length > 0) || $t('required')]"
            :type="r.visibility"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon class="cursor-pointer" name="close" @click="r.password = ''" />
            </template>
            <template v-if="!r.password" #hint>{{ $t("loginPassword") }}</template>

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
          <q-btn class="full-width" color="secondary" :label="$t('login')" type="submit"></q-btn>
          <q-btn
            class="full-width"
            color="secondary"
            flat
            :label="$t('registration')"
            @click="$emit('toReg')"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<style lang="scss" scoped></style>
