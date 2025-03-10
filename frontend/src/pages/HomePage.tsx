import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  makeStyles,
  shorthands,
  Input,
  Button,
  Text,
  Card,
  CardHeader,
  Textarea,
  Divider,
  tokens,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Spinner,
} from "@fluentui/react-components";
import { getSessions } from "../api/apiClient";
import { Session } from "../types";
import { sessionStoreContext, StoreState } from "../context/SessionStore";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    ...shorthands.padding("24px"),
  },
  card: {
    width: "100%",
    maxWidth: "500px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "16px",
  },
  divider: {
    marginTop: "24px",
    marginBottom: "24px",
  },
  title: {
    fontSize: tokens.fontSizeBase700,
    fontWeight: tokens.fontWeightSemibold,
    textAlign: "center",
    marginBottom: "24px",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    marginTop: "8px",
  },
  sessionsTable: {
    marginTop: "24px",
    width: "100%",
  },
  sessionRow: {
    cursor: "pointer",

    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

export const HomePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const sessionStore = useContext(sessionStoreContext);

  const [joinSessionId, setJoinSessionId] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRole, setJoinRole] = useState<"player" | "observer">("player");

  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [hostName, setHostName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Load existing sessions
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const fetchedSessions = await getSessions();
      setSessions(fetchedSessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinSessionId && joinName) {
      try {
        setFormError(null);
        await sessionStore.joinSession(joinSessionId, joinName, joinRole);
        navigate(`/session/${joinSessionId}`);
      } catch (err) {
        setFormError("Failed to join session. Please try again.");
        console.error("Error joining session:", err);
      }
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createName && hostName) {
      try {
        setFormError(null);
        await sessionStore.createSession(createName, createDescription);
        if (sessionStore.store) {
          await sessionStore.joinSession(
            sessionStore.store.id,
            hostName,
            "player"
          );
          navigate(`/session/${sessionStore.store.id}`);
        }
      } catch (err) {
        setFormError("Failed to create session. Please try again.");
        console.error("Error creating session:", err);
      }
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setJoinSessionId(sessionId);
  };

  return (
    <div className={styles.container}>
      <Text className={styles.title}>Planning Poker</Text>

      <Card className={styles.card}>
        <CardHeader
          header={
            <Text weight="semibold" size={500}>
              Join Existing Session
            </Text>
          }
        />

        <form onSubmit={handleJoinSession} className={styles.form}>
          <Input
            placeholder="Session ID"
            value={joinSessionId}
            onChange={(e, data) => setJoinSessionId(data.value)}
            required
          />

          <Input
            placeholder="Your Name"
            value={joinName}
            onChange={(e, data) => setJoinName(data.value)}
            required
          />

          <div>
            <Text>Join as:</Text>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <Button
                appearance={joinRole === "player" ? "primary" : "secondary"}
                onClick={() => setJoinRole("player")}
                type="button"
              >
                Player
              </Button>
              <Button
                appearance={joinRole === "observer" ? "primary" : "secondary"}
                onClick={() => setJoinRole("observer")}
                type="button"
              >
                Observer
              </Button>
            </div>
          </div>

          <Button
            appearance="primary"
            type="submit"
            disabled={!joinSessionId || !joinName}
          >
            Join Session
          </Button>
        </form>

        {/* Available Sessions Table */}
        {loadingSessions ? (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Spinner size="small" label="Loading sessions..." />
          </div>
        ) : sessions.length > 0 ? (
          <div className={styles.sessionsTable}>
            <Text weight="semibold" size={300}>
              Available Sessions
            </Text>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Participants</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className={styles.sessionRow}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <TableCell>{session.name}</TableCell>
                    <TableCell>{session.participants.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        <Divider className={styles.divider} />

        <CardHeader
          header={
            <Text weight="semibold" size={500}>
              Create New Session
            </Text>
          }
        />

        <form onSubmit={handleCreateSession} className={styles.form}>
          <Input
            placeholder="Session Name"
            value={createName}
            onChange={(e, data) => setCreateName(data.value)}
            required
          />

          <Textarea
            placeholder="Session Description (optional)"
            value={createDescription}
            onChange={(e, data) => setCreateDescription(data.value)}
            resize="vertical"
          />

          <Input
            placeholder="Your Name"
            value={hostName}
            onChange={(e, data) => setHostName(data.value)}
            required
          />

          <Button
            appearance="primary"
            type="submit"
            disabled={!createName || !hostName}
          >
            Create Session
          </Button>
        </form>

        {(sessionStore.state === StoreState.ERROR || formError) && (
          <Text className={styles.error}>
            {formError || "A mistake has happened."}
          </Text>
        )}
      </Card>
    </div>
  );
};
