import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { stringify } from 'qs';

@Injectable()
export class RequestService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.API_BASE_URL,
      responseType: 'json',
    });
  }

  get = async (path: string, locale: any = 'en', params: Object = {}): Promise<AxiosPromise> => {
    return await this.axios
      .get(path, {
        params,
        paramsSerializer: (params) => stringify(params),
      })
      .then((res: AxiosResponse) => res.data);
  };

  patch = async (path: string, body: any): Promise<AxiosPromise> =>
    this.axios.patch(path, body).then((res: AxiosResponse) => res.data);

  post = async (path: string, body: any = {}, params: Object = {}): Promise<AxiosPromise> => {
    return this.axios
      .post(path, body, {
        params,
        method: 'post',
        paramsSerializer: (params) => stringify(params),
      })
      .then((res: AxiosResponse) => res.data);
  };

  delete = async (path: string): Promise<AxiosPromise> =>
    this.axios.delete(path).then((res: AxiosResponse) => res.data);
}
