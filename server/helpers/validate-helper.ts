
import { Draft } from '../models/draft';
import { User } from '../models/user';
import { Article } from '../models/article';
import { SearchCondition } from '../models/search-condition';

class Validation {
  isDate(str: string): boolean {
    return !isNaN(Date.parse(str));
  }

  isExistedUser(_id: String): Promise<boolean> {
    return User
      .findOne({ _id: _id, deleted: { $exists : false }})
      .exec()
      .then(target => {
        if (target) {
          // チェックOK
          return Promise.resolve(true);
        }
        return Promise.reject(false);
      }).catch(err => Promise.reject(false));
  }

  isUniqueUserIdList(_ids: String[]): boolean {
    if (!_ids || _ids.length === 0) {
      return true;
    }

    const unique = _ids.filter((value, index, self) => self.indexOf(value) === index);

    return unique.length === _ids.length;
  }

  isExistedUserAll(_ids: String[] ): Promise<boolean> {
    if (!_ids || _ids.length === 0) {
      return Promise.resolve(true);
    }

    return User
      .find({ _id: {$in: _ids}, deleted: { $exists : false }})
      .exec()
      .then(target => {
        if (!target || target.length !== _ids.length) {
          return Promise.reject(false);
        }

        for (const user of target) {
          if (_ids.indexOf(user._id.toString()) === -1) {
            return Promise.reject(false);
          }
        }

        return Promise.resolve(true);
      }).catch(err => Promise.reject(false));
  }

  isExistedArticle(_id: String): Promise<boolean> {
    return Article
      .findOne({ _id: _id, deleted: { $exists : false }})
      .exec()
      .then(target => {
        if (target) {
          // チェックOK
          return Promise.resolve(true);
        }
        return Promise.reject(false);
      }).catch(err => Promise.reject(false));
  }

  isExistedVote(_idOfVorter: String, {req}): Promise<boolean> {
    return Article
    .findOne({ _id: req.params._id, deleted: { $exists : false }})
    .exec()
    .then(target => {
      if (target && target.vote && target.vote.length > 0 && target.vote.indexOf(_idOfVorter) !== -1) {
        // チェックOK
        return Promise.resolve(true);
      }
      return Promise.reject(false);
    }).catch(err => Promise.reject(false));
  }

  // 投稿済み記事の下書きの場合、記事投稿者と下書き投稿者が一致するか
  isArticleAuthorEqualsAuthor(_id: String, {req}): Promise<boolean> {
    if (req.body.posted !== true) {
      return Promise.resolve(true);
    }

    return Article
      .findOne({ _id: _id, deleted: { $exists : false }})
      .exec()
      .then(target => {
        if (target && target.author.toString() === req.body.author) {
          return Promise.resolve(true);
      }
        return Promise.reject(false);
      }).catch(err => Promise.reject(false));
  }

  isExistedDraft(_id: String): Promise<boolean> {
    return Draft
      .findOne({ _id: _id}) // 論理削除はないので単純に_id検索
      .exec()
      .then(target => {
        if (target) {
          // チェックOK
          return Promise.resolve(true);
        }
        return Promise.reject(false);
      }).catch(err => Promise.reject(false));
  }

  isExistedSearchCondition(_id: String): Promise<boolean> {
    return SearchCondition
      .findOne({ _id: _id}) // 論理削除はないので単純に_id検索
      .exec()
      .then(target => {
        if (target) {
          // チェックOK
          return Promise.resolve(true);
        }
        return Promise.reject(false);
      }).catch(err => Promise.reject(false));
  }
}

const MESSAGE_KEY = {
  default: 'エラーが発生しました',
  required: '{0}を入力してください',
  minlength: '{0}は{1}桁以上にしてください',
  maxlength: '{0}は{1}桁以下にしてください',
  passwordMatch: 'パスワードと確認用パスワードが一致しません',
  pattern_date: '{0}は日付形式にしてください',
  date_range: '{0}は{1}以降を指定してください',
  pattern: '{0}は{1}にしてください',
  pattern_hankakueisuji: '{0}は半角英数字で入力してください',
  pattern_password: '{0}は半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下にしてください',
  pattern_email: '{0}はメール形式で入力してください',
  cannot_allow_change: '{0}は変更できません',
  allready_existed: '指定した{0}は既に存在しています',
  allready_deleted: '指定した{0}は既に削除されています',
  not_existed: '指定した{0}は存在しません',
  not_unique: '指定した{0}は重複が存在します',
  different: '{0}と{1}が一致しません',
  login_error: 'ユーザIDかパスワードが正しくありません'
};

class ValidateHelper {
  PATTERN = {
    HANKAKUEISU: /^[a-zA-Z\d]*$/,
    PASSWORD: /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i
  };

  MESSAGE_KEY = MESSAGE_KEY;

  validation = new Validation();

  message(validationName: string, replacements: Array<string> = []): string {
    let messageTemplate = this.MESSAGE_KEY[validationName] || validationName;

    if (!replacements || replacements.length === 0) {
      return messageTemplate;
    }

    replacements.forEach((replacement, index) => {
      messageTemplate = messageTemplate.replace('{' + index + '}', replacement);
    });

    return messageTemplate;
  }
}

export const validateHelper = new ValidateHelper();
