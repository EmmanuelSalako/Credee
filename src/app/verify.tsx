import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ShieldIcon } from '../components/icons';
import { StepHeader } from '../components/StepHeader';
import { Button, Field, Screen, Txt } from '../components/ui';
import type { IdKind } from '../lib/types';
import { digitsOnly, isValidIdNumber } from '../lib/validate';
import { useApplication } from '../state/application';
import { colors, fonts, radius } from '../theme';

/** BVN (default) or NIN. Real version: verify via a KYC provider (NIBSS iGree for BVN, NIMC for NIN). */
export default function Verify() {
  const { app, setId } = useApplication();
  const [kind, setKind] = useState<IdKind>(app.idKind);
  const [num, setNum] = useState(app.idNumber);
  const [touched, setTouched] = useState(false);
  const ok = isValidIdNumber(num);
  const isBvn = kind === 'bvn';

  function next() {
    setTouched(true);
    if (!ok) return;
    setId(kind, digitsOnly(num));
    router.push('/consent');
  }

  return (
    <Screen
      footer={
        <>
          <Button label="Continue" onPress={next} />
          {isBvn ? <Button label="Don't know your BVN? Dial *565*0#" variant="ghost" /> : null}
        </>
      }
    >
      <StepHeader step={2} />
      <Txt variant="title" accessibilityRole="header" style={{ marginTop: 24, marginBottom: 8 }}>
        Confirm it's you
      </Txt>
      <Txt>We match your details to your ID so nobody can get a score in your name.</Txt>

      <View style={s.segment} accessibilityRole="radiogroup" accessibilityLabel="ID type">
        {(['bvn', 'nin'] as const).map((k) => {
          const on = k === kind;
          return (
            <Pressable
              key={k}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setKind(k)}
              style={[s.segBtn, on && s.segOn]}
            >
              <Text style={[s.segText, on && s.segTextOn]}>{k.toUpperCase()}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 24 }}>
        <Field
          label={isBvn ? 'Bank Verification Number (11 digits)' : 'National Identification Number (11 digits)'}
          value={num}
          onChangeText={(t) => setNum(digitsOnly(t).slice(0, 11))}
          keyboardType="number-pad"
          placeholder="00000000000"
          inputStyle={{ letterSpacing: 2, fontSize: 18 }}
          error={touched && !ok ? 'It should be 11 digits' : undefined}
          hint={isBvn ? 'BVN also lets us check your credit bureau record.' : 'With NIN only, your score may have lower confidence.'}
        />
      </View>

      <View style={s.note}>
        <ShieldIcon />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.noteTitle}>Your money stays safe</Text>
          <Text style={s.noteBody}>A BVN can't be used to move money. We never ask for your bank PIN, password or card details.</Text>
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  segment: { marginTop: 24, flexDirection: 'row', gap: 4, padding: 4, backgroundColor: colors.segment, borderRadius: 12 },
  segBtn: { flex: 1, height: 44, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  segText: { fontFamily: fonts.medium, fontSize: 15, color: colors.body },
  segTextOn: { fontFamily: fonts.semibold, color: colors.ink },
  note: { marginTop: 24, padding: 16, borderRadius: radius.md, backgroundColor: colors.primarySoft, flexDirection: 'row', gap: 12 },
  noteTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  noteBody: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: '#2F4A40' },
});
