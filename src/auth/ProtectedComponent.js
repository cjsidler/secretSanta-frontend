import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "../pages/HomePage";

const ProtectedComponent = ({ Component, ...propsForComponent }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    return isAuthenticated ? (
        <Component {...propsForComponent} />
    ) : isLoading ? (
        <p>Loading...</p>
    ) : (
        <HomePage />
    );
};

export default ProtectedComponent;
