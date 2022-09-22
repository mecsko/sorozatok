<script setup lang="ts">
  import { useTitleStore } from "../store/titleStore";
  import { useI18n } from "vue-i18n";

  const titleStore = useTitleStore();
  const { t } = useI18n({ useScope: "global" });

  const props = defineProps<{
    modelValue: boolean;
    editing?: boolean;
    titleId?: number;
  }>();

  const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: "update:modelValue", value: boolean): void;
    // eslint-disable-next-line no-unused-vars
    (event: "close", save?: boolean): void;
  }>();

  const show = computed({
    get() {
      return props.modelValue;
    },
    set(value: boolean) {
      return emit("update:modelValue", value);
    },
  });

  const title = computed(() => {
    return props.editing ? t("editTitle", { title: titleStore.title.title }) : t("newTitle");
  });

  async function send() {
    if (props.editing) {
      await titleStore.editById();
    } else {
      await titleStore.create();
    }
    show.value = false;
    emit("close", true);
  }

  function cancel() {
    show.value = false;
    emit("close");
  }

  function validateUrl(url: string) {
    if (url === "") {
      return true;
    }
    return /\/\/(\S+?(?:png|jpg|jpeg|gif|png|svg))/.test(url);
  }

  onMounted(() => {
    if (props.editing) {
      titleStore.getById(props.titleId!);
    } else {
      titleStore.title = { img: "" };
    }
  });
</script>

<template>
  <q-dialog v-model="show" persistent transition-hide="scale" transition-show="scale">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="q-px-xl text-h5 text-center">
          {{ title }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="send">
          <q-list dense>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ t("title") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model="titleStore.title.title"
                  filled
                  :rules="[(v) => (v != null && v != '') || t('inputRule')]"
                  type="text"
                />
              </q-item-section>
            </q-item>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ t("img") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model="titleStore.title.img"
                  filled
                  :rules="[(url) => validateUrl(url) || t('imgRule')]"
                  type="url"
                />
                <q-linear-progress v-if="false" />
              </q-item-section>
            </q-item>
            <q-item v-if="false">
              <q-item-section></q-item-section>
              <q-item-section>
                <q-btn disable icon="cloud_upload" :label="t('upload')" no-caps></q-btn>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-mt-xl row justify-center">
            <q-btn
              class="q-mr-md"
              color="green"
              :label="editing ? t('edit') : t('submit')"
              no-caps
              type="submit"
            />
            <q-btn class="q-mr-md" color="red" :label="t('cancel')" no-caps @click="cancel" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
