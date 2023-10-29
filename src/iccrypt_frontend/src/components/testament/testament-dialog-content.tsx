import * as React from 'react';
import {FC, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import {useSelector} from "react-redux";
import {selectGroupedSecrets} from "../../redux/secrets/secretsSelectors";
import {useAppDispatch} from "../../redux/hooks";
import {FormControl, Typography} from "@mui/material";
import {UiSecretListEntry, UiTestament, UiUser} from "../../services/IcTypesForUi";
import {testamentsActions} from "../../redux/testaments/testamentsSlice";
import {selectTestamentDialogItem} from "../../redux/testaments/testamentsSelectors";
import {selectHeirs} from "../../redux/heirs/heirsSelectors";
import {SelectList, SelectListItem} from "../selectlist/select-list";


export interface TestamentDialogContentProps {
    readonly?: boolean;
}

interface SelectedHeir extends SelectListItem, UiUser {
}

interface SelectedSecret extends SelectListItem, UiSecretListEntry {
}

export const TestamentDialogContent: FC<TestamentDialogContentProps> = ({readonly}) => {
    const dispatch = useAppDispatch();
    const dialogItem = useSelector(selectTestamentDialogItem);
    const groupedSecretList = useSelector(selectGroupedSecrets);
    const heirsList = useSelector(selectHeirs);
    const [selectedSecrets, setSelectedSecrets] = React.useState<SelectedSecret[]>([]);
    const [selectedHeirs, setSelectedHeirs] = React.useState<SelectedHeir[]>([]);

    useEffect(() => {
        const selectedHeirs = heirsList.map(h => {
            const heir = dialogItem.heirs.find(dh => dh.id === h.id);
            return heir ? {...h, selected: true} : {...h, selected: false};
        })
        setSelectedHeirs(selectedHeirs)
        const selectedSecrets = [...groupedSecretList.passwordList, ...groupedSecretList.notesList, ...groupedSecretList.documentsList, ...groupedSecretList.othersList].map(s => {
            const secret = dialogItem.secrets.find(ds => ds === s.id);
            return secret ? {...s, selected: true} : {...s, selected: false};
        })
        setSelectedSecrets(selectedSecrets)
    }, [dialogItem]);

    const updateTestamentToAdd = (testament: UiTestament) => {
        dispatch(testamentsActions.updateDialogItem(testament))
    }

    const handleSecretChange = (secret: SelectedSecret) => {
        const oldState = dialogItem.secrets.find(s => s === secret.id);
        let secrets: string[];
        if (oldState) {
            //not selected
            console.log('secret.id', secret.id)
            secrets = dialogItem.secrets.filter(s => s !== secret.id);
            setSelectedSecrets(selectedSecrets.map(s => s.id !== secret.id ? s : {...s, selected: false}));
        }else{
            //selected
            secrets = [...dialogItem.secrets, secret.id]
            setSelectedSecrets(selectedSecrets.map(s => s.id !== secret.id ? s : {...s, selected: true}));
        }
        //Add
        dispatch(testamentsActions.updateDialogItem({
            ...dialogItem,
            secrets
        }))
    };

    const handleHeirChange = (heir: SelectedHeir) => {
        const oldState = dialogItem.heirs.find(s => s.id === heir.id);
        let heirs: SelectedHeir[];
        if (oldState) {
            //not selected
            heirs = dialogItem.heirs.filter(s => s.id !== heir.id)
            setSelectedHeirs(selectedHeirs.map(s => s.id !== heir.id ? s : {...s, selected: false}));
        }else{
            //selected
            heirs = [...dialogItem.heirs, heir]
            setSelectedHeirs(selectedHeirs.map(s => s.id !== heir.id ? s : {...s, selected: true}));
        }
        //Add
        dispatch(testamentsActions.updateDialogItem({
            ...dialogItem,
            heirs: heirs
        }))
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <>
            <FormControl fullWidth>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant="standard"
                    value={dialogItem.name}
                    disabled={readonly}
                    onChange={e => updateTestamentToAdd({
                        ...dialogItem,
                        name: e.target.value
                    })}
                />
            </FormControl>
            <FormControl fullWidth>
                <Typography variant="body2">Secrets</Typography>
                <SelectList handleToggle={handleSecretChange} listItem={selectedSecrets} readonly={readonly}/>
            </FormControl>
            <FormControl fullWidth>
                <Typography variant="body2">Heirs</Typography>
                <SelectList handleToggle={handleHeirChange} listItem={selectedHeirs} readonly={readonly}/>
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    margin="dense"
                    id="conditionArg"
                    label="Condition Arg"
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant="standard"
                    value={dialogItem.conditionArg}
                    disabled={readonly}
                    onChange={e => updateTestamentToAdd({
                        ...dialogItem,
                        conditionArg: e.target.value
                    })}
                />
            </FormControl>
        </>
    );
}
