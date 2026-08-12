import React, { useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  colors?: { background: string; text: string; };
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title, onPress, style, textStyle, colors = { background: '#D4AF37', text: '#000' }, disabled = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled} activeOpacity={0.8}>
      <Animated.View style={[styles.button, { backgroundColor: colors.background }, { transform: [{ scale: scaleAnim }] }, disabled && styles.disabled, style]}>
        <Text style={[styles.text, { color: colors.text }, textStyle]}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minWidth: 100 },
  text: { fontWeight: 'bold', fontSize: 16 },
  disabled: { opacity: 0.5 }
});