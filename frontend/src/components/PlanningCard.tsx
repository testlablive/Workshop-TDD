import React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '120px',
    width: '80px',
    cursor: 'pointer',
    ...shorthands.transition('all', '0.2s'),
    ...shorthands.margin('8px'),
    
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: tokens.shadow16
    }
  },
  selected: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    transform: 'translateY(-5px)',
    boxShadow: tokens.shadow16
  },
  value: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold
  }
});

interface PlanningCardProps {
  value: string;
  selected: boolean;
  onClick: () => void;
}

export const PlanningCard: React.FC<PlanningCardProps> = ({ value, selected, onClick }) => {
  const styles = useStyles();
  
  return (
    <Card 
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <Text className={styles.value}>{value}</Text>
    </Card>
  );
};