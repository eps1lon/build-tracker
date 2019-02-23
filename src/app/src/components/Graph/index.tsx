import 'd3-transition';
import Area from './Area';
import Comparator from '@build-tracker/comparator';
import HoverOverlay from './HoverOverlay';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { scaleLinear, scalePoint } from 'd3-scale';

interface Props {
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  sizeKey: string;
}

enum Margin {
  TOP = 0,
  RIGHT = 20,
  BOTTOM = 100,
  LEFT = 80
}

const Graph = (props: Props): React.ReactElement => {
  const { colorScale, comparator, sizeKey } = props;
  const [{ width, height }, setDimensions] = React.useState({ width: 0, height: 0 });
  const svgRef = React.useRef(null);

  const xScale = React.useMemo(() => {
    const domain = comparator.builds
      .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
      .map(build => build.getMetaValue('revision'));
    return scalePoint()
      .range([0, width - Margin.LEFT - Margin.RIGHT])
      .padding(0.05)
      .round(true)
      .domain(domain);
  }, [comparator, width]);

  const yScale = React.useMemo(() => {
    const totals = comparator.builds.map(build => build.getTotals()[sizeKey]);
    const maxTotal = Math.max(...totals);
    return scaleLinear()
      .range([height - Margin.TOP - Margin.BOTTOM, 0])
      .domain([0, maxTotal]);
  }, [comparator, height, sizeKey]);

  const handleLayout = (event: LayoutChangeEvent): void => {
    const {
      nativeEvent: {
        layout: { height, width }
      }
    } = event;
    setDimensions({ height, width });
  };

  return (
    <View onLayout={handleLayout} style={styles.root}>
      <svg height={height} ref={svgRef} width={width}>
        <g className="main" transform="translate(80,20)">
          {height && width ? (
            <>
              <XAxis height={height - Margin.TOP - Margin.BOTTOM} scale={xScale} />
              <YAxis scale={yScale} />
              <Area colorScale={colorScale} comparator={comparator} sizeKey={sizeKey} xScale={xScale} yScale={yScale} />
              <HoverOverlay
                height={height - Margin.TOP - Margin.BOTTOM}
                width={width - Margin.LEFT - Margin.RIGHT}
                xScale={xScale}
              />
            </>
          ) : null}
        </g>
      </svg>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '100%',
    maxHeight: 'calc(100% - 4rem)',
    overflow: 'hidden'
  }
});

export default Graph;
