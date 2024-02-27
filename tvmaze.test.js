//getShowByTerm test
describe("getShowsByTerm", function () {
  let mock; //To hold Axios mock adapter

  beforeEach(function () {
    //Initialize the mock adapter before each test
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    //Reset the mock adapter after each test
    mock.reset();
  });

  it("Should return an array of show objects for a vailid search term", async function () {
    //Mock response data for a specific search term
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
    mock.onGet(`${apiURL}search/shows`, { params: { q: "test" } })
      .reply(200, mockShows); //200 is the status code

    const result = await getShowsByTerm("test");
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1); //Expect one result in the array
    expect(result[0].name).toBe("Test Show"); //Expect the name of the show to match the mock
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

//getEpisodesOfShow test
describe("getEpisodesOfShow", function () {
  let mock;

  beforeEach(function () {
    //Set up Axios mock adapter
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    //Reset the mock after each test
    mock.reset();
  });

  it("Should return an array of episodes for a valid show ID", async function () {
    const mockEpisodes = [
      { id: 1, name: "Pilot", season: 1, number: 1 },
      { id: 2, name: "Second Episode", season: 1, number: 2 },
    ];

    //Mocking the response for a specific show ID
    mock.onGet(`${apiURL}shows/1/episodes`).reply(200, mockEpisodes);
    const episodes = await getEpisodesOfShow(1);

    expect(episodes).toEqual(jasmine.any(Array));
    expect(episodes.length).toBe(2);
    expect(episodes[0].name).toBe("Pilot");
  });

  it("Should correctly format episode data", async function () {
    //Mocking the API response
    mock
      .onGet(`${apiURL}shows/1/episodes`)
      .reply(200, [{ id: 1, name: "Pilot", season: 1, number: 1 }]);

    const episodes = await getEpisodesOfShow(1);

    //Verify the episode object has correct structure
    expect(episodes[0]).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        season: jasmine.any(Number),
        number: jasmine.any(Number),
      })
    );
  });
});
