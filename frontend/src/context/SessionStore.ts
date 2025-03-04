import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Session, Story, User, Vote } from "../types";
import * as api from "../api/apiClient";

export enum StoreState {
  INITIAL = "initial",
  PENDING = "pending",
  DONE = "done",
  ERROR = "error",
}
export class SessionStore {
  state: StoreState;
  store: Session | undefined;
  currentUser: User | null;

  constructor() {
    this.state = StoreState.INITIAL;
    this.store = undefined;
    this.currentUser = null;
    makeAutoObservable(this);
  }

  async createSession(name: string, description: string): Promise<void> {
    try {
      this.state = StoreState.PENDING;
      const newSession = await api.createSession({
        name,
        description,
        status: "waiting",
        currentStory: null,
        participants: [],
      });
      this.store = newSession;
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error creating session:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to create session");
    }
  }

  async fetchSession(sessionId: string): Promise<void> {
    try {
      this.state = StoreState.PENDING;
      const session = await api.getSession(sessionId);
      this.store = session;
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error fetching session:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to fetch session");
    }
  }

  async joinSession(
    sessionId: string,
    name: string,
    role: "player" | "observer"
  ): Promise<void> {
    try {
      this.state = StoreState.PENDING;
      const user = await api.joinSession(sessionId, { name, role });
      this.currentUser = user;
      await this.fetchSession(sessionId);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error joining session:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to join session");
    }
  }

  async addStory(title: string, description: string): Promise<void> {
    try {
      this.state = StoreState.PENDING;
      const newStory: Omit<Story, "id"> = {
        title,
        description,
        status: "pending",
        finalEstimate: null,
        votes: [],
      };
      await api.createStory(this.store!.id, newStory);
      await this.fetchSession(this.store!.id);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error adding story:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to add story");
    }
  }

  async startVoiting(storyId: string): Promise<void> {
    try {
      this.state = StoreState.PENDING;
      await api.updateStory(this.store!.id, storyId, { status: "active" });
      await this.fetchSession(this.store!.id);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error starting voting:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to start voting");
    }
  }

  async submitVote(value: string): Promise<void> {
    if (!this.store || !this.store.currentStory || !this.currentUser) return;
    try {
      this.state = StoreState.PENDING;
      const vote: Omit<Vote, "id"> = {
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        value,
      };
      await api.submitVote(this.store.id, this.store.currentStory.id, vote);
      await this.fetchSession(this.store.id);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error submitting vote:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to submit vote");
    }
  }

  async revealVotes(): Promise<void> {
    if (!this.store || !this.store.currentStory) return;
    try {
      this.state = StoreState.PENDING;
      await api.revealVotes(this.store.id, this.store.currentStory.id);
      await this.fetchSession(this.store.id);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error revealing votes:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to reveal votes");
    }
  }

  async resetVotes(): Promise<void> {
    if (!this.store || !this.store.currentStory) return;
    try {
      this.state = StoreState.PENDING;
      await api.resetVotes(this.store.id, this.store.currentStory.id);
      await this.fetchSession(this.store.id);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error resetting votes:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to reset votes");
    }
  }

  async finalizeEstimate(estimate: string): Promise<void> {
    if (!this.store || !this.store.currentStory) return;
    try {
      this.state = StoreState.PENDING;
      await api.finalizeEstimate(
        this.store.id,
        this.store.currentStory.id,
        estimate
      );
      await this.fetchSession(this.store.id);
      this.state = StoreState.DONE;
    } catch (err) {
      this.state = StoreState.ERROR;
      console.error(
        "Error finalizing estimate:",
        err instanceof Error ? err.message : String(err)
      );
      throw new Error("Failed to finalize estimate");
    }
  }
}

export const sessionStoreContext = createContext(new SessionStore());
