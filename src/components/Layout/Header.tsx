import React from "react";
import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import { styled } from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)`
  position: sticky;
  top: 0;
  background-color: #0c356a !important;
`;
const style = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0px 10px 0px",
};
const Header: React.FC = () => {
  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <StyledAppBar>
      <Toolbar>
        <Grid container sx={style}>
          <Grid item xs={10}>
            <Typography variant="h6">Mashreq</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h6" sx={{}}>
              {user === "null" ? "" : user}
            </Typography>
          </Grid>
          <Grid xs={1} item>
            <a onClick={handleLogout}>
              <LogoutIcon />
            </a>
          </Grid>
        </Grid>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
