import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ArticleModel } from './article.model';
import { CommentModel } from './comment.model';
import { JwtService } from '../../shared/services/jwt.service';


@Injectable()
export class ArticleService {
  private baseUrl = '/api/articles';
  private commentUrl = '/api/comments';

  constructor(
    private http: Http,
    private jwtService: JwtService
  ) {}

  get(condition: Object, withUser: Boolean = false): Observable<any> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
        .get(URL, { headers, search })
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getOne(articleId: number, withUser: Boolean = false): Observable<any> {
    const URL = `${this.baseUrl}/${articleId}`;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
        .get(URL, { headers, search })
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  update(article: ArticleModel): Observable<any> {
    const URL = `${this.baseUrl}/${article.articleId}`;

    return this.http
      .put(URL, article, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  register(article: ArticleModel): Observable<any> {
    const URL = this.baseUrl;

    return this.http
      .post(URL, article, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }


  delete(articleId: number): Observable<any> {
    const URL = `${this.baseUrl}/${articleId}`;

    return this.http
        .delete(URL, this.jwtService.getRequestOptions())
        .map((response: Response) => {
          const result = response.json();
          return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }


  getComment(condition: Object, withUser: Boolean = false): Observable<any> {
    const URL = this.commentUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));
    if (withUser) {
      search.set('withUser', `true`);
    }

    return this.http
      .get(URL, { headers, search })
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  registerComment(comment: CommentModel): Observable<any> {
    const URL = this.commentUrl;

    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .post(URL, comment, options)
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  // 必ず差分更新とする
  updateComment(comment: CommentModel): Observable<any> {
    const URL = `${this.commentUrl}/${comment._id}`;
    const options = {
      'Content-Type': 'application/x-www-form-urlencoded',
      headers: this.jwtService.getHeaders()
    };

    return this.http
      .put(URL, {$set: comment}, options)
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  deleteComment(commentId: String): Observable<any> {
    const URL = `${this.commentUrl}/${commentId}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => {
        const result = response.json();
        return result;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

}
