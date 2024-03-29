import {Box, Button, MenuItem, Select, Typography} from "@mui/material";
import * as React from "react";
import {useEffect} from "react";
import {getCurrentUserThunk, updateUserThunk, userActions} from "../../redux/user/userSlice";
import {useAppDispatch} from "../../redux/hooks";
import {PageLayout} from "../../components/layout/page-layout";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/user/userSelectors";
import {UiUser, UiUserType} from "../../services/IoloTypesForUi";
import TextField from "@mui/material/TextField";
import {StyledAppBar, UserProfile} from "../../components/layout/search-bar";

export function Profile() {

    const dispatch = useAppDispatch();
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        if (!currentUser?.name) {
            dispatch(getCurrentUserThunk());
        }
    }, [currentUser]);

    const updateCurrentUser = (user: UiUser) => {
        dispatch(userActions.updateUser(user))
    }

    const updateUser = () => {
        dispatch(updateUserThunk(currentUser));
    }

    return (
        <PageLayout title="Profile">
            <StyledAppBar position="sticky">
                <UserProfile/>
            </StyledAppBar>
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="body2">Type of user</Typography>
                <Select
                    id="usertype-select"
                    value={currentUser?.type}
                    label="Type of user"
                    onChange={e => updateCurrentUser({
                        ...currentUser,
                        type: UiUserType[e.target.value as keyof typeof UiUserType]
                    })}
                    sx={{width: '100%'}}
                >
                    {Object.keys(UiUserType)
                        .map(key => {
                            return <MenuItem key={key} value={key}>{key}</MenuItem>
                        })

                    }
                </Select>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant="standard"
                    value={currentUser.name}
                    onChange={e => updateCurrentUser({
                        ...currentUser,
                        name: e.target.value
                    })}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email"
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant="standard"
                    value={currentUser.email}
                    onChange={e => updateCurrentUser({
                        ...currentUser,
                        email: e.target.value
                    })}
                />
                <Button variant="contained" sx={{m: '20px auto 0px auto'}} onClick={updateUser}>
                    Update User
                </Button>
            </Box>
        </PageLayout>
    );
}
