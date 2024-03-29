import {UiUser, UiUserType} from "../../services/IoloTypesForUi";

export interface UserState {
    principal: string,
    userVaultExisting: boolean,
    user?: UiUser;
    loginStatus: string,
    error?: string;
}

// Define the initial state using that type
export const initialState: UserState = {
    principal: undefined,
    userVaultExisting: false,
    loginStatus: 'init',
    user: {
        type: UiUserType.Person
    }
}
