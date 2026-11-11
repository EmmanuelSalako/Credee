import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';

/** Phone-width column, centred on wide web screens. Footer sticks to the bottom. */
export function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.column}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer ? <View style={s.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

type TxtVariant = 'display' | 'title' | 'body' | 'small' | 'label' | 'overline';

export function Txt({
  children,
  variant = 'body',
  style,
  ...rest
}: {
  children: ReactNode;
  variant?: TxtVariant;
  style?: StyleProp<TextStyle>;
  accessibilityRole?: 'header' | 'text';
}) {
  return (
    <Text style={[s[variant], style]} {...rest}>
      {children}
    </Text>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        variant === 'primary' && s.btnPrimary,
        variant === 'outline' && s.btnOutline,
        variant === 'ghost' && s.btnGhost,
        inactive && variant === 'primary' && s.btnDisabled,
        pressed && !inactive && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onPrimary : colors.primary} />
      ) : (
        <Text
          style={[
            s.btnText,
            variant !== 'primary' && { color: colors.primary },
            variant === 'ghost' && { fontFamily: fonts.medium, fontSize: 15 },
            inactive && variant === 'primary' && { color: colors.body },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Field({
  label,
  hint,
  error,
  prefix,
  inputStyle,
  ...input
}: TextInputProps & { label: string; hint?: string; error?: string; prefix?: string; inputStyle?: StyleProp<TextStyle> }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={s.label} nativeID={`${label}-label`}>
        {label}
      </Text>
      <View style={[s.inputWrap, error ? { borderColor: colors.poor } : null]}>
        {prefix ? <Text style={s.prefix}>{prefix}</Text> : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor="#8A938F"
          style={[s.input, inputStyle]}
          {...input}
        />
      </View>
      {error ? <Text style={[s.small, { color: colors.poor }]}>{error}</Text> : hint ? <Text style={s.small}>{hint}</Text> : null}
    </View>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warn' | 'good' }) {
  const bg = tone === 'warn' ? colors.warnSoft : tone === 'good' ? colors.primarySoft : '#EDEBE3';
  const fg = tone === 'warn' ? colors.warnInk : tone === 'good' ? colors.primaryDark : colors.label;
  return (
    <View style={[s.pill, { backgroundColor: bg }]}>
      <Text style={[s.pillText, { color: fg }]}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  column: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8, gap: 10 },

  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, letterSpacing: -0.8, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32, letterSpacing: -0.5, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.body },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.muted },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.label },
  overline: { fontFamily: fonts.semibold, fontSize: 13, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.label },

  btn: { height: 54, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btnPrimary: { backgroundColor: colors.primary },
  btnOutline: { borderWidth: 1.5, borderColor: colors.primary, height: 50 },
  btnGhost: { height: 46 },
  btnDisabled: { backgroundColor: colors.segment },
  btnText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 16 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  prefix: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.ink,
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    height: '100%',
    textAlignVertical: 'center',
    lineHeight: 51,
  },
  input: { flex: 1, minWidth: 0, height: '100%', paddingHorizontal: 14, fontFamily: fonts.body, fontSize: 17, color: colors.ink },

  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontFamily: fonts.semibold, fontSize: 12 },
});
