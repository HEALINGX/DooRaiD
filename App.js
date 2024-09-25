import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Home from './Screens/Home';
import Category from './Screens/Category';
import Details from './Screens/Details';
import Profile from "./Screens/Profile";
import CategoryDetails from "./Screens/CategoryDetails";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen 
      name="DooRaiD" 
      component={Home} 
      options={{ tabBarStyle: { display: 'flex' } }} // Show tab bar on Home
    />
    <Stack.Screen 
      name="Details" 
      component={Details} 
      options={{ tabBarStyle: { display: 'none' } }} // Hide tab bar on Details
    />
  </Stack.Navigator>
);

const CategoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Category" component={Category} />
    <Stack.Screen 
      name="CategoryDetails" 
      component={CategoryDetails} 
      options={({ route }) => ({ 
        title: route.params.category || 'Category Details',
        tabBarStyle: { display: 'none' }, // Hide tab bar for this screen
      })}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Profile" component={Profile} />
  </Stack.Navigator>
);

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: "#fff",
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center"}}>
                <Entypo name="home" size={24} color={focused ? "#16247d" : "#111"} />
                <Text style={{ fontSize: 12, color: focused ? "#16247d" : "#111" }}>
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="CategoryTab" 
          component={CategoryStack} 
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center"}}>
                <MaterialIcons name="category" size={24} color={focused ? "#16247d" : "#111"} />
                <Text style={{ fontSize: 12, color: focused ? "#16247d" : "#111" }}>
                  Category
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStack} 
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center"}}>
                <FontAwesome name="user" size={24} color={focused ? "#16247d" : "#111"} />
                <Text style={{ fontSize: 12, color: focused ? "#16247d" : "#111" }}>
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
