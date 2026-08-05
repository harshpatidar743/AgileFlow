import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Plus,
  Pencil,
  Trash2,
  Kanban,
  List,
  Clock,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { TaskItem, UserStory, Project, Status } from '../types';
import { StatusChip } from '../components/StatusChip';
import { PriorityChip } from '../components/PriorityChip';
import { useSearchParams } from 'react-router-dom';
import { parseTaskDateTime } from '../utils/dateTime';

interface TasksPageProps {
  tasks: TaskItem[];
  userStories: UserStory[];
  projects: Project[];
  onOpenCreateDialog: (defaultStoryId?: string) => void;
  onOpenEditDialog: (task: TaskItem) => void;
  onConfirmDelete: (task: TaskItem) => void;
  onStatusChange: (taskId: string, status: Status) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  userStories,
  projects,
  onOpenCreateDialog,
  onOpenEditDialog,
  onConfirmDelete,
  onStatusChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const selectedStoryId = searchParams.get('userStoryId') || '';
  const selectedProjectId = searchParams.get('projectId') || '';
  const selectedStatus = searchParams.get('status') || '';
  const selectedPriority = searchParams.get('priority') || '';

  const buildSearchParams = (overrides: Record<string, string | undefined>) => {
    const nextParams: Record<string, string> = {};
    if (overrides.projectId !== undefined) {
      if (overrides.projectId) nextParams.projectId = overrides.projectId;
    } else if (selectedProjectId) {
      nextParams.projectId = selectedProjectId;
    }
    if (overrides.userStoryId !== undefined) {
      if (overrides.userStoryId) nextParams.userStoryId = overrides.userStoryId;
    } else if (selectedStoryId) {
      nextParams.userStoryId = selectedStoryId;
    }
    if (overrides.status !== undefined) {
      if (overrides.status) nextParams.status = overrides.status;
    } else if (selectedStatus) {
      nextParams.status = selectedStatus;
    }
    if (overrides.priority !== undefined) {
      if (overrides.priority) nextParams.priority = overrides.priority;
    } else if (selectedPriority) {
      nextParams.priority = selectedPriority;
    }
    return nextParams;
  };

  const handleStoryFilterChange = (userStoryId: string) => {
    if (userStoryId) {
      const story = userStories.find((s) => s.id === userStoryId);
      setSearchParams(
        buildSearchParams({
          projectId: story?.projectId,
          userStoryId,
        })
      );
    } else {
      setSearchParams(buildSearchParams({ userStoryId: '' }));
    }
  };

  const handleProjectFilterChange = (projectId: string) => {
    setSearchParams(buildSearchParams({ projectId, userStoryId: projectId ? selectedStoryId : '' }));
  };

  const visibleUserStories = selectedProjectId
    ? userStories.filter((s) => s.projectId === selectedProjectId)
    : userStories;

  const selectedStoryBelongsToProject = visibleUserStories.some((s) => s.id === selectedStoryId);
  const storyFilterValue = selectedStoryBelongsToProject ? selectedStoryId : '';

  const filteredTasks = tasks.filter((t) => {
    if (selectedStatus && t.status !== selectedStatus) return false;
    if (selectedPriority && t.priority !== selectedPriority) return false;
    if (storyFilterValue && t.userStoryId !== storyFilterValue) return false;
    if (selectedProjectId && t.projectId !== selectedProjectId) return false;
    return true;
  });

  const columns: { title: string; status: Status; bg: string; color: string }[] = [
    { title: 'To Do', status: 'TODO', bg: '#f8fafc', color: '#475569' },
    { title: 'In Progress', status: 'IN_PROGRESS', bg: '#f0f9ff', color: '#0369a1' },
    { title: 'Completed', status: 'COMPLETED', bg: '#f0fdf4', color: '#15803d' },
  ];

