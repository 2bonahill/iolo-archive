import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialState} from "./testamentsState";
import IcCryptService from "../../services/IcCryptService";
import {RootState} from "../store";
import {UiTestament, UiTestamentListEntry} from "../../services/IcTypesForUi";
import {mapError} from "../../utils/errorMapper";

const icCryptService = new IcCryptService();

export const addTestamentThunk = createAsyncThunk<UiTestament, UiTestament, { state: RootState }>('testaments/add',
    async (testament, {rejectWithValue}) => {
        console.log('add testament', testament)
        try {
            const result = await icCryptService.addTestament(testament);
            return {
                ...testament,
                id: result?.id,
                date_created: result?.date_created ? new Date(result?.date_created.toString()) : new Date(),
                date_modified: result?.date_modified ? new Date(result?.date_modified.toString()) : new Date()
            } as UiTestament;
        } catch (e) {
            rejectWithValue(mapError(e))
        }
    }
);

export const updateTestamentThunk = createAsyncThunk<UiTestament, UiTestament, { state: RootState }>('testaments/update',
    async (uiTestament, {rejectWithValue}) => {
        console.log('update testament', uiTestament)
        try {
            const result = await icCryptService.updateTestament(uiTestament);
            return {
                ...uiTestament,
                id: result?.id,
                date_created: result?.date_created ? new Date(result?.date_created.toString()) : new Date(),
                date_modified: result?.date_modified ? new Date(result?.date_modified.toString()) : new Date()
            } as UiTestament;
        } catch (e) {
            rejectWithValue(mapError(e))
        }
    }
);


export const deleteTestamentThunk = createAsyncThunk<string, UiTestament, {
    state: RootState
}>('testaments/delete',
    async (testament, {rejectWithValue}) => {
        console.log('delete testaments', testament)
        try {
            await icCryptService.deleteTestament(testament.id);
            return testament.id;
        } catch (e) {
            rejectWithValue(mapError(e))
        }
    }
);

export const loadTestamentsThunk = createAsyncThunk<UiTestamentListEntry[], void, { state: RootState }>('testaments/load',
    async (_, {getState}) => {
        console.log('getting testament list...')
        const result = await icCryptService.getTestamentList();
        return result;
    }
);

// Define a type for the slice state
export const testamentsSlice = createSlice({
    name: 'testaments',
    initialState,
    reducers: {
        closeAddDialog: state => {
            state.showAddDialog = false
        },
        openAddDialog: state => {
            state.showAddDialog = true
        },
        cancelAddOrEditTestament: state => {
            state.testamentToAdd = initialState.testamentToAdd;
            state.showAddDialog = false;
            state.showEditDialog = false;
        },
        openEditDialog: state => {
            state.showEditDialog = true
        },
        openDeleteDialog: state => {
            state.showDeleteDialog = true
        },
        closeDeleteDialog: state => {
            state.showDeleteDialog = false
            state.testamentToAdd = initialState.testamentToAdd;
        },
        cancelDeleteTestament: state => {
            state.testamentToAdd = initialState.testamentToAdd;
            state.showDeleteDialog = false;
        },
        updateTestamentToAdd: (state, action: PayloadAction<UiTestament>) => {
            state.testamentToAdd = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTestamentsThunk.pending, (state) => {
                state.loadingState = 'loading';
            })
            .addCase(loadTestamentsThunk.fulfilled, (state, action) => {
                state.loadingState = 'succeeded';
                //state.testamentsList = mapUiTestaments(action.payload)
                state.testamentsList = action.payload
            })
            .addCase(loadTestamentsThunk.rejected, (state, action) => {
                state.loadingState = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTestamentThunk.pending, (state) => {
                state.addState = 'loading';
                state.showAddDialog = true;
            })
            .addCase(addTestamentThunk.fulfilled, (state, action) => {
                state.addState = 'succeeded';
                state.showAddDialog = false;
                state.testamentToAdd = initialState.testamentToAdd;
                state.testamentsList = [...state.testamentsList, action.payload]
            })
            .addCase(addTestamentThunk.rejected, (state, action) => {
                state.addState = 'failed';
                state.error = action.error.message;
                state.showAddDialog = true;
            })
            .addCase(updateTestamentThunk.pending, (state) => {
                state.addState = 'loading';
            })
            .addCase(updateTestamentThunk.fulfilled, (state, action) => {
                state.addState = 'succeeded';
                state.showEditDialog = false;
                state.testamentToAdd = initialState.testamentToAdd;
                state.testamentsList = [...state.testamentsList.filter(h => h.id != action.payload.id), action.payload]
            })
            .addCase(updateTestamentThunk.rejected, (state, action) => {
                state.addState = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteTestamentThunk.pending, (state) => {
                state.addState = 'loading';
            })
            .addCase(deleteTestamentThunk.fulfilled, (state, action) => {
                state.addState = 'succeeded';
                state.showDeleteDialog = false;
                state.testamentsList = [...state.testamentsList.filter(h => h.id != action.payload)]
            })
            .addCase(deleteTestamentThunk.rejected, (state, action) => {
                state.addState = 'failed';
                state.error = action.error.message;
            });
    },
})

// Action creators are generated for each case reducer function
export const testamentsActions = testamentsSlice.actions;

export const testamentsReducer = testamentsSlice.reducer;
