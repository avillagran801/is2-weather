import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

type CardProps = {
  title: string;
  customColor?: string;
  onClick: () => void;
}

export default function ActivityCard({title, customColor, onClick}: CardProps) {
  return(
    <>
      <Card>
        <CardActionArea onClick={onClick}>
          <CardContent sx={{
            backgroundColor: customColor? customColor : "lightblue"
          }}>
            <Typography>
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}