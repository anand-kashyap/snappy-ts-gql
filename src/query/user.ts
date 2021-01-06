import { User } from '../models/user';
const users = () => {
  return User.find({});
};

export { users };
