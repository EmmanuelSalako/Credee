import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckIcon } from '../components/icons';
import { Button, Screen, Txt } from '../components/ui';
import { scoreApplication } from '../lib/score';
import { useApplication } from '../state/application';
import { colors, fonts } from '../theme';

const STEPS: [string, string][] = [
  ['Checking the statements are genuine', 'Matching names, dates and running balances'],
  ['Reading your transactions', 'Sorting salary, transfers, bills, airtime and loans'],
  ['Finding your patterns', 'Income regularity, savings buffer, spending swings'],
  ['Checking credit bureaus', 'Past loans and repayments linked to your BVN'],
  ['Building your score', 'Combining everything into one number with reasons'],
];

export default function Analysing() {
  const { app, result, setResult } = useApplication();
  const [at, setAt] = useState(0);
  const steps = STEPS.filter((_, i) => i !== 3 || (app.consents.bureau && app.idKind === 'bvn'));

  useEffect(() => {
    setResult(null);
    scoreApplication(app).then(setResult);
    const t = setInterval(() => setAt((x) => (x >= steps.length ? x : x + 1)), 800);
    return () => clearInterval(t);
    // Run once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = at >= steps.length && !!result;

  return (
    <Screen footer={<Button label={done ? 'See my score' : 'Working on it'} disabled={!done} onPress={() => router.replace('/score')} />}>
      <Txt variant="title" accessibilityRole="header" style={{ marginTop: 48, marginBottom: 8 }}>
        {done ? 'Your score is ready' : 'Reading your statements'}
      </Txt>
      <Txt>This usually takes under a minute. You can close the app and we'll notify you.</Txt>

      <View style={{ marginTop: 36, gap: 22 }} accessibilityLiveRegion="polite">
        {steps.map(([title, body], i) => {
          const isDone = i < at;
          const active = i === at;
          return (
            <View key={title} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <View style={[s.dot, isDone ? s.dotDone : active ? s.dotActive : s.dotIdle]}>
                {isDone ? <CheckIcon size={16} color={colors.onPrimary} strokeWidth={3} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[s.title, !(isDone || active) && s.titleIdle]}>{title}</Text>
                <Txt variant="small">{body}</Txt>
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.primary },
  dotActive: { borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.surface },
  dotIdle: { borderWidth: 2, borderColor: '#CFCDC2' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  titleIdle: { fontFamily: fonts.medium, color: '#6B7570' },
});
