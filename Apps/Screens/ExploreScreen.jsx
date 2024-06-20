import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import LatestItemList from '../Components/HomeScreen/LatestItemList'
import { useFocusEffect } from '@react-navigation/native'

export default function ExploreScreen() {
  const db=getFirestore(app)
  const [productList,setproductList]=useState([])
 
  const getAllProducts=async()=>{
    setproductList([])
    const q=query(collection(db,'UserPost'),orderBy('createdAt','desc'))
    const snapshot=await getDocs(q);

    snapshot.forEach((doc)=>{
      console.log(doc)
      setproductList(productList=>[...productList, doc.data()]);
    })
  }

  useFocusEffect(
    useCallback(() => {
      getAllProducts();
    }, [])
  );

  return (
    <View className="p-5 py-8">
      <Text className="text-[24px]">Explore All Posts</Text>
      <LatestItemList latestItemList={productList}/>
    </View>
  )
}