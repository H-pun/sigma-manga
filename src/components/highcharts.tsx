"use client";

import HighchartsPrimitive from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Highcharts = ({ options }: { options: HighchartsPrimitive.Options }) => {
  return <HighchartsReact highcharts={HighchartsPrimitive} options={options} />;
};

export default Highcharts;
