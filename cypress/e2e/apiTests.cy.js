/// <reference types = "Cypress" />

import { endpoints } from "../support/apiEndpoints";
import { httpStatus } from "../support/httpStatus";
import { stringUtils } from "../support/StringUtils";
import expectedUser from "../fixtures/apiResponseUser5.json";
import testdata from "../fixtures/testdata.json";

describe('API tests', () => {
  it('passes', () => {
    cy.request('GET', endpoints.POSTS).then(response => {
      expect(response.status).to.eq(httpStatus.OK);
      expect(response.headers['content-type']).to.include(testdata.contentType);
      const ids = response.body.map(post => post.id);
      const sortedIds = [...ids].sort((a, b) => a - b);
      expect(ids).to.have.ordered.members(sortedIds);
    });

    cy.request('GET', endpoints.POST_BY_ID(testdata.validPostId)).then(response => {
      expect(response.status).to.eq(httpStatus.OK);
      expect(response.body.userId).to.eq(testdata.userIdGet);
      expect(response.body.id).to.eq(testdata.validPostId);
      expect(response.body.title).to.not.be.empty;
      expect(response.body.body).to.not.be.empty;
    });   

    cy.request({ method: 'GET',
      url: endpoints.POST_BY_ID(testdata.invalidPostId),
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(httpStatus.NOT_FOUND);
      expect(response.body).to.be.empty;
    });

    const randomTitle = stringUtils.generateRandomString(testdata.titleLength);
    const randomBody = stringUtils.generateRandomString(testdata.bodyLength);
    cy.request('POST', endpoints.POSTS, {
      title: randomTitle,
      body: randomBody,
      userId: testdata.userIdPost
    }).then(response => {
      expect(response.status).to.eq(httpStatus.CREATED);
      expect(response.body.title).to.eq(randomTitle);
      expect(response.body.body).to.eq(randomBody);
      expect(response.body.userId).to.eq(testdata.userIdPost);
      expect(response.body).to.have.property('id');
    });

    cy.request('GET', endpoints.USERS).then(response => {
      expect(response.status).to.eq(httpStatus.OK);
      expect(response.headers['content-type']).to.include(testdata.contentType);
      const actualUser = response.body.find(user => user.id === testdata.userId);
      expect(actualUser).to.deep.eq(expectedUser);
    });

    cy.request('GET', endpoints.USER_BY_ID(testdata.userId)).then(response => {
      expect(response.status).to.eq(httpStatus.OK);
      expect(response.body).to.deep.eq(expectedUser);
    });
  });
});
