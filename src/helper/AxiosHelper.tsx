import axios, { AxiosInstance } from "axios";
import StorageHelper from "./StorageHelper";

export default class AxiosHelper {
  private axios: AxiosInstance;
  private storageHelper: StorageHelper;
  constructor(url: string | undefined) {
    this.axios = axios.create({
      baseURL: url,
    });
    this.storageHelper = new StorageHelper(localStorage);
  }
  getAxios() {
    this.axios.interceptors.request.use(
      async (config) => {
        try {
          const token = this.storageHelper.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.axios.interceptors.response.use(
      async (response) => {
        try {
          return response;
        } catch (error) {
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    return this.axios;
  }
}
