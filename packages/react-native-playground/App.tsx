import { SheetProvider } from '@hong97/collections-react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { KeyboardAvoidingScrollViewPage } from './pages/keyboard-avoiding-scroll-view'
import { Sheet } from './pages/sheet'

const Drawer = createDrawerNavigator()

export default function App() {
  return (
    <SheetProvider>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Sheet" component={Sheet} />
          <Drawer.Screen
            name="KeyboardAvoidingScrollViewPage"
            component={KeyboardAvoidingScrollViewPage}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SheetProvider>
  )
}
