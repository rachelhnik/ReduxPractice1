import { useSelector } from "react-redux";

import { getAllUsers } from "../users/usersSlice";

// eslint-disable-next-line react/prop-types
const Author = ({ userId }) => {
    const users = useSelector(getAllUsers);

    const author = users.find((user) => user.id === userId);
    return <span>by {author ? author.name : "unknown author"}</span>;
};

export default Author;
