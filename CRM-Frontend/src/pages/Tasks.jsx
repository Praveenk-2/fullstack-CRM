import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import { taskApi } from '../api/taskApi';
import { leadApi } from '../api/leadApi';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Tasks = () => {
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const fetchTasksData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, leadsRes, usersRes] = await Promise.all([
        taskApi.getTasks(),
        leadApi.getLeads({ limit: 100 }),
        userApi.getUsers(),
      ]);

      if (tasksRes.success) setTasks(tasksRes.data || []);
      if (leadsRes.success) setLeads(leadsRes.data || []);
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setDialogError('');

    if (!title.trim() || !selectedLead || !selectedUser) {
      setDialogError('Title, Lead, and Assigned User are required');
      return;
    }

    setSaving(true);
    try {
      const response = await taskApi.createTask({
        title: title.trim(),
        lead: selectedLead,
        assignedTo: selectedUser,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
      });

      if (response.success) {
        setOpenDialog(false);
        setTitle('');
        setSelectedLead('');
        setSelectedUser('');
        setDueDate('');
        fetchTasksData();
      }
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (task, newStatus) => {
    setActionError('');
    try {
      const response = await taskApi.updateTaskStatus(task._id, newStatus);
      if (response.success) {
        fetchTasksData();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Status update failed';
      setActionError(`[HTTP ${err.response?.status || 403}] ${message}`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Tasks Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign and track task status for leads
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Create Task
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>Mandatory Interview Requirement:</strong> Only the assigned user (Current Logged In: <u>{currentUser?.name}</u>) can update a task status. If a non-assigned user attempts to complete a task, the backend will return a <strong>403 Forbidden</strong> response.
      </Alert>

      {actionError && <ErrorMessage title="Authorization Rule Violation" message={actionError} />}
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loader message="Loading task list..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          message="No tasks found"
          action={
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Create First Task
            </Button>
          }
        />
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell fontWeight="bold">Title</TableCell>
                  <TableCell fontWeight="bold">Lead</TableCell>
                  <TableCell fontWeight="bold">Assigned To</TableCell>
                  <TableCell fontWeight="bold">Due Date</TableCell>
                  <TableCell fontWeight="bold">Status</TableCell>
                  <TableCell align="center" fontWeight="bold">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => {
                  const assignedId = task.assignedTo?._id || task.assignedTo;
                  const isAssignedToCurrentUser =
                    currentUser && assignedId === currentUser._id;
                  const formattedDate = task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'No due date';

                  return (
                    <TableRow key={task._id} hover>
                      <TableCell fontWeight="600">{task.title}</TableCell>
                      <TableCell>{task.lead?.name || 'Unassigned Lead'}</TableCell>
                      <TableCell>
                        <Chip
                          label={task.assignedTo?.name || 'Unassigned'}
                          size="small"
                          variant="outlined"
                          color={isAssignedToCurrentUser ? 'primary' : 'default'}
                          sx={{ fontWeight: isAssignedToCurrentUser ? 'bold' : 'normal' }}
                        />
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          color={task.status === 'Completed' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {task.status === 'Completed' ? (
                          <Chip label="Done" color="success" size="small" variant="filled" />
                        ) : (
                          <Tooltip
                            title={
                              isAssignedToCurrentUser
                                ? 'Click to complete task'
                                : 'Only assigned user can complete task (Will trigger 403 Forbidden)'
                            }
                          >
                            <span>
                              <Button
                                size="small"
                                variant={isAssignedToCurrentUser ? 'contained' : 'outlined'}
                                color={isAssignedToCurrentUser ? 'success' : 'inherit'}
                                startIcon={
                                  isAssignedToCurrentUser ? (
                                    <CheckCircleOutlineIcon fontSize="small" />
                                  ) : (
                                    <LockIcon fontSize="small" />
                                  )
                                }
                                onClick={() => handleStatusUpdate(task, 'Completed')}
                              >
                                {isAssignedToCurrentUser ? 'Mark Done' : 'Forbidden'}
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Create Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Create New Task</DialogTitle>
        <Box component="form" onSubmit={handleCreateTask}>
          <DialogContent>
            {dialogError && <ErrorMessage message={dialogError} />}
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Task Title"
                  placeholder="e.g. Call Ravi to follow up"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="task-lead-label">Select Lead</InputLabel>
                  <Select
                    labelId="task-lead-label"
                    value={selectedLead}
                    label="Select Lead"
                    onChange={(e) => setSelectedLead(e.target.value)}
                  >
                    {leads.map((l) => (
                      <MenuItem key={l._id} value={l._id}>
                        {l.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="task-user-label">Assign To User</InputLabel>
                  <Select
                    labelId="task-user-label"
                    value={selectedUser}
                    label="Assign To User"
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    {users.map((u) => (
                      <MenuItem key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Creating...' : 'Save Task'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Tasks;
