// @flow
import * as React from 'react';
import { object } from 'prop-types';
import merge from 'deepmerge';

import type { $AppConfig } from 'build-tracker-flowtypes';

type ContextProps = {
  config: $AppConfig,
  children: React.Node
};

const defaultConfig = {
  thresholds: {
    stat: 5000,
    statPercent: 0.1,
    gzip: 500,
    gzipPercent: 0.05
  }
};

export default class ContextProvider extends React.Component<ContextProps> {
  static childContextTypes = {
    config: object
  };

  getChildContext() {
    const { config } = this.props;
    return {
      config: merge(defaultConfig, config)
    };
  }

  render() {
    return this.props.children;
  }
}
