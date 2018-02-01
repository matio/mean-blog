import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders,  } from '@angular/common/http';

import { LocalStorageService, KEY } from './local-storage.service';

/**
 * 認証が必要なサーバリクエストのリクエストヘッダーを生成する
 */
@Injectable()
export class JwtService {

  constructor(
    private localStorageService: LocalStorageService
  ) {}

  getHeaders(): HttpHeaders {
    if (!this.localStorageService.has(KEY.TOKEN)) {
      return;
    }

    return new HttpHeaders({
      'x-access-token': this.localStorageService.get(KEY.TOKEN)
    });
  }

  getRequestOptions(): {headers: HttpHeaders} {
    if (!this.localStorageService.has(KEY.TOKEN)) {
      return;
    }

    return { headers: this.getHeaders() };
  }
}
