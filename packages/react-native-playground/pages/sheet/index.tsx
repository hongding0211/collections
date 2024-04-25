import { SheetProvider, useSheet } from '@hong97/collections-react-native'
import React, { useRef, useState } from 'react'
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    rowGap: 24,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#969696',
    marginBottom: 8,
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
  sheetTitle: {
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

const Content = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.sheetTitle}>Sheet Title</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Placeholder</Text>
      </View>
      <Text style={styles.text}>
        Doloribus est excepturi ex voluptatem debitis sapiente ut. Quas nihil
        mollitia voluptatibus nihil nisi ut. Vitae dolor et perspiciatis est
        dolorem voluptas est nostrum ut. Ipsum in adipisci et. Est quia
        recusandae earum eaque illum.{' '}
      </Text>
    </View>
  )
}

const Child = () => {
  const sheet = useSheet()

  const [type2SheetOnend, setType2SheetOpened] = useState(false)

  const type2SheetId = useRef(-1)

  const handleOpen = (type: number) => {
    switch (type) {
      case 0: {
        const sheetId = sheet.show(Content, {
          bottomOffset: 88,
          useSpringAnim: true,
          useCloseAnim: true,
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 1: {
        const sheetId = sheet.show(Content, {
          bottomOffset: 88,
          useAnim: false,
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 2: {
        if (type2SheetOnend) {
          sheet.destroy(type2SheetId.current)
          setType2SheetOpened(false)
        } else {
          type2SheetId.current = sheet.show(Content, {
            bottomOffset: 88,
            useSpringAnim: true,
            showMask: false,
          })
          setType2SheetOpened(true)
        }
        break
      }
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.rowTitle}>Common Sheet</Text>
        <Text style={styles.rowSubtitle}>
          A basic sheet that provides most flexibility.
        </Text>
        <View style={styles.row}>
          <Button title="Open Sheet" onPress={() => handleOpen(0)} />
          <Button
            title="Open Sheet Without Anim"
            onPress={() => handleOpen(1)}
          />
          <Button
            title={
              type2SheetOnend
                ? 'Close Sheet Without Mask'
                : 'Open Sheet Without Mask'
            }
            onPress={() => handleOpen(2)}
          />
        </View>
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
