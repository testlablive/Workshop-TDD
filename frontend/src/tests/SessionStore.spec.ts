import { describe, it, expect, vi } from "vitest";
import { SessionStore, StoreState } from "../context/SessionStore";
import * as api from "../api/apiClient";

vi.mock("../api/apiClient");

describe("SessionStore", () => {
  describe("createSession", () => {
    it("should create a session successfully", async () => {
      const mockSession = {
        id: "1",
        name: "Test Session",
        description: "Test Description",
        status: "waiting",
        currentStory: null,
        participants: [],
      };
      api.createSession.mockResolvedValue(mockSession);

      const store = new SessionStore();
      await store.createSession("Test Session", "Test Description");

      expect(store.state).toBe(StoreState.DONE);
      expect(store.store).toEqual(mockSession);
    });

    it("should handle errors when creating a session", async () => {
      const errorMessage = "Failed to create session";
      api.createSession.mockRejectedValue(new Error(errorMessage));

      const store = new SessionStore();

      await expect(
        store.createSession("Test Session", "Test Description")
      ).rejects.toThrow(errorMessage);
      expect(store.state).toBe(StoreState.ERROR);
    });
  });
});
