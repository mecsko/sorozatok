<script setup lang="ts">
  import { useTitleStore, ITitle } from "../store/titleStore";
  import { useUsersStore } from "../store/usersStore";
  import { useEpisodeStore, IEpisode } from "../store/episodeStore";
  import { Loading, Notify, QTableProps } from "quasar";
  import { storeToRefs } from "pinia";
  import { useI18n } from "vue-i18n";
  import EpisodeDialog from "../components/EpisodeDialog.vue";
  import TitleDialog from "../components/TitleDialog.vue";
  import InsideImage from "../components/InsideImage.vue";

  const titleStore = useTitleStore();
  const episodeStore = useEpisodeStore();
  const userStore = useUsersStore();

  const { titles } = storeToRefs(titleStore);
  const { t } = useI18n({ useScope: "global" });

  const selectedTitle = ref<ITitle>({});
  const selectedEpisodes = ref<IEpisode[]>([]);

  const openTitleFormForEdit = ref(false);
  const openTitleFormForAdd = ref(false);
  const editingTitle = ref(false);

  const openEpisodeFormForEdit = ref(false);
  const openEpisodeFormForAdd = ref(false);
  const editingEpisode = ref(false);

  const openEpisodesOfSelectedTitle = ref(false);
  const maximizedToggle = ref(false);

  const pagination = ref({
    sortBy: "title",
    descending: false,
    page: 1,
    rowsPerPage: 6,
    rowsNumber: titleStore.numberOfTitles,
    filter: "",
  });
  const filter = ref("");
  watch(titles, () => {
    pagination.value.rowsNumber = titleStore.numberOfTitles;
  });

  const episodeCols = computed((): QTableProps["columns"] => [
    {
      name: "_id",
      label: "",
      field: "_id",
      style: "display: none",
      headerStyle: "display: none",
    },
    {
      name: "date",
      label: t("date"),
      field: "date",
      align: "center",
      sortable: true,
    },
    {
      name: "season",
      label: t("season"),
      field: "season",
      align: "center",
      sortable: true,
    },
    {
      name: "episode",
      label: t("episode"),
      field: "episode",
      align: "center",
      sortable: true,
    },
    {
      name: "duration",
      label: t("duration"),
      field: "duration",
      align: "center",
      sortable: true,
    },
    {
      name: "watched",
      label: t("watched"),
      field: "watched",
      align: "center",
      sortable: true,
    },
  ]);
  const titleCols: QTableProps["columns"] = [
    {
      name: "_id",
      label: "",
      field: "_id",
      style: "display: none",
      headerStyle: "display: none",
    },
    {
      name: "title",
      label: "Title",
      field: "title",
      align: "left",
      sortable: true,
    },
    { name: "img", label: "Image", field: "img", align: "left" },
  ];

  function deleteTitle() {
    if (selectedTitle.value.episodes!.length > 0) {
      Notify.create({
        message: t("deleteTitle"),
        color: "negative",
      });
    } else {
      titleStore.deleteById(selectedTitle.value._id!).then(() => {
        titleStore.titles.filter((title) => title._id != selectedTitle.value._id);
        updateTitleTable();
        selectedTitle.value = {};
      });
    }
  }
  function deleteOneOrMoreEpisode() {
    const episodes = [...selectedEpisodes.value];
    selectedEpisodes.value = [];

    for (const e of episodes) {
      episodeStore.deleteById({ _id: e._id! }).then(() => {
        const tempArr: IEpisode[] = selectedTitle.value.episodes!.filter(
          (selectedE: IEpisode) => selectedE._id != e._id
        );
        selectedTitle.value.episodes = tempArr;
      });
    }
    Loading.hide();
  }

  function exitFromEpisodeForm(save?: boolean) {
    if (save) {
      if (editingEpisode.value) {
        const index = selectedTitle.value.episodes!.findIndex(
          (e) => e._id == episodeStore.episode._id
        );
        selectedTitle.value.episodes![index] = episodeStore.episode;
        editingEpisode.value = false;
      } else {
        selectedTitle.value.episodes!.unshift(episodeStore.episode);
      }
    }
    editingEpisode.value = false;
    openEpisodesOfSelectedTitle.value = true;
  }
  function exitFromTitleForm(save?: boolean) {
    if (save) {
      if (editingTitle.value) {
        const index = titleStore.titles.findIndex((title) => title._id == selectedTitle.value._id);
        titleStore.titles[index] = titleStore.title;
        editingTitle.value = false;
      } else {
        updateTitleTable();
      }
    }
    editingTitle.value = false;
  }

  function onRequest(props: any) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;

    titleStore.fetchPaginatedTitles({
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
      order: sortBy,
      sort: descending ? "-1" : "1",
      keyword: filter.value,
    });

    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  }
  function updateTitleTable() {
    onRequest({
      pagination: pagination.value,
    });
  }

  onMounted(() => updateTitleTable());
