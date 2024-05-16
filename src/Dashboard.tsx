import React, { useEffect, useState } from 'react';
import { Container, Typography, Box,CircularProgress } from '@mui/material';
import axios from 'axios';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLegend,
} from 'victory';

interface Stock {
  symbol: string;
  price: number;
}

interface DashboardProps {
  userId: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [stocks, setStocks] = useState<{ symbol: string; price: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!userId) {
        console.error('No user ID provided');
        return;
      }
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/stocks', {
          params: { user_id: userId }
        });
        setStocks(response.data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, [userId]);


  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Stock Dashboard
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
            </Box>
        ) : (

        <VictoryChart
          containerComponent={<VictoryVoronoiContainer />}
        >
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryLine
            data={stocks.map((stock) => ({ x: stock.symbol, y: stock.price }))}
            labels={({ datum }: { datum: any }) => `${datum.symbol}: ${datum.y}`}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryLegend
            x={125}
            y={50}
            title="Legend"
            centerTitle
            orientation="horizontal"
            gutter={20}
            style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
            data={[{ name: "Stocks", symbol: { fill: "tomato" } }]}
          />
        </VictoryChart>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
