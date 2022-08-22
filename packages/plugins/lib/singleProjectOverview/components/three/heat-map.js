import React, { Suspense } from 'react';
import ThreeSetup from './three-setup';
import HeatModel from './heat-model';

function ThreeHeatMap(props) {
  return (

    <ThreeSetup {...props} controls={false} style={{ background: '#60718c' }}>
      <Suspense fallback={null}>
        <HeatModel {...props} />
      </Suspense>
    </ThreeSetup>

  );
}

export default ThreeHeatMap;
