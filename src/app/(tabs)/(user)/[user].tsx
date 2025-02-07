import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Text, TextInput, useTheme, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { signOut } from '@services/authService';
import { useUser } from '@context/UserContext';
import { checkIfFollowing, followUser, unfollowUser, getUserDocument } from '@services/userService';
import { fetchOwnersPetsInfo } from '@services/petService';

export default function UserProfile() {
  const theme = useTheme();
  const { currentUser, setCurrentUser, userData } = useUser();
  const [ isLoading, setIsLoading ] = useState(false);

  const params = useLocalSearchParams();
  const userProfileID = params.user as string;
  const [ userProfile, setUserProfile ] = useState(userData);

  const [ userPosts, setUserPosts ] = useState<any[]>([]);
  const [ userPets, setUserPets ] = useState<any[]>([]);
  const [ userFollowers, setUserFollowers ] = useState<any[]>([]);
  const [ userFollowing, setUserFollowing ] = useState<any[]>([]);


  const [ isFollowing, setIsFollowing ] = useState(false);
  const [ isRefreshing, setIsRefreshing ] = useState(false);

  const [ container, setContainer ] = useState<'posts' | 'pets'>('posts');

  useEffect(() => {
    setIsLoading(true);

    if (userProfileID === currentUser?.uid) {
      setUserProfile(userData);
      setUserPosts(userData.posts || []);
      fetchOwnersPetsInfo(userData.pets || []).then((pets) => {
        setUserPets(pets);
      });
      setUserFollowers(userData.followers || []);
      setUserFollowing(userData.following || []);
      setIsLoading(false);
      return;
    }

    getUserDocument(userProfileID).then((user) => {
      setUserProfile(user);
      setUserPosts(user.posts || []);
      fetchOwnersPetsInfo(user.pets || []).then((pets) => {
        setUserPets(pets);
      });
      setUserFollowers(user.followers || []);
      setUserFollowing(user.following || []);
      setIsLoading(false);
    });
  }, [userProfileID]);

  const refreshUserProfile = () => {
    setIsRefreshing(true);
    getUserDocument(userProfileID).then((user) => {
      console.log('user', user);
      setUserProfile(user);
      setUserPosts(user.posts || []);
      fetchOwnersPetsInfo(user.pets || []).then((pets) => {
        setUserPets(pets);
      });
      setUserFollowers(user.followers || []);
      setUserFollowing(user.following || []);
      setIsLoading(false);
      setIsRefreshing(false);
    });
  }

  const handleFollowOrUnfollow = async () => {
    if (!currentUser?.uid || !userProfileID) return;
    if (currentUser.uid === userProfileID) return;

    if (await checkIfFollowing(currentUser.uid, userProfileID)) {
      await unfollowUser(currentUser.uid, userProfileID);
      setIsFollowing(false);
      setUserFollowers(userFollowers.filter((follower) => follower.uid !== currentUser.uid));
    } else {
      await followUser(currentUser.uid, userProfileID);
      setIsFollowing(true);
      setUserFollowers([...userFollowers, { uid: currentUser.uid }]);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      router.push('(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  if (isLoading) {
    return (
      <View className='flex justify-center items-center h-full'>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>

      <View className='flex flex-row items-center w-full mb-8'>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source='chevron-left' size={30}/>
        </TouchableOpacity>
        <Text className='font-bold text-2xl pl-1'>{userProfile?.username}</Text>
      </View>

      <ScrollView 
        className='w-full'
        showsVerticalScrollIndicator={false}  
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={refreshUserProfile} 
          />
        }
      >
        <View className='flex flex-row w-full items-center px-2 mb-4'>
          <Avatar.Image size={80} source={{ uri: userProfile?.photoURL }} />
          
          <View className='pl-6'>
            {/* displayname */}
            <Text className='font-bold text-base mb-1'>{userProfile?.displayName}</Text>

            {/* posts, followers, following */}
            <View className='flex flex-row items-center justify-center'>
              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>
                  {userPosts.length}
                </Text>
                <Text className='text-base -mt-1'>posts</Text>
              </View>
              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>
                  {userFollowing.length}
                </Text>
                <Text className='text-base -mt-1'>following</Text>
              </View>
              <View className='flex flex-col'>
                <Text className='font-bold text-lg'>{userFollowers.length}</Text>
                <Text className='text-base -mt-1'>followers</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='flex flex-col'>
          <Text className='text-base pl-2 w-full break-words'>
            {userProfile?.bio}
            test bio
          </Text>

          <View className='flex flex-row justify-between items-center w-full mt-4'>
            { currentUser?.uid === userProfileID && (
              <Button 
                mode='contained'
                theme={{ roundness: 2 }}
                className='w-full'
                onPress={() => {}}
              >Edit Profile</Button>
            )}

            { currentUser?.uid !== userProfileID && (
              <Button 
                mode='outlined'
                theme={{ roundness: 2 }}
                style={{ backgroundColor: isFollowing ? theme.colors.primary : '' }}
                labelStyle={{ color: isFollowing ? theme.colors.background : theme.colors.primary }}
                className='w-full'
                onPress={handleFollowOrUnfollow}
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
            className={`pb-2 w-[50%] flex items-center justify-center ${container === 'pets' ? 'border-b-2' : ''}`} 
            style={{ borderColor: container === 'pets' ? theme.colors.primary : 'transparent' }}
            onPress={() => setContainer('pets')}>
            <Icon
              source='paw'
              size={20}
              color={container === 'pets' ? theme.colors.primary : theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>
        
        {container === 'posts' && (
          <View className='flex items-center justify-center flex-row w-full min-h-[400px]'>
            <Text>Posts</Text>
          </View>
        )}

        {container === 'pets' && (
          <View className='flex flex-row w-full min-h-[400px] flex-wrap justify-evenly items-start pt-10'>
            {userPets.length > 0 ? (
              userPets.map((pet) => (
                <View 
                  key={pet.uid}
                  className='flex items-center justify-center'
                >
                  <TouchableOpacity onPress={() => router.push(`/(pets)/${pet.uid}`)}>
                    <Avatar.Image size={80} source={{ uri: pet.photoURL }} />
                  </TouchableOpacity>
                  
                  <Text className='mt-2 font-bold text-base'>{pet.name}</Text>
                </View>
              ))
            ) : (
              <Text>No pets</Text>
            )}
          </View>
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
}