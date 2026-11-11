import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckIcon, ClockIcon, LockIcon } from '../components/icons';
import { Button, Card, Screen, Txt } from '../components/ui';
import { colors, fonts } from '../theme';

function Point({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <Card style={s.point}>
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={s.pointTitle}>{title}</Text>
        <Txt variant="small">{body}</Txt>
      </View>
    </Card>
  );
}

export default function Welcome() {
  return (
    <Screen
      footer={
        <>
          <Button label="Get my score" onPress={() => router.push('/sign-up')} />
          <Button label="I already have an account" variant="ghost" onPress={() => router.push('/sign-up')} />
        </>
      }
    >
      <View style={s.brand}>
        <View style={s.logo}>
          <Text style={s.logoLetter}>C</Text>
        </View>
        <Text style={s.brandName}>Credee</Text>
      </View>

      <View style={{ marginTop: 48, gap: 16 }}>
        <Txt variant="display" accessibilityRole="header">
          A credit score built from how you really manage money
        </Txt>
        <Txt style={{ fontSize: 16, lineHeight: 24 }}>
          Never had a loan? That's fine. We read your bank statements and credit bureau record to show lenders the full
          picture.
        </Txt>
      </View>

      <View style={{ marginTop: 32, gap: 12 }}>
        <Point icon={<ClockIcon />} title="About 5 minutes" body="Phone, ID, consent, statements" />
        <Point icon={<LockIcon />} title="You decide who sees it" body="Share with a lender only when you choose" />
        <Point icon={<CheckIcon size={24} strokeWidth={2} />} title="Free to check" body="Checking never lowers your score" />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 },
  logo: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: colors.onPrimary, fontFamily: fonts.display, fontSize: 20 },
  brandName: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, letterSpacing: -0.3 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  pointTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
});
