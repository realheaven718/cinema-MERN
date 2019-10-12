// @ts-nocheck
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button
} from '@material-ui/core';
import Navbar from '../../../layouts/Public/components/Navbar/Navbar';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(10),
    backgroundColor: theme.palette.background.dark,
    color: theme.palette.common.white,
    height: '100vh'
  },
  container: { height: '100%' },
  movieInfos: {
    background: 'rgba(57, 61, 67, 0.5)',
    position: 'relative',
    height: '100%'
  },
  background: {
    position: 'absolute',
    opacity: 0.4,
    top: 0,
    height: '70%',
    right: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    zIndex: 1
  },
  title: {
    position: 'absolute',
    top: '60%',
    right: 0,
    width: '100%',
    textAlign: 'center',
    color: theme.palette.common.white,
    fontSize: '24px',
    textTransform: 'capitalize',
    zIndex: 2
  },
  info: {
    position: 'absolute',
    padding: theme.spacing(5),
    top: '70%',
    right: 0,
    width: '100%'
  },
  infoBox: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing(2)
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  seat: {
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: 2,
    padding: theme.spacing(2),
    margin: theme.spacing(0.5),
    fontWeight: 600,
    '&:hover': {
      background: 'rgb(120, 205, 4)'
    }
  },
  bookingBanner: {},
  bannerTitle: {
    fontSize: theme.spacing(1.4),
    textTransform: 'uppercase',
    color: 'rgb(93, 93, 97)',
    marginBottom: theme.spacing(1)
  },
  bannerContent: {
    fontSize: theme.spacing(2),
    textTransform: 'capitalize',
    color: theme.palette.common.white
  },
  [theme.breakpoints.down('md')]: {
    root: { height: '100%' },
    movieInfos: { minHeight: '30vh' },
    background: { height: '60%' },
    title: { top: '50%' },
    info: { top: '60%', display: 'flex', justifyContent: 'center' },
    infoBox: {
      marginRight: theme.spacing(2)
    }
  },
  [theme.breakpoints.down('sm')]: {
    seat: { padding: theme.spacing(0.8), margin: theme.spacing(0.5) }
  }
});

class MovieBooking extends Component {
  state = {
    movie: null,
    cinema: { seats: [] },
    selectedSeats: 0
  };
  componentDidMount() {
    this.addPageCursors();
    this.getCinema();
    this.getMovie();
  }

  onSelectSeat = async (row, seat) => {
    const {
      cinema: { seats }
    } = this.state;
    if (seats[row][seat] === 1) return;
    const newSeats = [...seats];
    seats[row][seat] === 2
      ? (newSeats[row][seat] = 0)
      : (newSeats[row][seat] = 2);
    this.setState(({ cinema, selectedSeats }) => ({
      cinema: { ...cinema, seats: newSeats },
      selectedSeats: selectedSeats + 1
    }));
  };

