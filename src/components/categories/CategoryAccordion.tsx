import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CategoryWithActivities } from "@/pages/api/category/readWithActivitiesByUser";
import GenericActivityCard from "../activities/GenericActivityCard";

type CategoryAccordionProps = {
  category: CategoryWithActivities;
  defaultExpanded: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function CategoryAccordion({ category, defaultExpanded, onEditClick, onDeleteClick } : CategoryAccordionProps) {
  return(
    <>
      <Accordion
        defaultExpanded={defaultExpanded}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "#344e41"
          }}
        >
          <Typography
            sx={{
              color: "white"
            }}
          >
            {category.name}
          </Typography>

        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} padding={2} alignItems={"stretch"}>
            {category.ActivityCategory.map((activity) => (
              <Grid
                key={activity.Activity.id}
                sx={{ xs: 12, sm: 6, md: 4 }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <GenericActivityCard activity={activity.Activity} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Button
            onClick={onEditClick}
          >
            Editar
          </Button>
          <Button
            onClick={onDeleteClick}
          >
            Eliminar
          </Button>
        </AccordionActions>
        
      </Accordion>
    </>
  );
}