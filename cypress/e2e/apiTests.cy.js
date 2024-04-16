/// <reference types = "Cypress" />

import { endpoints } from "../support/apiEndpoints";
import { httpStatus } from "../support/httpStatus";
import { utils } from "../support/utils";
import expectedUser from "../fixtures/apiResponseUser5.json";
import testdata from "../fixtures/testdata.json";

describe('API tests', () => {
  it('passes', () => {
    // Step 1
    // Send GET request to get all posts (/posts)
    cy.request('GET', endpoints.POSTS).then(response => {
      // Status code is 200
      expect(response.status).to.eq(httpStatus.OK);
      // The list in response body is JSON
      expect(response.headers['content-type']).to.include(testdata.contentType);
      // Posts are sorted in ascending order (by id)
      const ids = response.body.map(post => post.id);
      const sortedIds = [...ids].sort((a, b) => a - b);
      expect(ids).to.have.ordered.members(sortedIds);
    });

     // Step 2
    // Send GET request to get post with id=99 (/posts/99)
    cy.request('GET', endpoints.POST_BY_ID(testdata.validPostId)).then(response => {
      // Status code is 200
      expect(response.status).to.eq(httpStatus.OK);
      // Post information is correct: userId is 10, id is 99, title and body arent' empty
      expect(response.body.userId).to.eq(testdata.userIdGet);
      expect(response.body.id).to.eq(testdata.validPostId);
      expect(response.body.title).to.not.be.empty;
      expect(response.body.body).to.not.be.empty;
    });   

    // Step 3
    // Send GET request to get post with id=150 (/posts/150)
    cy.request({ method: 'GET',
      url: endpoints.POST_BY_ID(testdata.invalidPostId),
      failOnStatusCode: false
    }).then(response => {
      // Status code is 404
      expect(response.status).to.eq(httpStatus.NOT_FOUND);
      // Response body is empty
      expect(response.body).to.be.empty;
    });

    // Step 4
    // Send POST request to create post with userId=1 and random body and random title (/posts)
    const randomTitle = utils.generateRandomString(testdata.titleLength);
    const randomBody = utils.generateRandomString(testdata.bodyLength);
    cy.request('POST', endpoints.POSTS, {
      title: randomTitle,
      body: randomBody,
      userId: testdata.userIdPost
    }).then(response => {
      // Status code is 201
      expect(response.status).to.eq(httpStatus.CREATED);
      // Post information is correct: title, body, userId match data from request, id is present in response
      expect(response.body.title).to.eq(randomTitle);
      expect(response.body.body).to.eq(randomBody);
      expect(response.body.userId).to.eq(testdata.userIdPost);
      expect(response.body).to.have.property('id');
    });

    // Step 5
    // Send GET request to get users (/users)
    cy.request('GET', endpoints.USERS).then(response => {
      // Status code is 200
      expect(response.status).to.eq(httpStatus.OK);
      // The list in response body is JSON
      expect(response.headers['content-type']).to.include(testdata.contentType);
      // User (id=5) equals to data
      const actualUser = response.body.find(user => user.id === testdata.userId);
      expect(actualUser).to.deep.eq(expectedUser);
    });

    // Step 6
    // Send GET request to get user with id=5 (/users/5)
    cy.request('GET', endpoints.USER_BY_ID(testdata.userId)).then(response => {
      // Status code is 200
      expect(response.status).to.eq(httpStatus.OK);
      // User data matches with user data in the previous step
      expect(response.body).to.deep.eq(expectedUser);
    });
  });
});
