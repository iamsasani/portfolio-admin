import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const API_URL = 'https://portfolio-api.workwithsasan.workers.dev';

function Profile() {
  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    github_url: '',
    telegram_url: '',
    portfolio_url: '',
    education: '',
    skills: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load profile.');
      }

      setForm({
        name: data.profile?.name || '',
        title: data.profile?.title || '',
        bio: data.profile?.bio || '',
        email: data.profile?.email || '',
        github_url: data.profile?.github_url || '',
        telegram_url: data.profile?.telegram_url || '',
        portfolio_url: data.profile?.portfolio_url || '',
        education: data.profile?.education || '',
        skills: Array.isArray(data.profile?.skills) ? data.profile.skills : [],
      });
    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess('');
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (form.skills.includes(skill)) {
      setSkillInput('');
      return;
    }

    setForm((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setSkillInput('');
    setSuccess('');
  };

  const removeSkill = (skillToRemove) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));

    setSuccess('');
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setSuccess(data.message || 'Profile updated successfully.');
    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
          Profile
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography color='text.secondary'>Loading profile...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 1 }}>
        Profile
      </Typography>

      <Typography color='text.secondary' sx={{ mb: 3 }}>
        Manage the information displayed on your portfolio.
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Full Name'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Title'
                    name='title'
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label='Bio'
                    name='bio'
                    value={form.bio}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact & Links */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
                Contact & Links
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='GitHub URL'
                    name='github_url'
                    value={form.github_url}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Telegram URL'
                    name='telegram_url'
                    value={form.telegram_url}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Portfolio URL'
                    name='portfolio_url'
                    value={form.portfolio_url}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Education */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
                Education
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Education'
                name='education'
                value={form.education}
                onChange={handleChange}
              />
            </Paper>
          </Grid>

          {/* Skills */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant='h5' fontWeight={700} sx={{ mb: 1 }}>
                Skills
              </Typography>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Type a skill and press Enter to add it.
              </Typography>

              <TextField
                fullWidth
                label='Add Skill'
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
              />

              <Stack
                direction='row'
                spacing={1}
                useFlexGap
                flexWrap='wrap'
                sx={{ mt: 2 }}
              >
                {form.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Save */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Profile;
