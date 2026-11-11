import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DownIcon, UpIcon } from '../components/icons';
import { ScoreGauge } from '../components/ScoreGauge';
import { Button, Card, Pill, Screen, Txt } from '../components/ui';
import type { Reason } from '../lib/types';
import { useApplication } from '../state/application';
import { colors, fonts, radius } from '../theme';

function ReasonRow({ r }: { r: Reason }) {
  return (
    <Card style={s.reason}>
      {r.direction === 'up' ? <UpIcon /> : <DownIcon />}
      <Text style={s.reasonText}>{r.text}</Text>
    </Card>
  );
}

export default function Score() {
  const { result } = useApplication();
  if (!result) return <Redirect href="/" />;

  const up = result.reasons.filter((r) => r.direction === 'up');
  const down = result.reasons.filter((r) => r.direction === 'down');
  const updated = new Date(result.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Screen footer={<Button label="How to raise my score" onPress={() => router.push('/improve')} />}>
      <View style={s.top}>
        <Text style={s.hello}>Your Credee score</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/improve')} style={s.share} hitSlop={6}>
          <Text style={s.shareText}>Share</Text>
        </Pressable>
      </View>

      <View style={s.hero}>
        <ScoreGauge score={result.score} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Pill tone={result.confidence === 'High' ? 'good' : 'warn'}>{`${result.confidence} confidence`}</Pill>
          <Pill>{`Updated ${updated}`}</Pill>
        </View>
        <Txt variant="small" style={{ marginTop: 10, textAlign: 'center', fontSize: 12 }}>
          {result.basis}
        </Txt>
      </View>

      {up.length ? (
        <>
          <Txt variant="overline" accessibilityRole="header" style={s.section}>
            What's helping
          </Txt>
          <View style={{ gap: 8 }}>{up.map((r) => <ReasonRow key={r.code} r={r} />)}</View>
        </>
      ) : null}
      {down.length ? (
        <>
          <Txt variant="overline" accessibilityRole="header" style={s.section}>
            What's holding you back
          </Txt>
          <View style={{ gap: 8 }}>{down.map((r) => <ReasonRow key={r.code} r={r} />)}</View>
        </>
      ) : null}

      <Txt variant="small" style={{ marginTop: 16, fontSize: 12, textAlign: 'center' }}>
        Prototype: this score is sample data, not a real assessment.
      </Txt>
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hello: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  share: { height: 44, justifyContent: 'center', paddingHorizontal: 4 },
  shareText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  hero: {
    marginTop: 8,
    padding: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  section: { marginTop: 20, marginBottom: 10 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  reasonText: { flex: 1, fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.ink },
});
