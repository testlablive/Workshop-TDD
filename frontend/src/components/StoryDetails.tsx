import React from 'react';
import { 
  Card, 
  CardHeader, 
  Text, 
  makeStyles, 
  Button, 
  Divider,
  Badge
} from '@fluentui/react-components';
import { Story } from '../types';

const useStyles = makeStyles({
  card: {
    width: '100%',
    marginBottom: '16px'
  },
  description: {
    marginTop: '8px',
    marginBottom: '16px'
  },
  badge: {
    marginLeft: '8px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px'
  }
});

interface StoryDetailsProps {
  story: Story;
  isAdmin: boolean;
  onStartVoting: () => void;
  onRevealVotes: () => void;
  onResetVoting: () => void;
}

export const StoryDetails: React.FC<StoryDetailsProps> = ({
  story,
  isAdmin,
  onStartVoting,
  onRevealVotes,
  onResetVoting
}) => {
  const styles = useStyles();
  
  const getStatusBadge = () => {
    switch (story.status) {
      case 'pending':
        return <Badge appearance="outline" color="informative" className={styles.badge}>Pending</Badge>;
      case 'active':
        return <Badge appearance="filled" color="success" className={styles.badge}>Active</Badge>;
      case 'completed':
        return <Badge appearance="filled" color="important" className={styles.badge}>Completed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className={styles.card}>
      <CardHeader header={
        <div>
          <Text weight="semibold" size={500}>
            {story.title}
            {getStatusBadge()}
          </Text>
          {story.finalEstimate && (
            <Badge appearance="filled" color="brand" className={styles.badge}>
              {story.finalEstimate} points
            </Badge>
          )}
        </div>
      } />
      
      <Text className={styles.description}>
        {story.description}
      </Text>
      
      <Divider />
      
      {isAdmin && (
        <div className={styles.actions}>
          {story.status === 'pending' && (
            <Button appearance="primary" onClick={onStartVoting}>
              Start Voting
            </Button>
          )}
          
          {story.status === 'active' && (
            <>
              <Button appearance="secondary" onClick={onResetVoting}>
                Reset Votes
              </Button>
              <Button appearance="primary" onClick={onRevealVotes}>
                Reveal Votes
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};