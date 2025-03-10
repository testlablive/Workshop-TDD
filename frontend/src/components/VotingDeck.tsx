import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { PlanningCard } from './PlanningCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    ...shorthands.margin('16px', '0')
  }
});

interface VotingDeckProps {
  selectedValue: string | null;
  onSelectCard: (value: string) => void;
  disabled?: boolean;
}

export const VotingDeck: React.FC<VotingDeckProps> = ({ 
  selectedValue, 
  onSelectCard,
  disabled = false
}) => {
  const styles = useStyles();
  const cardValues = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?'];
  
  return (
    <div className={styles.container}>
      {cardValues.map((value) => (
        <PlanningCard
          key={value}
          value={value}
          selected={selectedValue === value}
          onClick={() => {
            if (!disabled) {
              onSelectCard(value);
            }
          }}
        />
      ))}
    </div>
  );
};