import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Header from '../Components/HomeScreen/Header'
import Slider from '../Components/HomeScreen/Slider'
import { collection, getDocs, getFirestore, orderBy } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import Categories from '../Components/HomeScreen/Categories'
import LatestItemList from '../Components/HomeScreen/LatestItemList'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'

export default function HomeScreen() {


  const db= getFirestore(app);



  const [sliderList, setSliderList]=useState([]);

  const [categoryList, setCategoryList]=useState([]);

  const [latestItemList,setLatestItemList]=useState([]);
  
  
  // useEffect(()=>{
  //   getSliders();
  //   getCategoryList();
  //   getLatestItemList();
  // },[])

  // const navigation=useNavigation()

  // useEffect(()=>{
  //   navigation.addListener('focus',(e)=>{
  //     getLatestItemList();
  //   })
  // },[navigation])

  const getSliders=async()=>{
    setSliderList([])
    const querySnapshot = await getDocs(collection(db, "sliders"));
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  
  setSliderList(sliderList=>[...sliderList,doc.data()])
  
});

}

  const getCategoryList = async () => {
  setCategoryList([]);
  const querySnapshot = await getDocs(collection(db, 'Category'));
  querySnapshot.forEach((doc) => {
   
    setCategoryList(categoryList => [...categoryList, doc.data()]);
  });
}

   const getLatestItemList=async()=>{
    setLatestItemList([]);
    const querySnapshot=await getDocs(collection(db, 'UserPost'),orderBy('createdAt','desc'))
    querySnapshot.forEach((doc)=>{
      console.log(doc.data());
      setLatestItemList(latestItemList=>[...latestItemList,doc.data()]);
    });
   }


   useFocusEffect(
    useCallback(() => {
      getSliders();
      getCategoryList();
      getLatestItemList();
    }, [])
  );

  
 

  return (
    <ScrollView className="py-2 px-2 bg-white flex-1">
     <Header/>
     <Slider sliderList={sliderList}/>
     <Categories categoryList={categoryList}/>
     <LatestItemList latestItemList={latestItemList}
     heading={'Latest Items'}
     />
    </ScrollView>
  ) 
}