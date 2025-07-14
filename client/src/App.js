import { useState, useEffect } from "react";
import {
  ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Box, Avatar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Divider, Grid, Button, AvatarGroup, ListItemAvatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Login from "./components/Login";
import Register from "./components/Register";
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isSameDay } from 'date-fns';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpacityIcon from '@mui/icons-material/Opacity';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FlagIcon from '@mui/icons-material/Flag';
import MoodIcon from '@mui/icons-material/Mood';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckInForm from './components/CheckInForm';
import ProgressDashboard from './components/ProgressDashboard';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AIChat from './components/AIChat';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 90;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#43a047',
    },
    background: {
      default: '#f4f6fa',
      paper: '#fff',
    },
    grey: {
      100: '#e5e7eb',
      200: '#d1d5db',
      300: '#9ca3af',
      400: '#6b7280',
    }
  },
  typography: {
    fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12
  }
});

const sidebarIcons = [
  { icon: <HomeIcon fontSize="large" />, label: 'Home', section: 'header-section' },
  { icon: <CalendarMonthIcon fontSize="large" />, label: 'Calendar', section: 'progress-section' },
  { icon: <FavoriteIcon fontSize="large" />, label: 'Wellness', section: 'focus-section' },
  { icon: <ShowChartIcon fontSize="large" />, label: 'Progress', section: 'goal-section' },
  { icon: <AddCircleIcon fontSize="large" />, label: 'Add', section: 'recent-section' },
  { icon: <SettingsIcon fontSize="large" />, label: 'Settings', section: 'team-section' },
  { icon: <LogoutIcon fontSize="large" />, label: 'Logout', section: 'logout' },
];