</script>

<template>
  <q-page>
    <q-table
      v-model:pagination="pagination"
      binary-state-sort
      class="row justify-around"
      :columns="titleCols"
      :filter="filter"
      grid
      row-key="_id"
      :rows="titleStore.titles"
      @request="onRequest"
    >
      <template #top-right>
        <q-input v-model="filter" debounce="300" dense :placeholder="t('search')">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template #top-left>
        <div>
          <span class="text-h5 text-italic">{{ t("gridTitle") }}</span>
          <q-btn
            v-if="userStore.loggedUser"
            class="absolute-center"
            color="green"
            :label="t('newTitle')"
            no-caps
            @click="openTitleFormForAdd = true"
          />
        </div>
      </template>

      <template #item="props">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-ma-md">
            <div v-for="col in props.cols" :key="col._id">
              <div v-if="col.name == 'img'">
                <q-img
                  :class="$q.dark.isActive ? 'shadow-5' : 'shadow-10'"
                  :fit="'fill'"
                  native-context-menu
                  :src="col.value"
                  style="height: 400px"
                >
                  <template #default>
                    <InsideImage
                      :row="props.row"
                      @delete-title="deleteTitle"
                      @editing-title="(value) => (editingTitle = value)"
                      @open-episodes-of-selected-title="
                        (value) => (openEpisodesOfSelectedTitle = value)
                      "
                      @open-title-form-for-edit="(value) => (openTitleFormForEdit = value)"
                      @update:selected-title="(title) => (selectedTitle = title)"
                    />
                  </template>
                  <template #loading>
                    <q-spinner-gears :color="$q.dark.isActive ? 'white' : 'black'" />
                  </template>
                  <template #error>
                    <InsideImage
                      :row="props.row"
                      @delete-title="deleteTitle"
                      @editing-title="(value) => (editingTitle = value)"
                      @open-episodes-of-selected-title="
                        (value) => (openEpisodesOfSelectedTitle = value)
                      "
                      @open-title-form-for-edit="(value) => (openTitleFormForEdit = value)"
                      @update:selected-title="(title) => (selectedTitle = title)"
                    />
                  </template>
                </q-img>
              </div>
            </div>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog
      :key="selectedTitle._id"
      v-model="openEpisodesOfSelectedTitle"
      :maximized="maximizedToggle"
      persistent
    >
      <q-card style="max-width: 800px">
        <q-bar>
          Episodes of {{ selectedTitle.title }}
          <q-space />
          <q-btn
            dense
            :disable="!maximizedToggle"
            flat
            icon="minimize"
            @click="maximizedToggle = false"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">
              {{ t("min") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            :disable="maximizedToggle"
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">
              {{ t("max") }}
            </q-tooltip>
          </q-btn>
          <!-- (maximizedToggle = false) && (selectedEpisodes = []) -->
          <q-btn
            v-close-popup
            dense
            flat
            icon="close"
            @click="() => (selectedEpisodes = []) && (maximizedToggle = false)"
          >
            <q-tooltip class="bg-white text-primary">{{ t("close") }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-table
          v-model:selected="selectedEpisodes"
          :columns="episodeCols"
          :dense="$q.screen.lt.md"
          hide-selected-banner
          :pagination="{ rowsPerPage: 8 }"
          row-key="_id"
          :rows="selectedTitle.episodes"
          :selection="userStore.loggedUser ? 'multiple' : 'none'"
          separator="vertical"
        >
          <template #no-data="{ message }">
            <div class="full-width flex justify-between items-center">
              <div>
                <q-btn
                  v-if="userStore.loggedUser"
                  color="green"
                  @click="openEpisodeFormForAdd = true"
                >
                  {{ t("newEpisodeBtn") }}
                </q-btn>
              </div>
              <div style="margin: auto">
                <q-icon name="sentiment_dissatisfied" size="2em" />
                <span>{{ message }}</span>
              </div>
            </div>
          </template>
          <template #bottom="props">
            <div class="full-width flex justify-between">
              <div>
                <q-btn
                  v-if="userStore.loggedUser && selectedEpisodes.length == 0"
                  color="green"
                  no-caps
                  @click="openEpisodeFormForAdd = true"
                >
                  {{ t("newEpisodeBtn") }}
                </q-btn>
                <q-btn
                  v-else-if="selectedEpisodes.length != 0"
                  class="q-mr-sm"
                  color="red"
                  no-caps
                  @click="deleteOneOrMoreEpisode()"
                >
                  {{ t("delete") }}
                </q-btn>
                <q-btn
                  v-if="selectedEpisodes.length == 1"
                  class="q-ml-sm"
                  color="blue"
                  no-caps
                  @click="
                    () =>
                      (openEpisodeFormForEdit = editingEpisode = true) &&
                      (openEpisodesOfSelectedTitle = false)
                  "
                >
                  {{ t("edit") }}
                </q-btn>
              </div>
              <div class="flex row">
                <q-select
                  v-model="props.pagination.rowsPerPage"
                  borderless
                  dense
                  emit-value
                  map-options
                  :options="[3, 5, 7, 10, 15, 20, { label: t('all'), value: 0 }]"
                  options-dense
                />
                <q-btn
                  v-if="props.pagesNumber > 2"
                  color="grey-8"
                  dense
                  :disable="props.isFirstPage"
                  flat
                  icon="first_page"
                  round
                  @click="props.firstPage"
                ></q-btn>
                <q-btn
                  color="grey-8"
                  dense
                  :disable="props.isFirstPage"
                  flat
                  icon="chevron_left"
                  round
                  @click="props.prevPage"
                ></q-btn>
                <q-btn
                  color="grey-8"
                  dense
                  :disable="props.isLastPage"
                  flat
                  icon="chevron_right"
                  round
                  @click="props.nextPage"
                ></q-btn>
                <q-btn
                  v-if="props.pagesNumber > 2"
                  color="grey-8"
                  dense
                  :disable="props.isLastPage"
                  flat
                  icon="last_page"
                  round
                  @click="props.lastPage"
                ></q-btn>
              </div>
            </div>
          </template>
          <template #body-cell-date="props">
            <q-td :props="props">
              <span class="text-center text-overline text-weight-bold">
                {{ props.value ? props.value : "-" }}
              </span>
            </q-td>
          </template>
          <template #body-cell-watched="props">
            <q-td :props="props">
              <q-badge v-if="props.value === 1" color="green" :label="t('yes')" outline />
              <q-badge v-else color="red" :label="t('no')" outline />
            </q-td>
          </template>
          <template #header="props">
            <q-tr class="bg-secondary" :props="props">
              <q-th v-if="userStore.loggedUser">
                <q-checkbox v-model="props.selected" color="primary" keep-color />
              </q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span class="text-overline text-weight-bold text-grey-1">
                  {{ col.label }}
                </span>
              </q-th>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </q-dialog>

    <TitleDialog
      v-if="openTitleFormForAdd"
      v-model="openTitleFormForAdd"
      @close="exitFromTitleForm"
    />
    <TitleDialog
      v-if="openTitleFormForEdit"
      v-model="openTitleFormForEdit"
      :editing="editingTitle"
      :title-id="selectedTitle._id"
      @close="exitFromTitleForm"
    />

    <EpisodeDialog
      v-if="openEpisodeFormForAdd"
      v-model="openEpisodeFormForAdd"
      :selected-title="{ id: selectedTitle._id!, title: selectedTitle.title! }"
      @close="exitFromEpisodeForm"
    />
    <EpisodeDialog
      v-if="openEpisodeFormForEdit"
      v-model="openEpisodeFormForEdit"
      :editing="editingEpisode"
      :episode-id="selectedEpisodes[0]._id!"
      :selected-title="{ id: selectedTitle._id!, title: selectedTitle.title! }"
      @close="exitFromEpisodeForm"
    />
  </q-page>
</template>

<style scoped>
  .q-table th,
  .q-table td {
    padding: 10 !important;
  }
  .q-table {
    border-spacing: 2px !important;
  }
</style>
