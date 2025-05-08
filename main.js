const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
// All requests using this instance will have a 2 seconds delay:
const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 2000 });

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet("/users").reply(200, {
  users: [{ id: 1, name: "John Smith" }],
});

axios.get("/users").then(function (response) {
  console.log(response.data);
});

// Mock GET request to /users when param `searchText` is 'John'
// arguments for reply are (status, data, headers)
mock.onGet("/users", { params: { searchText: "John" } }).reply(200, {
  users: [{ id: 1, name: "John Smith" }],
});

axios
  .get("/users", { params: { searchText: "John" } })
  .then(function (response) {
    console.log(response.data);
  });

/////////////////////////////////////////////
const normalAxios = axios.create();
const mockAxios = axios.create();
const mock = new AxiosMockAdapter(mockAxios);

mock
  .onGet("/orders")
  .reply(() =>
    Promise.all([
      normalAxios.get("/api/v1/orders").then((resp) => resp.data),
      normalAxios.get("/api/v2/orders").then((resp) => resp.data),
      { id: "-1", content: "extra row 1" },
      { id: "-2", content: "extra row 2" },
    ]).then((sources) => [
      200,
      sources.reduce((agg, source) => agg.concat(source)),
    ])
  );
