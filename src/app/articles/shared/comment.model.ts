export class CommentModel {
  _id: string;
  // 元記事の_id
  articleId: string;
  text: string;
  // コメントしたユーザの_id
  user: string;
  created: string;
  update: string;
  deleted: string;
}
