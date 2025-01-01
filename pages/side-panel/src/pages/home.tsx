import { withErrorBoundary, withSuspense } from '@extension/shared';
import Container from '../components/container';

const Home = () => {
  return (
    <Container>
      <h1 className="text-2xl font-bold">Home</h1>
    </Container>
  );
};

export default withErrorBoundary(withSuspense(Home, <div> Loading ... </div>), <div> Error Occur </div>);
