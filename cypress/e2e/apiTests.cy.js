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
  });
});