// IC
import {useAppDispatch} from "../../redux/hooks";
import {Backdrop, Box, Button, CircularProgress, Typography} from "@mui/material";
import * as React from "react";
import {createUserThunk} from "../../redux/user/userSlice";


export function Onboarding() {


    const dispatch = useAppDispatch();
    const [loadingIconIsOpen, setLoadingIcon] = React.useState(false);

    // Login/Logout
    async function createUser() {
        setLoadingIcon(true);
        dispatch(createUserThunk())
        setLoadingIcon(false);
    }

    return (
        <Box justifyContent="center">
            <Typography paragraph>
                It seems you have not yet created your IC Crypt account. You wanna go for one?
            </Typography>
            <Button variant="contained" sx={{ml: 2, mt: 1}} onClick={createUser}>
                Create Account
            </Button>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loadingIconIsOpen}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Box>
    );
}
