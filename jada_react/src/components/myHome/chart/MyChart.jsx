import { PieChart } from "react-minimal-pie-chart";

const Chart = () => {


data = 


  return (
      <PieChart
        data={[
          {
            value: 0,
            color: "#F6CB44",
            name: "name1",
          },
        ]}
        reveal={0} //퍼센트 치수
        lineWidth={18} //도넛 두께
        background="#f3f3f3"
        lengthAngle={-180}
        rounded
        animate
        label={({ dataEntry }) => dataEntry.value + "%"}
        labelStyle={{
          fontSize: "26px",
          fill: "#33333",
        }}
        labelPosition={0}
      />
  );
};

export default Chart;