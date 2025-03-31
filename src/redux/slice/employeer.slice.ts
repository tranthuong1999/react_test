import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiCreateEmployee, apiDeleteEmployee, apiGetEmployees, apiUpdateEmployee } from "../../apis/employeer.api";

type Employee = {
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
    user: {}
}

// Khởi tạo state ban đầu
const initialState: EmployeerState = {
    listEmployeer: null,
    loading: false,
    error: null,
    user: {}
};


class CategoryAsyncThunk {
    listEmployeer = createAsyncThunk(`employeer/listEmployeer`, async (props: { page: number, limit: number }) => {
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
export const listEmployeer = employeerAsyncThunk.listEmployeer;
export const updateEmployeer = employeerAsyncThunk.updateEmployeer;
export const deleteEmployeer = employeerAsyncThunk.deleteEmployeer;
export const createEmployeer = employeerAsyncThunk.createEmployeer;

// Reducer cập nhật state
const employeerSlice = createSlice({
    name: "employeerSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listEmployeer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listEmployeer.fulfilled, (state, action: PayloadAction<any>) => {
                console.log("listEmployeer fullfield", action.payload)
                state.loading = false;
                state.listEmployeer = action.payload;
            })
            .addCase(listEmployeer.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default employeerSlice.reducer;
