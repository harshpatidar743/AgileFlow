import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Plus,
  Pencil,
  Trash2,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';
import { UserStory, Project } from '../types';
import { StatusChip } from '../components/StatusChip';
import { PriorityChip } from '../components/PriorityChip';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface UserStoriesPageProps {
  userStories: UserStory[];
  projects: Project[];
  onOpenCreateDialog: (defaultProjectId?: string) => void;
  onOpenEditDialog: (story: UserStory) => void;
  onConfirmDelete: (story: UserStory) => void;
}

export const UserStoriesPage: React.FC<UserStoriesPageProps> = ({
  userStories,
  projects,
  onOpenCreateDialog,
  onOpenEditDialog,
  onConfirmDelete,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedProjectId = searchParams.get('projectId') || '';

  const handleProjectFilterChange = (projectId: string) => {
    if (projectId) {
      setSearchParams({ projectId });
    } else {
      setSearchParams({});
    }
  };

  const filteredStories = selectedProjectId
    ? userStories.filter((s) => s.projectId === selectedProjectId)
    : userStories;

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
            User Stories Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Hierarchical level 2: Functional features attached to Projects
          </Typography>
        </Box>

        {projects.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => onOpenCreateDialog(selectedProjectId || undefined)}
            sx={{ textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            Create User Story
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4, maxWidth: 360 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="project-filter-label">Filter by Project</InputLabel>
          <Select
            labelId="project-filter-label"
            value={selectedProjectId}
            label="Filter by Project"
            onChange={(e) => handleProjectFilterChange(e.target.value)}
          >
            <MenuItem value="">
              <em>All Projects</em>
            </MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredStories.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
            No User Stories found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
            {projects.length === 0
              ? 'Create a project first before adding user stories.'
              : selectedProjectId
              ? 'No user stories in this project yet.'
              : 'Click "Create User Story" to add your first story!'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredStories.map((story) => {
            const taskProgress =
              story.totalTasks > 0
                ? Math.round((story.completedTasks / story.totalTasks) * 100)
                : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={story.id}>
                <Card
                  elevation={0}
                  onClick={() => navigate(`/tasks?userStoryId=${story.id}`)}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                      borderColor: '#cbd5e1',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                        {story.projectName || 'Project'}
                      </Typography>
                      <Box>
                        <Tooltip title="Edit User Story">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onOpenEditDialog(story); }}>
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User Story">
                          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onConfirmDelete(story); }}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                      {story.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, minHeight: 38 }}>
                      {story.description || 'No detailed description.'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      <StatusChip status={story.status} />
                      <PriorityChip priority={story.priority} />
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          Sub-tasks ({story.completedTasks}/{story.totalTasks})
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {taskProgress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={taskProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: taskProgress === 100 ? '#16a34a' : '#2563eb',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 3, pb: 2.5, pt: 0, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      startIcon={<CheckSquare size={16} />}
                      endIcon={<ArrowRight size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tasks?userStoryId=${story.id}`);
                      }}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      View Tasks
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
