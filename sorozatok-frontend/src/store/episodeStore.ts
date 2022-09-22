import { $axios } from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";
import { AxiosError } from "axios";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
});

interface IObjectKeys {
  [key: string]: string | Record<string, string | number> | number | undefined;
}

export interface IEpisode extends IObjectKeys {
  _id?: number;
  title?:
    | {
        _id?: number;
        title?: string;
      }
    | number;
  date?: string;
  season?: number;
  episode?: number;
  duration?: number;
  watched?: number;
}

interface IIdParams {
  _id: number | number[];
}

interface IState {
  episodes: Array<IEpisode>;
  episode: IEpisode;
  episodeOld: IEpisode;
}

function ShowErrorWithNotify(error: any): void {
  Loading.hide();
  let msg = `Error on N-side: ${error.response.status} ${error.response.statusText}`;
  if (error.response.data) {
    msg += ` - ${error.response.data}`;
  }
  Notify.create({ message: msg, color: "negative" });
}

function getDifferences(newEpisode: IEpisode, oldEpisode: IEpisode): IEpisode | undefined {
  const diff: IEpisode = {};
  Object.keys(newEpisode).forEach((k: string, i) => {
    if (k == "date") {
      const temp = Object.values(newEpisode)[i] as string;
      if (temp !== (Object.values(oldEpisode)[i] as string)) {
        if (temp !== "") {
          diff[k as keyof IEpisode] = newEpisode.date = temp.split("-").join(".");
        } else {
          diff[k as keyof IEpisode] = "";
        }
      }
      return;
    }
    const newValue = Object.values(newEpisode)[i];
    const oldValue = Object.values(oldEpisode)[i];
    if (newValue != oldValue) diff[k as keyof IEpisode] = newValue;
  });
  if (Object.keys(diff).length == 0) {
    Notify.create({
      message: "Nothing changed!",
      color: "negative",
    });
    Loading.hide();
    return;
  }
  return diff;
}

export const useEpisodeStore = defineStore({
  id: "episodes",
  state: (): IState => ({
    episodes: [],
    episode: {},
    episodeOld: {},
  }),
  getters: {
    getEpisodes(): Array<IEpisode> {
      return this.episodes;
    },
    getEpisode(): IEpisode {
      return this.episode;
    },
  },
  actions: {
    async getAll(): Promise<void> {
      try {
        Loading.show();
        this.episodes = [];
        const res = await $axios.get("episodes");
        Loading.hide();
        if (res && res.data) {
          this.episodes = res.data;
        }
      } catch (error) {
        let errorMessage = "Failed to get episodes!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async getById(id: number): Promise<void> {
      try {
        Loading.show();
        const res = await $axios.get(`episode/${id}`);
        Loading.hide();
        if (res && res.data) {
          this.episode = {
            ...res.data,
            title: (res.data.title! as Record<string, number>)._id!,
            date: res.data.date != null ? res.data.date.split(".").join("-") : null,
          };
          Object.assign(this.episodeOld, this.episode);
        }
      } catch (error) {
        let errorMessage = "Failed to get episode by id!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async getByTitleId(id: number): Promise<void> {
      try {
        Loading.show();
        const res = await $axios.get(`episodes/${id}`);
        Loading.hide();
        if (res && res.data) {
          this.episodes = res.data;
        }
      } catch (error) {
        let errorMessage = "Failed to get episodes by title id!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async editById(): Promise<void> {
      try {
        if (this.episode && this.episode._id) {
          Loading.show();
          const diff = getDifferences(this.episode, this.episodeOld);
          if (diff) {
            const res = await $axios.patch(`episode/${this.episode._id}`, diff);
            Loading.hide();
            if (res && res.data) {
              Notify.create({
                message: `Episode with id=${res.data._id} has been edited successfully!`,
                color: "positive",
              });
            }
          }
        }
      } catch (error) {
        let errorMessage = "Failed to edit episode!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async deleteById(params: IIdParams): Promise<void> {
      try {
        Loading.show();
        const response = await $axios.delete(`episode/${params._id}`);
        Loading.hide();
        if (response.status == 200) {
          Notify.create({
            message: `Episode with id=${params._id} has been deleted successfully!`,
            color: "positive",
          });
        }
      } catch (error) {
        let errorMessage = "Failed to delete episode!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async create(titleID: number): Promise<void> {
      try {
        if (this.episode) {
          Loading.show();
          const res = await $axios.post("episode", {
            ...this.episode,
            title: titleID,
            date: this.episode.date!.split("-").join("."),
          });
          Loading.hide();
          if (res && res.data) {
            // this.getAll();
            this.episode._id = res.data._id!;
            Notify.create({
              message: `New document with id=${res.data._id} has been saved successfully!`,
              color: "positive",
            });
          }
        }
      } catch (error) {
        let errorMessage = "Failed to create episode!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
  },
});
