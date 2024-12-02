import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { SignOutApi } from "../../api/AuthApi";

export default function NavigationBar() {
  const [state, setState] = React.useState({ bottom: false });
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ bottom: open });
  };

  const handleSignOut = async () => {
    try {
      await SignOutApi(); // Call the sign-out API
      navigate("/login"); // Redirect to login after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { text: "Home", path: "/home" },
    { text: "Join Game", path: "/joinGame" },
    { text: "Create Quiz", path: "/createQuestion" },
    { text: "Dashboard", path: "/dashboard" },
  ];

  const list = (
    <Box
      sx={{ width: "100%" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={Link} to={link.path}>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Sign Out Button */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut}>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleDrawer(true)}
        sx={{
          color: "white",
          borderRadius: "50%",
          width: "5rem",
          height: "4rem",
          zIndex: 999,
          position: "absolute",
          bottom: "3rem",
          right: "2rem",
        }}
      >
        <MoreHorizIcon />
      </Button>
      <Drawer anchor="bottom" open={state.bottom} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </>
  );
}
