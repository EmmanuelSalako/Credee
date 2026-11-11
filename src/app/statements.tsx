import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CloseIcon, FileIcon, PlusIcon } from '../components/icons';
import { StepHeader } from '../components/StepHeader';
import { Button, Card, Screen, Txt } from '../components/ui';
import { useApplication } from '../state/application';
import { colors, fonts, radius } from '../theme';

const MAX_BYTES = 20 * 1024 * 1024;

function sizeLabel(bytes?: number) {
  if (!bytes) return 'PDF';
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/**
 * Upload PDF statements. Files stay on the device in this version; nothing is sent anywhere.
 * Real version: upload to the statement-analysis service, which parses and checks them.
 */
export default function Statements() {
  const { app, addStatement, removeStatement } = useApplication();
  const [error, setError] = useState<string | null>(null);
  const n = app.statements.length;

  async function pick() {
    setError(null);
    const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: true, copyToCacheDirectory: true });
    if (res.canceled) return;
    for (const a of res.assets) {
      if (a.size && a.size > MAX_BYTES) {
        setError(`${a.name} is over 20 MB.`);
        continue;
      }
      addStatement({ id: `${Date.now()}-${a.name}`, name: a.name, sizeBytes: a.size ?? undefined, uri: a.uri });
    }
  }

  function addSample() {
    const samples = ['Salary account statement.pdf', 'Wallet statement.pdf', 'Savings account statement.pdf'];
    addStatement({ id: `sample-${Date.now()}`, name: samples[n % samples.length] });
  }

  return (
    <Screen
      footer={
        <>
          <Txt variant="small" style={{ textAlign: 'center' }}>
            {n === 0 ? 'Add at least one statement to continue' : `${n} statement${n === 1 ? '' : 's'} added`}
          </Txt>
          <Button label="Analyse my statements" disabled={n === 0} onPress={() => router.push('/analysing')} />
        </>
      }
    >
      <StepHeader step={4} />
      <Txt variant="title" accessibilityRole="header" style={{ marginTop: 24, marginBottom: 8 }}>
        Add your bank statements
      </Txt>
      <Txt>
        The last 6 months from the accounts you use most, including fintech wallets. PDF straight from your bank app works best.
      </Txt>

      <View style={{ marginTop: 20, gap: 10 }}>
        {app.statements.map((f) => (
          <Card key={f.id} style={s.file}>
            <View style={s.fileIcon}>
              <FileIcon />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.fileName} numberOfLines={1}>
                {f.name}
              </Text>
              <Txt variant="small">{f.uri ? sizeLabel(f.sizeBytes) : 'Sample file'}</Txt>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${f.name}`} onPress={() => removeStatement(f.id)} hitSlop={10} style={s.remove}>
              <CloseIcon />
            </Pressable>
          </Card>
        ))}

        <Pressable accessibilityRole="button" onPress={pick} style={s.upload}>
          <View style={[s.fileIcon, { backgroundColor: '#EDEBE3' }]}>
            <PlusIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.fileName}>Upload a statement</Text>
            <Txt variant="small">PDF, up to 20 MB. Password-protected is fine.</Txt>
          </View>
        </Pressable>
        {error ? <Txt variant="small" style={{ color: colors.poor }}>{error}</Txt> : null}
      </View>

      <Card style={{ marginTop: 16, gap: 6 }}>
        <Text style={s.fileName}>No PDF yet?</Text>
        <Txt variant="small">Most bank apps can email you a statement in a minute. A per-bank guide comes next.</Txt>
        <Pressable accessibilityRole="button" onPress={addSample} style={{ paddingVertical: 6 }}>
          <Text style={s.link}>Use a sample statement (demo)</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  file: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  fileIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  fileName: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  remove: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  upload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9CA59F',
    borderRadius: radius.md,
  },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
});
