import axios from "axios";
import { fetchSprints } from "../components/api";

// Mock axios
vi.mock("axios");

describe("fetchSprints", () => {
  it("should fetch sprints successfully", async () => {
    const mockSprints = [
      { id: 1, name: "Sprint 1", start: "2023-01-01", end: "2023-01-15" },
      { id: 2, name: "Sprint 2", start: "2023-02-01", end: "2023-02-15" },
    ];

    axios.get.mockResolvedValue({ data: mockSprints });

    const sprints = await fetchSprints();

    expect(sprints).toEqual(mockSprints);
    expect(axios.get).toHaveBeenCalledWith("http://127.0.0.1:8000/api/user/sprints", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  });

  it("should handle errors", async () => {
    axios.get.mockRejectedValue(new Error("Failed to fetch sprints"));

    await expect(fetchSprints()).rejects.toThrow("Failed to fetch sprints");
  });
});
