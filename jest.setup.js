import "@testing-library/jest-dom";

process.env.NODE_ENV = "test";

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.init = init;
    this.status = init?.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    return JSON.parse(this.body);
  }
};

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body, init) => {
      return new Response(JSON.stringify(body), {
        ...init,
        headers: {
          "content-type": "application/json",
          ...init?.headers,
        },
      });
    },
  },
}));
