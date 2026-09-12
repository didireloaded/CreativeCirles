import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { onboardingStorageKey } from "../onboarding/model";
const profile = {
  completed: true,
  role: "Designer",
  interests: ["Design"],
  displayName: "Jordan K.",
  handle: "jordan.creates",
};
describe("secondary product modules", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.setItem("circle:entered", "1");
    localStorage.setItem(onboardingStorageKey, JSON.stringify(profile));
    vi.stubGlobal("scrollTo", vi.fn());
  });
  it.each([
    ["/buzz", "What’s moving around the circle."],
    ["/skill-swap", "Skill swap"],
    ["/ai-studio", "Drafting Studio"],
    ["/business", "Creator business"],
    ["/saved", "Saved"],
  ])("renders %s as a dedicated destination", (route, heading) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: new RegExp(heading, "i") }),
    ).toBeVisible();
  });
  it("generates and saves a drafting preview", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/ai-studio"]}>
        <App />
      </MemoryRouter>,
    );
    await user.click(
      screen.getByRole("button", { name: /generate preview draft/i }),
    );
    expect(screen.getByText("Preview draft")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("status")).toHaveTextContent(/saved/i);
  });
  it("updates a booking stage without payment UI", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/business"]}>
        <App />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("tab", { name: "Bookings" }));
    await user.selectOptions(screen.getByLabelText("Status"), "Confirmed");
    expect(screen.getByLabelText("Status")).toHaveValue("Confirmed");
    expect(screen.queryByText(/checkout|pay now/i)).not.toBeInTheDocument();
  });
});
