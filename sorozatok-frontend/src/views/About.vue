<script setup lang="ts"></script>

<template>
  <q-page>
    <div class="column flex-center">
      <div class="q-pa-xl" :class="$q.dark.isActive ? 'bg-grey-9 shadow-5' : 'bg-grey-3 shadow-10'">
        <h5>Informatika emelt szint</h5>
        <h5>2020. október 28.</h5>
        <h5>Sorozatok feladat megoldása</h5>
        <h6>Linkek:</h6>
        <q-list bordered style="width: 300px">
          <q-item
            clickable
            href="https://www.oktatas.hu/bin/content/dload/erettsegi/feladatok_2020osz_emelt/e_inf_20okt_fl.pdf"
            target="_blank"
          >
            <q-item-section class="text-center text-overline text-weight-bold">
              Feladat pdf
            </q-item-section>
          </q-item>
          <q-item
            clickable
            href="https://www.oktatas.hu/bin/content/dload/erettsegi/feladatok_2020osz_emelt/e_inf_20okt_ut.pdf"
            target="_blank"
          >
            <q-item-section class="text-center text-overline text-weight-bold">
              Javítás pdf
            </q-item-section>
          </q-item>
          <q-item
            clickable
            href="https://www.oktatas.hu/bin/content/dload/erettsegi/feladatok_2020osz_emelt/e_inffor_20okt_fl.zip"
          >
            <q-item-section class="text-center text-overline text-weight-bold">
              Feladatok zip
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
  h5 {
    margin-bottom: 0;
  }
</style>
