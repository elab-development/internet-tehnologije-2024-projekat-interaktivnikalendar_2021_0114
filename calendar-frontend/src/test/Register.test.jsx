import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import { BrowserRouter } from "react-router-dom";
import { expect } from "vitest";

test("renders Register page", () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
  expect(
    screen.getByRole("heading", { name: /Register/i })
  ).toBeInTheDocument();
});

test("displays error message when passwords do not match", async () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/Name/i), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "password1" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
    target: { value: "password2" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Register/i }));

  await waitFor(() =>
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
  );
});
