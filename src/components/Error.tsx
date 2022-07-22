import Layout from "../components/Layout";

function ErrorPage({
  pageError,
  errorTitle,
}: {
  pageError: string;
  errorTitle: string;
}) {
  return (
    <Layout title={errorTitle}>
      <div>
        <h1>Page Not Found</h1>
        <p>Error: {pageError}</p>
      </div>
    </Layout>
  );
}

export default ErrorPage;
