// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import React from 'react';

// export default function LoginScreen() {
//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('./../../assets/images/loginpage.jpg')}
//         style={styles.image}
//       />
//       <View style={styles.contentContainer}>
//         <Text style={styles.title}>One Stop Marketplace</Text>
//         <Text style={styles.subtitle}>Buying and Selling items now made easy with just a couple clicks.</Text>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Get Started</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     backgroundColor: '#fff',
//   },
//   image: {
//     width: '100%',
//     height: 400,
//     resizeMode: 'cover',
//   },
//   contentContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 30,
//     alignItems: 'center',
//     borderTopLeftRadius: 30, // Rounded top left corner
//     borderTopRightRadius: 30, // Rounded top right corner
//     backgroundColor: '#fff', // Background color for the content container
//     marginTop: -30, // Adjust marginTop to overlap the image slightly
//   },
//   title: {
//     fontSize: 35,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import * as WebBrowser from "expo-web-browser"
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({strategy:"oauth_google"})
  
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
 
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View>
      <Image source={require('./../../assets/images/loginpage.jpg')}
       className="w-full h-[400px] object-cover"
      />
      <View className="p-10">
        <Text className="text-[35px] font-bold">One Stop Marketplace</Text>
        <Text className="text=[18px] text-slate-500 mt-6">Buying and Selling items now made easy with just a couple clicks.</Text>
        <TouchableOpacity onPress={(onPress)} className="p-4 bg-blue-500 rounded-full mt-20">
            <Text className="text-white text-center text-[18px]">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}