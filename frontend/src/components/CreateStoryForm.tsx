import React, { useState } from 'react';
import { 
  makeStyles, 
  Input, 
  Textarea, 
  Button, 
  Text,
  Card,
  CardHeader
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '8px'
  }
});

interface CreateStoryFormProps {
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
}

export const CreateStoryForm: React.FC<CreateStoryFormProps> = ({ onSubmit, onCancel }) => {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };
  
  return (
    <Card>
      <CardHeader header={<Text weight="semibold" size={500}>Add New Story</Text>} />
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Story title"
          value={title}
          onChange={(e, data) => setTitle(data.value)}
          required
        />
        
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e, data) => setDescription(data.value)}
          resize="vertical"
          rows={3}
        />
        
        <div className={styles.actions}>
          <Button appearance="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button appearance="primary" type="submit" disabled={!title.trim()}>
            Add Story
          </Button>
        </div>
      </form>
    </Card>
  );
};