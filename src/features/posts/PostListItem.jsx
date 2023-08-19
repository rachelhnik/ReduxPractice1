/* eslint-disable react/prop-types */
import ReactionButtons from "./ReactionsButton";
import TimeAgo from "./TimeAgo";
import Author from "./Author";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

// eslint-disable-next-line react/prop-types
const PostListItem = ({ postId }) => {
    const post = useSelector((state) => selectPostById(state, postId));
    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <Author userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
};
export default PostListItem;
