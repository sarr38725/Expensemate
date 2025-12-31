import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation();

  const handleContinue = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/welcome_image.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{t('welcomeTitle')}</Text>
      <Text style={styles.subtitle}>{t('welcomeSubtitle')}</Text>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>{t('continueButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 300,
    height: 250,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
