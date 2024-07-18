import { StackedList, List } from '@hong97/collections-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export function StackedFlashListPage() {
  const data = new Array(20)
  return (
    <View style={styles.container}> 
      <StackedList>
        <List
          numColumns={2}
          data={data}
          renderItem={({index}) => <View style={{ height: 100, backgroundColor: index % 2 === 0 ? '#fff' : 'blue' }} />}
          estimatedItemSize={100}
        />
        <List
          data={data}
          renderItem={({index}) => <View style={{ height: 100, backgroundColor: index % 2 === 0 ? '#fff' : 'green' }} />}
          estimatedItemSize={100}
        />
        <List
          data={data}
          renderItem={({index}) => <View style={{ height: 100, backgroundColor: index % 2 === 0 ? '#fff' : 'red' }} />}
          estimatedItemSize={100}
        />
      </StackedList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
