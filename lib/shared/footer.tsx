/**
 * TODO:
 *  Update with any links
 *
 * @returns Footer
 */
import { Paper } from "@mui/material";
const Footer = () => {
  return (
    // <!--Footer container-->
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        bgcolor: "transparent",
      }}
    >
      <footer className="text-center text-white">
        {/* <!--Copyright section--> */}
        <div className="p-4 text-center text-xs" style={{ backgroundColor: "#1A1A1A" }}>
          © 2023 Copyright:
          <a className="text-white text-xs" href="https://github.com/blankenshipd001">
            &nbsp;Code-Monkey
          </a>
          <br />
          <a className="text-white text-xs/[2px]" href="https://github.com/blankenshipd001">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            <br />
            This product uses the Just Watch API but is not endorsed or certified by Just Watch.
          </a>
        </div>
      </footer>
    </Paper>
  );
};

export default Footer;
