import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '../context/DarkModeContext';
import BarChartIcon from '@mui/icons-material/BarChart';
import '../styles/MobileSidebar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase-config';

const MobileSidebar = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const history = useNavigate();

    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        
        <Box
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
                height: '100vh', // Set height to cover the entire viewport height
                bgcolor: isDarkMode ? '#437AAA' : '#8BAECD',
                color: isDarkMode ? '#fff' : '#000',
            }}
            className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem disablePadding component={Link} to="/landing">
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText>
                        <div className="button-wrapper">
                            <span className="sidebar-button home-button">
                                <HomeIcon className="button-icon" />
                                <span className="button-text">Home</span>
                            </span>
                        </div>
                    </ListItemText>
                </ListItem>
                <ListItem disablePadding component={Link} to="/hourly">
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText>
                        <div className="button-wrapper">
                            <span className="sidebar-button chart-button">
                                <BarChartIcon className="button-icon" />
                                <span className="button-text">Monitor Progress</span>
                            </span>
                        </div>
                    </ListItemText>
                </ListItem>
                <ListItem disablePadding component={Link} to="/timeline">
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText>
                        <div className="button-wrapper">
                            <span className="sidebar-button progress-button">
                                <TimelineIcon className="button-icon" />
                                <span className="button-text">Activity Timeline</span>
                            </span>
                        </div>
                    </ListItemText>
                </ListItem>
                <ListItem disablePadding component={Link} to="/alert">
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText>
                        <div className="button-wrapper">
                            <span className="sidebar-button alert-button">
                                <WarningIcon className="button-icon" />
                                <span className="button-text">Alert</span>
                            </span>
                        </div>
                    </ListItemText>
                </ListItem>
                <ListItem disablePadding onClick={handleLogout}>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText>
                        <div className="button-wrapper">
                            <span className="sidebar-button logout-button">
                                <ExitToAppIcon className="button-icon" />
                                <span className="button-text">Logout</span>
                            </span>
                        </div>
                    </ListItemText>
                </ListItem>
            </List>
        </Box>
        
    );

    const handleLogout = () => {
        signOut(auth)
          .then(() => {
            // Clear user data from local storage
            localStorage.removeItem("user");
            history('/');
          })
          .catch(error => {
            console.error('Logout failed:', error.message);
          });
      };

    return (
        <>
<div className={`mob-sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
    <div style={{ position: 'fixed', top: '23px', right: '10px', zIndex: '99999' }}>
        <MenuIcon
            className='mob-menu-icon'
            onClick={toggleDrawer("left", true)}
        />
    </div>

    <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
    >
        {list("left")}
    </Drawer>
</div>



            {/* This div will be displayed only on large devices */}
            <div className="large-device-sidebar">
                {/* Content for large devices */}
            </div>
        </>
    )
}

export default MobileSidebar;
