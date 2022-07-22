import ErrorPage from "../components/Error";
import Layout from "../components/Layout";

function NotFoundPage() {
  return <ErrorPage pageError="Not Found" errorTitle="Not Found" />;
}

export default NotFoundPage;
