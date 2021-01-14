import { expect } from 'chai';
import { request } from './base.spec';

describe('Users', () => {
  describe('Mutations', () => {
    describe('Register', () => {
      it('should create User on valid param values', (done) => {
        const email = 'test3@test.com',
          name = 'Test person',
          pass = 'test@person';
        request()
          .send({
            query: `mutation {
                register(name: "${name}", email: "${email}", password: "${pass}") {
                  _id
                }
            }`,
          })
          .then(async (res) => {
            const { data } = res.body;
            expect(data).to.exist;
            expect(data?.register?._id).to.exist;
          })
          .then(done)
          .catch(done);
      });
      xit('should throw error - "Email exists already" if User email already exists', (done) => {});
    });

    describe('Authenticate', () => {
      it('should login on correct credentials', (done) => {
        const email = 'test3@test.com',
          pass = 'test@person';
        request()
          .send({
            query: `mutation {
                authenticate(email: "${email}", password: "${pass}")
            }`,
          })
          .then((res) => {
            const { data, errors } = res.body;

            expect(errors).to.not.exist;
            expect(data).to.exist;

            const { authenticate } = data;
            expect(authenticate).to.be.a('string').with.length.gte(0);

            done();
          })
          .catch(done);
      });
      it('should throw error - "Incorrect Password" on incorrect password', (done) => {
        const email = 'test3@test.com',
          pass = 'wrongpass';
        request()
          .send({
            query: `mutation {
                authenticate(email: "${email}", password: "${pass}")
            }`,
          })
          .then((res) => {
            const { data, errors } = res.body;

            expect(data?.authenticate).to.not.exist;

            expect(errors).to.be.a('array').with.lengthOf(1);
            const [err] = errors;
            expect(err.message).to.be.eql('Incorrect password');
            done();
          })
          .catch(done);
      });
      it('should throw error - "User not found" on incorrect email', (done) => {
        const email = 'ak@random.biz',
          pass = 'wrongpass';
        request()
          .send({
            query: `mutation {
                authenticate(email: "${email}", password: "${pass}")
            }`,
          })
          .then((res) => {
            const { data, errors } = res.body;

            expect(data?.authenticate).to.not.exist;

            expect(errors).to.be.a('array').with.lengthOf(1);
            const [err] = errors;
            expect(err.message).to.be.eql('User not found');
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Queries', () => {
    it('should GET all the users', (done) => {
      request()
        .send({
          query: `query{
            users{
              name
               _id
               email
             }
            }`,
        })
        .then((res) => {
          const { data } = res.body;

          expect(res.status).be.eql(200);
          expect(data).to.exist;

          const { users } = data;
          expect(users).to.be.a('array');

          if (users.length > 0) {
            const [f] = users;
            ['name', 'email', '_id'].forEach((v) => {
              expect(f).to.have.property(v);
            });
          }

          done();
        })
        .catch(done);
    });
  });
});
