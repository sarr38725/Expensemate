import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const loadProfileData = async () => {
    const image = await AsyncStorage.getItem('profile_image');
    const name = await AsyncStorage.getItem('user_name');
    const email = await AsyncStorage.getItem('email');

    if (image) setProfileImage(image);
    if (name) setUserName(name);
    if (email) setUserEmail(email);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await AsyncStorage.setItem('profile_image', result.assets[0].uri);
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleResetProfile = () => {
    Alert.alert(
      t('confirmResetTitle'),
      t('confirmResetDescription'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('yes'),
          onPress: async () => {
            await AsyncStorage.removeItem('profile_image');
            await AsyncStorage.removeItem('user_name');
            setProfileImage(null);
            setUserName('User');
            Alert.alert(t('profileResetSuccess'));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      icon: 'edit',
      label: t('editInfo'),
      onPress: () => Alert.alert('Edit Info', 'Feature coming soon'),
    },
    {
      icon: 'settings',
      label: t('settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'picture-as-pdf',
      label: t('exportAsPdf'),
      onPress: () => Alert.alert(t('pdfGeneratedSuccess')),
    },
    {
      icon: 'refresh',
      label: t('resetProfile'),
      onPress: handleResetProfile,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/images/user.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.changePhotoText}>{t('tapToChangePhoto')}</Text>
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Icon name={item.icon} size={24} color="#000" />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F0',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
});
