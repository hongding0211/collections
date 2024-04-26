import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import 'react-native-gesture-handler'

import { KeyboardAvoidingScrollViewPage } from './pages/keyboard-avoiding-scroll-view'
import { Popup } from './pages/popup'

const Drawer = createDrawerNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="KeyboardAvoidingScrollViewPage"
          component={KeyboardAvoidingScrollViewPage}
        />
        <Drawer.Screen name="Popup" component={Popup} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
