import { useDispatch, useSelector } from "react-redux";
import {
    fetchPosts,
    getPostError,
    getPostStatus,
    selectPostIds,
} from "./postsSlice";

import { useEffect } from "react";
import PostListItem from "./PostListItem";

const PostsList = () => {
    const dispatch = useDispatch();

    const postIds = useSelector(selectPostIds);

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
        content = postIds.map((postId) => (
            <PostListItem key={postId} postId={postId} />
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
