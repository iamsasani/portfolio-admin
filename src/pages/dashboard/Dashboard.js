import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  MailOutline as MailIcon,
  MarkEmailUnreadOutlined as UnreadIcon,
  EventAvailable as MeetingIcon,
  CheckCircleOutline as CompletedIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const API_URL = "https://portfolio-api.workwithsasan.workers.dev";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [messagesResponse, meetingsResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/messages`, {
          method: "GET",
          credentials: "include",
        }),

        fetch(`${API_URL}/api/admin/meetings`, {
          method: "GET",
          credentials: "include",
        }),
      ]);

      const messagesData = await messagesResponse.json();
      const meetingsData = await meetingsResponse.json();

      if (!messagesResponse.ok) {
        throw new Error(
          messagesData.message || "Failed to load messages."
        );
      }

      if (!meetingsResponse.ok) {
        throw new Error(
          meetingsData.message || "Failed to load meetings."
        );
      }

      setMessages(messagesData.messages || []);
      setMeetings(meetingsData.meetings || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const unreadMessages = useMemo(
    () => messages.filter((message) => message.is_read === 0),
    [messages]
  );

  const scheduledMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.status === "scheduled"),
    [meetings]
  );

  const completedMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.status === "completed"),
    [meetings]
  );

  const upcomingMeetings = useMemo(() => {
    const now = new Date();

    return meetings
      .filter((meeting) => meeting.status === "scheduled")
      .filter((meeting) => {
        const date = new Date(
          `${meeting.meeting_date}T${meeting.meeting_time}:00`
        );

        return date >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.meeting_date}T${a.meeting_time}:00`
        );

        const dateB = new Date(
          `${b.meeting_date}T${b.meeting_time}:00`
        );

        return dateA - dateB;
      })
      .slice(0, 5);
  }, [meetings]);

  const latestMessages = useMemo(
    () => [...messages].sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    ).slice(0, 5),
    [messages]
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Welcome to your portfolio administration panel.
        </Typography>
      </Box>

      {loading ? (
        <Paper sx={{ p: 4 }}>
          <Typography color="text.secondary">
            Loading dashboard...
          </Typography>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 4 }}>
          <Typography color="error">
            {error}
          </Typography>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={loadDashboardData}
          >
            Retry
          </Button>
        </Paper>
      ) : (
        <>
          {/* Statistics */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Total Messages
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{ mt: 1 }}
                    >
                      {messages.length}
                    </Typography>
                  </Box>

                  <MailIcon fontSize="large" color="primary" />
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Unread Messages
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{ mt: 1 }}
                    >
                      {unreadMessages.length}
                    </Typography>
                  </Box>

                  <UnreadIcon fontSize="large" color="warning" />
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Scheduled Meetings
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{ mt: 1 }}
                    >
                      {scheduledMeetings.length}
                    </Typography>
                  </Box>

                  <MeetingIcon fontSize="large" color="success" />
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Completed Meetings
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{ mt: 1 }}
                    >
                      {completedMeetings.length}
                    </Typography>
                  </Box>

                  <CompletedIcon
                    fontSize="large"
                    color="primary"
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Content */}
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Latest Messages */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    Latest Messages
                  </Typography>

                  <Button
                    component={Link}
                    to="/app/messages"
                    size="small"
                  >
                    View All
                  </Button>
                </Stack>

                {latestMessages.length === 0 ? (
                  <Typography color="text.secondary">
                    No messages yet.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {latestMessages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={2}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700}>
                              {message.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {message.email}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {message.subject || "No subject"}
                            </Typography>
                          </Box>

                          <Chip
                            label={
                              message.is_read === 1
                                ? "Read"
                                : "Unread"
                            }
                            color={
                              message.is_read === 1
                                ? "default"
                                : "warning"
                            }
                            size="small"
                          />
                        </Stack>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 1.5 }}
                        >
                          {formatDate(message.created_at)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>

            {/* Upcoming Meetings */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    Upcoming Meetings
                  </Typography>

                  <Button
                    component={Link}
                    to="/app/meetings"
                    size="small"
                  >
                    View All
                  </Button>
                </Stack>

                {upcomingMeetings.length === 0 ? (
                  <Typography color="text.secondary">
                    No upcoming meetings.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {upcomingMeetings.map((meeting) => (
                      <Box
                        key={meeting.id}
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                        }}
                      >
                        <Stack spacing={0.5}>
                          <Typography fontWeight={700}>
                            {meeting.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {meeting.email}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ mt: 1 }}
                          >
                            {meeting.meeting_date} at{" "}
                            {meeting.meeting_time}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {meeting.topic || "No topic"}
                          </Typography>

                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label="Scheduled"
                              color="success"
                              size="small"
                            />
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default Dashboard;