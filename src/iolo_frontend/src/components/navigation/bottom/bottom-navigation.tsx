import {BottomNavigation, BottomNavigationAction} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import * as React from 'react';


function AppBottomNavigation() {
    const location = useLocation();

    return (
        <BottomNavigation showLabels value={location.pathname} sx={{ position: 'fixed', bottom: 0, width: 1.0 }}>
            <BottomNavigationAction label="Wallet" icon={<LockOpenOutlinedIcon/>} component={Link} to="/" value="/"/>
            <BottomNavigationAction label="Testaments" icon={<HistoryEduOutlinedIcon/>} component={Link} to="/testaments" value="/testaments" />
            <BottomNavigationAction label="Heirs" icon={<PersonOutlinedIcon/>} component={Link} to="/heirs" value="/heirs"/>
            <BottomNavigationAction label="Rules" icon={<SettingsOutlinedIcon/>} component={Link} to="/rules" value="/rules"/>
        </BottomNavigation>
    );
}

export default AppBottomNavigation;
