import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { CommentModel } from '../shared/comment.model';
import { CommentWithUserModel } from '../shared/comment-with-user.model';
import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  providers: [ ArticleService ]
})
export class CommentListComponent implements OnInit {
  @Input() replyCommentIndentMargin: Number = 42;
  @Input() replyCommentIndentLimit: Number = 4;
  @Input() _idOfArticle: string;
  @Input() comments: Array<CommentWithUserModel>;

  constructor(
    public auth: AuthenticationService,
    private articleService: ArticleService,
    private commentService: CommentService,
  ) {
  }

  ngOnInit(): void {
    if (!this._idOfArticle) {
      throw new Error(`Attribute '_idOfArticle' is required`);
    }

    if (!this.comments) {
      this.refreshComments();
    }
  }


  refreshComments(): void {
    const withUser = true;
    this.commentService
      .getOfArticle(this._idOfArticle, withUser)
      .subscribe(comments => {
        this.comments = comments as Array<CommentWithUserModel>;
      });
  }


  commentOfForm(commentWithUserModel: CommentWithUserModel = null, parentId: string = null): CommentModel {
    // 追加の場合
    if (commentWithUserModel === null) {
      const newComment = new CommentModel();
      newComment.user = this.auth.loginUser._id;
      newComment.articleId = this._idOfArticle;
      newComment.parentId = parentId;
      return newComment;
    }

    // 更新の場合（差分更新なので必要なのは_idとテキスト情報のみ）
    const commentModel = new CommentModel();
    commentModel._id = commentWithUserModel._id;
    commentModel.text = commentWithUserModel.text;
    commentModel.created = commentWithUserModel.created;
    return commentModel;
  }

  calcMarginOfComment(depth: number): number {
    const d: number = depth > 4 ? 4 : depth;
    return d * 24;
  }


  deleteComment(commentId: String): void {
    this.articleService
      .deleteComment(commentId)
      .subscribe(res => {
        this.refreshComments();
      });
  }
}
