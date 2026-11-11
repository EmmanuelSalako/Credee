import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { Button, Field, Screen, Txt } from '../components/ui';
import { digitsOnly, formatPhone, isValidPhone, normalisePhone } from '../lib/validate';
import { useApplication } from '../state/application';
import { colors } from '../theme';

/**
 * Phone + OTP. The OTP is mocked: any 6 digits pass.
 * Real version: send via an SMS provider (e.g. Termii) from the backend.
 */
export default function SignUp() {
  const { app, setPhone } = useApplication();
  const [phone, setLocalPhone] = useState(app.phone ? formatPhone(app.phone) : '');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);

  const phoneOk = isValidPhone(phone);
  const codeOk = digitsOnly(code).length === 6;

  function sendCode() {
    setTouched(true);
    if (!phoneOk) return;
    setPhone(normalisePhone(phone));
    setSent(true);
  }

  return (
    <Screen
      footer={
        <>
          {sent ? (
            <Button label="Verify and continue" disabled={!codeOk} onPress={() => router.push('/verify')} />
          ) : (
            <Button label="Send code" onPress={sendCode} />
          )}
          <Text style={{ textAlign: 'center', fontSize: 12, color: colors.muted }}>
            By continuing you agree to our Terms and Privacy notice.
          </Text>
        </>
      }
    >
      <StepHeader step={1} />
      <Txt variant="title" accessibilityRole="header" style={{ marginTop: 24, marginBottom: 8 }}>
        What's your phone number?
      </Txt>
      <Txt>Use the number linked to your BVN. We'll text you a code to confirm it.</Txt>

      <View style={{ marginTop: 28, gap: 28 }}>
        <Field
          label="Phone number"
          prefix="+234"
          value={phone}
          onChangeText={(t) => {
            setLocalPhone(t);
            setSent(false);
          }}
          keyboardType="phone-pad"
          placeholder="803 123 4567"
          autoComplete="tel"
          error={touched && !phoneOk ? 'Enter a Nigerian mobile number, like 803 123 4567' : undefined}
        />
        {sent ? (
          <Field
            label={`6-digit code sent to 0${formatPhone(normalisePhone(phone))}`}
            value={code}
            onChangeText={(t) => setCode(digitsOnly(t).slice(0, 6))}
            keyboardType="number-pad"
            placeholder="000000"
            autoComplete="one-time-code"
            inputStyle={{ letterSpacing: 8, fontSize: 22 }}
            hint="Prototype: any 6 digits will work."
          />
        ) : null}
      </View>
    </Screen>
  );
}
