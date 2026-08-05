import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { UserStory, Project, Status, Priority } from '../types';

interface UserStoryDialogProps {
  open: boolean;
  userStory?: UserStory | null;
  projects: Project[];
  defaultProjectId?: string;
  onClose: () => void;
  onSave: (data: Partial<UserStory>) => void;
}

export const UserStoryDialog: React.FC<UserStoryDialogProps> = ({
  open,
  userStory,
  projects,
  defaultProjectId,
  onClose,
  onSave,
}) => {
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('TODO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [errors, setErrors] = useState<{ projectId?: string; title?: string }>({});

  useEffect(() => {
    if (userStory) {
      setProjectId(userStory.projectId);
      setTitle(userStory.title);
      setDescription(userStory.description || '');
      setStatus(userStory.status);
      setPriority(userStory.priority);
    } else {
      setProjectId(defaultProjectId || (projects.length > 0 ? projects[0].id : ''));
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
    }
    setErrors({});
  }, [userStory, open, defaultProjectId, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { projectId?: string; title?: string } = {};

    if (!projectId) newErrors.projectId = 'Project is required';
    if (!title.trim()) newErrors.title = 'Title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{userStory ? 'Edit User Story' : 'Create New User Story'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required error={Boolean(errors.projectId)}>
            <InputLabel id="project-select-label">Parent Project</InputLabel>
            <Select
              labelId="project-select-label"
              value={projectId}
              label="Parent Project"
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
            {errors.projectId && <FormHelperText>{errors.projectId}</FormHelperText>}
          </FormControl>

          <TextField
            label="Story Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={Boolean(errors.title)}
            helperText={errors.title}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="As a [user], I want to [feature] so that [benefit]"
          />

          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="URGENT">Urgent</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {userStory ? 'Save Changes' : 'Create User Story'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
