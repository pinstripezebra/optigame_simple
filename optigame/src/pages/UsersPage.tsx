import React from "react";
import { Text, Button } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

const UsersPage: React.FC = () => {
  const users = [1, 2, 3, 4, 5]; // Example user data
  return (
    <div className="flex gap-2">
      <div>
        <Button as={Link} to="/" colorScheme="teal" size="md">
          Go back to Home
        </Button>
        <Text fontSize="2xl" marginBottom="4">
          User List
        </Text>
        {users.map((user) => (
          <Link to={`/user/${user}`} key={user}>
            <Text fontSize="lg" marginBottom="2">
              User {user}
            </Text>
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default UsersPage;