  const formatDueDate = (dateStr?: string) => {
    const due = parseTaskDateTime(dateStr);
    if (!due) return null;

    const now = new Date();
    const isOverdue = due < now;
    const isDueSoon = due.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

    let chipColor: 'default' | 'warning' | 'error' = 'default';
    if (isOverdue) chipColor = 'error';
    else if (isDueSoon) chipColor = 'warning';

    return (
      <Chip
        icon={<Clock size={12} />}
        label={due.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
        size="small"
        color={chipColor}
        variant={isOverdue || isDueSoon ? 'filled' : 'outlined'}
        sx={{ fontSize: '0.75rem', fontWeight: 600 }}
      />
    );
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Tasks Workspace
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Hierarchical level 3: Atomic work items with status workflows and due date alerts
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            size="small"
          >
            <ToggleButton value="kanban">
              <Kanban size={16} style={{ marginRight: 4 }} /> Board
            </ToggleButton>
            <ToggleButton value="list">
              <List size={16} style={{ marginRight: 4 }} /> List
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => onOpenCreateDialog(storyFilterValue || undefined)}
            sx={{ textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 260 } }}>
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
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 300 } }} disabled={visibleUserStories.length === 0}>
          <InputLabel id="story-filter-label">Filter by User Story</InputLabel>
          <Select
            labelId="story-filter-label"
            value={storyFilterValue}
            label="Filter by User Story"
            onChange={(e) => handleStoryFilterChange(e.target.value)}
          >
            <MenuItem value="">
              <em>{selectedProjectId ? 'All Stories in Project' : 'All User Stories'}</em>
            </MenuItem>
            {visibleUserStories.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {selectedProjectId ? s.title : s.projectName ? `[${s.projectName}] ${s.title}` : s.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(selectedProjectId || storyFilterValue) && (
          <Button
            size="small"
            variant="text"
            onClick={() => setSearchParams({})}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Clear filters
          </Button>
        )}
      </Box>

      {viewMode === 'kanban' ? (
        <Grid container spacing={3}>
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <Grid item xs={12} md={4} key={col.status}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: col.bg,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    minHeight: 500,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: col.color, fontSize: '1.05rem' }}>
                      {col.title}
                    </Typography>
                    <Chip
                      label={colTasks.length}
                      size="small"
                      sx={{ fontWeight: 700, backgroundColor: '#ffffff' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {colTasks.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                        <Typography variant="body2">No tasks in this column</Typography>
                      </Box>
                    ) : (
                      colTasks.map((task) => (
                        <Card
                          key={task.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600 }}>
                              {task.userStoryTitle || 'Story'}
                            </Typography>
                            <Box>
                              <IconButton size="small" onClick={() => onOpenEditDialog(task)}>
                                <Pencil size={14} />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => onConfirmDelete(task)}>
                                <Trash2 size={14} />
                              </IconButton>
                            </Box>
                          </Box>

                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
                            {task.title}
                          </Typography>

                          {task.description && (
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.875rem' }}>
                              {task.description}
                            </Typography>
                          )}

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                            <PriorityChip priority={task.priority} />
                            {formatDueDate(task.dueDate)}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 0.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
                            {task.status !== 'TODO' && (
                              <Button
                                size="small"
                                color="inherit"
                                onClick={() => onStatusChange(task.id, 'TODO')}
                                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                              >
                                To Do
                              </Button>
                            )}
                            {task.status !== 'IN_PROGRESS' && (
                              <Button
                                size="small"
                                color="primary"
                                startIcon={<Play size={12} />}
                                onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                                sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 }}
                              >
                                Start
                              </Button>
                            )}
                            {task.status !== 'COMPLETED' && (
                              <Button
                                size="small"
                                color="success"
                                startIcon={<CheckCircle2 size={12} />}
                                onClick={() => onStatusChange(task.id, 'COMPLETED')}
                                sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 }}
                              >
                                Complete
                              </Button>
                            )}
                          </Box>
                        </Card>
                      ))
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
          {filteredTasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: '#94a3b8' }}>
              <Typography variant="body1">No tasks matching criteria</Typography>
            </Box>
          ) : (
            filteredTasks.map((task, idx) => (
              <Box
                key={task.id}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx < filteredTasks.length - 1 ? '1px solid #f1f5f9' : 'none',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Story: {task.userStoryTitle || 'N/A'} | Project: {task.projectName || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StatusChip status={task.status} />
                  <PriorityChip priority={task.priority} />
                  {formatDueDate(task.dueDate)}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={() => onOpenEditDialog(task)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onConfirmDelete(task)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Paper>
      )}
    </Box>
  );
};
