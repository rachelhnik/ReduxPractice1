/* eslint-disable react/prop-types */
import ReactionButtons from "./ReactionsButton";
import TimeAgo from "./TimeAgo";
import Author from "./Author";

// eslint-disable-next-line react/prop-types
const PostListItem = ({ post }) => {
    return (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}</p>
            <p className="postCredit">
                <Author userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
};
export default PostListItem;
