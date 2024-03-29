import * as React from 'react';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../redux/hooks";
import AddIcon from "@mui/icons-material/Add";
import {Fab} from "@mui/material";
import {addTestamentThunk, testamentsActions} from "../../redux/testaments/testamentsSlice";
import {
    selectShowAddTestamentDialog,
    selectTestamentDialogItem,
    selectTestamentDialogItemState,
    selectTestamentError
} from "../../redux/testaments/testamentsSelectors";
import {selectCurrentUser} from "../../redux/user/userSelectors";
import {BasicDialog} from "../dialog/basic-dialog";
import {TestamentDialogContent} from './testament-dialog-content';
import {UiTestament, UiTestamentResponse} from "../../services/IoloTypesForUi";

export default function AddTestamentDialog() {
    const dispatch = useAppDispatch();
    const showAddTestamentDialog = useSelector(selectShowAddTestamentDialog);
    const dialogItem: UiTestamentResponse = useSelector(selectTestamentDialogItem);
    const testamentError = useSelector(selectTestamentError);
    const dialogItemState = useSelector(selectTestamentDialogItemState);
    const currentUser = useSelector(selectCurrentUser);

    const handleClickOpen = () => {
        dispatch(testamentsActions.openAddDialog());
    };

    const handleClose = () => {
        dispatch(testamentsActions.closeAddDialog());
    };

    const cancelAddTestament = () => {
        dispatch(testamentsActions.cancelAddTestament());
    }

    const createTestament = async () => {
        dispatch(addTestamentThunk({
            ...dialogItem,
            testator: currentUser,
            secrets: dialogItem.secrets.map(s => s.id)
        } as UiTestament));
    }

    return (
        <div>
            <Fab color="primary" aria-label="add" onClick={handleClickOpen} sx={{
                position: "fixed",
                bottom: (theme) => theme.spacing(10),
                right: (theme) => theme.spacing(2)
            }}>
                <AddIcon/>
            </Fab>
            <BasicDialog title="Add testament"
                         leadText="To add a testament choose the secrets, heirs and fill in the necessary information."
                         isOpen={showAddTestamentDialog}
                         handleClose={handleClose}
                         cancelAction={cancelAddTestament}
                         okAction={createTestament}
                         okButtonText="Add testament"
                         error={testamentError}
                         dialogItemState={dialogItemState}>
                <TestamentDialogContent/>
            </BasicDialog>
        </div>
    );
}
