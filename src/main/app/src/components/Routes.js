import Workspace from './Workspace';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import HomeIcon from '@material-ui/icons/Home';
import Lookup from './Lookup';

const Routes = [
    {
        path: '/',
        sidebarLabel: 'Home',
        icon : HomeIcon,
        component: Workspace
    },
    {
        path: '/add',
        sidebarLabel: 'Add',
        icon : AddToQueueIcon,
        component: Lookup
    },
    // {
    //     path: 'https://github.com/blankenshipd001/movies',
    //     sidebarName: 'GitHub',
    //     icon : GitHubIcon,
    //     component: ''
    // }
];

export default Routes;