  async checkout() {
    const { selectedSeats, cinema, movie } = this.state;
    if (!selectedSeats) return;
    try {
      const url = '/reservations';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startAt: '20:00',
          seats: [[1, 7], [1, 18]],
          ticketPrice: cinema.ticketPrice,
          total: selectedSeats * cinema.ticketPrice,
          movieId: movie._id,
          cinemaId: cinema._id
        })
      });
      const reservation = await response.json();
      if (response.ok) {
        console.log(reservation);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async bookSeat() {
    const {
      selectedSeats,
      cinema: { seats, seatsAvailable }
    } = this.state;
    if (!selectedSeats) return;
    const bookedSeats = seats.map(row =>
      row.map(seat => ([1, 2].includes(seat) ? 1 : 0))
    );
    // const totalBookedSeats = bookedSeats
    //   .reduce((a, b) => a.concat(b))
    //   .reduce((a, b) => a + b);
    try {
      const url = '/cinemas/5da0a9281583f225bcc9b310';
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seats: bookedSeats,
          seatsAvailable: seatsAvailable - selectedSeats
        })
      });
      const cinema = await response.json();
      if (response.ok) {
        this.checkout();
        this.setState({
          cinema,
          selectedSeats: 0
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCinema() {
    try {
      const url = '/cinemas/5da0a9281583f225bcc9b310';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const cinema = await response.json();
      if (response.ok) {
        this.setState({
          cinema
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getMovie() {
    try {
      const url = '/movies/' + this.props.match.params.id;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const movie = await response.json();
      if (response.ok) {
        this.setState({
          movie
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  addPageCursors() {
    let cursor1, cursor2, cursor3;
    cursor1 = document.getElementById('cursor');
    cursor2 = document.getElementById('cursor2');
    cursor3 = document.getElementById('cursor3');
    //Page cursors
    document
      .getElementsByTagName('body')[0]
      .addEventListener('mousemove', function(event) {
        cursor1.style.left = event.clientX + 'px';
        cursor1.style.top = event.clientY + 'px';
        cursor2.style.left = event.clientX + 'px';
        cursor2.style.top = event.clientY + 'px';
        cursor3.style.left = event.clientX + 'px';
        cursor3.style.top = event.clientY + 'px';
      });
  }

  render() {
    const {
      movie,
      selectedSeats,
      cinema: { seats, ticketPrice, seatsAvailable }
    } = this.state;
    const { classes } = this.props;
    return (
      <Fragment>
        <div className={classes.root}>
          <Navbar />
          <Container maxWidth="xl" className={classes.container}>
            <Grid container spacing={2} style={{ height: '100%' }}>
              {movie && (
                <Grid item xs={12} md={12} lg={3}>
                  <div className={classes.movieInfos}>
                    <div
                      className={classes.background}
                      style={{
                        backgroundImage: `url(${movie.image})`
                      }}
                    />
                    <Typography className={classes.title}>
                      {movie.title}
                    </Typography>
                    <div className={classes.info}>
                      {movie.director && (
                        <div className={classes.infoBox}>
                          <Typography variant="subtitle1" color="inherit">
                            Director
                          </Typography>
                          <Typography variant="caption" color="inherit">
                            {movie.director}
                          </Typography>
                        </div>
                      )}
                      {movie.cast && (
                        <div className={classes.infoBox}>
                          <Typography variant="subtitle1" color="inherit">
                            Cast
                          </Typography>
                          <Typography variant="caption" color="inherit">
                            {movie.cast}
                          </Typography>
                        </div>
                      )}
                      {movie.genre && (
                        <div className={classes.infoBox}>
                          <Typography variant="subtitle1" color="inherit">
                            Genre
                          </Typography>
                          <Typography variant="caption" color="inherit">
                            {movie.genre}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              )}
              <Grid item lg={9} xs={12} md={12}>
                <Box width={1} pt={15}>
                  {seats.length > 0 &&
                    seats.map((seatRows, indexRow) => (
                      <div key={indexRow} className={classes.row}>
                        {seatRows.map((seat, index) => (
                          <Box
                            key={`seat-${index}`}
                            onClick={() => this.onSelectSeat(indexRow, index)}
                            className={classes.seat}
                            bgcolor={
                              seat === 1
                                ? 'rgb(65, 66, 70)'
                                : seat === 2
                                ? 'rgb(120, 205, 4)'
                                : 'rgb(96, 93, 169)'
                            }>
                            {index + 1}
                          </Box>
                        ))}
                      </div>
                    ))}
                </Box>
                <Box width={1} mt={10}>
                  <Box
                    width="50%"
                    margin="auto"
                    display="flex"
                    alignItems="center"
                    textAlign="center"
                    color="#eee">
                    <div>
                      <Box
                        mr={1}
                        display="inline-block"
                        width={10}
                        height={10}
                        bgcolor="rgb(96, 93, 169)"
                      />
                      Seat Available
                    </div>
                    <div>
                      <Box
                        mr={1}
                        ml={2}
                        display="inline-block"
                        width={10}
                        height={10}
                        bgcolor="rgb(65, 66, 70)"
                      />
                      Reserved Seat
                    </div>
                    <div>
                      <Box
                        mr={1}
                        ml={2}
                        display="inline-block"
                        width={10}
                        height={10}
                        bgcolor="rgb(120, 205, 4)"
                      />
                      Your Seat
                    </div>
                  </Box>
                </Box>
                <Box marginTop={2} bgcolor="rgb(18, 20, 24)">
                  <Grid container>
                    <Grid item xs={10}>
                      <Grid container spacing={3} style={{ padding: 20 }}>
                        <Grid item>
                          <Typography className={classes.bannerTitle}>
                            Name
                          </Typography>
                          <Typography className={classes.bannerContent}>
                            George Simos
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.bannerTitle}>
                            Tickets
                          </Typography>
                          {selectedSeats > 0 ? (
                            <Typography className={classes.bannerContent}>
                              {selectedSeats} tickets
                            </Typography>
                          ) : (
                            <Typography className={classes.bannerContent}>
                              None
                            </Typography>
                          )}
                        </Grid>
                        <Grid item>
                          <Typography className={classes.bannerTitle}>
                            Price
                          </Typography>
                          <Typography className={classes.bannerContent}>
                            {ticketPrice * selectedSeats} Euro
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        color: 'rgb(120, 205, 4)',
                        background: 'black',
                        display: 'flex'
                      }}>
                      <Button
                        color="inherit"
                        fullWidth
                        disabled={seatsAvailable <= 0}
                        onClick={() => this.bookSeat()}>
                        Checkout
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </div>
        <div className="cursor" id="cursor" />
        <div className="cursor2" id="cursor2" />
        <div className="cursor3" id="cursor3" />
      </Fragment>
    );
  }
}

MovieBooking.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(MovieBooking);