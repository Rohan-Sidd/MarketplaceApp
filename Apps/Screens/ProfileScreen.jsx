import { SafeAreaView, StyleSheet,View, Text, Image, Touchable, TouchableOpacity, FlatList} from 'react-native'
import React from 'react'
import { ClerkProvider, SignedIn, SignedOut,useAuth } from "@clerk/clerk-expo";
import diary from './../../assets/images/diary.png'
import logout from './../../assets/images/logout.png'
import searchengine from './../../assets/images/searchengine.png'
import { useUser } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
// import {GestureHandlerRootView } from 'react-native-gesture-handler'


export default function ProfileScreen() {

  const {user}=useUser();

  const navigation=useNavigation();

  const { isLoaded,signOut } = useAuth()
  

  

  

  const menuList=[
    {
      id:1,
      name:'My Products',
      icon:diary,
      path:'my-product'
    },
    {
      id:2,
      name:'Explore',
      icon:searchengine,
      path:'explore'
    },
    {
      id:3,
      name:'Rohan',
      icon:diary
    },
    {
      id:4,
      name:'Logout',
      icon:logout
    }
    
  ]
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  const onMenuPress=(item)=>{
    if(item.name=='Logout'){
      signOut();
      return;
    }
    item?.path?navigation.navigate(item.path):null;
  }

  return (
    <View className="p-5">
      <View className="items-center mt-14">
      <Image source={{uri:user?.imageUrl}}
      className="w-[100px] h-[100px] rounded-full"
      />
      <Text className="font-bold text-[25px] mt-2">{user?.fullName}</Text>
      <Text className="text-[18px] mt-2 text-gray-600">{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
      <FlatList
      data={menuList}
      numColumns={3}
      style={{marginTop:20}}
      renderItem={({item,index})=>(
        <TouchableOpacity
        onPress={()=>onMenuPress(item)} 
        className="
            flex-1 
            p-4 
            items-center 
            mx-4 
            mt-4 
            rounded-lg 
            border-2 
            border-blue-500 
            bg-blue-100
        ">
        {item.icon && (
            <Image 
                source={item.icon} 
                className="w-[70px] h-[70px]" 
            />
        )}
        <Text className="font-bold text-[16px] mt-2 text-blue-700 ">
            {item.name}
        </Text>
    </TouchableOpacity>
    )}/>
       
      
    </View>
  )
}


 