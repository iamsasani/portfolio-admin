import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
} from '@mui/material';

const API_URL = 'https://portfolio-api.workwithsasan.workers.dev';

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/admin/meetings`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load meetings.');
      }

      setMeetings(data.meetings || []);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to fetch meetings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const updateMeetingStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/meetings/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update meeting.');
      }

      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) =>
          meeting.id === id ? { ...meeting, status } : meeting,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to update meeting.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
        Meetings
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 4 }}>
            <Typography color='text.secondary'>Loading meetings...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 4 }}>
            <Typography color='error'>{error}</Typography>
          </Box>
        ) : meetings.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <Typography color='text.secondary'>No meetings found.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Topic</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{meeting.meeting_date}</TableCell>

                    <TableCell>{meeting.meeting_time}</TableCell>

                    <TableCell>{meeting.name}</TableCell>

                    <TableCell>{meeting.email}</TableCell>

                    <TableCell>{meeting.topic || '-'}</TableCell>

                    <TableCell>
                      <Chip
                        label={meeting.status}
                        color={getStatusColor(meeting.status)}
                        size='small'
                      />
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction='row'
                        spacing={1}
                        flexWrap='wrap'
                        useFlexGap
                      >
                        {meeting.status === 'scheduled' && (
                          <>
                            <Button
                              size='small'
                              variant='outlined'
                              color='error'
                              onClick={() =>
                                updateMeetingStatus(meeting.id, 'cancelled')
                              }
                            >
                              Cancel
                            </Button>

                            <Button
                              size='small'
                              variant='outlined'
                              color='success'
                              onClick={() =>
                                updateMeetingStatus(meeting.id, 'completed')
                              }
                            >
                              Complete
                            </Button>
                          </>
                        )}

                        {meeting.status === 'cancelled' && (
                          <Button
                            size='small'
                            variant='outlined'
                            onClick={() =>
                              updateMeetingStatus(meeting.id, 'scheduled')
                            }
                          >
                            Restore
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default Meetings;
