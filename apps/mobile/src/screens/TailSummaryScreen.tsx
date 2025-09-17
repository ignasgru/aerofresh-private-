import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  route: any;
}

export default function TailSummaryScreen({ route }: Props) {
  const { summary, tail } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tail: {tail}</Text>
      <Text>Registration Status: {summary.regStatus}</Text>
      <Text>Airworthiness: {summary.airworthiness}</Text>
      <Text>Open ADs: {summary.adOpenCount}</Text>
      <Text>NTSB Accidents: {summary.ntsbAccidents}</Text>
      <Text>Owners: {summary.owners}</Text>
      <Text>Risk Score: {summary.riskScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
