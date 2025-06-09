import { Typography } from "@mui/material";
import GenericActivityCard from "./GenericActivityCard";
import LinearProgress from "@mui/material/LinearProgress";
import { ScoredActivity } from "@/utils/calculateActivityScores";

type CardProps = {
  activity: ScoredActivity;
}

export default function ScoredActivityCard({ activity }: CardProps) {
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
        Puntaje: {activity.score} / {activity.maxScore}
      </Typography>
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
    </GenericActivityCard>
  );
}