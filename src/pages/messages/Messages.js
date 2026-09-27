import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "https://portfolio-api.workwithsasan.workers.dev";

function Messages() {
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/messages`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load messages.");
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/messages/${id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update message.");
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === id
            ? { ...message, is_read: 1 }
            : message
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/messages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete message.");
      }

      setMessages((prev) =>
        prev.filter((message) => message.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Messages
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Messages received from your portfolio contact form.
          </Typography>
        </Box>

        <Button variant="outlined" onClick={loadMessages}>
          Refresh
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No messages yet.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id} hover>
                  <TableCell>
                    {message.is_read ? (
                      <Chip label="Read" size="small" />
                    ) : (
                      <Chip
                        label="Unread"
                        size="small"
                        color="primary"
                      />
                    )}
                  </TableCell>

                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject || "-"}</TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 300,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {message.message}
                  </TableCell>

                  <TableCell>
                    {message.created_at
                      ? new Date(
                          message.created_at
                        ).toLocaleString()
                      : "-"}
                  </TableCell>

                  <TableCell align="right">
                    {!message.is_read && (
                      <IconButton
                        color="primary"
                        onClick={() => markAsRead(message.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}

                    <IconButton
                      color="error"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Messages;