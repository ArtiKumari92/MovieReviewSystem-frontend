import { useEffect, useRef, useState } from 'react';
import api from '../../api/axiosConfig';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReviewForm from '../reviewForm/ReviewForm';
import React from 'react';

const Reviews = ({ getMovieData, movie, reviews, setReviews, auth }) => {
  const revText = useRef();
  let { movieId } = useParams();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    getMovieData(movieId);
    if (auth) {
      checkIfInWatchlist();
    }
  }, [movieId, auth]);

  const checkIfInWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.get('/api/v1/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const inList = response.data.some((m) => m.imdbId === movieId);
      setIsInWatchlist(inList);
    } catch (err) {
      console.error("Failed to check watchlist", err);
      toast.error("⚠️ Could not check watchlist.");
    }
  };

  const toggleWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isInWatchlist) {
        await api.delete(`/api/v1/watchlist/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWatchlist(false);
        toast.success("🗑️ Removed from watchlist.");
      } else {
        await api.post('/api/v1/watchlist', { imdbId: movieId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWatchlist(true);
        toast.success("✅ Added to watchlist.");
      }
    } catch (err) {
      console.error("Failed to update watchlist", err);
      toast.error("❌ Watchlist action failed.");
    }
  };

  const addReview = async (e) => {
    e.preventDefault();
    const rev = revText.current;

    try {
      const token = localStorage.getItem('token');
      await api.post("/api/v1/reviews", {
        reviewBody: rev.value,
        imdbId: movieId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedReviews = [...reviews, { body: rev.value }];
      rev.value = "";
      setReviews(updatedReviews);
      toast.success("📝 Review submitted.");
    } catch (err) {
      console.error("Failed to add review", err);
      toast.error("❌ Failed to submit review.");
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col><h3>Reviews</h3></Col>
      </Row>

      <Row className="mt-2">
        <Col md={4}>
          <img src={movie?.poster} alt={movie?.title} style={{ width: "100%", borderRadius: '10px' }} />
        </Col>

        <Col md={8}>
          {auth ? (
            <>
              <Row className="mb-3">
                <Col>
                  <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Button
                    variant={isInWatchlist ? "outline-danger" : "outline-warning"}
                    onClick={toggleWatchlist}
                  >
                    {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  </Button>
                </Col>
              </Row>

              <Row><Col><hr /></Col></Row>
            </>
          ) : (
            <Row className="mb-3">
              <Col>
                <Alert variant="info">
                  Please <Link to="/login">log in</Link> to write a review or manage your watchlist.
                </Alert>
              </Col>
            </Row>
          )}

          {reviews?.map((r, index) => (
            <React.Fragment key={index}>
              <Row>
                <Col>{r.body}</Col>
              </Row>
              <Row>
                <Col><hr /></Col>
              </Row>
            </React.Fragment>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Reviews;
