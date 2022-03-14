import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Body from "./Body";
import { Container, Box, Tabs, Tab, Typography } from "@material-ui/core";
import ButtonAppBar from "./components/appBar";
import { useAuth0 } from "@auth0/auth0-react";


function App() {
  
  const [selectedTab, setSelectedTab] = useState(0);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
  const getUserMetadata = async () => {
    const domain = "darkninja.us.auth0.com";

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: "read:current_user",
      });

      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { user_metadata } = await metadataResponse.json();

      setUserMetadata(user_metadata);
    } catch (e) {
      console.log(e.message);
    }
  };

  getUserMetadata();
}, [getAccessTokenSilently, user?.sub]);

  return (
    <>
    <ButtonAppBar />
    <Container >
      <Box color="text.primary">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab3 " />
        </Tabs>
      </Box>
      <Body value={selectedTab} index={0} />
      <Body value={selectedTab} index={1} />
      <Body value={selectedTab} index={2} />
    </Container>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default App;