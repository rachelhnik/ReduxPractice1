import Author from "./Author";
import TimeAgo from "./TimeAgo";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { selectPostById } from "./postsSlice";
import ReactionButtons from "./ReactionsButton";
import { useSelector } from "react-redux";

const SinglePost = () => {
    const { postId } = useParams();

    const post = useSelector((state) => selectPostById(state, Number(postId)));

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        );
    }
    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <Author userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
};

export default SinglePost;
