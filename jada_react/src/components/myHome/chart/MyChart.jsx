import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const MyChart = ({ rideArr, alightArr }) => {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['7-8', '8-9', '9-10', '10-11', '11-12', '17-18', '18-19', '19-20'],
        datasets: [
          {
            label: '탑승인원',
            data: [1,2,3,4,5,6,1],
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'red',
            borderWidth: 2,
          },
          {
            label: '하차인원',
            data: [4,2,53,2,3,4,51,1],
            
            backgroundColor: 'rgb(75, 192, 192)',
          },
        ],
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [rideArr, alightArr]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MyChart;
