import { expect } from 'chai';
import { request } from './base.spec';

//Our parent block
describe('Users', () => {
  const req = request('http://localhost:4000').keepOpen().post('/graphql');
  beforeEach((done) => {
    //Before each test we empty the database
    done();
  });

  describe('Queries', () => {
    it('should GET all the users', (done) => {
      req
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
