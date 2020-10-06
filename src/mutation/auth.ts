import { ApolloError } from 'apollo-server';
import { compare } from 'bcrypt';
import { StatusCodes as codes } from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import { User } from '../models/user';

const authenticate = async (_parent, args, context) => {
  const { email, password: pass } = args;
  const user = await User.findOne({ email })
    .lean()
    .catch((e) => {
      throw new Error(`${e.message}: ${codes.INTERNAL_SERVER_ERROR}`);
    });
  if (!user) {
    throw new ApolloError('User not found', `${codes.NOT_FOUND}`);
  }
  const { name, password } = user;
  const match = await compare(pass, password);

  if (!match) {
    throw new ApolloError('Incorrect password', `${codes.UNAUTHORIZED}`);
  }

  const token = sign({ name }, process.env.JWT_SALT, { expiresIn: '2d' });
  return token;
};

export { authenticate };
