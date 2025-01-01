import { withErrorBoundary, withSuspense } from '@extension/shared';
import Container from '../components/container';

const Settings = () => {
  return (
    <Container>
      <h1 className="text-2xl font-bold">Settings</h1>
    </Container>
  );
};

export default withErrorBoundary(withSuspense(Settings, <div> Loading ... </div>), <div> Error Occur </div>);
