<script setup lang="ts">
  import { computed } from "vue";
  import { useEpisodeStore } from "../store/episodeStore";
  import { useI18n } from "vue-i18n";

  const episodeStore = useEpisodeStore();
  const { t } = useI18n({ useScope: "global" });

  const props = defineProps<{
    modelValue: boolean;
    editing?: boolean;
    selectedTitle: {
      id: number;
      title: string;
    };
    episodeId?: number;
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
    return props.editing
      ? t("editEpisode", { title: props.selectedTitle.title })
      : t("newEpisode", { title: props.selectedTitle.title });
  });

  function send() {
    if (props.editing) {
      episodeStore.editById();
    } else {
      episodeStore.create(props.selectedTitle.id);
    }
    show.value = false;
    emit("close", true);
  }

  function cancel() {
    episodeStore.episode = {};
    show.value = false;
    emit("close");
  }

  onMounted(() => {
    if (props.editing) {
      episodeStore.getById(props.episodeId!);
    } else {
      episodeStore.episode = { date: "", watched: 0 };
    }
  });
</script>

<template>
  <q-dialog v-model="show" persistent transition-hide="scale" transition-show="scale">
    <q-card style="min-width: 700px">
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
                <q-item-label>{{ t("date") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model="episodeStore.episode.date"
                  clearable
                  filled
                  mask="####-##-##"
                  @clear="episodeStore.episode.date = ''"
                >
                  <template #append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date
                          v-model="episodeStore.episode.date"
                          :subtitle="t('years')"
                          :title="t('calendar')"
                          today-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat :label="t('close')" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ t("season") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model.number="episodeStore.episode.season"
                  filled
                  :rules="[(v) => (v != null && v != '') || t('inputRule')]"
                  type="number"
                />
              </q-item-section>
            </q-item>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ t("episode") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model.number="episodeStore.episode.episode"
                  filled
                  :rules="[(v) => (v != null && v != '') || t('inputRule')]"
                  type="number"
                />
              </q-item-section>
            </q-item>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ t("duration") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model.number="episodeStore.episode.duration"
                  filled
                  :rules="[(v) => (v != null && v != '') || t('inputRule')]"
                  type="number"
                />
              </q-item-section>
            </q-item>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ t("haveBeenWatched") }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-toggle
                  v-model="episodeStore.episode.watched"
                  checked-icon="check"
                  :false-value="0"
                  :toggle-indeterminate="false"
                  :true-value="1"
                  unchecked-icon="clear"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-mt-xl row justify-center">
            <q-btn class="q-mr-md" color="green" :label="t('submit')" no-caps type="submit" />
            <q-btn class="q-mr-md" color="red" :label="t('cancel')" no-caps @click="cancel" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
