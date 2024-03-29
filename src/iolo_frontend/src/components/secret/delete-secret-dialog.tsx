import * as React from 'react';
import {useSelector} from "react-redux";
import {
    selectDialogItem,
    selectDialogItemState,
    selectSecretsError,
    selectShowDeleteSecretDialog
} from "../../redux/secrets/secretsSelectors";
import {useAppDispatch} from "../../redux/hooks";
import {deleteSecretThunk, secretsActions} from "../../redux/secrets/secretsSlice";
import {BasicDialog} from "../dialog/basic-dialog";

export default function DeleteSecretDialog() {
    const dispatch = useAppDispatch();
    const showDeleteSecretDialog: boolean = useSelector(selectShowDeleteSecretDialog);
    const dialogItem = useSelector(selectDialogItem);
    const dialogItemState = useSelector(selectDialogItemState);
    const secretError = useSelector(selectSecretsError);

    const handleClose = () => {
        dispatch(secretsActions.closeAddOrEditDialog());
    };

    const cancelDeleteSecret = () => {
        dispatch(secretsActions.cancelDeleteSecret())
    }

    const deleteSecret = async () => {
        dispatch(deleteSecretThunk(dialogItem));
    }

    return (
        <BasicDialog title="Delete secret"
                     leadText={`Are you sure you want to delete the secret ${dialogItem.name}?`}
                     isOpen={showDeleteSecretDialog}
                     handleClose={handleClose}
                     cancelAction={cancelDeleteSecret}
                     okAction={deleteSecret}
                     okButtonText="Delete secret"
                     error={secretError}
                     dialogItemState={dialogItemState}>
        </BasicDialog>
    );
}
