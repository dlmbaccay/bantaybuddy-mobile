import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Chip, Text, TextInput, useTheme, Avatar } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getPetDocument } from '@services/petService';
import { getUserDocument } from '@services/userService';
import { Pet } from '@models/Pet';
import { useUser } from '@context/UserContext';
import { User } from '@models/User';

export default function PetProfile() {
  const theme = useTheme();
  const { currentUser } = useUser();
  const params = useLocalSearchParams();
  const petID = params.pet as string;

  const [ pet, setPet ] = useState<Pet | null>(null);
  const [ isFollowing, setIsFollowing ] = useState(false);
  const [ container, setContainer ] = useState<'posts' | 'owners'>('posts');
  const [ owners, setOwners ] = useState<User[]>([]);

  useEffect(() => {
    if (!petID) return;

    getPetDocument(petID)
    .then(pet => {
      if (pet) setPet(pet)
      else Alert.alert('Error', 'Pet not found');
    });
  }, [petID]);

  useEffect(() => {
    if (!pet) return;

    Promise.all(pet.owners.map(ownerId => getUserDocument(ownerId)))
      .then(users => setOwners(users));
  }, [pet]);

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>

      <View className='flex flex-row items-center w-full mb-8'>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source='chevron-left' size={30}/>
        </TouchableOpacity>
        <Text className='font-bold text-2xl pl-1'>{pet?.name}</Text>
      </View>

      <ScrollView 
        className='w-full'
        showsVerticalScrollIndicator={false}  
        // refreshControl={
        //   <RefreshControl 
        //     refreshing={isRefreshing} 
        //     onRefresh={refreshUserProfile} 
        //   />
        // }
      >
        <View className='flex flex-row w-full items-center px-2 mb-4'>

          <Avatar.Image size={80} source={{ uri: pet?.photoURL }} />
          
          <View className='pl-6'>
            {/* breed */}
            <Text className='font-bold text-base mb-1'>{pet?.breed}</Text>


            {/* posts, followers, following */}
            <View className='flex flex-row items-center justify-center'>
              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>{pet?.taggedPosts?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>posts</Text>
              </View>

              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>{pet?.following?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>following</Text>
              </View>

              <View className='flex flex-col'>
                <Text className='font-bold text-lg'>{pet?.followers?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>followers</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='flex flex-col'>
          <Text className='text-base pl-2 w-full break-words'>
            {pet?.bio}
            test bio
          </Text>

          {/* hobbies and favorite food chips */}
          <View className='flex flex-row flex-wrap mt-4'>
            {pet?.hobbies?.map(hobby => (
              <Chip icon='heart' mode='flat' className='mr-2 mb-2'>{hobby}</Chip>
            ))}

            {pet?.favoriteFood?.map(food => (
              <Chip icon='food-drumstick' mode='flat' className='mr-2 mb-2'>{food}</Chip>
            ))}
          </View>

          <View className='flex flex-row justify-between items-center w-full mt-4'>
            { pet?.owners.includes(currentUser?.uid ?? '') && (
              <Button 
                mode='contained'
                theme={{ roundness: 2 }}
                className='w-full'
                onPress={() => {}}
              >Edit Profile</Button>
            )}

            { !pet?.owners.includes(currentUser?.uid ?? '') && (
              <Button 
                mode='outlined'
                theme={{ roundness: 2 }}
                style={{ backgroundColor: isFollowing ? theme.colors.primary : '' }}
                labelStyle={{ color: isFollowing ? theme.colors.background : theme.colors.primary }}
                className='w-full'
                // onPress={handleFollowOrUnfollow}
              >
                { isFollowing ? 'Following' : 'Follow' }
              </Button>
            )}
          </View>
        </View>
       
        
        <View className='flex flex-row justify-evenly items-center w-full mt-6'>
          <TouchableOpacity 
            className={`pb-2 w-[50%] flex items-center justify-center ${container === 'posts' ? 'border-b-2' : ''}`} 
            style={{ borderColor: container === 'posts' ? theme.colors.primary : 'transparent' }}
            onPress={() => setContainer('posts')}>
            <Icon
              source='image-filter-none'
              size={20}
              color={container === 'posts' ? theme.colors.primary : theme.colors.onSurface}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`pb-2 w-[50%] flex items-center justify-center ${container === 'owners' ? 'border-b-2' : ''}`} 
            style={{ borderColor: container === 'owners' ? theme.colors.primary : 'transparent' }}
            onPress={() => setContainer('owners')}>
            <Icon
              source='account-group'
              size={20}
              color={container === 'owners' ? theme.colors.primary : theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>
        
        {container === 'posts' && (
          <View className='flex items-center justify-center flex-row w-full min-h-[400px]'>
            <Text>Posts</Text>
          </View>
        )}

        {container === 'owners' && (
          <View className='flex flex-row w-full min-h-[400px] flex-wrap justify-evenly items-start pt-10'>
            {pet?.owners.map((owner) => (
              <View 
                key={owner}
                className='flex items-center justify-center'
              >
                <TouchableOpacity onPress={() => router.push(`/(user)/${owner}`)}>
                  <Avatar.Image size={80} source={{ uri: owners.find(o => o.uid === owner)?.photoURL }} />

                  <Text className='mt-2 font-bold text-base'>{owners.find(o => o.uid === owner)?.username}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
