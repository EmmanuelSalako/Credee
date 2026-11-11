import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { Button, Card, Screen, Txt } from '../components/ui';
import { makeShareCode } from '../lib/score';
import { useApplication } from '../state/application';
import { colors, fonts, radius } from '../theme';

export default function Improve() {
  const { result } = useApplication();
  const [code, setCode] = useState<string | null>(null);
  if (!result) return <Redirect href="/" />;

  return (
    <Screen footer={<Button label="Add another statement" variant="outline" onPress={() => router.push('/statements')} />}>
      <StepHeader title="Improve and share" />

      <Txt variant="overline" accessibilityRole="header" style={{ marginTop: 16, marginBottom: 10 }}>
        Ways to raise your score
      </Txt>
      <View style={{ gap: 8 }}>
        {result.tips.map((t) => (
          <Card key={t.title} style={s.tip}>
            <View style={s.pts}>
              <Text style={s.ptsText}>{`+${t.points[0]}–${t.points[1]}`}</Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={s.tipTitle}>{t.title}</Text>
              <Txt variant="small">{t.body}</Txt>
            </View>
          </Card>
        ))}
      </View>
      <Txt variant="small" style={{ marginTop: 8, fontSize: 12 }}>
        Point ranges are estimates. Upload new statements monthly to update your score.
      </Txt>

      <Txt variant="overline" accessibilityRole="header" style={{ marginTop: 22, marginBottom: 10 }}>
        Share with a lender
      </Txt>
      <Card style={{ gap: 12 }}>
        <Txt style={{ fontSize: 14, color: colors.label }}>
          Give a lender a one-time code. They see your score, band and reasons, never your full statements.
        </Txt>
        {code ? (
          <View style={s.codeBox} accessible accessibilityLabel={`Share code ${code.split('').join(' ')}`}>
            <Text selectable style={s.code}>
              {code}
            </Text>
            <Txt variant="small" style={{ fontSize: 12 }}>
              Valid for 7 days · you can revoke it anytime
            </Txt>
          </View>
        ) : (
          <Button label="Create share code" onPress={() => setCode(makeShareCode())} />
        )}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  pts: { minWidth: 56, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.primarySoft },
  ptsText: { fontFamily: fonts.display, fontSize: 14, color: colors.primaryDark },
  tipTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  codeBox: { alignItems: 'center', gap: 4, padding: 14, borderRadius: radius.sm, backgroundColor: colors.ground },
  code: { fontFamily: fonts.display, fontSize: 30, letterSpacing: 6, color: colors.ink },
});
