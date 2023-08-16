import { useDispatch, useSelector } from "react-redux";
import {
    fetchPosts,
    getAllPosts,
    getPostError,
    getPostStatus,
} from "./postsSlice";

import { useEffect } from "react";
import PostListItem from "./PostListItem";

const PostsList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(getAllPosts);
    const postStatus = useSelector(getPostStatus);
    const postError = useSelector(getPostError);

    useEffect(() => {
        if (postStatus === "idle") {
            dispatch(fetchPosts());
        }
    }, [dispatch, postStatus]);

    let content;

    if (postStatus === "loading") {
        content = <p>loading ...</p>;
    } else if (postStatus === "succeeded") {
        const orderedPosts = posts
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date));

        content = orderedPosts.map((post) => (
            <PostListItem key={post.id} post={post} />
        ));
    } else if (postStatus === "failed") {
        content = <p>{postError}</p>;
    }

    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    );
};

export default PostsList;
