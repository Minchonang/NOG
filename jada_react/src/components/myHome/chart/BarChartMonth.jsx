import React from 'react';
import { Bar } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const BarChartMonth = ({data5}) => {
  // data5[0].keys()
  let label = [0]
  let myData = [];
  let cityData = [];
  let keys =[]
  if (data5 && Array.isArray(data5) && data5.length > 0 && typeof data5[0] === 'object') {
    // console.log(Object.keys(data5[0]));
  label = Object.keys(data5[1])
    console.log(data5[0]["1"])
  keys = Object.keys(data5[1]);

  }
  keys.forEach(key => {
    const value = data5[0][key] !== undefined ? data5[0][key] : 0;
    myData.push(value);
    cityData.push(data5[1][key]);
  });
  // console.log(data5[1].keys())
    const labels = label;
    const data = {
      labels: labels,
      datasets: [{


        label: ['나의 소비'],
        data: myData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
        
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          
        ],
        borderWidth: 1
      },{


        label: ['도시 소비 평균(kWh)'],
        data: cityData,
        backgroundColor: [
          'rgba(153, 102, 255, 0.5)',
        
        ],
        borderColor: [
          'rgb(153, 102, 255)',
          
        ],
        borderWidth: 1
      },
    
    
    
    
    ]
    };
    const option = {
   
      plugins: {
      
        legend: {
          display: true,
          
          // labels: {
          //   color: 'black', // 범례 텍스트 색상
          //   font: {
          //     size: 15,

          //   },
          // }, 
         

        },}}


  return (

          <Bar  data={data} options={option} className={style.bar_chart}/>
  );
};

export default BarChartMonth;
