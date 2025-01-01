import { useNavigate } from 'react-router';
import Container from '../components/container';

const Entry = () => {
  const navigate = useNavigate();
  const logo = 'side-panel/entry_logo.png';

  // TODO: Check if the user is authenticated
  // If authenticated, navigate to '/home'
  // Otherwise, display the entry page with a login button

  return (
    <Container className="items-center justify-center">
      <h1 className="mb-6 text-4xl font-bold">Sidekick</h1>
      <p className="mb-4 text-lg">Be the hero of your day. Sidekick is here to make it happen.</p>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => navigate('/home')}>
        Login
      </button>
      <img src={chrome.runtime.getURL(logo)} alt="logo" className="size-80" />
    </Container>
  );
};

export default Entry;
