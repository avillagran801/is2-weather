import React from "react";
import { Box, Button, Typography } from "@mui/material";
import GenericActivityCard from "./GenericActivityCard";
import { ScoredActivity } from "@/utils/calculateActivityScores";
import StarRating from "@/components/rating/StarRating";

type CardProps = {
  activity: ScoredActivity;
  onVerMas?: () => void;
};

export default function ScoredActivityCard({ activity, onVerMas }: CardProps) {
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
      <Typography
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'primary.main',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        #{activity.rank}
      </Typography>
      {onVerMas && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1, mr: 1 }}>
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={onVerMas}
            sx={{ textTransform: "none", fontWeight: 500, px: 0.5, minWidth: 0 }}
          >
            Más Información
          </Button>
        </Box>
      )}  
      <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
        <StarRating value={rating} onChange={handleRatingChange} />
      </Box>
    </GenericActivityCard>
  );
}