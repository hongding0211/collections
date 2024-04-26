import React, { useRef } from 'react'
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'
import { SheetProvider, useSheet } from 'react-native-collections/core'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
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
  placeholder: {
    backgroundColor: '#dedede',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#969696',
  },
  content: {
    rowGap: 12,
    margin: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    color: '#5a5a5a',
  },
})

const Button: React.FC<PressableProps & { title: string }> = props => (
  <Pressable {...props} style={styles.button}>
    <Text style={styles.buttonText}>{props.title}</Text>
  </Pressable>
)

const Content = () => (
  <View style={styles.content}>
    <Text style={styles.title}>Sheet Title</Text>
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Placeholder</Text>
    </View>
    <Text style={styles.text}>
      Doloribus est excepturi ex voluptatem debitis sapiente ut. Quas nihil
      mollitia voluptatibus nihil nisi ut. Vitae dolor et perspiciatis est
      dolorem voluptas est nostrum ut. Ipsum in adipisci et. Est quia recusandae
      earum eaque illum.{' '}
    </Text>
  </View>
)

const Child = () => {
  const sheetId = useRef(-1)
  const shown = useRef(false)

  const sheet = useSheet()

  const handleOpen = () => {
    if (shown.current) {
      return
    }
    sheetId.current = sheet.show(Content, {
      bottomOffset: 88,
      useCloseAnim: true,
    })
    shown.current = true
  }

  const handleClose = () => {
    sheet.destroy(sheetId.current)
    shown.current = false
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title="Open Sheet" onPress={handleOpen} />
        <Button title="Close Sheet" onPress={handleClose} />
      </View>
    </View>
  )
}

export const Sheet: React.FC = () => {
  return (
    <SheetProvider>
      <Child />
    </SheetProvider>
  )
}
