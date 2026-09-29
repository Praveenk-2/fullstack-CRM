import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Pagination,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { leadApi } from '../api/leadApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';

const statusColors = {
  New: 'info',
  Contacted: 'success',
  Lost: 'error',
};

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await leadApi.getLeads({
        page,
        limit: 10,
        search,
        status: status === 'All' ? '' : status,
      });
      if (response.success) {
        setLeads(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await leadApi.deleteLead(leadToDelete._id);
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete lead');
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Leads Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, search, filter, and manage your leads
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/leads/new')}
          sx={{ fontWeight: 'bold' }}
        >
          Add Lead
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <GridSearchContainer
          search={search}
          setSearch={setSearch}
          handleSearchSubmit={handleSearchSubmit}
          status={status}
          setStatus={(val) => {
            setStatus(val);
            setPage(1);
          }}
        />
      </Paper>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loader message="Loading leads list..." />
      ) : leads.length === 0 ? (
        <EmptyState
          message="No leads found matching your criteria"
          action={
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/leads/new')}>
              Create New Lead
            </Button>
          }
        />
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell fontWeight="bold">Name</TableCell>
                  <TableCell fontWeight="bold">Email</TableCell>
                  <TableCell fontWeight="bold">Phone</TableCell>
                  <TableCell fontWeight="bold">Company</TableCell>
                  <TableCell fontWeight="bold">Status</TableCell>
                  <TableCell fontWeight="bold">Assigned To</TableCell>
                  <TableCell align="center" fontWeight="bold">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell fontWeight="600">{lead.name}</TableCell>
                    <TableCell>{lead.email || 'N/A'}</TableCell>
                    <TableCell>{lead.phone || 'N/A'}</TableCell>
                    <TableCell>{lead.company?.name || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        color={statusColors[lead.status] || 'default'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{lead.assignedTo?.name || 'Unassigned'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/leads/${lead._id}/edit`)}
                        title="Edit Lead"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(lead)}
                        title="Soft Delete Lead"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={pagination.totalPages || 1}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Paper>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Soft Delete Lead"
        content={`Are you sure you want to delete lead "${leadToDelete?.name}"? The lead will be marked as deleted and excluded from list and stats.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

const GridSearchContainer = ({ search, setSearch, handleSearchSubmit, status, setStatus }) => {
  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
    >
      <TextField
        size="small"
        placeholder="Search by name, email or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ minWidth: 260, flexGrow: 1 }}
        InputProps={{
          endAdornment: (
            <IconButton type="submit" size="small">
              <SearchIcon />
            </IconButton>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="status-filter-label">Status Filter</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          value={status}
          label="Status Filter"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="Contacted">Contacted</MenuItem>
          <MenuItem value="Lost">Lost</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Leads;
