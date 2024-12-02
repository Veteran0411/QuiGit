import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { firestore } from '../../fireBaseConfig';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { toast } from 'react-toastify';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';

const LeaderBoard = () => {
  const location = useLocation();  // Hook to get the current URL
  const [leaderboardData, setLeaderboardData] = useState([]);  // State for leaderboard data
  const [loading, setLoading] = useState(true);  // Loading state

  // Get the gamePin from the URL query params
  const queryParams = new URLSearchParams(location.search);
  const gamePin = queryParams.get('gamePin');

  // Fetch leaderboard data in real-time
  useEffect(() => {
    if (!gamePin) {
      toast.error("Game Pin not found!");
      return;
    }

    // Reference to the leaderboard document in Firestore
    const leaderboardDocRef = doc(firestore, "leaderboard", gamePin);

    // Set up real-time listener using onSnapshot
    const unsubscribe = onSnapshot(leaderboardDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const playersData = data.players || {};

        // Transform players data into an array for easier rendering
        const leaderboard = Object.keys(playersData).map((email) => {
          const player = playersData[email];
          return {
            displayName: player.displayName || "Anonymous",
            totalScore: player.totalScore || 0,
          };
        });

        // Sort players by totalScore in descending order
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);
        setLeaderboardData(leaderboard);  // Set the leaderboard data in state
      } else {
        toast.error("Leaderboard data not found!");
      }
      setLoading(false);  // Set loading to false once data is fetched
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [gamePin]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Leaderboard
      </Typography>
      
      {/* If no players have joined, show a message */}
      {leaderboardData.length === 0 ? (
        <Typography variant="h6" align="center">
          No players have joined the game yet.
        </Typography>
      ) : (
        // Display players in grid layout
        <Grid container spacing={3} justifyContent="center">
          {leaderboardData.map((player, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                {/* Display the player rank, name, and score */}
                <Typography variant="h6">
                  {index + 1}. {player.displayName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {player.totalScore} points
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LeaderBoard;
