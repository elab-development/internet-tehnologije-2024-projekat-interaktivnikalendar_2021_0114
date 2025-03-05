import axios from "axios";
import { fetchSprints, deleteSprint } from "../components/api";

// Mock axios
/*
Ovo koristi vi.mock funkcionalnost iz Vitest biblioteke za mock-ovanje
 (lažno pozivanje) axios modula. 
 To znači da će se svi pozivi na axios tokom testiranja 
 umesto da idu prema stvarnom API-ju,
  pozivati fake implementacije koje vraćaju zadate vrednosti.
*/
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

describe("deleteSprint", () => {
  it("should delete sprint successfully", async () => {
    const sprintId = 1;

    axios.delete.mockResolvedValue({});

    await deleteSprint(sprintId);

    expect(axios.delete).toHaveBeenCalledWith(`http://127.0.0.1:8000/api/sprints/${sprintId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  });

  it("should handle errors", async () => {
    const sprintId = 1;

    axios.delete.mockRejectedValue(new Error("Failed to delete sprint"));

    await expect(deleteSprint(sprintId)).rejects.toThrow("Failed to delete sprint");
  });
});
