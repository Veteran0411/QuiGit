import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { firestore } from "../../fireBaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { Box, Typography, Grid, Paper, CircularProgress, Button, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NavigationBar from "../navbar/NavigationBar";

const LeaderBoard = () => {
  const location = useLocation();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract the gamePin from the URL query params
  const queryParams = new URLSearchParams(location.search);
  const gamePin = queryParams.get("gamePin");

  // Fetch leaderboard data in real-time
  useEffect(() => {
    if (!gamePin) {
      toast.error("Game Pin not found!");
      return;
    }

    const leaderboardDocRef = doc(firestore, "leaderboard", gamePin);

    const unsubscribe = onSnapshot(leaderboardDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const playersData = data.players || {};

        const leaderboard = Object.keys(playersData).map((email) => {
          const player = playersData[email];
          return {
            email,
            displayName: player.displayName || "Anonymous",
            totalScore: player.totalScore || 0,
            questions: player.questions || {},
          };
        });

        leaderboard.sort((a, b) => b.totalScore - a.totalScore);
        setLeaderboardData(leaderboard);
      } else {
        toast.error("Leaderboard data not found!");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gamePin]);

  // Function to generate and download the Excel report
  const downloadExcelReport = () => {
    const excelData = leaderboardData.map((player) => {
      const questions = player.questions;
      const questionScores = Object.keys(questions).map((question) => ({
        [`${question}`]: questions[question],
      }));
      return {
        Name: player.displayName,
        Email: player.email,
        TotalScore: player.totalScore,
        ...Object.assign({}, ...questionScores),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");
    XLSX.writeFile(workbook, `Leaderboard_${gamePin}.xlsx`);
  };

  // Function to generate and download the PDF report
  const downloadPdfReport = () => {
    const doc = new jsPDF();
    const tableColumnHeaders = ["Name", "Email", "Total Score"];
    const tableRows = leaderboardData.map((player) => {
      const rowData = [
        player.displayName,
        player.email,
        player.totalScore,
        // Add scores for each question dynamically if needed
        ...Object.keys(player.questions || {}).map(
          (question) => player.questions[question]
        ),
      ];
      return rowData;
    });

    doc.text("Leaderboard", 14, 10);
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Leaderboard_${gamePin}.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: "#1c1c1c", minHeight: "100vh" }}>
      <NavigationBar/>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#f5f5f5" }}
        >
          Leaderboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={downloadExcelReport}
          >
            Download Excel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={downloadPdfReport}
          >
            Download PDF
          </Button>
        </Stack>
      </Box>

      {leaderboardData.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: "#f5f5f5" }}>
          No players have joined the game yet.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {leaderboardData.map((player, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#333",
                  borderLeft: "6px solid #1976d2",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#f5f5f5" }}
                  >
                    {index + 1}. {player.displayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#9e9e9e", fontStyle: "italic" }}
                  >
                    {player.email}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#43a047",
                    textAlign: "right",
                  }}
                >
                  {player.totalScore} Points
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
