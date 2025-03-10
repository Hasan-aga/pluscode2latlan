import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface MapsModalProps {
  visible: boolean;
  onClose: () => void;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const MapsModal = ({ visible, onClose, coordinates }: MapsModalProps) => {
  const colorScheme = useColorScheme();

  const handleMapPress = (mapType: 'google' | 'apple' | 'yandex') => {
    const { latitude, longitude } = coordinates;
    let url = '';

    switch (mapType) {
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        break;
      case 'apple':
        url = `maps://maps.apple.com/?ll=${latitude},${longitude}`;
        break;
      case 'yandex':
        url = `https://yandex.com/maps/?ll=${longitude},${latitude}&z=17`;
        break;
    }

    Linking.openURL(url);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.title}>Open in Maps</ThemedText>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleMapPress('google')}
          >
            <ThemedText>Google Maps</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleMapPress('apple')}
          >
            <ThemedText>Apple Maps</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleMapPress('yandex')}
          >
            <ThemedText>Yandex Maps</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, styles.cancelOption]}
            onPress={onClose}
          >
            <ThemedText style={{ color: Colors[colorScheme || 'light'].tint }}>
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelOption: {
    borderBottomWidth: 0,
  },
});
