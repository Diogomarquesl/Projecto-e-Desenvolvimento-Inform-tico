import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DiscoScreen from '../Screens/discoListScreen';
import BalanceScreen from '../Screens/balanceScreen';
import HomeScreen from '../Screens/homeScreen';

const Tab = createBottomTabNavigator();

export default function TabBar({ navigation }) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{
                headerShown: false,
                tabBarIcon: () => <Ionicons name="home-outline" size={25} color="black" />
            }} />
            <Tab.Screen name="Carteira" component={BalanceScreen} options={{
                headerShown: false,
                tabBarIcon: () => <Ionicons name="wallet-outline" size={25} color="black" />
            }} />
            <Tab.Screen name="BalanceScreen" component={BalanceScreen} options={{
                headerShown: false,
                tabBarIcon: () => <MaterialCommunityIcons name="account-circle-outline" size={25} color="black" />
            }} />
        </Tab.Navigator>
    );
}
