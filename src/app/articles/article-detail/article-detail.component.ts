import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';

import { Constant } from '../../shared/constant';
import {
  ArticleService,
  AuthenticationService,
  MarkdownParseService,
  MessageBarService,
} from '../../shared/services';
import { ConfirmDialogComponent } from '../../shared/components';
import {
  ArticleWithUserModel,
  UserModel,
} from '../../shared/models';
import * as fromArticle from '../../state';

import { CommentListComponent } from '../comment-list/comment-list.component';
import { Store } from '@ngrx/store';
import { SetTitle } from '../../state/app.actions';
import { DeleteArticle, DeleteArticleFail } from '../../state/article.actions';
import { Actions, ofType } from '@ngrx/effects';
import { DraftActionTypes } from '../../drafts/state/draft.actions';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  public article: ArticleWithUserModel;
  public text: string;
  public showToc: Observable<Boolean> = of(false);
  public toc: string;
  public baseUrl: string;

  // HTMLでコメント件数を参照する用
  @ViewChild(CommentListComponent) commentListComponent: CommentListComponent;
  @ViewChildren('markdownText') markdownTexts: QueryList<ElementRef>;
  private onDestroy = new Subject();
  private activeIndex: number | null = null;

  constructor(
    private store: Store<fromArticle.State>,
    private actions$: Actions,
    public auth: AuthenticationService,

    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private markdownParseService: MarkdownParseService,
    private articleService: ArticleService,
  ) {
    // エラーメッセージ表示処理を登録
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<DeleteArticleFail>(DraftActionTypes.DeleteDraftFail),
      tap(action => this.messageBarService.showValidationError(action.payload.error))
    ).subscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(new SetTitle({title: '記事詳細'}));
    this.getArticle();
  }

  // markdonwテキストが初期化時に
  // ハッシュタグで指定したタグまでスクロールする
  ngAfterViewInit(): void {
    this.showToc = this.markdownTexts.changes
      .pipe(
        takeUntil(this.onDestroy),
        map((change: any) => !!change)
      );
  }


  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }


  private getArticle(): void {
    this.route.params.subscribe( params => {
      const userId = params['userId'];
      const _idOfArticle = params['_id'];
      const withUser = true;
      this.articleService.getById(_idOfArticle, withUser)
      .subscribe( (article: ArticleWithUserModel) => {

        if (userId !== article.author.userId) {
          this.router.navigate(['/', article.author.userId, 'articles', article._id]);
        }

        this.article = article as ArticleWithUserModel;
        if (this.article.isMarkdown) {
          this.baseUrl = `/${article.author.userId}/articles/${article._id}`;
          const parsed = this.markdownParseService.parse(this.article.body, this.baseUrl);
          this.text = parsed.text;
          this.toc = parsed.toc;
        } else {
          this.text = this.article.body;
        }

      });
    });
  }

  private deleteArticle(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '記事削除',
        message: `記事を削除しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.store.dispatch(new DeleteArticle({
        id: this.article._id
      }));
    });

  }

  private registerVote(): void {
    this.articleService
      .registerVote(this.article._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねしました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);

        const withUser = true;
        this.articleService.getVote(this.article._id, withUser)
          .subscribe((vote: UserModel[]) => {
            this.article.vote = vote;
          });
      }, this.messageBarService.showValidationError.bind(this.messageBarService));
  }

  private deleteVote(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'いいね取り消し',
        message: `いいねを取り消しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }


      this.articleService
      .deleteVote(this.article._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねを取り消しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);

        const withUser = true;
        this.articleService.getVote(this.article._id, withUser)
        .subscribe( (vote: UserModel[]) => {
          this.article.vote = vote;
        });
      }, this.messageBarService.showValidationError.bind(this.messageBarService));
    });
  }

  private isMine(article: ArticleWithUserModel) {
    if (!article) {
      return false;
    }

    if (!this.auth.isLogin()) {
      return false;
    }

    return this.auth.loginUser.userId === article.author.userId;
  }

  private containMineVote(votes: Array<UserModel>): boolean {
    if (!votes) {
      return false;
    }

    if (!this.auth.isLogin()) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return votes.some(v => _idOfMine === v._id);
  }
}
