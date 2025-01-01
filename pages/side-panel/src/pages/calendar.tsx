import { withErrorBoundary, withSuspense } from '@extension/shared';
import Container from '../components/container';

const Calendar = () => {
  return (
    <Container>
      <h1 className="text-2xl font-bold">Calendar</h1>
      {/* 
        TODO: Add a calendar component to display the user's calendar
      */}
    </Container>
  );
};

export default withErrorBoundary(withSuspense(Calendar, <div> Loading ... </div>), <div> Error Occur </div>);
