import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES, FONTS, STYLES } from '../constants/base';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={STYLES.center_align}>
        <Text style={[FONTS.h3_semibold, { color: COLORS.textPrimary }]}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={[FONTS.h6_regular, { color: COLORS.primary }]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: SIZES.margin,
    paddingVertical: SIZES.margin,
  },
});
