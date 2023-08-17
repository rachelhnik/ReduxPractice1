import "./App.css";
import AddPostForm from "./features/posts/AddPost";
import PostsList from "./features/posts/PostsList";
import SinglePost from "./features/posts/SinglePost";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import EditPost from "./features/posts/EditPost";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PostsList />} />

                <Route path="post">
                    <Route index element={<AddPostForm />} />
                    <Route path=":postId" element={<SinglePost />} />
                    <Route path="edit/:postId" element={<EditPost />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
