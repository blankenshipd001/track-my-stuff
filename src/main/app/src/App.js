
import React, { useState } from 'react';
import clsx from 'clsx';
import { withRouter, Route, Switch, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { Brightness3Outlined, Brightness7Outlined } from '@material-ui/icons';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import BugReportIcon from '@material-ui/icons/BugReport';
import GitHubIcon from '@material-ui/icons/GitHub';

import { dark, light } from './theme';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Routes from './components/Routes';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 2),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

/**
 * Main application component used to contain everything else
 * @return {JSX.Element}
 */
const App = () => {
    const classes = useStyles();
    const history = createBrowserHistory();
    const theme = useTheme();

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [open, setOpen] = React.useState(false);

    const appliedTheme = createMuiTheme(!isDarkMode ? light : dark);
    const icon = !isDarkMode ? <Brightness7Outlined /> : <Brightness3Outlined />;

    /**
     * Toggle the menu state to open/closed
     */
    const toggleMenu = () => {
        setOpen(!open);
    };

    /**
     * Determine which icon is active based on the browser's route
     * @param routeName {string} route in the url ex: /home
     */
    const activeRoute = (routeName) => {
        console.log('routeName: ' + routeName);
        console.log('history: ' + history.location.pathname);

        return history.location.pathname === routeName;
    };

    return (
        <ThemeProvider theme={appliedTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <AppBar
                    color="inherit"
                    position='fixed'
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleMenu}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap style={{flex: 1}}>
                            Movies
                        </Typography>
                        <IconButton edge='end' color='inherit' aria-label='theme mode' onClick={() => setIsDarkMode(!isDarkMode)}>
                            {icon}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={toggleMenu}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>

                    <Divider />

                    <List>
                        { Routes.map((prop, key) => (
                            <ListItem component={Link} to={prop.path} style={{textDecoration: 'none'}} key={key} selected={activeRoute(prop.path)} button>
                                <ListItemIcon><prop.icon /></ListItemIcon>
                                <ListItemText primary={prop.sidebarLabel}/>
                            </ListItem>
                        ))}

                        <Divider />

                        <a href='https://github.com/blankenshipd001/movies/issues' target='_blank' rel='noopener noreferrer' style={{color: isDarkMode ? 'white' : 'black'}}>
                            <ListItem button key='BugReport'>
                                <ListItemIcon><BugReportIcon /></ListItemIcon>
                                <ListItemText primary='Report a Bug'/>
                            </ListItem>
                        </a>

                        <a href='https://github.com/blankenshipd001/movies' target='_blank' rel='noopener noreferrer' style={{color: isDarkMode ? 'white' : 'black'}}>
                            <ListItem button key='GitHubPage'>
                                <ListItemIcon><GitHubIcon /></ListItemIcon>
                                <ListItemText primary='GitHub page' />
                            </ListItem>
                        </a>

                    </List>
                </Drawer>

                {/* <SearchBar /> */}
                <Paper className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        { Routes.map((route) => (
                            <Route exact path={route.path} key={route.path}>
                                <route.component />
                            </Route>
                        ))}
                    </Switch>
                </Paper>
            </div>
        </ThemeProvider>
    );
};

export default withRouter(App);
