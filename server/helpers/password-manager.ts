
import * as bcrypt from 'bcryptjs';

/**
 * パスワードを暗号化、比較するためのユーティルクラス
 */
const PasswordManager = {

  crypt: (password): String => {
    return bcrypt.hashSync(password, 10);
  },

  compare: (plainPass, hashword): Boolean => {
    console.log('パスワードを比較します');
    console.log('bcrypt = ' + bcrypt);
    if (bcrypt) {
      console.log('bcrypt.compareSync = ' + bcrypt.compareSync);
    }
    return bcrypt.compareSync(plainPass, hashword);
  }

};

export { PasswordManager };
