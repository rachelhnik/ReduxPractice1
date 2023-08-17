import { sub } from "date-fns";
import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

// const initialState = [
//     {
//         id: "1",
//         title: "NCT",
//         content: "To the world , this is NCT",

//         date: sub(new Date(), { minutes: 10 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0,
//         },
//     },
//     {
//         id: "2",
//         title: "SHINee",
//         content: "SHINee's back ",

//         date: sub(new Date(), { minutes: 10 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0,
//         },
//     },
// ];

const initialState = {
    posts: [],
    status: "idle",
    error: null,
};

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
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload);
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        userId,
                        date: new Date().toISOString(),
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0,
                        },
                    },
                };
            },
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.posts.find((post) => post.id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
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
                state.posts = state.posts.concat(loadedPosts);
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
                state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("Update could not complete");
                    console.log(action.payload);
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                const posts = state.posts.filter((post) => post.id !== id);
                state.posts = [...posts, action.payload];
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("Delete could not complete");
                    console.log(action.payload);
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter((post) => post.id !== id);
                state.posts = posts;
            });
    },
});

export const getAllPosts = (state) => state.posts.posts;
export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;

export const selectPostById = (state, postId) =>
    state.posts.posts.find((post) => post.id === Number(postId));

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
