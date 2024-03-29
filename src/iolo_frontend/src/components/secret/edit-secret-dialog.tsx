import * as React from 'react';
import {useSelector} from "react-redux";
import {
    selectDialogItem,
    selectDialogItemState,
    selectSecretsError,
    selectShowEditSecretDialog
} from "../../redux/secrets/secretsSelectors";
import {useAppDispatch} from "../../redux/hooks";
import {secretsActions, updateSecretThunk} from "../../redux/secrets/secretsSlice";
import {BasicDialog} from "../dialog/basic-dialog";
import {SecretDialogContent} from './secret-dialog-content';

export default function EditSecretDialog() {
    const dispatch = useAppDispatch();
    const showEditSecretDialog: boolean = useSelector(selectShowEditSecretDialog);
    const dialogItem = useSelector(selectDialogItem);
    const dialogItemState = useSelector(selectDialogItemState);
    const secretError = useSelector(selectSecretsError);

    const handleClose = () => {
        dispatch(secretsActions.closeAddOrEditDialog());
    };

    const cancelEditSecret = () => {
        dispatch(secretsActions.cancelEditSecret())
    }

    const updateSecret = async () => {
        dispatch(updateSecretThunk(dialogItem));
    }

    return (
        <BasicDialog title="Edit secret"
                     leadText="Edit your secret"
                     isOpen={showEditSecretDialog}
                     handleClose={handleClose}
                     cancelAction={cancelEditSecret}
                     okAction={updateSecret}
                     okButtonText="Update secret"
                     error={secretError}
                     dialogItemState={dialogItemState}>
            <SecretDialogContent/>
        </BasicDialog>
    );
}
