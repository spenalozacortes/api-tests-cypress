/// <reference types = "Cypress" />

import { utils } from "../support/utils";
import expectedUser from "../fixtures/apiResponseUser5.json";

describe('API tests', () => {
  it('passes', () => {
    // Step 1
    // Send GET request to get all posts (/posts)
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts').then(response => {
      // Status code is 200
      expect(response.status).to.eq(200);
      // The list in response body is JSON
      expect(response.headers['content-type']).to.include('application/json');
      // Posts are sorted in ascending order (by id)
      const ids = response.body.map(post => post.id);
      const sortedIds = [...ids].sort((a, b) => a - b);
      expect(ids).to.have.ordered.members(sortedIds);
    });

     // Step 2
    // Send GET request to get post with id=99 (/posts/99)
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/99').then(response => {
      // Status code is 200
      expect(response.status).to.eq(200);
      // Post information is correct: userId is 10, id is 99, title and body arent' empty
      expect(response.body.userId).to.eq(10);
      expect(response.body.id).to.eq(99);
      expect(response.body.title).to.not.be.empty;
      expect(response.body.body).to.not.be.empty;
    });   

    // Step 3
    // Send GET request to get post with id=150 (/posts/150)
    cy.request({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/150',
      failOnStatusCode: false
    }).then(response => {
      // Status code is 404
      expect(response.status).to.eq(404);
      // Response body is empty
      expect(response.body).to.be.empty;
    });

    // Step 4
    // Send POST request to create post with userId=1 and random body and random title (/posts)
    const randomTitle = utils.generateRandomString(10);
    const randomBody = utils.generateRandomString(100);
    cy.request('POST', 'https://jsonplaceholder.typicode.com/posts', {
      title: randomTitle,
      body: randomBody,
      userId: 1
    }).then(response => {
      // Status code is 201
      expect(response.status).to.eq(201);
      // Post information is correct: title, body, userId match data from request, id is present in response
      expect(response.body.title).to.eq(randomTitle);
      expect(response.body.body).to.eq(randomBody);
      expect(response.body.userId).to.eq(1);
      expect(response.body).to.have.property('id');
    });

    // Step 5
    // Send GET request to get users (/users)
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users').then(response => {
      // Status code is 200
      expect(response.status).to.eq(200);
      // The list in response body is JSON
      expect(response.headers['content-type']).to.include('application/json');
      // User (id=5) equals to data
      const actualUser = response.body.filter(user => user.id === 5);
      expect(actualUser).to.deep.eq(expectedUser);
    });

    // Step 6
    // Send GET request to get user with id=5 (/users/5)
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users/5').then(response => {
      // Status code is 200
      expect(response.status).to.eq(200);
      // User data matches with user data in the previous step
      expect(response.body).to.deep.eq(expectedUser[0]);
    });
  });
});