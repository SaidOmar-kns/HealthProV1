import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchFromApi } from '../../lib/api';

export interface LoginData {
    username: string,
    password: string
}


export interface PasswordResetData {
    password: string,
    confirm_password: string,
    reset_key: string
}


export interface LoggedInUser {
    _id: string,
    uid: string,
    name: string,
    email: string,
    is_active: boolean,
    token: string,
}


interface UsersState {
    loggedInUser: LoggedInUser | null;
    token: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UsersState = {
    loggedInUser: null,
    token: "",
    status: 'idle',
    error: null,
};

export const fetchLoggedInUserDetails = createAsyncThunk('users', async (uid: string) => {
    const response = await fetchFromApi(`users/${uid}`);
    return response as any;
});



export const updatePasswordRequest = createAsyncThunk('auth/request_update_password', async (userData: LoginData) => {
    const response = await fetchFromApi('auth/request_update_password', {
        data: userData,
    }, 'POST');
    return response as any;
});

export const updatePassword = createAsyncThunk('auth/update_password', async (updatePasswordData: PasswordResetData) => {
    const response = await fetchFromApi('auth/update_password', {
        data: updatePasswordData,
    }, 'POST');
    return response as any;
});

export const loginUser = createAsyncThunk('auth/login', async (userData: LoginData) => {
    const response = await fetchFromApi('auth/login', {
        data: userData,
    }, 'POST');
    return response as any;
});


export const LogoutUser = createAsyncThunk('auth/logout', async (uid: string) => {
    return uid;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setLoggedInUser: (state, action: PayloadAction<LoggedInUser | null>) => {
            state.loggedInUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoggedInUserDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLoggedInUserDetails.fulfilled, (state, action: PayloadAction<LoggedInUser>) => {
                state.status = 'succeeded';
                state.loggedInUser = action.payload;
            })
            .addCase(fetchLoggedInUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch users';
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoggedInUser>) => {
                state.status = 'succeeded';
                state.loggedInUser = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch user';
            })
            .addCase(updatePassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update Password';
            })

            .addCase(LogoutUser.fulfilled, (state) => {
                state.loggedInUser = null;
            });

    },
});

export const { setToken, setLoggedInUser } = authSlice.actions;

export default authSlice.reducer;