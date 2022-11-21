/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
  });
})
