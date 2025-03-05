import { render, screen } from "@testing-library/react";
import NotFound from "../pages/NotFound";
import { BrowserRouter } from "react-router-dom";

test("renders 'Go Back' button", () => {
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  );
  expect(screen.getByRole("button", { name: /Go Back/i })).toBeInTheDocument();
});
