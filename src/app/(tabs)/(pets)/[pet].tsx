import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Text, TextInput, useTheme, Avatar } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getPetDocument } from '@services/petService';
import { Pet } from '@models/Pet';

export default function PetProfile() {
  const params = useLocalSearchParams();
  const petID = params.pet as string;

  const [ pet, setPet ] = useState<Pet | null>(null);

  useEffect(() => {
    if (!petID) return;

    getPetDocument(petID)
    .then(pet => {
      if (pet) setPet(pet)
      else Alert.alert('Error', 'Pet not found');
    });
  }, [petID]);

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>
      {/* instagram twitter profile fusion, no cover photo */}
      <View className='flex flex-row items-center w-full mb-4'>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source='chevron-left' size={30}/>
        </TouchableOpacity>
        <Text className='font-bold text-2xl pl-1'>{pet?.name}</Text>
      </View>

      <ScrollView className='w-full'>
        <View className='flex flex-row w-full items-center'>
          <Avatar.Image size={100} source={{ uri: pet?.photoURL }} />
          <View>
            {/* breed */}
            <View className='flex flex-row items-center justify-start pl-4 mb-1'>
              <Text className='font-bold text-base'>{pet?.breed}</Text>
            </View>

            {/* posts, followers, following */}
            <View className='flex flex-row items-center justify-center pl-6'>
              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>{pet?.taggedPosts?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>posts</Text>
              </View>

              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>{pet?.followers?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>followers</Text>
              </View>

              <View className='flex flex-col'>
                <Text className='font-bold text-lg'>{pet?.following?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>following</Text>
              </View>
            </View>
         </View>
        </View>

        <View>
          
        </View>
        
        
      </ScrollView>
    </SafeAreaView>
  );
}
