/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Build from '@build-tracker/build';
import Button from './Button';
import CloseIcon from '../icons/Close';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Table, Tbody, Td, Th, Tr } from './Table';

interface Props {
  build: Build;
  onClose?: (revision: string) => void;
  style?: StyleProp<ViewStyle>;
}

const titleCase = (value: string): string => {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

const BuildInfo = (props: Props): React.ReactElement => {
  const { build, onClose, style } = props;
  const revision = build.getMetaValue('revision');
  const handleClose = React.useCallback(() => {
    onClose(revision);
  }, [onClose, revision]);
  return (
    <View style={[styles.root, style]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Revision details</Text>
        <Button icon={CloseIcon} iconOnly onPress={handleClose} title="Close" />
      </View>
      <Table>
        <Tbody>
          <Tr>
            <Th>
              <Text>Revision</Text>
            </Th>
            <Td style={styles.infoCell}>
              <Text>{revision}</Text>
            </Td>
          </Tr>
          <Tr>
            <Th>
              <Text>Date</Text>
            </Th>
            <Td style={styles.infoCell}>
              <Text>{build.timestamp.toLocaleString()}</Text>
            </Td>
          </Tr>
          {Object.keys(build.meta)
            .filter(metaKey => metaKey !== 'revision' && metaKey !== 'timestamp')
            .map(metaKey => {
              // @ts-ignore
              const value = build.getMetaValue(metaKey);
              return (
                <Tr key={metaKey}>
                  <Th>
                    <Text>{titleCase(metaKey)}</Text>
                  </Th>
                  <Td style={styles.infoCell}>
                    <Text>{value}</Text>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: Theme.Spacing.Normal,
    paddingBottom: Theme.Spacing.Large
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  // @ts-ignore
  headerText: {
    fontWeight: Theme.FontWeight.Bold,
    fontSize: Theme.FontSize.Medium
  },
  infoCell: {
    textAlign: 'left'
  }
});

export default BuildInfo;