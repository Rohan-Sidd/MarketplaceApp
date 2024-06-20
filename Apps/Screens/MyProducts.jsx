import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useUser } from '@clerk/clerk-expo'
import { app } from '../../firebaseConfig'
import LatestItemList from '../Components/HomeScreen/LatestItemList'
import { useNavigation } from '@react-navigation/native'

export default function MyProducts() {
  const db=getFirestore(app)
  const {user}=useUser();
  const [productList,setproductList]=useState([])
  useEffect(()=>{
    user&&getUserPost();
  },[user])

  const navigation=useNavigation()

  useEffect(()=>{
    navigation.addListener('focus',(e)=>{
      getUserPost();
    })
  },[navigation])

  const getUserPost=async()=>{
    setproductList([]);
    const q=query(collection(db,'UserPost'),where('userEmail','==',user?.primaryEmailAddress?.emailAddress))
    const snapshot=await getDocs(q)
    snapshot.forEach(doc=>{
        
        setproductList(productList=>[...productList,doc.data()])
    })
  }  
  return (  
    <View>
      <LatestItemList latestItemList={productList}
      
      />
    </View>
  )
}