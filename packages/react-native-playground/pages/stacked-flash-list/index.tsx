import {
  ScrollViewCell,
  ScrollViewContainer,
} from '@hong97/collections-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'red',
  },
})

export function StackedFlashListPage() {
  return (
    <View style={styles.container}>
      <ScrollViewContainer>
        <ScrollViewCell>
          {new Array(5).fill(0).map((_, i) => (
            <View
              key={i}
              style={{ height: 100, backgroundColor: i % 2 ? 'blue' : '#fff' }}
            />
          ))}
        </ScrollViewCell>
        <ScrollViewCell>
          {new Array(10).fill(0).map((_, i) => (
            <View
              key={i}
              style={{ height: 100, backgroundColor: i % 2 ? 'blue' : '#fff' }}
            />
          ))}
        </ScrollViewCell>
      </ScrollViewContainer>
    </View>
  )
}
