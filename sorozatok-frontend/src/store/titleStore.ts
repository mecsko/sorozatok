import { $axios } from "./axios.instance";
import { AxiosError } from "axios";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";
import { IEpisode } from "./episodeStore";

Notify.setDefaults({
  position: "bottom",
  textColor: "yellow",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
});

interface IObjectKeys {
  [key: string]: number | string | IEpisode[] | undefined;
}

export interface ITitle extends IObjectKeys {
  _id?: number;
  title?: string;
  img?: string;
  episodes?: IEpisode[];
}

interface IState {
  titles: Array<ITitle>; // store documents (records) after get method
  title: ITitle;
  titleOld: ITitle;
  numberOfTitles: number;
}

interface IPaginatedParams {
  offset: number;
  limit: string;
  order: string;
  sort: string;
  keyword?: string;
}

function ShowErrorWithNotify(error: any): void {
  Loading.hide();
  let msg = `Error with title: ${error.response.status} ${error.response.statusText}`;
  if (error.response.data) {
    msg += ` - ${error.response.data}`;
  }
  Notify.create({ message: msg, color: "negative" });
}

function getDifferences(newTitle: ITitle, oldTitle: ITitle): ITitle | undefined {
  const diff: ITitle = {};
  Object.keys(newTitle).forEach((k: string, i) => {
    if (k === "episodes") {
      return;
    }
    if (k === "img") {
      const temp = Object.values(newTitle)[i] as string;
      if (temp !== (Object.values(oldTitle)[i] as string)) {
        diff[k as keyof ITitle] = newTitle.img = validateImage(temp);
      }
      return;
    }
    const newValue = Object.values(newTitle)[i];
    const oldValue = Object.values(oldTitle)[i];
    if (newValue != oldValue) diff[k as keyof ITitle] = newValue;
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

function validateImage(image: string): string {
  if (image === "" || !image) {
    image =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
  }
  return image;
}

export const useTitleStore = defineStore({
  id: "titles",
  state: (): IState => ({
    titles: [],
    title: {},
    titleOld: {},
    numberOfTitles: 0,
  }),
  getters: {
    getNumberOfTitles(): number {
      return this.numberOfTitles;
    },
  },
  actions: {
    async getAll(): Promise<void> {
      try {
        Loading.show();
        this.titles = [];
        const res = await $axios.get("titles");
        Loading.hide();
        if (res && res.data) {
          this.titles = res.data;
          this.numberOfTitles = res.data.length;
        }
      } catch (error) {
        let errorMessage = "Failed to get titles!";
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
        const res = await $axios.get(`title/${id}`);
        Loading.hide();
        if (res && res.data) {
          this.title = res.data;
          Object.assign(this.titleOld, this.title);
        }
      } catch (error) {
        let errorMessage = "Failed to get title!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async editById(): Promise<void> {
      try {
        if (this.title && this.title._id) {
          Loading.show();
          const diff = getDifferences(this.title, this.titleOld);
          if (diff) {
            const res = await $axios.patch(`title/${this.title._id}`, diff);
            Loading.hide();
            if (res && res.data) {
              Notify.create({
                message: `Title with id=${res.data._id} has been edited successfully!`,
                color: "positive",
              });
            }
          }
        }
      } catch (error) {
        let errorMessage = "Failed to edit title!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async fetchPaginatedTitles(params: IPaginatedParams): Promise<void> {
      try {
        Loading.show();
        const res = await $axios.get(
          `title/${params.offset}/${params.limit}/${params.order}/${params.sort}/${params.keyword}`
        );
        if (res && res.data) {
          Loading.hide();
          this.titles = res.data.titles;
          this.numberOfTitles = res.data.count;
        }
      } catch (error) {
        let errorMessage = "Failed to get titles with pagination!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async create(): Promise<void> {
      try {
        if (this.title) {
          Loading.show();
          this.title.episodes = [];
          const res = await $axios.post("title", {
            ...this.title,
            img: validateImage(this.title.img!),
          });
          Loading.hide();
          Notify.create({
            message: `New document with id=${res.data._id} has been saved successfully!`,
            color: "positive",
          });
        }
      } catch (error) {
        let errorMessage = "Failed to create title!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
    async deleteById(id: number): Promise<void> {
      try {
        Loading.show();
        const response = await $axios.delete(`title/${id}`);
        if (response.status == 200) {
          Loading.hide();
          Notify.create({
            message: `Title with id=${id} has been deleted successfully!`,
            color: "positive",
          });
        }
      } catch (error) {
        let errorMessage = "Failed to delete title!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        Loading.hide();
        ShowErrorWithNotify(errorMessage);
      }
    },
  },
});
