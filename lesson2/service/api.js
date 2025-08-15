const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:6000/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

module.exports = instance;
