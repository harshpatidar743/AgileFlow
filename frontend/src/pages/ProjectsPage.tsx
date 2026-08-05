import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  InputAdornment,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProjectsPageProps {
  projects: Project[];
  onOpenCreateDialog: () => void;
  onOpenEditDialog: (project: Project) => void;
  onConfirmDelete: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onOpenCreateDialog,
  onOpenEditDialog,
  onConfirmDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Projects Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Top level container for User Stories and Tasks across team initiatives
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={onOpenCreateDialog}
          sx={{ textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
        >
          Create Project
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: '#ffffff', borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#94a3b8" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
            No projects found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Click "Create Project" to get started!'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => {
            const taskProgress =
              project.totalTasks > 0
                ? Math.round((project.completedTasks / project.totalTasks) * 100)
                : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  elevation={0}
                  onClick={() => navigate(`/user-stories?projectId=${project.id}`)}
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {project.name}
                      </Typography>
                      <Box>
                        <Tooltip title="Edit Project">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onOpenEditDialog(project); }}>
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
                          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onConfirmDelete(project); }}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3, minHeight: 40 }}>
                      {project.description || 'No description provided.'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      <Chip
                        icon={<BookOpen size={14} />}
                        label={`${project.totalUserStories} User Stories`}
                        size="small"
                        sx={{ backgroundColor: '#f0f9ff', color: '#0369a1', fontWeight: 600 }}
                      />
                      <Chip
                        icon={<CheckSquare size={14} />}
                        label={`${project.totalTasks} Tasks`}
                        size="small"
                        sx={{ backgroundColor: '#f5f3ff', color: '#6d28d9', fontWeight: 600 }}
                      />
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          Progress ({project.completedTasks}/{project.totalTasks} tasks)
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
                      endIcon={<ArrowRight size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user-stories?projectId=${project.id}`);
                      }}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      View User Stories
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
