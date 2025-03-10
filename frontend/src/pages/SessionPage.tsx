import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  makeStyles,
  shorthands,
  Button,
  Text,
  Spinner,
  Divider,
  tokens,
  Card,
  CardHeader,
} from "@fluentui/react-components";
import {
  Add24Regular,
  ArrowLeft24Regular,
  ArrowSync24Regular,
} from "@fluentui/react-icons";
import { VotingDeck } from "../components/VotingDeck";
import { ParticipantList } from "../components/ParticipantList";
import { StoryDetails } from "../components/StoryDetails";
import { VotingResults } from "../components/VotingResults";
import { CreateStoryForm } from "../components/CreateStoryForm";
import { getStories } from "../api/apiClient";
import { Story } from "../types";
import { sessionStoreContext, StoreState } from "../context/SessionStore";

const useStyles = makeStyles({
  container: {
    ...shorthands.padding("24px"),
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: tokens.fontSizeBase700,
    fontWeight: tokens.fontWeightSemibold,
  },
  sessionInfo: {
    marginBottom: "16px",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "24px",

    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  addStoryButton: {
    marginTop: "16px",
  },
  noStory: {
    textAlign: "center",
    marginTop: "32px",
    marginBottom: "32px",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    marginTop: "16px",
  },
  refreshButton: {
    marginLeft: "8px",
  },
  storiesList: {
    marginTop: "24px",
    marginBottom: "24px",
  },
  storyItem: {
    marginBottom: "8px",
    cursor: "pointer",
    ...shorthands.padding("8px"),
    ...shorthands.borderRadius("4px"),

    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  activeStory: {
    backgroundColor: tokens.colorNeutralBackground1Selected,

    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Selected,
    },
  },
});

export const SessionPage: React.FC = () => {
  const styles = useStyles();
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const sessionStore = useContext(sessionStoreContext);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [showAddStoryForm, setShowAddStoryForm] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);

  // Fetch stories when session changes
  useEffect(() => {
    if (sessionStore.store) {
      fetchStories();
    }
  }, [sessionStore.store]);

  // Check if user has already voted
  useEffect(() => {
    if (sessionStore?.store?.currentStory && sessionStore.currentUser) {
      const userVote = sessionStore.store.currentStory.votes.find(
        (v) => v.userId === sessionStore.currentUser!.id
      );
      if (userVote && userVote.value) {
        setSelectedValue(userVote.value);
      } else {
        setSelectedValue(null);
      }
    }
  }, [sessionStore.store, sessionStore.currentUser]);

  const fetchStories = async () => {
    if (!sessionId) return;

    try {
      setLoadingStories(true);
      const fetchedStories = await getStories(sessionId);
      setStories(fetchedStories);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleRefresh = () => {
    if (sessionId) {
      sessionStore.fetchSession(sessionId);
      fetchStories();
    }
  };

  if (sessionStore.state === StoreState.PENDING && !sessionStore.store) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size="large" label="Loading session..." />
      </div>
    );
  }

  if (!sessionStore.store || !sessionStore.currentUser) {
    return (
      <div className={styles.container}>
        <Text className={styles.error}>
          {sessionStore.state === StoreState.ERROR ||
            "Session not found or you're not connected. Please go back and try again."}
        </Text>
        <Button
          appearance="secondary"
          onClick={() => navigate("/")}
          className={styles.backButton}
        >
          <ArrowLeft24Regular />
          Back to Home
        </Button>
      </div>
    );
  }

  const isAdmin =
    sessionStore.store.participants[0]?.id === sessionStore.currentUser.id;
  const canVote =
    sessionStore.currentUser.role === "player" &&
    sessionStore.store.currentStory?.status === "active";

  const handleSelectCard = (value: string) => {
    if (canVote) {
      setSelectedValue(value);
      sessionStore.submitVote(value);
    }
  };

  const handleAddStory = (title: string, description: string) => {
    sessionStore.addStory(title, description);
    setShowAddStoryForm(false);
  };

  const handleStartVoting = () => {
    if (sessionStore.store?.currentStory) {
      sessionStore.startVoting(sessionStore.store.currentStory.id);
    }
  };

  const showVotingResults =
    sessionStore.store.currentStory?.status === "completed";

  return (
    <div className={styles.container}>
      <Button
        appearance="subtle"
        onClick={() => navigate("/")}
        className={styles.backButton}
      >
        <ArrowLeft24Regular />
        Back to Home
      </Button>

      <div className={styles.header}>
        <div>
          <Text className={styles.title}>
            {sessionStore.store.name}
            <Button
              appearance="transparent"
              icon={<ArrowSync24Regular />}
              onClick={handleRefresh}
              className={styles.refreshButton}
              title="Refresh session data"
            />
          </Text>
          <Text block>{sessionStore.store.description}</Text>
          <Text block size={200}>
            Session ID: {sessionStore.store.id}
          </Text>
        </div>

        {isAdmin && !showAddStoryForm && (
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={() => setShowAddStoryForm(true)}
          >
            Add Story
          </Button>
        )}
      </div>

      <Divider />

      <div className={styles.twoColumns}>
        <div>
          {showAddStoryForm && (
            <CreateStoryForm
              onSubmit={handleAddStory}
              onCancel={() => setShowAddStoryForm(false)}
            />
          )}

          {sessionStore.store.currentStory ? (
            <>
              <StoryDetails
                story={sessionStore.store.currentStory}
                isAdmin={isAdmin}
                onStartVoting={handleStartVoting}
                onRevealVotes={sessionStore.revealVotes}
                onResetVoting={sessionStore.resetVotes}
              />

              {canVote && (
                <>
                  <Text weight="semibold" size={400}>
                    Your Vote
                  </Text>
                  <VotingDeck
                    selectedValue={selectedValue}
                    onSelectCard={handleSelectCard}
                  />
                </>
              )}

              {showVotingResults && (
                <VotingResults
                  votes={sessionStore.store.currentStory.votes}
                  onFinalizeEstimate={sessionStore.finalizeEstimate}
                  isAdmin={isAdmin}
                />
              )}
            </>
          ) : (
            <div className={styles.noStory}>
              <Text size={400}>
                No active story.{" "}
                {isAdmin
                  ? "Add a story to get started."
                  : "Waiting for the session admin to add a story."}
              </Text>
            </div>
          )}

          {/* Stories List */}
          {stories.length > 0 && (
            <div className={styles.storiesList}>
              <Card>
                <CardHeader
                  header={
                    <Text weight="semibold" size={500}>
                      All Stories
                    </Text>
                  }
                />

                {loadingStories ? (
                  <Spinner size="small" label="Loading stories..." />
                ) : (
                  <div>
                    {stories.map((story) => (
                      <div
                        key={story.id}
                        className={`${styles.storyItem} ${
                          sessionStore.store?.currentStory?.id === story.id
                            ? styles.activeStory
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            isAdmin &&
                            story.id !== sessionStore.store?.currentStory?.id
                          ) {
                            sessionStore.startVoting(story.id);
                          }
                        }}
                      >
                        <Text
                          weight={
                            sessionStore.store?.currentStory?.id === story.id
                              ? "semibold"
                              : "regular"
                          }
                        >
                          {story.title}
                        </Text>
                        {story.finalEstimate && (
                          <Text size={200}>
                            {" "}
                            - {story.finalEstimate} points
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        <div>
          <Text weight="semibold" size={400}>
            Participants
          </Text>
          <ParticipantList
            participants={sessionStore.store.participants}
            votes={sessionStore.store.currentStory?.votes || []}
            showVotes={showVotingResults}
          />
        </div>
      </div>
    </div>
  );
};
