import { ActivityIndicator, Pressable, Text } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function AppButton({ title, onPress, loading = false, variant = 'primary' }: AppButtonProps) {
  const backgroundColor =
    variant === 'primary' ? '#2563eb' : variant === 'danger' ? '#dc2626' : '#e5e7eb';

  const color = variant === 'secondary' ? '#111827' : '#fff';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={{ color, fontWeight: '700' }}>{title}</Text>}
    </Pressable>
  );
}