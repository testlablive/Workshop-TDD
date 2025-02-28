import React, { useMemo } from 'react';
import { 
  makeStyles, 
  Text, 
  Card, 
  CardHeader, 
  Button,
  Divider,
  Badge
} from '@fluentui/react-components';
import { Vote } from '../types';

const useStyles = makeStyles({
  container: {
    marginTop: '24px',
    marginBottom: '24px'
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px'
  },
  votesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  badge: {
    fontSize: '16px',
    padding: '8px 16px'
  },
  summary: {
    marginTop: '16px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px'
  }
});

interface VotingResultsProps {
  votes: Vote[];
  onFinalizeEstimate: (estimate: string) => void;
  isAdmin: boolean;
}

export const VotingResults: React.FC<VotingResultsProps> = ({ 
  votes, 
  onFinalizeEstimate,
  isAdmin
}) => {
  const styles = useStyles();
  
  // Calculate vote statistics
  const voteStats = useMemo(() => {
    const validVotes = votes.filter(v => v.value && v.value !== '?').map(v => Number(v.value));
    
    if (validVotes.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        mode: null
      };
    }
    
    // Calculate average
    const sum = validVotes.reduce((acc, val) => acc + val, 0);
    const average = sum / validVotes.length;
    
    // Calculate min and max
    const min = Math.min(...validVotes);
    const max = Math.max(...validVotes);
    
    // Calculate mode (most common value)
    const counts = validVotes.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    let mode = null;
    let maxCount = 0;
    
    for (const [value, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        mode = Number(value);
      }
    }
    
    return {
      average: parseFloat(average.toFixed(1)),
      min,
      max,
      mode
    };
  }, [votes]);
  
  // Group votes by value for display
  const votesByValue = useMemo(() => {
    const result: Record<string, Vote[]> = {};
    
    votes.forEach(vote => {
      if (vote.value) {
        if (!result[vote.value]) {
          result[vote.value] = [];
        }
        result[vote.value].push(vote);
      }
    });
    
    return result;
  }, [votes]);
  
  const handleSelectEstimate = (estimate: string) => {
    if (isAdmin) {
      onFinalizeEstimate(estimate);
    }
  };
  
  return (
    <div className={styles.container}>
      <Card>
        <CardHeader header={<Text weight="semibold" size={500}>Voting Results</Text>} />
        
        <div className={styles.resultsContainer}>
          {Object.entries(votesByValue).map(([value, votes]) => (
            <div key={value}>
              <Text weight="semibold">
                {value} ({votes.length} vote{votes.length !== 1 ? 's' : ''})
              </Text>
              <div className={styles.votesRow}>
                {votes.map(vote => (
                  <Badge 
                    key={vote.userId} 
                    appearance="filled" 
                    color={value === '?' ? 'severe' : 'brand'}
                    className={styles.badge}
                  >
                    {vote.userName}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div className={styles.summary}>
          <Text weight="semibold" size={400}>Summary</Text>
          <div style={{ marginTop: '8px' }}>
            <Text>Average: {voteStats.average}</Text>
            <br />
            <Text>Range: {voteStats.min} - {voteStats.max}</Text>
            <br />
            <Text>Suggested estimate: {voteStats.mode}</Text>
          </div>
        </div>
        
        {isAdmin && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <Text weight="semibold">Select final estimate:</Text>
            <div className={styles.votesRow}>
              {['0', '1', '2', '3', '5', '8', '13', '21', '34'].map(value => (
                <Button 
                  key={value} 
                  appearance={value === String(voteStats.mode) ? 'primary' : 'secondary'}
                  onClick={() => handleSelectEstimate(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};