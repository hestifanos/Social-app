import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Button, Image, TextInput, View } from 'react-native';
import { auth, db, storage } from '../firebase';
const isPostContentValid = require('./postValidation');

export default function CreatePostScreen({ navigation }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const pickImage = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your media library to pick a photo.');
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
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in before creating a post.');
      return;
    }
    if (!isPostContentValid(text, image)) return;

    setIsPosting(true);
    try {
      let imageUrl = '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const filename = `posts/${Date.now()}-${user.uid}.jpg`;
        const imgRef = ref(storage, filename);
        await uploadBytes(imgRef, blob);
        imageUrl = await getDownloadURL(imgRef);
      }

      await addDoc(collection(db, 'posts'), {
        text: text.trim(),
        imageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Post failed', 'Your post could not be uploaded. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Say something..."
        value={text}
        onChangeText={setText}
        editable={!isPosting}
      />
      <Button title="Pick an Image" onPress={pickImage} disabled={isPosting} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      <Button
        title={isPosting ? 'Posting…' : 'Post'}
        onPress={uploadPost}
        disabled={isPosting || !isPostContentValid(text, image)}
      />
    </View>
  );
}
