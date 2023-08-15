import { useSelector } from "react-redux";
import { getAllPosts } from "./postsSlice";
import ReactionButtons from "./ReactionsButton";
import TimeAgo from "./TimeAgo";
import Author from "./Author";

const PostsList = () => {
    const posts = useSelector(getAllPosts);

    const orderedPosts = posts
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date));
    const renderPosts = orderedPosts.map((post) => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <p className="postCredit">
                <Author userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    ));
    return (
        <section>
            <h2>Posts</h2>
            {renderPosts}
        </section>
    );
};

export default PostsList;
