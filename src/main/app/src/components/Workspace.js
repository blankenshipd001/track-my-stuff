import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    card: {
        margin: theme.spacing(1),
        width: 270,
    },
    gridList: {
        flexWrap: 'nowrap',
        width: '100%',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    media: {
        height: '400px',
    },
    title: {
        color: theme.palette.primary.main
    },
}));

/**
 * Main area for displaying movies. This will eventually be moved and replaced with a Dashboard or similar type page
 * @return {JSX.Element}
 */
const Workspace = () => {
    const classes = useStyles();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('/movie/list')
            .then(function (response) {
                console.log(response);
                setMovies(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className={classes.root}>
                { movies.map((movie, index) => (
                    <Card fluid key={index} className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={movie.poster}
                                title={movie.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                                    {movie.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {movie.plot}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default Workspace;
