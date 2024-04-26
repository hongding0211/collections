import React from 'react'
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    rowGap: 8,
  },
  row: {
    flexDirection: 'row',
    columnGap: 8,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#868686',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
})

const Button: React.FC<PressableProps & { title: string }> = props => (
  <Pressable {...props} style={styles.button}>
    <Text style={styles.buttonText}>{props.title}</Text>
  </Pressable>
)

const Child = () => {
  const handleOpen = () => {}

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title="Open Sheet" onPress={handleOpen} />
      </View>
    </View>
  )
}

export const Sheet: React.FC = () => {
  return <Child />
}
