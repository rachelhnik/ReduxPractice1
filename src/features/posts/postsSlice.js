import { sub } from "date-fns";
import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postAdapter.getInitialState({
    status: "idle",
    error: null,
    count: 0,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const response = await axios.get(POSTS_URL);
    return response.data;
});

export const addNewPost = createAsyncThunk(
    "posts/addNewPost",
    async (newpost) => {
        const response = await axios.post(POSTS_URL, newpost);
        return response.data;
    }
);

export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async (postToEdit) => {
        const { id } = postToEdit;
        try {
            const response = await axios.put(`${POSTS_URL}/${id}`, postToEdit);
            return response.error;
        } catch (error) {
            return postToEdit;
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postToDelete) => {
        const { id } = postToDelete;
        try {
            const response = await axios.delete(
                `${POSTS_URL}/${id}`,
                postToDelete
            );
            if (response.status === 200) return postToDelete;
            return `${response?.status}: ${response?.statusText}`;
        } catch (error) {
            return error.message;
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.posts.find((post) => post.id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        },
        increaseCount(state) {
            state.count = state.count + 1;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";

                let min = 1;
                const loadedPosts = action.payload.map((post) => {
                    post.date = sub(new Date(), {
                        minutes: min++,
                    }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    };
                    return post;
                });
                //state.posts = state.posts.concat(loadedPosts);
                postAdapter.upsertMany(state, loadedPosts);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1;
                    if (a.id < b.id) return -1;
                });
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();

                action.payload.reactions = {
                    thumbsUp: 0,
                    hooray: 0,
                    heart: 0,
                    rocket: 0,
                    eyes: 0,
                };
                //state.posts.push(action.payload);
                postAdapter.addOne(state, action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("Update could not complete");
                    console.log(action.payload);
                    return;
                }
                //const { id } = action.payload;
                action.payload.date = new Date().toISOString();

                // state.posts = [...posts, action.payload];
                postAdapter.upsertOne(state, action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("Delete could not complete");
                    console.log(action.payload);
                    return;
                }
                const { id } = action.payload;
                postAdapter.removeOne(state, id);
                // const posts = state.posts.filter((post) => post.id !== id);
                // state.posts = posts;
            });
    },
});

export const {
    selectAll: getAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    // Pass in a selector that returns the posts slice of state
} = postAdapter.getSelectors((state) => state.posts);

export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const selectPostsByUsers = createSelector(
    [getAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
