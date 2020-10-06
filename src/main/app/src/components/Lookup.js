import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { movieService } from '../api/MovieService';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    media: {
        height: 557,
    },
    title: {
        color: theme.palette.primary.main
    }
}));

/**
 * Looks up is used to find movies using the open movie database.
 * @return {JSX.Element}
 */
export default function Lookup() {
    const classes = useStyles();
    const [movie, setMovie] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [toast, setToast] = useState(false);

    /**
     * Display a toast message at the bottom of the screen
     * @param text that will be displayed.
     * @param type of alert (success, error, etc).
     */
    const showToast = (text, type) => {
        setMessage(text);
        setSeverity(type);
        setToast(true);
    };

    /**
     * Handle closing the toast if the close icon was clicked or if the user clicks away leave the toast to timeout
     * @param event fired event
     * @param reason the reason for the event being fired
     */
    const handleClose = (event, reason) => {
        /* istanbul ignore next */
        if (reason === 'clickaway') {
            return;
        }
        // We can't test this line because jest does not like waiting for the dialog to be removed by timing out
        /* istanbul ignore next */
        setToast(false);
    };

    /**
     * Search for a movie using the user defined title
     */
    const search = () => {
        if (movieTitle && movieTitle.length > 0) {
            movieService.search(movieTitle)
                .then(function (response) {
                    setMovie(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                    showToast('Failed to search for the movie!', 'error');
                });
        }
    };

    /**
     * Save the movie that was found to the database
     * TODO: Add some validation to ensure the movie isn't invalid
     */
    const save = () => {
        movieService.save(movie)
            .then(function (response) {
                showToast('Movie saved!', 'success');
            })
            .catch(function (error) {
                showToast('Movie not saved to the database!', 'error');
                console.error(error);
            });
    };

    return (
        <>
            <Paper className={classes.root} >
                <InputBase
                    className={classes.input}
                    placeholder="Search For Movie"
                    inputProps={{ 'aria-label': 'search for Movie' }}
                    onInput={(event) => setMovieTitle(event.target.value)}
                />
                <IconButton className={classes.iconButton} aria-label="search" onClick={search}>
                    <SearchIcon />
                </IconButton>
            </Paper>

            { movie && (
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={movie.Poster}
                            title={movie.Title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                                {movie.Title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {movie.Plot}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {/* <Button size="small" color="primary" href="https://unsplash.com/photos/Z05GiksmqYU">*/}
                        {/*    See it on Unsplash*/}
                        {/* </Button>*/}
                    </CardActions>
                </Card>
            )}

            <Button onClick={save}>Save Movie</Button>

            <Snackbar datat-testid='snackbar' open={toast} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}
