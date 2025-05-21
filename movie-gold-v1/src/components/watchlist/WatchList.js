import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get('/api/v1/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(response.data); // full movie objects expected
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
      setError("Unable to load watchlist. Please log in again.");
    }
  };

  const removeFromWatchlist = async (imdbId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/v1/watchlist/${imdbId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(watchlist.filter(m => m.imdbId !== imdbId));
      toast.success("✅ Movie removed from your watchlist.");
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
      toast.error("❌ Failed to remove from watchlist.");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <Container className="mt-4">
      <h3>Your Watchlist</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {watchlist.length === 0 && !error && (
          <Col><Alert variant="info">Your watchlist is empty.</Alert></Col>
        )}

        {watchlist.map((movie, index) => (
          <Col key={index} md={4} className="mb-4">
            <div
              onClick={() => navigate(`/Reviews/${movie.imdbId}`)}
              style={{ cursor: "pointer", borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <div style={{ padding: '0.5rem' }}>
                <strong>{movie.title}</strong>
                <div>{movie.releaseDate}</div>
              </div>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2"
              onClick={() => removeFromWatchlist(movie.imdbId)}
            >
              Remove
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WatchList;
