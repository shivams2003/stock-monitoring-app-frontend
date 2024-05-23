import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface WatchlistProps {
  userId: string | null;
}

const Watchlist: React.FC<WatchlistProps> = ({ userId }) => {
  const [watchlist, setWatchlist] = useState<{ symbol: string; price: number }[]>([]);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) {
        console.error('No user ID provided');
        return;
      }
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/watchlist', {
          params: { user_id: userId }
        });
        setWatchlist(response.data);
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [userId]);

  const handleAddToWatchlist = async () => {
    if (!userId) {
      console.warn('No user ID provided');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/watchlist/add/', {
        user_id: userId,
        symbol: symbol
      });
      setWatchlist([...watchlist, { symbol: symbol, price: response.data.price }]);
      setSymbol('');
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    }
  };

  const handleDeleteFromWatchlist = async (symbolToDelete: string) => {
    if (!userId) {
      console.warn('No user ID provided');
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/watchlist/delete/${symbolToDelete}/`, {
        params: { user_id: userId }
      });
      setWatchlist(watchlist.filter(stock => stock.symbol !== symbolToDelete));
    } catch (error) {
      console.error('Failed to delete from watchlist:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Watchlist
        </Typography>
        
        <TextField
          label="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button onClick={handleAddToWatchlist}>Add to Watchlist</Button>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {watchlist.map((stock, index) => (
              <TableRow key={index}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteFromWatchlist(stock.symbol)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      </Box>
    </Container>
  );
};

export default Watchlist;
