import express from 'express';
import router from '../router.js';
import supertest from 'supertest';
import { describe, beforeAll, afterEach, it, expect } from 'vitest'
import sequelize from '../config/database.js';
import VisitModel from '../model/model.js';

describe('Unit tests', () => {

  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    await sequelize.authenticate();
  })

  afterEach(async () => {
    await VisitModel.destroy({where: {}});
  })

  // VIC SAYS: Consider adding an afterAll that closes the DB connection.


    it('should send a Visit to the database', () => new Promise( done => {
      const testVisit = { site: 'test.com', timeSpent: 10000 };
      request.post('/visits').send({ usage: [testVisit] })
      .then( () => VisitModel.findOne({where: {site: 'test.com'}, raw: true}))
      .then( visit => {
        expect(visit.site).toBe('test.com');
        expect(visit.timeSpent).toBe(10000);
        done();
      })
      .catch(err => console.log('Error sending tab info to DB:', err));
    }));

    // VIC SAYS: Typically, in a test, you want to fail the test rather than just log the error.

    it('should receive a Visit[] from the database', () => new Promise( done => {

      request.get('/stats/last24h')
      .then( response => expect(response.body).toStrictEqual([]))
      .catch(err => console.log('Error sending tab info to DB:', err));

      const testVisitA = { site: 'a-test.com', timeSpent: 30000 };
      const testVisitB = { site: 'b-test.com', timeSpent: 20000 };

      request.post('/visits').send({ usage: [testVisitA] })
      .then( () => request.post('/visits').send({ usage: [testVisitB] }))
      .then( () => request.get('/stats/last24h'))
      .then( response => {
        expect(response.body[0]).toStrictEqual(testVisitA);
        expect(response.body[1]).toStrictEqual(testVisitB);
        done();
      })
      .catch(err => console.log('Error sending tab info to DB:', err));

    }));

  });

  it('should warn client when fields are missing', () => {

    const expectedResult = 'One or more fields missing.';

    const checkMissingFields = (obj) => {
      new Promise(done => {
        request.post('/visits').send(obj)
          .then(result => {
            expect(result.body).toBe(expectedResult);
            done();
          }).catch(err => console.log(err));
      })
    };

    // TODO: USE ASSERTIONS HERE
    /* it('empty object', () => checkMissingFields({}));
    it('empty usage', () => checkMissingFields({ usage: [] }));
    it('empty timeSpent', () => checkMissingFields({ usage: [{ site: 'site' }] }));
    it('empty site', () => checkMissingFields({ usage: [{ timeSpent: 'timeSpent' }] })); */

  });