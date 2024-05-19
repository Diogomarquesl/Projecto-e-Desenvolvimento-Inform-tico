import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem  } from '@react-navigation/drawer';
import { UserProvider } from './Scr/Navigation/UserContext';
import LogInScreen from './Scr/Screens/logInScreen';
import HomeScreen from './Scr/Screens/homeScreen';
import DiscoListScreen from './Scr/Screens/discoListScreen';
import BalanceScreen from './Scr/Screens/balanceScreen';
import DiscoScreen from './Scr/Screens/discoScreen';
import TicketScreen from './Scr/Screens/ticketScreen';
import CameraScreen from './Scr/Screens/cameraScreen';
import AccountScreen from './Scr/Screens/accountScreen';
import SignUpScreen from './Scr/Screens/signUpScreen';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


const HomeStack = () => (
  <Stack.Navigator>

    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="DiscoListScreen" component={DiscoListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BalanceScreen" component={BalanceScreen} options={{ headerShown: false }} />
    <Stack.Screen name="DiscoScreen" component={DiscoScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TicketScreen" component={TicketScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />

  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStack} options={{
      headerShown: false,
      tabBarIcon: () => <Ionicons name="home-outline" size={25} color="black" />
    }} />
    <Tab.Screen name="Carteira" component={BalanceScreen} options={{
      headerShown: false,
      tabBarIcon: () => <Ionicons name="wallet-outline" size={25} color="black" />
    }} />
    <Tab.Screen name="Conta" component={AccountScreen} options={{
      headerShown: false,
      tabBarIcon: () => <MaterialCommunityIcons name="account-circle-outline" size={25} color="black" />
    }} />
  </Tab.Navigator>
);

const AppDrawer = () => (

  <Drawer.Navigator  drawerContent={(props) => <CustomDrawerContent {...props} />} >
    <Drawer.Screen name="Home" component={TabNavigator} options={{headerShown: true,headerTransparent: true, headerTintColor: 'white', headerTitleStyle: { color: 'transparent' }, }}/>
    
  </Drawer.Navigator>
);
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Home')}
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Carteira"
        onPress={() => props.navigation.navigate('Carteira')}
        icon={({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Conta"
        onPress={() => props.navigation.navigate('Conta')}
        icon={({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />}
      />
    </DrawerContentScrollView>
  );
}


export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="LogInScreen" component={LogInScreen} options={{ headerShown: false }} />

          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={AppDrawer} options={{ headerShown: false }} />
          

          <Stack.Screen name="DiscoListScreen" component={DiscoListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BalanceScreen" component={BalanceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DiscoScreen" component={DiscoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TicketScreen" component={TicketScreen} options={{ headerShown: false }} />

          <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
