import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import { companyApi } from '../api/companyApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const statusColors = {
  New: 'info',
  Contacted: 'success',
  Lost: 'error',
};

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await companyApi.getCompanyById(id);
        if (response.success && response.data) {
          setCompany(response.data.company);
          setLeads(response.data.leads || []);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch company details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Loader message="Loading company profile..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!company) return <EmptyState message="Company not found" />;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/companies')}
        sx={{ mb: 2 }}
      >
        Back to Companies
      </Button>

      {/* Company Header Info Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BusinessIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {company.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Company Profile & Associated Leads
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="action" fontSize="small" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Industry
                </Typography>
                <Typography variant="subtitle2" fontWeight="600">
                  {company.industry || 'Not specified'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="action" fontSize="small" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Location
                </Typography>
                <Typography variant="subtitle2" fontWeight="600">
                  {company.location || 'Not specified'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Associated Leads Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Associated Leads ({leads.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Active non-deleted leads belonging to {company.name}
        </Typography>
      </Box>

      {leads.length === 0 ? (
        <EmptyState message="No active leads associated with this company" />
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell fontWeight="bold">Lead Name</TableCell>
                  <TableCell fontWeight="bold">Email</TableCell>
                  <TableCell fontWeight="bold">Phone</TableCell>
                  <TableCell fontWeight="bold">Status</TableCell>
                  <TableCell fontWeight="bold">Assigned To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell fontWeight="600">{lead.name}</TableCell>
                    <TableCell>{lead.email || 'N/A'}</TableCell>
                    <TableCell>{lead.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        color={statusColors[lead.status] || 'default'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{lead.assignedTo?.name || 'Unassigned'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default CompanyDetails;
