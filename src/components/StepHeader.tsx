import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { BackIcon } from './icons';

export const TOTAL_STEPS = 4;

/** Back button, "Step n of 4" and a segmented progress bar. */
export function StepHeader({ step, title }: { step?: number; title?: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={s.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          style={s.back}
          hitSlop={8}
        >
          <BackIcon />
        </Pressable>
        <Text style={s.caption}>{step ? `Step ${step} of ${TOTAL_STEPS}` : title}</Text>
        <View style={{ width: 44 }} />
      </View>
      {step ? (
        <View style={s.bar} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: TOTAL_STEPS, now: step }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <View key={i} style={[s.seg, { backgroundColor: i < step ? colors.primary : colors.track }]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  row: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 44, height: 44, justifyContent: 'center' },
  caption: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  bar: { flexDirection: 'row', gap: 6, marginTop: 4 },
  seg: { flex: 1, height: 4, borderRadius: 2 },
});
