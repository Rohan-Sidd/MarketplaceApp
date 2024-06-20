// import { View, Text, Image, Button, StyleSheet, TextInput, TouchableOpacity, ToastAndroid} from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { getDocs, getFirestore, collection} from "firebase/firestore";
// import { getStorage, ref, uploadBytes, file } from "firebase/storage";
// import { app } from '../../firebaseConfig';
// import { Formik } from 'formik';
// import {Picker} from '@react-native-picker/picker'
// import * as ImagePicker from 'expo-image-picker';

// // export default function AddPostScreen() {
// //   const db = getFirestore(app);

// //   useEffect(() => {
// //     getCategoryList();
// //   }, []);

// //   const getCategoryList = async () => {
// //     try {
// //       const querySnapshot = await getDocs(collection(db, 'Category'));
// //       querySnapshot.forEach((doc) => {
// //         console.log(doc.data());
// //       });
// //     } catch (error) {
// //       console.error('Error fetching category list:', error);
// //     }
// //   };

// //   return (
// //     <View>
// //       <Text>AddPostScreen</Text>
// //     </View>
// //   );
// // }

// export default function AddPostScreen() {

//   const [image, setImage] = useState(null);
//   const db=getFirestore(app);
//   const storage = getStorage()
//   const [categoryList, setCategoryList] = useState([]);

//   useEffect(()=>{
//     getCategoryList();
//   },[])

//   const getCategoryList=async()=>{
//     setCategoryList([]);
//     const querySnapshot=await getDocs(collection(db,'Category'))

//     querySnapshot.forEach((doc)=>{
//       console.log("Docs:",doc.data());
//       setCategoryList(categoryList=>[...categoryList,doc.data()])
//     })
//   }
//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 1,
//     })
//     console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }

//   }

//   const onSubmitMethod=async(value)=>{
//     value.image=image;
//     console.log(value)
//     const resp=await fetch(image);
//     const blob = await resp.blob();
//     const storageRef = ref(storage, 'UserData/'+Date.now()+".jpg");

//     uploadBytes(storageRef, file).then((snapshot) => {
//       console.log('Uploaded a blob or file!');
//     });
    
//   }


//   return (
//     <View className="p-10">
//       <Formik
//       initialValues={{title:'',desc:'',category:'',address:'',price:'',image:''}}
//       onSubmit={value=>onSubmitMethod(value)}
//       validate={(values)=>{
//         const errors={}
//         if(!values.title){
//           ToastAndroid.show('Title is required',ToastAndroid.SHORT)
//           errors.name="Ttitle is madatory"
//         }
//         return errors
//       }}
//       >
//         {({handleChange,handleBlur,handleSubmit,values,setFieldValue,errors})=>(
//           <View>
//           <TouchableOpacity onPress={pickImage}>
//             {image?
//             <Image source={{uri:image}} style={{width:100,height:100,borderRadius:15}}/>
//             :
//             <Image source={require('./../../assets/images/placeholder.jpg')}
//           style={{width:100,height:100,borderRadius:15}}
//           />
//             }
          
//           </TouchableOpacity>
//           <TextInput
//           style={styles.input}
//           placeholder='Title'
//           value={values?.title}
//           onChangeText={handleChange('title')}
//  />
//            <TextInput
//           style={styles.input}
//           placeholder='Description'
//           value={values?.desc}
//           numberOfLines={5}
//           onChangeText={handleChange('desc')}
//  />
//            <TextInput
//           style={styles.input}
//           placeholder='Price'
//           value={values?.price}
//           keyboardType='number-pad'
//           onChangeText={handleChange('price')}
//  />
//           <TextInput
//           style={styles.input}
//           placeholder='Address'
//           value={values?.address}
//           onChangeText={handleChange('address')}
//  />
//           <Picker
//           selectedValue={values.category}
//           onValueChange={handleChange('category')}
//           >
//             {categoryList&&categoryList.map((item,index)=>(
//               <Picker.Item key={index} 
//               label={item.name} value={item.name}/>
//             ))}
            
//           </Picker>
          
//           <Button onPress={handleSubmit} className="mt-7" title="submit"/>
//           </View>
//         )}
//         </Formik>
//     </View>
//   )
// }


// const styles = StyleSheet.create({
//   input:{
//     borderWidth:1,
//     borderRadius:10,
//     padding:10,
//     marginTop:10,marginBottom:5,
//     paddingHorizontal:15,
//     fontSize:18
//   }
// })





import { View, Text, Image, Button, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getDocs, getFirestore, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from '../../firebaseConfig';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import moment from 'moment'

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();

  const [loading,setLoading]=useState(false);

  const {user}=useUser();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));
    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data()]);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (values) => {

    setLoading(true)    
    console.log(values);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, 'UserData/' + Date.now() + ".jpg");

      const metadata = {
        contentType: blob.type
      };

      await uploadBytes(storageRef, blob, metadata);
      console.log('Uploaded a blob or file!');

      const downloadURL=await getDownloadURL(storageRef);

      console.log(downloadURL);
      values.image=downloadURL;
      values.userName=user.fullName;
      values.userEmail=user.primaryEmailAddress.emailAddress;
      values.userImage=user.imageUrl;

      const docRef=await addDoc(collection(db,"UserPost"),values)

      if(docRef.id){
        setLoading(false);
        Alert.alert('Post Added Sucessfully')
      }


      ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error uploading image:', error);
      ToastAndroid.show('Image upload failed!', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ title: '', desc: '', category: '', address: '', price: '', image: '',userName:'',userEmail:'',userImage:'', createdAt:moment().format('DD-MM-YYYY')}}
        onSubmit={(values) => onSubmitMethod(values)}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            ToastAndroid.show('Title is required', ToastAndroid.SHORT);
            errors.title = "Title is mandatory";
          }
          return errors;
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
          <View>
            <TouchableOpacity onPress={pickImage}>
              {image ?
                <Image source={{ uri: image }} style={styles.image} /> :
                <Image source={require('./../../assets/images/placeholder.jpg')} style={styles.image} />
              }
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder='Title'
              value={values.title}
              onChangeText={handleChange('title')}
            />
            <TextInput
              style={styles.input}
              placeholder='Description'
              value={values.desc}
              numberOfLines={5}
              onChangeText={handleChange('desc')}
            />
            <TextInput
              style={styles.input}
              placeholder='Price'
              value={values.price}
              keyboardType='number-pad'
              onChangeText={handleChange('price')}
            />
            <TextInput
              style={styles.input}
              placeholder='Address'
              value={values.address}
              onChangeText={handleChange('address')}
            />
            <Picker
              selectedValue={values.category}
              onValueChange={handleChange('category')}
            >
              {categoryList && categoryList.map((item, index) => (
                <Picker.Item key={index} label={item.name} value={item.name} />
              ))}
            </Picker>
            <Button onPress={handleSubmit} style={styles.button} title="Submit" />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  button: {
    marginTop: 7,
  }
});
