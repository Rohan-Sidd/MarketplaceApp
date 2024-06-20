import { View, Text, Image, TextInput} from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
    const {user} = useUser();
  return (
    <View>
      {/*User Info Section */}
      <View className="flex flex-row items-center gap-4">
        <Image source={{uri:user?.imageUrl}}className="rounded-full w-10 h-10"/>
        <View>
            <Text className="text-[16px]">Welcome</Text>
            <Text className="text-[20px]">{user?.fullName}</Text>
        </View>
      </View>

      {/*Search Bar Section */}
      <View className="p-[9px] px-5 flex flex-row item-center gap-2 bg-blue-50 mt-5 rounded-full border-[1px] border-blue-300">
      <Ionicons name="search" size={24} color="gray"  />
        <TextInput placeholder='Search' className="ml-3 text-[17px]"
        onChangeText={(value)=>console.log(value)}
        />
      </View>
    </View>

    
  

    
  )
}