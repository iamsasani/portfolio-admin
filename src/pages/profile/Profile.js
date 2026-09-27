import {
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";

function Profile() {
  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Avatar */}
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.main",
                color: "#fff",
                fontSize: 42,
                fontWeight: 700,
              }}
            >
              MS
            </Box>
          </Grid>

          {/* Main Info */}
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="h4" fontWeight={700}>
              Mohammad Mehdi Sasanian
            </Typography>

            <Typography
              variant="h6"
              color="primary"
              sx={{ mt: 0.5 }}
            >
              Frontend / React Developer
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Personal portfolio administration panel
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* About */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              About Me
            </Typography>

            <Typography color="text.secondary" lineHeight={1.9}>
              Frontend developer focused on building modern and responsive
              web applications with React and JavaScript. Interested in
              clean UI, reusable components, API integration and building
              real-world projects.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Links */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Quick Links
            </Typography>

            <Stack spacing={1.5}>
              <Button
                variant="contained"
                href="https://personal-portfolio.workwithsasan.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Portfolio
              </Button>

              <Button
                variant="outlined"
                href="https://github.com/iamsasani"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Skills */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Skills
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
            >
              <Chip label="HTML" />
              <Chip label="CSS" />
              <Chip label="JavaScript" />
              <Chip label="React" color="primary" />
              <Chip label="Tailwind CSS" color="primary" />
              <Chip label="REST API" />
              <Chip label="Context API" />
              <Chip label="Cloudflare Workers" />
              <Chip label="Cloudflare D1" />
              <Chip label="Git & GitHub" />
            </Stack>
          </Paper>
        </Grid>

        {/* Education */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Education
            </Typography>

            <Typography fontWeight={600}>
              B.Sc. Computer Engineering
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Software Engineering
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography color="text.secondary">
              Islamic Azad University — Marvdasht Branch
            </Typography>
          </Paper>
        </Grid>

        {/* Projects */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Projects
            </Typography>

            <Typography fontWeight={600}>
              PopcornDB
            </Typography>

            <Typography color="text.secondary">
              Movie discovery platform built with React.
            </Typography>

            <Typography fontWeight={600} sx={{ mt: 2 }}>
              Atmos Weather
            </Typography>

            <Typography color="text.secondary">
              Responsive weather application built with React.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;