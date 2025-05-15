import React from 'react'
// import { RankChart } from './rank-chart';
import { ChartTotal } from './chart-total';
import { ChartRank } from './chart-rank';
import { ChartField } from './chart-field';
import { ChartActive } from './chart-active';
import { ChartInterst } from './chart-interst';

interface MemberChartProps {
  onClose: () => void;
}

const MemberChart: React.FC<MemberChartProps> = () => {
  return (
    <div className='flex flex-col -mt-6'>
      <div className='flex flex-col md:flex-row gap-2'>
        <ChartRank />
        <ChartTotal />
        <ChartActive />
      </div>
      <div className='flex mt-2 justify-between'>
        <ChartField />
        <ChartInterst />
      </div>
    </div>
  )
}

export default MemberChart




