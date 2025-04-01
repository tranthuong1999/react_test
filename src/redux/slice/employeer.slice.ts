import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiCreateEmployee, apiDeleteEmployee, apiGetEmployees, apiUpdateEmployee } from "../../apis/employeer.api";

export type Employee = {
    _id?: string;
    name: string;
    dateOfBirth: number;
    gender: number;
    email: string;
    address?: string;
}

interface EmployeerState {
    listEmployeer: any;
    loading: boolean;
    error: string | null;
    currentUser: Employee | null;
    totalPages: number | undefined
}

// Khởi tạo state ban đầu
const initialState: EmployeerState = {
    listEmployeer: null,
    loading: false,
    error: null,
    currentUser: null,
    totalPages: undefined
};


class CategoryAsyncThunk {
    fetchListEmployeer = createAsyncThunk(`employeer/listEmployeer`, async (props: { page: number, limit: number }) => {
        const { page, limit } = props;
        const result = await apiGetEmployees(page, limit);
        return result;
    });

    updateEmployeer = createAsyncThunk(`employeer/updateEmployeer`, async ({ id, dataUpdate }: { id: string; dataUpdate: any }) => {
        const result = await apiUpdateEmployee(id, dataUpdate);
        return result;
    });

    deleteEmployeer = createAsyncThunk(`employeer/deleteEmployeer`, async (id: string) => {
        const result = await apiDeleteEmployee(id);
        return result;
    });

    createEmployeer = createAsyncThunk(`employeer/createEmployeer`, async (data: Employee) => {
        const result = await apiCreateEmployee(data);
        return result;
    });
}

const employeerAsyncThunk = new CategoryAsyncThunk();
// action
export const fetchListEmployeer = employeerAsyncThunk.fetchListEmployeer;
export const updateEmployeer = employeerAsyncThunk.updateEmployeer;
export const deleteEmployeer = employeerAsyncThunk.deleteEmployeer;
export const createEmployeer = employeerAsyncThunk.createEmployeer;

// Reducer cập nhật state
const employeerSlice = createSlice({
    name: "employeerSlice",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<Employee>) => {
            state.currentUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListEmployeer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchListEmployeer.fulfilled, (state, action: PayloadAction<any>) => {
                console.log("listEmployeer fullfield", action.payload)
                state.loading = false;
                state.listEmployeer = action.payload.data;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchListEmployeer.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createEmployeer.fulfilled, (state, action: PayloadAction<any>) => {
                state.listEmployeer = state.listEmployeer.concat(action.payload.employee)
            })
            .addCase(updateEmployeer.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload) {
                    state.listEmployeer = state.listEmployeer.map((item: Employee) => {
                        if (item._id === action.payload._id) {
                            return action.payload;
                        }
                        return item;
                    })
                }
            })
            .addCase(deleteEmployeer.fulfilled, (state, action: PayloadAction<any>) => {
                state.listEmployeer = state.listEmployeer.filter((item: Employee) => item._id !== action.payload._id)
            })
    },
});
export const { setCurrentUser } = employeerSlice.actions;

export default employeerSlice.reducer;
