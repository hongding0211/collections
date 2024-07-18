import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { StackedListProps } from "./types";

export const StackedList: React.FC<StackedListProps> = props => {
  const { children } = props

  const [parentHeight, setParentHeight] = useState(0)

  if (!Array.isArray(children)) {
    return (
      <View style={styles.container}>{children}</View>
    )
  }

  const handleLayout = e => {
    setParentHeight(e.nativeEvent.layout.height)
  }

  return (
    <ScrollView style={styles.container} onLayout={handleLayout}>
      {
        !!parentHeight &&
        children.map((c, i) => (
          <View key={i} style={{
            height: parentHeight,
          }}>
            {c}
          </View>
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})