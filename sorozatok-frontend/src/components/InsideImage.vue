<script setup lang="ts">
  import { ITitle } from "src/store/titleStore";
  import { useUsersStore } from "../store/usersStore";

  const userStore = useUsersStore();

  const props = defineProps<{
    row: ITitle;
  }>();

  const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: "update:selectedTitle", value: ITitle): void;
    // eslint-disable-next-line no-unused-vars
    (event: "openEpisodesOfSelectedTitle", value: boolean): void;
    // eslint-disable-next-line no-unused-vars
    (event: "openTitleFormForEdit", value: boolean): void;
    // eslint-disable-next-line no-unused-vars
    (event: "editingTitle", value: boolean): void;
    // eslint-disable-next-line no-unused-vars
    (event: "deleteTitle"): void;
  }>();

  function edit() {
    console.log("edit");
    emit("update:selectedTitle", props.row);
    emit("openTitleFormForEdit", true);
    emit("editingTitle", true);
  }

  function openEpisodes() {
    console.log("open");
    emit("update:selectedTitle", props.row);
    emit("openEpisodesOfSelectedTitle", true);
  }
</script>

<template>
  <div class="flex justify-between items-center absolute-top text-h5">
    <span>{{ props.row.title }}</span>
    <q-btn-dropdown
      v-if="userStore.loggedUser"
      auto-close
      class="float-right"
      content-class="transparent no-shadow"
      dense
      dropdown-icon="menu"
      flat
      no-caps
      size="lg"
      @show="emit('update:selectedTitle', props.row)"
    >
      <q-list>
        <q-item dense>
          <q-btn
            color="red"
            :label="$t('delete')"
            no-caps
            style="width: 100px"
            @click="emit('deleteTitle')"
          />
        </q-item>
        <q-item dense>
          <q-btn class="full-width" color="blue" :label="$t('edit')" no-caps @click="edit" />
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <div class="absolute-bottom" style="padding: 0">
    <q-btn class="full-width q-ma-none" dense :label="$t('episodes')" @click="openEpisodes" />
  </div>
</template>

<style lang="scss" scoped></style>
