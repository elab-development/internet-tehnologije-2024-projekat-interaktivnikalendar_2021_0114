import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router-dom";

test("renders Login page", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  // expect(screen.getAllByText(/Log in/i).length).toBeGreaterThan(0);
  expect(screen.getByRole("heading", { name: /Log in/i })).toBeInTheDocument();
});

test("shows error on invalid login", async () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: "invalid@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: "invalidpassword" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Log in/i })); // This line clicks the "Log in" button
  expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
});
