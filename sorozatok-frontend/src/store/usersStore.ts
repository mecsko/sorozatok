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

export interface IUser {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

interface IState {
  loggedUser: null | IUser;
}

export const useUsersStore = defineStore({
  id: "usersStore",
  state: (): IState => ({
    loggedUser: null,
  }),
  getters: {
    getLoggedUser(): null | IUser {
      return this.loggedUser;
    },
  },
  actions: {
    async loginUser(usernameOrEmail: string, password: string): Promise<void> {
      try {
        Loading.show();
        const res = await $axios.post("auth/login", {
          usernameOrEmail: usernameOrEmail,
          password: password,
        });
        if (res && res.data) {
          this.loggedUser = res.data;
          Loading.hide();
          Notify.create({
            message: `${res.data.name} is logged in`,
            color: "positive",
          });
        }
      } catch (error) {
        let errorMessage = "Error on Authentication!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        this.loggedUser = null;
        Loading.hide();
        Notify.create({ message: errorMessage, color: "negative" });
      }
    },
    async registration(user: IUser): Promise<void> {
      try {
        Loading.show();
        const res = await $axios.post("auth/register", user);
        if (res && res.data) {
          this.loggedUser = res.data;
          Loading.hide();
          Notify.create({
            message: `Successfully registrated`,
            color: "positive",
          });
        }
      } catch (error) {
        let errorMessage = "Error on Registration!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        this.loggedUser = null;
        Loading.hide();
        Notify.create({ message: errorMessage, color: "negative" });
      }
    },
    async logOut(): Promise<void> {
      try {
        Loading.show();
        const res = await $axios.post("auth/logout");
        Loading.hide();
        if (res) {
          this.loggedUser = null;
          Loading.hide();
          Notify.create({
            message: "Successful logout",
            color: "positive",
          });
        }
      } catch (error) {
        let errorMessage = "Error on log out!";
        if (error instanceof AxiosError) {
          errorMessage = error.message;
        }
        this.loggedUser = null;
        Loading.hide();
        Notify.create({ message: errorMessage, color: "negative" });
      }
    },
  },
});
