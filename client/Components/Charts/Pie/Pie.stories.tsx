import Pie from './Pie';

export default {
  title: 'Wpai/Charts/Pie',
  component: Pie,
};

export const Simple = {
  args: {
    data: [
      { month: 'January', visitors: 186 },
      { month: 'February', visitors: 305 },
      { month: 'March', visitors: 55 },
      { month: 'April', visitors: 75 },
      { month: 'May', visitors: 170 },
      { month: 'June', visitors: 186 },
      { month: 'July', visitors: 305 },
      { month: 'August', visitors: 55 },
      { month: 'September', visitors: 75 },
      { month: 'October', visitors: 170 },
      { month: 'November', visitors: 170 },
      { month: 'December', visitors: 170 },
    ],
    chart: {
      xAxisKey: 'month',
      dataKeys: [
        {
          key: 'visitors',
          label: 'Visitors',
        },
      ],
      xAxisTickAbbr: 3,
    },
  },
};
