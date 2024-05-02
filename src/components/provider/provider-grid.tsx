import { Box, Divider, Grid, Paper } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { ProviderBox } from "./provider-box";

interface providerGrid {
  title: string;
  items: ServiceProvider[];
}

export const ProviderGrid = ({ title, items }: providerGrid) => (
  <Grid item xs={4}>
    <Paper sx={{ backgroundColor: "#3D3D3D", textAlign: "left" }}>
      <Box sx={{ paddingBottom: "10px" }}>
        <div style={{ fontWeight: "400", fontSize: "18px", marginLeft: "10px", paddingBottom: "7px", paddingTop: "6px" }}>{title}</div>
        <Divider />
        {items.length > 0 && items.map((item: ServiceProvider) => {
            return (
                <ProviderBox provider={item} key={item.provider_id} />
            )
        })}
      </Box>
    </Paper>
  </Grid>
);
