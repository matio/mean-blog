import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Constant } from '../../shared/constant';
import { JwtService } from '../../shared/services/jwt.service';

import { ArticleModel } from './article.model';
import { ArticleWithUserModel } from './article-with-user.model';
import { CommentModel } from './comment.model';


@Injectable()
export class ArticleService {
  private Constant = Constant;
  private baseUrl = '/api/articles';
  private commentUrl = '/api/comments';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  /**
   * 複数件取得
   *
   * @param condition 検索条件
   * @param paginOptions ページング条件
   * @param withUser ユーザ情報を検索結果に付与するか
   */
  get(condition: Object, paginOptions: {skip?: number, limit?: number, sort?: Object}, withUser: boolean = false): Observable<{count: number, articles: Array<ArticleModel | ArticleWithUserModel>}> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();

    let params = new HttpParams()
      .set('condition', JSON.stringify(Object.assign({}, condition, paginOptions)));

    if (withUser) {
      params = params.set('withUser', 'true');
    }

    return this.http.get<{count: number, articles: Array<ArticleModel | ArticleWithUserModel>}>(URL, { headers, params });
  }

  // １件取得
  getById(_id: string, withUser: Boolean = false): Observable<ArticleModel | ArticleWithUserModel> {
    const URL = `${this.baseUrl}/${_id}`;
    const headers = this.jwtService.getHeaders();
    const params = new HttpParams().set('withUser', withUser ? 'true' : null);

    return this.http.get<ArticleModel | ArticleWithUserModel>(URL, { headers, params });
  }

  // 更新
  update(article: ArticleModel): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${article._id}`;

    return this.http.put<ArticleModel>(URL, article, this.jwtService.getRequestOptions());
  }

  // 登録
  register(article: ArticleModel): Observable<ArticleModel> {
    const URL = this.baseUrl;

    return this.http.post<ArticleModel>(URL, article, this.jwtService.getRequestOptions());
  }

  // 削除
  delete(_id: string): Observable<ArticleModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<ArticleModel>(URL, this.jwtService.getRequestOptions());
  }


  /* いいね */

  // 登録
  registerVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http.post(URL, {'voter': _idOfUser}, this.jwtService.getRequestOptions());
  }

  // 削除
  deleteVote(_idOfArticle: string, _idOfUser: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote/${_idOfUser}`;

    return this.http.delete(URL, this.jwtService.getRequestOptions());
  }

  // １件取得
  getVoteOne(_idOfArticle: string): Observable<any> {
    const URL = `${this.baseUrl}/${_idOfArticle}/vote`;

    return this.http.get(URL, this.jwtService.getRequestOptions());
  }
}
