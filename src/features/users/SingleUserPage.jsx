import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectUserById } from "./usersSlice";
import { selectPostsByUsers } from "../posts/postsSlice";

const SingleUserPage = () => {
    const { userId } = useParams();

    const user = useSelector((state) => selectUserById(state, Number(userId)));
    const userPosts = useSelector((state) =>
        selectPostsByUsers(state, Number(userId))
    );
    const postsListOfUser = userPosts.map((post) => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ));

    return (
        <section>
            <h3>{user.name}</h3>
            {postsListOfUser}
        </section>
    );
};

export default SingleUserPage;
