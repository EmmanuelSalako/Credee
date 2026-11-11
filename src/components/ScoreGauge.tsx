import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { bandFor, SCORE_MAX, SCORE_MIN } from '../lib/score';
import { colors, fonts } from '../theme';

const ARC = 'M 20 130 A 110 110 0 0 1 240 130';
const ARC_LENGTH = Math.PI * 110;

export function toneColor(score: number) {
  const tone = bandFor(score).tone;
  return tone === 'good' ? colors.primary : tone === 'fair' ? colors.fair : colors.poor;
}

/** Half-circle gauge from 300 to 850 with the score and band in the middle. */
export function ScoreGauge({ score }: { score: number }) {
  const frac = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const accent = toneColor(score);
  return (
    <View style={{ alignItems: 'center' }} accessible accessibilityLabel={`Score ${score} out of ${SCORE_MAX}, ${bandFor(score).label}`}>
      <View style={{ width: 260, height: 146 }}>
        <Svg width={260} height={146} viewBox="0 0 260 146">
          <Path d={ARC} fill="none" stroke={colors.segment} strokeWidth={16} strokeLinecap="round" />
          <Path
            d={ARC}
            fill="none"
            stroke={accent}
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={`${(frac * ARC_LENGTH).toFixed(1)} ${ARC_LENGTH}`}
          />
        </Svg>
        <View style={s.centre}>
          <Text style={s.score}>{score}</Text>
          <Text style={[s.band, { color: accent }]}>{bandFor(score).label}</Text>
        </View>
      </View>
      <View style={s.scale}>
        <Text style={s.tick}>{SCORE_MIN}</Text>
        <Text style={s.tick}>{SCORE_MAX}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  centre: { position: 'absolute', left: 0, right: 0, top: 52, alignItems: 'center' },
  score: { fontFamily: fonts.display, fontSize: 52, lineHeight: 56, letterSpacing: -1.5, color: colors.ink },
  band: { fontFamily: fonts.semibold, fontSize: 14, marginTop: 2 },
  scale: { width: 240, flexDirection: 'row', justifyContent: 'space-between' },
  tick: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
