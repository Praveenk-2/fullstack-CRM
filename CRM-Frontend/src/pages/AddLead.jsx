import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { leadApi } from '../api/leadApi';
import { userApi } from '../api/userApi';
import { companyApi } from '../api/companyApi';
import ErrorMessage from '../components/common/ErrorMessage';

const AddLead = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('New');
  const [assignedTo, setAssignedTo] = useState('');
  const [company, setCompany] = useState('');

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, companiesRes] = await Promise.all([
          userApi.getUsers(),
          companyApi.getCompanies(),
        ]);
        if (usersRes.success) setUsers(usersRes.data || []);
        if (companiesRes.success) setCompanies(companiesRes.data || []);
      } catch (err) {
        console.error('Error fetching dropdown options:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Lead name is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        assignedTo: assignedTo || null,
        company: company || null,
      };
      const response = await leadApi.createLead(payload);
      if (response.success) {
        navigate('/leads');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to create lead'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/leads')}
        sx={{ mb: 2 }}
      >
        Back to Leads
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New Lead
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter lead contact details and assign to a team member & company
        </Typography>

        {error && <ErrorMessage message={error} />}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Lead Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="lead-status-label">Lead Status</InputLabel>
                <Select
                  labelId="lead-status-label"
                  value={status}
                  label="Lead Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Contacted">Contacted</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="assigned-user-label">Assigned To User</InputLabel>
                <Select
                  labelId="assigned-user-label"
                  value={assignedTo}
                  label="Assigned To User"
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company-label"
                  value={company}
                  label="Company"
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <MenuItem value="">
                    <em>No Company</em>
                  </MenuItem>
                  {companies.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} ({c.industry || 'General'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/leads')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ fontWeight: 'bold', minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Lead'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddLead;
