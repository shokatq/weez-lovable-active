import { useParams } from 'react-router-dom';
import SpaceChatInterface from '@/components/SpaceChatInterface';
import NotFound from './NotFound';

const SpaceChatPage = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  
  // Define valid spaces
  const validSpaces = ['marketing', 'finance', 'backend', 'frontend', 'operations'];
  
  if (!spaceName || !validSpaces.includes(spaceName.toLowerCase())) {
    return <NotFound />;
  }

  // Capitalize first letter for display
  const displayName = spaceName.charAt(0).toUpperCase() + spaceName.slice(1);

  return <SpaceChatInterface spaceName={displayName} />;
};

export default SpaceChatPage;