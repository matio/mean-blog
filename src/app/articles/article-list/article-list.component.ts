import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../shared/article.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UserModel } from '../../users/shared/user.model';
import { CommentModel } from '../shared/comment.model';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  providers: [ ArticleService ],
})
export class ArticleListComponent implements OnInit {
  articles: Array<ArticleWithUserModel>;

  constructor(
    private articleService: ArticleService,
    private currentUserService: CurrentUserService,
  ) {
  }

  ngOnInit() {
    this.getArticles();
  }
  onSelect(): void {
  }

  getArticles(): void {
    const withUser = true;

    this.articleService
      .getAll(withUser)
      .subscribe((res: any) => {
        this.articles = res as Array<ArticleWithUserModel>;
      });
  }

  isLogin() {
    return this.currentUserService.getToken();
  }

  user(): UserModel {
    return this.currentUserService.get().user;
  }

  // TODO コメントはプレーンテキスト固定で良いか検討
  createNewComment(item: ArticleWithUserModel) {
    const newComment = new CommentModel();
    newComment.user = this.user()._id;
    newComment.articleId = item.articleId;
    newComment.isMarkdown = false;

    item.newComment = newComment;
  }

  deleteNewComment(item: ArticleWithUserModel) {
    item.newComment = null;
  }

  registerComment(articleId: number, newComment: CommentModel) {
    this.articleService
      .registerComment(articleId, newComment)
      .subscribe(res => {
        this.getArticles();
      });
  }
}
