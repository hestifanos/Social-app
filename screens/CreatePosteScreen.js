import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Button, Image, TextInput, View } from 'react-native';
import { auth, db, storage } from '../firebase';

export default function CreatePostScreen({ navigation }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission needed to access media');
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `posts/${Date.now()}-${auth.currentUser.uid}.jpg`;
      const imgRef = ref(storage, filename);
      await uploadBytes(imgRef, blob);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, 'posts'), {
      text,
      imageUrl,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Say something..." value={text} onChangeText={setText} />
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      <Button title="Post" onPress={uploadPost} />
    </View>
  );
}
