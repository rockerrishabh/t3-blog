import ErrorPage from "../components/Error";
import Layout from "../components/Layout";

function NotFoundPage() {
  return (
    <Layout>
      <ErrorPage pageError="Not Found" errorTitle="Not Found" />
    </Layout>
  );
}

export default NotFoundPage;
