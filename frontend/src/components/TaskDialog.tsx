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
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { TaskItem, UserStory, Status, Priority } from '../types';
import { Calendar } from 'lucide-react';
import { addToCurrentLocalDateTime, toDateTimeLocalInput, toLocalDateTimeApiValue } from '../utils/dateTime';

interface TaskDialogProps {
  open: boolean;
  task?: TaskItem | null;
  userStories: UserStory[];
  defaultUserStoryId?: string;
  onClose: () => void;
  onSave: (data: Partial<TaskItem>) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  task,
  userStories,
  defaultUserStoryId,
  onClose,
  onSave,
}) => {
  const [userStoryId, setUserStoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('TODO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ userStoryId?: string; title?: string }>({});

  useEffect(() => {
    if (task) {
      setUserStoryId(task.userStoryId);
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(toDateTimeLocalInput(task.dueDate));
    } else {
      setUserStoryId(defaultUserStoryId || (userStories.length > 0 ? userStories[0].id : ''));
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
    }
    setErrors({});
  }, [task, open, defaultUserStoryId, userStories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { userStoryId?: string; title?: string } = {};

    if (!userStoryId) newErrors.userStoryId = 'Parent User Story is required';
    if (!title.trim()) newErrors.title = 'Title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      userStoryId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: toLocalDateTimeApiValue(dueDate),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required error={Boolean(errors.userStoryId)}>
            <InputLabel id="user-story-select-label">Parent User Story</InputLabel>
            <Select
              labelId="user-story-select-label"
              value={userStoryId}
              label="Parent User Story"
              onChange={(e) => setUserStoryId(e.target.value)}
            >
              {userStories.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.projectName ? `[${s.projectName}] ${s.title}` : s.title}
                </MenuItem>
              ))}
            </Select>
            {errors.userStoryId && <FormHelperText>{errors.userStoryId}</FormHelperText>}
          </FormControl>

          <TextField
            label="Task Title"
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
            placeholder="Detailed technical specifications or sub-task steps"
          />

          <FormControl fullWidth>
            <InputLabel id="task-status-select-label">Status</InputLabel>
            <Select
              labelId="task-status-select-label"
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
            <InputLabel id="task-priority-select-label">Priority</InputLabel>
            <Select
              labelId="task-priority-select-label"
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

          <Box>
            <TextField
              label="Due Date & Time (Triggers Background Reminder)"
              type="datetime-local"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onClick={(e) => {
                try {
                  const inputEl = e.currentTarget.querySelector('input');
                  if (inputEl && 'showPicker' in inputEl) {
                    (inputEl as any).showPicker();
                  }
                } catch (err) {}
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <IconButton
                    size="small"
                    edge="start"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        const inputEl = (e.currentTarget.closest('.MuiFormControl-root') as HTMLElement)?.querySelector('input');
                        if (inputEl && 'showPicker' in inputEl) {
                          (inputEl as any).showPicker();
                        }
                      } catch (err) {}
                    }}
                    sx={{ mr: 0.5, p: 0.5 }}
                  >
                    <Calendar size={18} style={{ color: '#2563eb' }} />
                  </IconButton>
                ),
              }}
              sx={{
                '& input::-webkit-calendar-picker-indicator': {
                  cursor: 'pointer',
                  filter: 'invert(0.4) sepia(1) saturate(5) hue-rotate(200deg)',
                  fontSize: '1.1rem',
                },
              }}
              helperText="Set a deadline within 24 hours to test background scheduler notification."
            />
            {/* Quick Presets for Fast Testing */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                Quick Presets:
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setDueDate(addToCurrentLocalDateTime({ hours: 2 }));
                }}
                sx={{ fontSize: '0.75rem', textTransform: 'none', py: 0.2 }}
              >
                +2 Hours (Test Scheduler)
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setDueDate(addToCurrentLocalDateTime({ days: 1 }));
                }}
                sx={{ fontSize: '0.75rem', textTransform: 'none', py: 0.2 }}
              >
                +1 Day
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setDueDate(addToCurrentLocalDateTime({ days: 3 }));
                }}
                sx={{ fontSize: '0.75rem', textTransform: 'none', py: 0.2 }}
              >
                +3 Days
              </Button>
              {dueDate && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => setDueDate('')}
                  sx={{ fontSize: '0.75rem', textTransform: 'none', py: 0.2 }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
