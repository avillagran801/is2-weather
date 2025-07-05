import React from "react";
import { Typography, Box } from "@mui/material";
import GenericActivityCard from "./GenericActivityCard";
import LinearProgress from "@mui/material/LinearProgress";
import { ScoredActivity } from "@/utils/calculateActivityScores";
import StarRating from "@/components/rating/StarRating";

type CardProps = {
  activity: ScoredActivity;
}

export default function ScoredActivityCard({ activity }: CardProps) {
  const [rating, setRating] = React.useState(activity.rating || 0);

  const handleRatingChange = async (newRating: number) => {
    setRating(newRating);
    await fetch(`/api/activity/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activity.id, rating: newRating }),
    });
  };

  return (
    <GenericActivityCard activity={activity}>
      <LinearProgress
        variant="determinate"
        value={activity.maxScore > 0 ? (activity.score / activity.maxScore) * 100 : 0}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#ffffff",
          border: '1px solid #ccc',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'primary.main',
          },
          mt: 1,
          width: '120px',
          position: "absolute",
          top: 40,
          right: 8,
        }}
      />
      <Box sx={{ position: "absolute", bottom: 8, right: 8 }}>
        <StarRating value={rating} onChange={handleRatingChange} />
      </Box>
    </GenericActivityCard>
  );
}