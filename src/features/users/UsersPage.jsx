import { useSelector } from "react-redux";
import { getAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersPage = () => {
    const users = useSelector(getAllUsers);

    const renderUsers = users.map((user) => (
        <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.name}</Link>
        </li>
    ));
    return (
        <section>
            <h2>Users</h2>

            <ul>{renderUsers}</ul>
        </section>
    );
};

export default UsersPage;
