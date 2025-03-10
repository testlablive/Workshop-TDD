import React from 'react';
import { 
  makeStyles, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell,
  Badge,
  Text
} from '@fluentui/react-components';
import { CheckmarkCircle24Regular, QuestionCircle24Regular } from '@fluentui/react-icons';
import { User, Vote } from '../types';

const useStyles = makeStyles({
  table: {
    width: '100%'
  },
  votedIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
});

interface ParticipantListProps {
  participants: User[];
  votes: Vote[];
  showVotes: boolean;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ 
  participants, 
  votes, 
  showVotes 
}) => {
  const styles = useStyles();
  
  // Filter to only show players (not observers)
  const players = participants.filter(p => p.role === 'player');
  
  return (
    <Table className={styles.table}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          {showVotes && <TableHeaderCell>Vote</TableHeaderCell>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => {
          const playerVote = votes.find(v => v.userId === player.id);
          const hasVoted = !!playerVote;
          
          return (
            <TableRow key={player.id}>
              <TableCell>
                <Text weight="semibold">{player.name}</Text>
              </TableCell>
              <TableCell>
                <div className={styles.votedIndicator}>
                  {hasVoted ? (
                    <>
                      <CheckmarkCircle24Regular color="green" />
                      <Text>Voted</Text>
                    </>
                  ) : (
                    <>
                      <QuestionCircle24Regular color="gray" />
                      <Text>Waiting</Text>
                    </>
                  )}
                </div>
              </TableCell>
              {showVotes && (
                <TableCell>
                  {hasVoted && playerVote.value ? (
                    <Badge appearance="filled" color="brand" shape="rounded">
                      {playerVote.value}
                    </Badge>
                  ) : (
                    <Text>-</Text>
                  )}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};