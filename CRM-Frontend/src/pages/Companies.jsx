import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { companyApi } from '../api/companyApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog state for Add Company
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await companyApi.getCompanies();
      if (response.success) {
        setCompanies(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');

    if (!name.trim()) {
      setDialogError('Company name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await companyApi.createCompany({
        name: name.trim(),
        industry: industry.trim(),
        location: location.trim(),
      });
      if (response.success) {
        setOpenDialog(false);
        setName('');
        setIndustry('');
        setLocation('');
        fetchCompanies();
      }
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Failed to create company');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Companies Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage company profiles and view associated leads
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Add Company
        </Button>
      </Box>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loader message="Loading companies list..." />
      ) : companies.length === 0 ? (
        <EmptyState
          message="No companies found"
          action={
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Create First Company
            </Button>
          }
        />
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell fontWeight="bold">Company Name</TableCell>
                  <TableCell fontWeight="bold">Industry</TableCell>
                  <TableCell fontWeight="bold">Location</TableCell>
                  <TableCell align="center" fontWeight="bold">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id} hover>
                    <TableCell fontWeight="600">{company.name}</TableCell>
                    <TableCell>{company.industry || 'N/A'}</TableCell>
                    <TableCell>{company.location || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon fontSize="small" />}
                        onClick={() => navigate(`/companies/${company._id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add Company Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Create New Company</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent>
            {dialogError && <ErrorMessage message={dialogError} />}
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Company Name"
                  placeholder="e.g. ABC Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  placeholder="e.g. Information Technology"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g. Chennai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Creating...' : 'Save Company'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Companies;
