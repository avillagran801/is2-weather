import { Card, CardActionArea, CardContent } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

type CardProps = {
  onClick: () => void;
}

export default function ActivityCard({onClick}: CardProps) {
  return(
    <>
      <Card sx={{
        height: "100%",
        display: "flex",
        backgroundColor: "#a3b18a"
      }}>
        <CardActionArea onClick={onClick}>
          <CardContent sx={{
            display: "flex",
            justifyContent: "center"
          }}>
            <AddIcon sx={{
              fontSize: "3rem"
            }}
            />
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}