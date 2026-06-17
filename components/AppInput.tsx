import { Text, TextInput, TextInputProps, View } from 'react-native';

type AppInputProps = TextInputProps & {
  label: string;
};

export function AppInput({ label, ...props }: AppInputProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#777"
        style={{
          borderWidth: 1,
          borderColor: '#d0d5dd',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: '#fff',
          color: '#111',
        }}
      />
    </View>
  );
}