import { ApolloError } from 'apollo-server';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from 'src/models/user';

const authenticate = async (_parent, args, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { email, password: pass } = args;
  const user = await User.findOne({ email })
    .lean()
    .catch((e) => {
      throw new Error(`${e.message}: 500`);
    });
  if (!user) {
    throw new ApolloError('User not found', '400');
  }
  const { name, password } = user;
  const match = await compare(pass, password);

  if (!match) {
    throw new ApolloError('Incorrect password', '401');
  }

  const token = sign({ name }, process.env.JWT_SALT, { expiresIn: '2d' });
  return token;
};

export { authenticate };
