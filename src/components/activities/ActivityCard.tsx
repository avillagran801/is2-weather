import { Button, CardActions } from "@mui/material";
import { ActivityWithCategories } from "@/pages/api/activity/readByUser";
import GenericActivityCard from "./GenericActivityCard";

type CardProps = {
  activity: ActivityWithCategories;
  onClick: () => void;
}

export default function ActivityCard({ activity, onClick }: CardProps) {
  return (
    <GenericActivityCard activity={activity}>
      <CardActions>
        <Button onClick={onClick}>Ver más</Button>
      </CardActions>
    </GenericActivityCard>
  );
}