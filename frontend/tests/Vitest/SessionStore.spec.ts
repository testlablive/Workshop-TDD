import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SessionStore, StoreState } from "../../src/store/SessionStore";
import * as api from "../../src/api/apiClient";
import { Session } from "../../src/types";

vi.mock("../api/apiClient");

describe("SessionStore", () => {
  describe("createSession", () => {
    let apiSpy;
    beforeEach(() => {
      apiSpy = vi.spyOn(api, "createSession").mockImplementation(vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("should create a session successfully", async () => {
      const mockSession: Session = {
        id: "1",
        name: "Test Session",
        description: "Test Description",
        status: "waiting",
        currentStory: null,
        participants: [],
      };
      apiSpy.mockResolvedValueOnce(mockSession);
      const store = new SessionStore();
      await store.createSession("Test Session", "Test Description");

      expect(store.state).toBe(StoreState.DONE);
      expect(store.store).toEqual(mockSession);
    });

    it("should handle errors when creating a session", async () => {
      const errorMessage = "Failed to create session";
      apiSpy.mockRejectedValue(new Error(errorMessage));

      const store = new SessionStore();

      await expect(
        store.createSession("Test Session", "Test Description")
      ).rejects.toThrow(errorMessage);
      expect(store.state).toBe(StoreState.ERROR);
    });
  });
});
