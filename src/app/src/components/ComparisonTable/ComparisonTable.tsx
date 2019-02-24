import ArtifactCell from './ArtifactCell';
import ColorScaleContext from '../../context/ColorScale';
import DeltaCell from './DeltaCell';
import React from 'react';
import RevisionCell from './RevisionCell';
import RevisionDeltaCell from './RevisionDeltaCell';
import { StyleSheet } from 'react-native';
import TextCell from './TextCell';
import TotalCell from './TotalCell';
import TotalDeltaCell from './TotalDeltaCell';
import Comparator, { BodyCell, CellType, TotalDeltaCell as TDCell } from '@build-tracker/comparator';
import { Table, Tbody, Thead, Tr } from './Table';

interface Props {
  activeArtifactNames: Array<string>;
  comparator: Comparator;
  onSetActiveArtifacts: (artifactNames: Array<string>) => void;
  sizeKey: string;
}

const ComparisonTable = (props: Props): React.ReactElement => {
  const { activeArtifactNames, comparator, onSetActiveArtifacts, sizeKey } = props;
  const scaleFromContext = React.useContext(ColorScaleContext);
  const colorScale = scaleFromContext.domain([0, comparator.artifactNames.length]);
  const matrix = comparator.toJSON();

  const handleToggleArtifact = (artifactName: string, toggled: boolean): void => {
    let nextArtifacts;
    if (!toggled) {
      nextArtifacts = activeArtifactNames.filter(name => name !== artifactName);
    } else {
      nextArtifacts =
        artifactName === 'All'
          ? comparator.artifactNames
          : comparator.artifactNames.filter(name => name === artifactName || activeArtifactNames.indexOf(name) !== -1);
    }

    onSetActiveArtifacts(nextArtifacts);
  };

  const mapBodyCell = (cell: BodyCell | TDCell, i: number): React.ReactElement => {
    switch (cell.type) {
      case CellType.TEXT:
        return <TextCell cell={cell} key={i} />;
      case CellType.ARTIFACT: {
        const isActive =
          cell.text === 'All'
            ? activeArtifactNames.length === comparator.artifactNames.length
            : activeArtifactNames.indexOf(cell.text) !== -1;
        return (
          <ArtifactCell
            cell={cell}
            color={colorScale(comparator.artifactNames.indexOf(cell.text))}
            disabled={cell.text === 'All' && isActive}
            key={i}
            isActive={isActive}
            onToggle={handleToggleArtifact}
          />
        );
      }
      case CellType.DELTA:
        return <DeltaCell cell={cell} key={i} sizeKey={sizeKey} />;
      case CellType.TOTAL:
        return <TotalCell cell={cell} key={i} sizeKey={sizeKey} />;
      case CellType.TOTAL_DELTA:
        return <TotalDeltaCell cell={cell} key={i} sizeKey={sizeKey} />;
    }
  };

  return (
    <Table style={styles.table}>
      <Thead>
        <Tr style={styles.headerRow}>
          {matrix.header.map((cell, i) => {
            switch (cell.type) {
              case CellType.TEXT:
                return <TextCell cell={cell} header key={i} style={styles.headerCell} />;
              case CellType.REVISION:
                return <RevisionCell cell={cell} key={i} style={styles.headerCell} />;
              case CellType.REVISION_DELTA:
                return <RevisionDeltaCell cell={cell} key={i} style={styles.headerCell} />;
            }
          })}
        </Tr>
        <Tr>{matrix.total.map(mapBodyCell)}</Tr>
      </Thead>
      <Tbody>
        {matrix.body.map((row, i) => (
          <Tr key={i}>{row.map(mapBodyCell)}</Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const styles = StyleSheet.create({
  table: {
    position: 'relative'
  },
  headerCell: {
    // @ts-ignore
    position: 'sticky',
    top: 0,
    zIndex: 2,
    height: 'calc(4rem - 1px)'
  }
});

export default ComparisonTable;