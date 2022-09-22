<script setup lang="ts">
  import { useI18n } from "vue-i18n";
  import { Quasar } from "quasar";
  import router from "src/router";
  import { useMeta } from "vue-meta";
  import { useUsersStore } from "./store/usersStore";

  const leftDrawer = ref(false);
  const miniState = ref(true);
  const usersStore = useUsersStore();

  let { locale, t } = useI18n({
    inheritLocale: true,
    useScope: "global",
  });

  const computedTitle = computed(() => ({
    title: t("gridTitle"),
  }));
  useMeta(computedTitle);

  const menuItems = ref([
    {
      icon: "mdi-home",
      text: t("startPage"),
      name: "startPage",
      route: "/",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-grid",
      text: t("gridSeries"),
      name: "gridSeries",
      route: "/grid",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-account",
      text: t("account"),
      name: "account",
      route: "/account",
      disabled: false,
      separator: true,
    },
    {
      icon: "mdi-information",
      text: t("about"),
      name: "about",
      route: "/about",
      disabled: false,
      separator: true,
    },
  ]);

  function toggleLanguage() {
    const langs: Record<string, string>[] = [
      { label: "hu", value: "hu" },
      { label: "en", value: "en-US" },
    ];

    locale.value = locale.value == langs[0].value ? langs[1].label : langs[0].label;
    switch (locale.value) {
      case "hu":
        import("quasar/lang/hu").then((lang) => Quasar.lang.set(lang.default));
        break;
      case "en":
        import("quasar/lang/en-US").then((lang) => Quasar.lang.set(lang.default));
        break;
    }

    menuItems.value.forEach((e) => {
      if (e.name != "") e.text = t(e.name);
    });
  }

  const links = ref([
    {
      icon: "mdi-github",
      text: "GitHub repo",
      name: "",
      link: "https://github.com/mecseridavid",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-tire",
      text: "Quasar",
      name: "",
      link: "https://quasar.dev/",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-fruit-pineapple",
      text: "Pinia",
      name: "",
      link: "https://pinia.vuejs.org/introduction.html",
      disabled: false,
      separator: false,
    },
  ]);

  onMounted(() => {
    import("quasar/lang/hu").then((lang) => Quasar.lang.set(lang.default));
  });
</script>

<template>
  <metainfo>
    <template #title="{ content }">
      {{ content }}
    </template>
  </metainfo>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr fFf">
      <q-header
        class="bg-secondary text-left"
        :class="$q.dark.isActive ? 'text-white' : 'text-black'"
        elevated
      >
        <q-toolbar>
          <q-btn dense flat icon="mdi-menu" round @click="leftDrawer = !leftDrawer" />
          <q-toolbar-title id="title" style="cursor: pointer" @click="router.push({ path: '/' })">
            {{ $t("header") }} 2022 -
            {{ usersStore.loggedUser ? usersStore.loggedUser!.name : $t("noUser") }}
          </q-toolbar-title>
          <q-btn flat icon="mdi-comment-text-multiple" @click="toggleLanguage">
            <q-badge color="primary" floating>{{ locale }}</q-badge>
          </q-btn>
          <q-btn flat icon="mdi-theme-light-dark" @click="$q.dark.toggle" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawer"
        bordered
        :breakpoint="500"
        :class="$q.dark.isActive ? 'bg-grey-9 primary' : 'bg-grey-3 secondary'"
        :mini="miniState"
        persistent
        show-if-above
        :width="200"
        @mouseout="miniState = true"
        @mouseover="miniState = false"
      >
        <q-scroll-area class="fit">
          <q-list>
            <template v-for="(menuItem, index) in menuItems" :key="index">
              <q-item clickable :disable="menuItem.disabled" :to="menuItem.route">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="menuItem.separator" :key="'sep' + index" />
            </template>
          </q-list>
          <q-list>
            <template v-for="(linkItem, index) in links" :key="index">
              <q-item clickable :href="linkItem.link" target="_blank">
                <q-item-section avatar>
                  <q-icon :name="linkItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ linkItem.text }}
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container id="container">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="slide-fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style lang="scss">
  .slide-fade-enter {
    transform: translateX(10px);
    opacity: 0;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.2s ease;
  }

  .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }

  #title {
    font-size: 10px;
    @media (min-width: 400px) {
      font-size: calc(10px + 0.5vw);
    }
    @media (min-width: 800px) {
      font-size: calc(14px + 0.5vw);
    }
    @media (min-width: 1200px) {
      font-size: calc(18px + 0.5vw);
    }
  }

  .q-item.q-router-link--active {
    color: $secondary;
  }
</style>
