import React from "react";
import { Grid, CircularProgress, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useUserDispatch } from "../../context/UserContext";
import { loginUser } from "../../context/UserContext";


import Widget from "../../components/Widget";
import { Button } from "components/Wrappers/Wrappers";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const userDispatch = useUserDispatch();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

 const handleLogin = async (event) => {
  event.preventDefault();

  setError("");

  if (!username || !password) {
    setError("Please enter username and password.");
    return;
  }

  const success = await loginUser(
    userDispatch,
    username,
    password,
    setIsLoading,
    setError
  );

  if (success) {
    const from = location.state?.from?.pathname || "/app";
    navigate(from, { replace: true });
  }
};
  return (
    <Grid
      container
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
        padding: "20px",
      }}
    >
      <Grid item xs={12} sm={8} md={5} lg={4}>
        <Widget
          style={{
            margin: 0,
            padding: "30px",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            style={{
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Admin Panel
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="textSecondary"
            style={{
              marginBottom: "30px",
            }}
          >
            Sign in to manage your portfolio
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              margin="normal"
              autoComplete="username"
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              margin="normal"
              autoComplete="current-password"
              disabled={isLoading}
            />

            {error && (
              <Typography
                variant="body2"
                style={{
                  color: "#d32f2f",
                  marginTop: "15px",
                  marginBottom: "10px",
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              style={{
                marginTop: "20px",
                height: "48px",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Widget>
      </Grid>
    </Grid>
  );
}