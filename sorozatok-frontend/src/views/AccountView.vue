<script setup lang="ts">
  import { useUsersStore } from "src/store/usersStore";
  import LoginForm from "../components/LoginForm.vue";
  import RegisterForm from "../components/RegisterForm.vue";

  const userStore = useUsersStore();

  const register = ref(true);
</script>

<template>
  <q-page class="row justify-center items-center">
    <div v-if="!userStore.loggedUser">
      <LoginForm v-if="register" @to-reg="register = !register" />
      <RegisterForm v-else @to-login="register = !register" />
    </div>
    <div v-else>
      <q-form
        ref="myform"
        class="square-card row justify-center"
        @submit.prevent="userStore.logOut()"
      >
        <q-card
          bordered
          class="q-pa-sm shadow-10"
          square
          style="min-height: 60%"
          :style="$q.dark.isActive ? '' : 'background: #eee'"
        >
          <q-card-section>
            <p class="q-pa-md text-h6 text-left">{{ $t("logout") }}</p>
          </q-card-section>
          <q-separator color="secondary" inset />
          <q-card-section>
            <div class="q-pa-md q-gutter-y-md">
              <q-btn class="full-width" color="secondary" :label="$t('logout')" type="submit" />
            </div>
          </q-card-section>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
