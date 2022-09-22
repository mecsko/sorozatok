<script setup lang="ts">
    import { useEpisodeStore, IEpisode } from "../store/episodeStore";
    import { useTitleStore } from "../store/titleStore";
    import TxtWritter from "../components/TxtWriter.vue";

    const episodeStore = useEpisodeStore();
    const titleStore = useTitleStore();
    const weekDays = ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"];
    const episodesByWeekDays = (): { [index: string]: Set<string> } => {
        const months = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        let temp: { [index: string]: Set<string> } = {};
        weekDays.forEach((day) => (temp[day] = new Set()));
        for (const episode of episodeStore.episodes) {
            if (episode.date !== "") {
                const [, month, day] = episode.date!.split(".");
                let year = parseInt(episode.date!.split(".")[0]);
                if (parseInt(month) < 3) {
                    year -= 1;
                }
                const weekDay =
                    weekDays[
                        Math.floor(
                            (year +
                                year / 4 -
                                year / 100 +
                                year / 400 +
                                months[parseInt(month) - 1] +
                                parseInt(day)) %
                                7
                        )
                    ];
                temp[weekDay].add((episode.title! as Record<string, string>).title!);
            }
        }
        return temp;
    };

    let selectedDate = ref("2017.10.18");
    let selectedWeekDay = ref(weekDays[3]);

    function getReleasedates(): string[] {
        let temp: Set<string> = new Set();
        for (const episode of episodeStore.episodes) {
            if (episode.date != null) {
                temp.add(episode.date ?? "");
            }
        }
        return Array.from(temp).sort((a, b) => (a > b ? 1 : -1));
    };

    function allEpisodeWithDate() {
        let counter = 0;
        for (const e of episodeStore.episodes) {
            if (e.date != null) {
                counter++;
            }
        }
        return counter;
    };

    function watchedEpisodes() {
        let counter = 0;
        for (const e of episodeStore.episodes) {
            if (e.watched === 1) {
                counter++;
            }
        }
        return ((counter / episodeStore.episodes.length) * 100).toFixed(2);
    };

    function watchingTime() {
        let time = 0;
        for (const e of episodeStore.episodes) {
            if (e.watched === 1) {
                time += e.duration || 0;
            }
        }
        const day = Math.floor(time / (24 * 60)),
            hour = Math.floor((time - day * 24 * 60) / 60),
            minute = time % 60;
        return [day, hour, minute];
    };

    function getEpisodesByDate(date: string) {
        return episodeStore.episodes.filter((ep: IEpisode) => {
            if (ep.date && date && ep.watched === 0 && ep.date <= date) {
                return ep;
            }
        })
    }

    function getTitlesScreenTimeAndSumOfEp() {
        interface TitleArr {
            id: number;
            title: string;
            time?: number;
            ep?: number;
        }
        const titles = titleStore.titles;
        const titleArr: TitleArr[] = [];
        titles.forEach((title) => {
            titleArr.push({
                id: title._id!,
                title: title.title!,
                time: 0,
                ep: title.episodes!.length,
            });
        });
        for (let t = 0; t < titles.length; t++) {
            let count = 0;
            for (let e = 0; e < titles[t].episodes!.length; e++) {
                count += titles![t].episodes![e]!.duration!;
            }
            titleArr[t].time = count;
        }
        return titleArr;
    }

    function summa(): string {
        let txt = "";
        for (const title of getTitlesScreenTimeAndSumOfEp()) {
            txt += `${ title.title } ${ title.time } ${ title.ep }\n`
        }
        return txt.slice(0, -1);
    }

    function lista(): string {
        let txt = "";
        for (const title of titleStore.titles) {
            for (const episode of title.episodes!) {
                txt += `${episode.date != "" ? episode.date : "NI"}\n${title.title}\n${episode.season}x${episode.episode! < 10 ? "0" + episode.episode : episode.episode}\n${episode.duration}\n${episode.watched}\n`;
            }
        }
        return txt.slice(0, -1);
    }

    onMounted(() => {
        episodeStore.getAll();
        titleStore.getAll();
    });