function MainLayout({ user, handleLogout, sidebarIcons, drawerWidth, theme, children }) {
  const navigate = useNavigate();
  // Sidebar navigation handler
  const handleSidebarClick = (section, route) => {
    if (section === 'logout') {
      handleLogout();
      return;
    }
    if (route) {
      navigate(route);
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'grey.100',
            borderRight: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 3,
            pb: 3,
          },
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          {sidebarIcons.map((item, idx) => (
            <ListItem key={item.label} disablePadding sx={{ justifyContent: 'center', mb: 1 }}>
              <ListItemButton sx={{ borderRadius: 2, minHeight: 56, justifyContent: 'center' }}
                onClick={() => handleSidebarClick(item.section, item.route)}>
                <ListItemIcon sx={{ minWidth: 0, color: 'grey.400', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: `${drawerWidth}px`, p: 0 }}>
        {/* Header */}
        <AppBar id="header-section" position="static" color="inherit" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: 1, borderColor: 'grey.200', px: 4, py: 2 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {user?.username ? `Welcome, ${user.username}!` : 'Welcome, Friend!'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Your wellness dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <TextField
                variant="outlined"
                placeholder="Find your goals"
                size="small"
                sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: 260 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Avatar alt={user?.username || 'User'} src={user?.avatarUrl || ''} sx={{ width: 48, height: 48 }} />
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

function DashboardMain({ user, handleLogout, sidebarIcons, drawerWidth, theme, focusAreas, goalOverview, recentUpdates, teamSupport, CheckinDay, AdapterDateFns, LocalizationProvider, AddIcon, ArrowForwardIosIcon }) {
  const navigate = useNavigate();
  // Scroll to section or navigate
  const handleSidebarClick = (section, route) => {
    if (section === 'logout') {
      handleLogout();
      return;
    }
    if (route) {
      navigate(route);
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <Grid container spacing={3}>
      {/* Today's Progress Calendar Card */}
      <Grid item xs={12} md={5} lg={4}>
        <Box id="progress-section" sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 3, minHeight: 260 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Today's Progress</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              slots={{ day: CheckinDay }}
              disableFuture
              sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        {/* Focus Areas Card */}
        <Box id="focus-section" sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 3, minHeight: 120 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Focus Areas</Typography>
          <List disablePadding>
            {focusAreas.map((item, idx) => (
              <ListItem key={item.label} sx={{ px: 0, py: 1, borderBottom: idx < focusAreas.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                secondaryAction={<Typography color="text.secondary" fontWeight={500}>• Today</Typography>}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        {/* Goal Overview Card */}
        <Box id="goal-section" sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 3, minHeight: 180 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Goal Overview</Typography>
          <List disablePadding>
            {goalOverview.map((item, idx) => (
              <ListItem key={item.label} sx={{ px: 0, py: 1, borderBottom: idx < goalOverview.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                secondaryAction={
                  item.avatars.length > 0 ? (
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 14 } }}>
                      {item.avatars.map((src, i) => (
                        <Avatar key={i} src={src} />
                      ))}
                    </AvatarGroup>
                  ) : null
                }
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ fontWeight: 600, borderRadius: 2 }} onClick={() => navigate('/checkin')}>
              + Log now
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        {/* Recent Updates Card */}
        <Box id="recent-section" sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 3, minHeight: 180 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recent updates</Typography>
          <List disablePadding>
            {recentUpdates.map((item, idx) => (
              <ListItem key={idx} sx={{ px: 0, py: 1, mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
                secondaryAction={<ArrowForwardIosIcon fontSize="small" color="action" />}
              >
                <ListItemAvatar>
                  <Avatar src={item.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight={600}>{item.name} <span style={{ fontWeight: 400, color: '#666' }}>{item.action}</span></Typography>}
                  secondary={<Typography color="primary" fontWeight={500}>{item.detail}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        {/* Team Support Card */}
        <Box id="team-section" sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 3, minHeight: 180 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Team support</Typography>
          <Grid container spacing={2}>
            {teamSupport.map((member, idx) => (
              <Grid item xs={6} sm={6} md={12} lg={6} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 1 }}>
                  <Avatar src={member.avatar} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography fontWeight={600}>{member.name}</Typography>
                    <Typography color="text.secondary" fontSize={14}>{member.role}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {/* Tags/Quick Links Card Placeholder */}
        <Box sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 3, minHeight: 80 }}>
          {/* Tags/quick links will go here */}
        </Box>
      </Grid>
    </Grid>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  // const navigate = typeof useNavigate === 'function' ? useNavigate() : null; // Removed as per edit hint

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleRegister = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // Mock check-in dates for calendar demo
  const mockCheckinDates = [
    new Date(),
    new Date(new Date().setDate(new Date().getDate() - 1)),
    new Date(new Date().setDate(new Date().getDate() - 3)),
    new Date(new Date().setDate(new Date().getDate() - 5)),
  ];

  // Custom day renderer to show a dot for check-in days
  function CheckinDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const hasCheckin = mockCheckinDates.some(d => isSameDay(d, day));
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        sx={{
          ...(hasCheckin && {
            '& .MuiPickersDay-dayWithMargin': {
              borderBottom: '4px solid #1976d2',
            },
            borderBottom: '4px solid #1976d2',
          }),
        }}
      />
    );
  }

  const focusAreas = [
    { icon: <CheckCircleOutlineIcon color="primary" />, label: 'Log your daily check-in' },
    { icon: <OpacityIcon color="primary" />, label: 'Hydration tracking' },
    { icon: <RestaurantIcon color="primary" />, label: 'Nutrition goals' },
  ];

  const goalOverview = [
    { icon: <TrendingUpIcon color="primary" />, label: 'Weight goal progress', avatars: ["/avatars/1.png", "/avatars/2.png"] },
    { icon: <AssignmentTurnedInIcon color="primary" />, label: 'Daily check-ins', avatars: ["/avatars/3.png"] },
    { icon: <FlagIcon color="primary" />, label: 'Goal setting', avatars: [] },
    { icon: <MoodIcon color="primary" />, label: 'Mood and energy logs', avatars: ["/avatars/1.png", "/avatars/2.png", "/avatars/3.png"] },
    { icon: <BarChartIcon color="primary" />, label: 'Progress visualization', avatars: [] },
  ];

  const recentUpdates = [
    {
      avatar: '/avatars/2.png',
      name: 'Alex T.',
      action: 'logged mood today',
      detail: 'Check my hydration stats...'
    },
    {
      avatar: '/avatars/3.png',
      name: 'Jamie L.',
      action: 'set new goals',
      detail: 'Let’s review my fitness plan.'
    },
  ];

  const teamSupport = [
    { avatar: '/avatars/3.png', name: 'Jamie L.', role: 'Fitness Coach' },
    { avatar: '/avatars/2.png', name: 'Alex T.', role: 'Nutrition Expert' },
    { avatar: '/avatars/4.png', name: 'Taylor R.', role: 'Wellness Advisor' },
    { avatar: '/avatars/5.png', name: 'Jordan K.', role: 'Fitness Trainer' },
  ];

  // Update sidebarIcons to include routes
  const sidebarIcons = [
    { icon: <HomeIcon fontSize="large" />, label: 'Home', section: 'header-section', route: '/' },
    { icon: <CalendarMonthIcon fontSize="large" />, label: 'Calendar', section: 'progress-section', route: '/progress' },
    { icon: <AddCircleIcon fontSize="large" />, label: 'Check-In', section: 'checkin-section', route: '/checkin' },
    { icon: <SmartToyIcon fontSize="large" />, label: 'AI', section: 'ai-section', route: '/ai' },
    { icon: <PeopleIcon fontSize="large" />, label: 'Friends', section: 'friends-section', route: '/friends' },
    { icon: <LogoutIcon fontSize="large" />, label: 'Logout', section: 'logout', route: null },
  ];

  // Scroll to section or navigate
  // const handleSidebarClick = (section, route) => { // Removed as per edit hint
  //   if (section === 'logout') {
  //     handleLogout();
  //     return;
  //   }
  //   if (route && navigate) {
  //     navigate(route);
  //     return;
  //   }
  //   const el = document.getElementById(section);
  //   if (el) {
  //     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom>FitCoach AI</Typography>
        </Box>
        {showRegister ? (
          <div>
            <Register onRegister={handleRegister} />
            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowRegister(false)}>
                Login here
              </Box>
            </Typography>
          </div>
        ) : (
          <div>
            <Login onLogin={handleLogin} />
            <Typography align="center" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowRegister(true)}>
                Register here
              </Box>
            </Typography>
          </div>
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={
            <MainLayout
              user={user}
              handleLogout={handleLogout}
              sidebarIcons={sidebarIcons}
              drawerWidth={drawerWidth}
              theme={theme}
            />
          }>
            <Route path="/" element={
              <DashboardMain
                user={user}
                handleLogout={handleLogout}
                sidebarIcons={sidebarIcons}
                drawerWidth={drawerWidth}
                theme={theme}
                focusAreas={focusAreas}
                goalOverview={goalOverview}
                recentUpdates={recentUpdates}
                teamSupport={teamSupport}
                CheckinDay={CheckinDay}
                AdapterDateFns={AdapterDateFns}
                LocalizationProvider={LocalizationProvider}
                AddIcon={AddIcon}
                ArrowForwardIosIcon={ArrowForwardIosIcon}
              />
            } />
            <Route path="/checkin" element={<CheckInForm />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/ai" element={<AIChat />} />
            <Route path="/friends" element={<FriendsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const FriendsPage = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current friends on mount
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/friends', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    setAdding(userId);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendId: userId })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Friend added!');
        fetchFriends();
      } else {
        setError(data.error || 'Failed to add friend');
      }
    } catch (err) {
      setError('Failed to add friend');
    } finally {
      setAdding('');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001' }}>
      <h2><PeopleIcon style={{ verticalAlign: 'middle', marginRight: 8 }} /> Friends</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <TextField
          label="Search users"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={loading || !search.trim()}>Search</Button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      {results.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h4>Search Results</h4>
          {results.map(user => (
            <div key={user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #eee' }}>
              <span>{user.username} <span style={{ color: '#888', fontSize: 13 }}>({user.email})</span></span>
              <Button
                variant="outlined"
                size="small"
                disabled={adding === user._id || friends.some(f => f._id === user._id)}
                onClick={() => handleAddFriend(user._id)}
              >
                {friends.some(f => f._id === user._id) ? 'Friend' : adding === user._id ? 'Adding...' : 'Add Friend'}
              </Button>
            </div>
          ))}
        </div>
      )}
      <h4>Your Friends</h4>
      {loading ? <div>Loading...</div> : (
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {friends.length === 0 && <li style={{ color: '#888' }}>No friends yet.</li>}
          {friends.map(friend => (
            <li key={friend._id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              {friend.username} <span style={{ color: '#888', fontSize: 13 }}>({friend.email})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
