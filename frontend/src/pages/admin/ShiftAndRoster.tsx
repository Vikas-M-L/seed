import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Stack,
  Tabs,
  Tab,
  useTheme,
  alpha,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { mockShifts, mockRosterAssignments } from '@/services/mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ShiftAndRosterManagement: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [shifts] = useState(mockShifts);
  const [roster] = useState(mockRosterAssignments);
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [openRosterDialog, setOpenRosterDialog] = useState(false);
  const [editingShift, setEditingShift] = useState<any | null>(null);
  const [editingRoster, setEditingRoster] = useState<any | null>(null);

  const [shiftForm, setShiftForm] = useState({
    name: '',
    type: 'MORNING',
    startTime: '',
    endTime: '',
    breakDuration: 60,
    description: '',
  });

  const [rosterForm, setRosterForm] = useState({
    labMemberId: '',
    shiftId: '',
    weekStartDate: '',
    weekEndDate: '',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddShift = () => {
    setEditingShift(null);
    setShiftForm({
      name: '',
      type: 'MORNING',
      startTime: '',
      endTime: '',
      breakDuration: 60,
      description: '',
    });
    setOpenShiftDialog(true);
  };

  const handleSaveShift = () => {
    if (!shiftForm.name || !shiftForm.startTime || !shiftForm.endTime) {
      alert('Please fill in all required fields');
      return;
    }
    setOpenShiftDialog(false);
    alert('Shift saved successfully!');
  };

  const handleAddRoster = () => {
    setEditingRoster(null);
    setRosterForm({
      labMemberId: '',
      shiftId: '',
      weekStartDate: '',
      weekEndDate: '',
    });
    setOpenRosterDialog(true);
  };

  const handleSaveRoster = () => {
    if (!rosterForm.labMemberId || !rosterForm.shiftId) {
      alert('Please select a member and shift');
      return;
    }
    setOpenRosterDialog(false);
    alert('Roster assignment saved successfully!');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ScheduleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4">Shift & Roster Management</Typography>
          <Typography color="text.secondary">Manage shifts and assign rosters to team members</Typography>
        </Box>
      </Box>

      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="shift management tabs"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Shifts" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Roster Assignments" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Weekly Schedules" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>

        {/* Shifts Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Available Shifts</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddShift}>
              Add Shift
            </Button>
          </Box>

          <Grid container spacing={2}>
            {shifts.map((shift) => (
              <Grid item xs={12} md={6} key={shift.id}>
                <Card sx={{ background: alpha(theme.palette.primary.main, 0.05) }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{shift.name}</Typography>
                        <Chip label={shift.type} size="small" sx={{ mt: 1 }} />
                      </Box>
                      <Box>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Start Time
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatTime(shift.startTime)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          End Time
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatTime(shift.endTime)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Total Work Hours
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {shift.totalWorkHours}h
                        </Typography>
                      </Box>
                      {shift.description && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Description
                          </Typography>
                          <Typography variant="caption">{shift.description}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Roster Assignments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Current Assignments</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRoster}>
              Assign Shift
            </Button>
          </Box>

          <List>
            {roster.map((assignment, index) => (
              <div key={assignment.id}>
                <ListItem
                  sx={{
                    py: 2,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                  }}
                >
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>{assignment.labMemberName}</Typography>
                        <Chip label={assignment.status} size="small" />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Shift: {assignment.shiftName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Week: {assignment.weekStartDate} to {assignment.weekEndDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < roster.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </TabPanel>

        {/* Weekly Schedules Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            View and manage weekly schedules for all team members
          </Typography>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">Weekly schedule view will be displayed here</Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              View Weekly Schedule
            </Button>
          </Card>
        </TabPanel>
      </Card>

      {/* Shift Dialog */}
      <Dialog open={openShiftDialog} onClose={() => setOpenShiftDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{editingShift ? 'Edit Shift' : 'Create New Shift'}</span>
            <IconButton onClick={() => setOpenShiftDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Shift Name"
              value={shiftForm.name}
              onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
              placeholder="e.g., Morning Shift"
            />
            <TextField
              select
              fullWidth
              label="Shift Type"
              value={shiftForm.type}
              onChange={(e) => setShiftForm({ ...shiftForm, type: e.target.value })}
            >
              <MenuItem value="MORNING">Morning</MenuItem>
              <MenuItem value="AFTERNOON">Afternoon</MenuItem>
              <MenuItem value="EVENING">Evening</MenuItem>
              <MenuItem value="NIGHT">Night</MenuItem>
              <MenuItem value="FLEXIBLE">Flexible</MenuItem>
            </TextField>
            <TextField
              type="time"
              label="Start Time"
              value={shiftForm.startTime}
              onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="End Time"
              value={shiftForm.endTime}
              onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="number"
              label="Break Duration (minutes)"
              value={shiftForm.breakDuration}
              onChange={(e) => setShiftForm({ ...shiftForm, breakDuration: parseInt(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Description"
              value={shiftForm.description}
              onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenShiftDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveShift} variant="contained">
            {editingShift ? 'Update' : 'Create'} Shift
          </Button>
        </DialogActions>
      </Dialog>

      {/* Roster Dialog */}
      <Dialog open={openRosterDialog} onClose={() => setOpenRosterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Assign Shift</span>
            <IconButton onClick={() => setOpenRosterDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Select Member"
              value={rosterForm.labMemberId}
              onChange={(e) => setRosterForm({ ...rosterForm, labMemberId: e.target.value })}
            >
              <MenuItem value="1">John Doe</MenuItem>
              <MenuItem value="2">Alice Johnson</MenuItem>
              <MenuItem value="3">Bob Wilson</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Select Shift"
              value={rosterForm.shiftId}
              onChange={(e) => setRosterForm({ ...rosterForm, shiftId: e.target.value })}
            >
              {shifts.map((shift) => (
                <MenuItem key={shift.id} value={shift.id}>
                  {shift.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Week Start Date"
              value={rosterForm.weekStartDate}
              onChange={(e) => setRosterForm({ ...rosterForm, weekStartDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="Week End Date"
              value={rosterForm.weekEndDate}
              onChange={(e) => setRosterForm({ ...rosterForm, weekEndDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRosterDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRoster} variant="contained">
            Assign Shift
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftAndRosterManagement;
