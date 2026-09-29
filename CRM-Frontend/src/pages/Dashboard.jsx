import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import EventTaskIcon from '@mui/icons-material/Today';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { dashboardApi } from '../api/dashboardApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    tasksDueToday: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await dashboardApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to load dashboard metrics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loader message="Loading dashboard statistics..." />;
  if (error) return <ErrorMessage message={error} />;

  const metricCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      description: 'Active non-deleted leads in CRM',
      icon: <PeopleIcon sx={{ fontSize: 36, color: '#2563eb' }} />,
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
    },
    {
      title: 'Qualified Leads',
      value: stats.qualifiedLeads,
      description: 'Leads with "Contacted" status',
      icon: <VerifiedIcon sx={{ fontSize: 36, color: '#059669' }} />,
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
    },
    {
      title: 'Tasks Due Today',
      value: stats.tasksDueToday,
      description: 'Pending tasks scheduled for today',
      icon: <EventTaskIcon sx={{ fontSize: 36, color: '#d97706' }} />,
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      description: 'Finished tasks total count',
      icon: <TaskAltIcon sx={{ fontSize: 36, color: '#16a34a' }} />,
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time aggregated metrics from database
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                bgcolor: card.bgColor,
                borderColor: card.borderColor,
                borderWidth: 1,
                borderStyle: 'solid',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'white',
                      display: 'flex',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 5, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Interview Architecture Summary
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              • Qualified Lead Definition:
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Leads with status set to <strong>"Contacted"</strong> qualify as qualified leads in the aggregation calculation.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              • Server Aggregation:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Metrics are calculated directly on MongoDB via backend service aggregations without relying on client-side math.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
