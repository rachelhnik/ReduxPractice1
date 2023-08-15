import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    { id: "0", name: "Mark Lee" },
    { id: "1", name: "Rachel Hnik" },
    { id: "2", name: "Na Yuta" },
];

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
});

export const getAllUsers = (state) => state.users;

export default usersSlice.reducer;
