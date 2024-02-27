describe("getShowsByTerm", function () {
  let mock;

  beforeEach(function () {
    //Initialize the mock before each test
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    //Reset the mock after each test
    mock.reset();
  });

  it("Should return an array of show objects for a vailid search term", async function () {
    const mockShows = [
      {
        show: {
          id: 1,
          name: "Test Show",
          summary: "A test show",
          image: { medium: "http://example.com/test.jpg" },
        },
      },
    ];

    //Mocking the response for the search term "test"
    mock
      .onGet(`${apiURL}search/shows`, { params: { q: "test" } })
      .reply(200, mockShows);

    const result = await getShowsByTerm("test");
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Test Show");
  });

  it("Should return show objects with the correct structure", async function () {
    const mockShow = {
      show: {
        id: 2,
        name: "Another Test Show",
        summary: "Another test show",
        image: null,
      },
    };
    mock
      .onGet(`${apiURL}search/shows`, { params: { q: "another" } })
      .reply(200, [mockShow]);

    const result = await getShowsByTerm("another");
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        summary: jasmine.any(String),
        image: jasmine.any(String),
      })
    );
  });

  it("Will use a default image when the show object does not have an image", async function () {
    const mockShow = {
      show: {
        id: 3,
        name: "No Image Show",
        summary: "This show has no image",
        image: null,
      },
    };
    mock
      .onGet(`${apiURL}search/shows`, { params: { q: "no image" } })
      .reply(200, [mockShow]);

    const result = await getShowsByTerm("no image");
    expect(result[0].image).toBe(missingImage);
  });
});