</script>
<template>
    <q-page>
        <div class="row justify-center">
            <div class="q-pa-md col-12 col-sm-8 col-md-6 col-lg-4" :class="$q.dark.isActive ? 'bg-grey-9 shadow-5' : 'bg-grey-3 shadow-10'">
                <div class="text-h4 text-center q-py-md">Sorozatok feladat megoldása</div>
                <div>
                    <p>2. feladat</p>
                    <div class="task">
                        <p class="solution">
                            A listában {{ allEpisodeWithDate() }} db vetítési dátummal rendelkező epizód
                            van.
                        </p>
                    </div>
                </div>
                <div>
                    <p>3. feladat</p>
                    <div class="task">
                        <p class="solution">A listában lévő epizódok {{ watchedEpisodes() }}%-át látta.</p>
                    </div>
                </div>
                <div>
                    <p>4. feladat</p>
                    <div class="task">
                        <p class="solution">
                            Sorozatnézéssel {{ watchingTime()[0] }} napot {{ watchingTime()[1] }} órát és
                            {{ watchingTime()[2] }} percet töltött.
                        </p>
                    </div>
                </div>
                <div>
                    <p>5. feladat</p>
                    <div class="task">
                        <div class="flex justify-between">
                            <span>Adjon meg egy dátumot!</span>
                            <q-select
                                v-model="selectedDate"
                                :dense="true"
                                label="Dátum"
                                option-label="date"
                                :options="getReleasedates()"
                                outlined
                                square
                            >
                                <template #prepend>
                                    <q-icon name="event" />
                                </template>
                            </q-select>
                        </div>
                        <div v-for="ep in getEpisodesByDate(selectedDate)" :key="ep._id" class="feladat">
                            <span class="solution">
                            {{ep.season}}x{{ (ep.episode!).toString().length > 1 ? ep.episode : "0" + ep.episode }}
                                {{ (ep.title! as Record<string, string>).title! }}
                                <!-- eslint-disable-next-line prettier/prettier -->
                                </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="flex justify-between items-center">6. feladat
                        <TxtWritter
                            :content="summa()"
                            filename="summa.txt"
                            title="summa.txt letöltése"
                        />
                    </p>
                    
                    <q-expansion-item
                        class="solution"
                        expand-separator
                        label="summa.txt"
                    >
                        <div
                            v-for="title in getTitlesScreenTimeAndSumOfEp()"
                            :key="title.id"
                            class="solution"
                        >
                            <code>{{ title.title }} {{ title.time }} {{ title.ep }}</code>
                        </div>
                    </q-expansion-item>
                </div>
                <div>
                <p>7. feladat</p>
                <div class="task">
                    <div class="flex justify-between">
                        <span>Adja meg a hét egy napját:</span>
                        <q-select
                            v-model="selectedWeekDay"
                            class="q-mx-lg"
                            :dense="true"
                            label="Nap"
                            :options="weekDays"
                            outlined
                            square
                        />
                    </div>
                    <div v-if="episodesByWeekDays()[selectedWeekDay].size > 0">
                        <div
                            v-for="title in episodesByWeekDays()[selectedWeekDay]"
                            :key="title"
                            class="solution"
                        >
                            <p>{{ title }}</p>
                        </div>
                    </div>
                    <p v-else class="solution">Az adott napon nem kerül adásba sorozat.</p>
                </div>
                </div>
                <TxtWritter
                    :content="lista()"
                    filename="lista.txt"
                    style="margin-top: 20px; width: 100%;"
                    title="lista.txt írása a NoSQL adatbázisból"
                />
            </div>
        </div>
    </q-page>
</template>

<style scoped>
    p {
        margin-bottom: 1px;
    }
    .task {
        margin-bottom: 10px;
        margin-left: 10px;
        max-width: 100%;
    }
    .solution {
        margin-left: 10px;
        margin-bottom: 0;
    }
</style>
