import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../shared/db/models/User';

export class UserService {
  public async signUp(username: string, password: string, email: string) {
    const hashedPw = await bcrypt.hash(password, 10);
    return await getRepository(User)
      .insert({ username, password: hashedPw, email })
      .then(result => (result ? 'Signed up successful!' : 'Something went wrong!'))
      .catch(e => e);
  }

  public async login(username: string, password: string) {
    return await getRepository(User)
      .findOne({ username })
      .then(async result => {
        if (result) {
          const passMatch = await bcrypt.compare(password, result.password);
          if (passMatch) {
            return 'Success!';
          } else {
            return 'Password is incorrect. Please try again!';
          }
        } else {
          return 'Unable to find username!';
        }
      })
      .catch(e => e);
  }
}
