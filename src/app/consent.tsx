import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckIcon } from '../components/icons';
import { StepHeader } from '../components/StepHeader';
import { Button, Pill, Screen, Txt } from '../components/ui';
import type { ConsentKey } from '../lib/types';
import { useApplication } from '../state/application';
import { colors, fonts, radius } from '../theme';

const ITEMS: { key: ConsentKey; title: string; body: string; required?: boolean }[] = [
  { key: 'statements', title: 'Bank statements', body: 'Income, spending, savings and bill patterns from the statements you upload.', required: true },
  { key: 'bureau', title: 'Credit bureau record', body: 'Past loans and repayments from CRC and other licensed bureaus, using your BVN.' },
  { key: 'airtime', title: 'Airtime and data top-ups', body: 'How regularly you recharge from your bank app. Shows steady spending habits.' },
  { key: 'receipts', title: 'Rent and utility receipts', body: 'Optional uploads later, like rent, electricity tokens or school fees.' },
];

export default function Consent() {
  const { app, toggleConsent } = useApplication();

  return (
    <Screen footer={<Button label="I agree, continue" onPress={() => router.push('/statements')} />}>
      <StepHeader step={3} />
      <Txt variant="title" accessibilityRole="header" style={{ marginTop: 24, marginBottom: 8 }}>
        What we'll look at
      </Txt>
      <Txt>Pick what Credee can use. More data usually means a more confident score.</Txt>

      <View style={{ marginTop: 20, gap: 10 }}>
        {ITEMS.map((item) => {
          const on = app.consents[item.key];
          const bureauNeedsBvn = item.key === 'bureau' && app.idKind !== 'bvn';
          return (
            <Pressable
              key={item.key}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: !!item.required }}
              disabled={item.required}
              onPress={() => toggleConsent(item.key)}
              style={s.row}
            >
              <View style={[s.box, on && s.boxOn]}>{on ? <CheckIcon size={16} color={colors.onPrimary} strokeWidth={3} /> : null}</View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text style={s.title}>{item.title}</Text>
                  {item.required ? <Pill tone="warn">Required</Pill> : null}
                </View>
                <Txt variant="small">{item.body}</Txt>
                {bureauNeedsBvn ? (
                  <Txt variant="small" style={{ color: colors.warnInk }}>
                    Needs a BVN. You verified with NIN, so we'll skip this for now.
                  </Txt>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Txt variant="small" style={{ marginTop: 16, fontSize: 12 }}>
        You can withdraw consent or delete your data anytime in Settings. We follow the Nigeria Data Protection Act.
      </Txt>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#9CA59F', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  title: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
});
