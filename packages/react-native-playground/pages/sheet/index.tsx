import {
  KeyboardAvoidingScrollView,
  KeyboardAvoidingScrollViewContext,
  SheetScrollView,
  useSheet,
} from '@hong97/collections-react-native'
import React, { useContext, useRef, useState } from 'react'
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    rowGap: 12,
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
  buttonRed: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgb(221, 131, 131)',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  buttonTextRed: {
    fontSize: 12,
    fontWeight: '500',
    color: '#e92626',
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
  textInputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    height: 100,
    padding: 10,
  },
  textInput: {
    fontSize: 14,
    color: '#333',
  },
})

const Button: React.FC<
  PressableProps & { title: string; type?: string }
> = props => (
  <Pressable
    {...props}
    style={[styles.button, props.type === 'red' ? styles.buttonRed : undefined]}
  >
    <Text
      style={[
        styles.buttonText,
        props.type === 'red' ? styles.buttonTextRed : undefined,
      ]}
    >
      {props.title}
    </Text>
  </Pressable>
)

const Content = () => {
  return (
    <View style={[styles.content, { flex: 1 }]}>
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

const ScrollableContent = () => {
  return (
    <SheetScrollView
      style={[styles.content, { flex: 1 }]}
      contentContainerStyle={{ rowGap: 12, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sheetTitle}>Sheet Title</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Placeholder</Text>
      </View>
      <Text style={styles.text}>
        Doloribus est excepturi ex voluptatem debitis sapiente ut. Quas nihil
        mollitia voluptatibus nihil nisi ut. Vitae dolor et perspiciatis est
        dolorem voluptas est nostrum ut. Ipsum in adipisci et. Est quia
        recusandae earum eaque illum. Maiores soluta magni qui perspiciatis.
        Nihil voluptatem ut dolores dolor ut nisi est officiis dicta iure
        reiciendis.
      </Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Placeholder</Text>
      </View>
      <Text style={styles.text}>
        Doloribus est excepturi ex voluptatem debitis sapiente ut. Quas nihil
        mollitia voluptatibus nihil nisi ut. Vitae dolor et perspiciatis est
        dolorem voluptas est nostrum ut. Ipsum in adipisci et. Est quia
        recusandae earum eaque illum. Maiores soluta magni qui perspiciatis.
        Nihil voluptatem ut dolores dolor ut nisi est officiis dicta iure
        reiciendis. Ullam quisquam ut fugiat iusto ut aut. Ut explicabo at aut
        voluptatem. Provident mollitia quis facilis consequatur voluptatem ut.
        Repudiandae quibusdam minus enim quas voluptatem dolor rerum aut
        ratione. Ea ipsum suscipit est et quam quos facere est corrupti minus
        non qui deleniti. Non quo libero numquam sit aut eius ab ullam aut dolor
        facilis magnam provident quo. Nesciunt omnis eum aliquid qui.
      </Text>
    </SheetScrollView>
  )
}

const ExpandContent = ({ onPress }: { onPress: () => void }) => {
  return (
    <SheetScrollView
      style={[styles.content, { flex: 1 }]}
      contentContainerStyle={{ rowGap: 12, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sheetTitle}>Sheet Title</Text>
      <View onTouchEnd={onPress} style={styles.placeholder}>
        <Text style={styles.placeholderText}>Press or fling up to expand</Text>
      </View>
      <Text style={styles.text}>
        Doloribus est excepturi ex voluptatem debitis sapiente ut. Quas nihil
        mollitia voluptatibus nihil nisi ut. Vitae dolor et perspiciatis est
        dolorem voluptas est nostrum ut. Ipsum in adipisci et. Est quia
        recusandae earum eaque illum. Maiores soluta magni qui perspiciatis.
        Nihil voluptatem ut dolores dolor ut nisi est officiis dicta iure
        reiciendis. Ullam quisquam ut fugiat iusto ut aut. Ut explicabo at aut
        voluptatem. Provident mollitia quis facilis consequatur voluptatem ut.
        Repudiandae quibusdam minus enim quas voluptatem dolor rerum aut
        ratione. Ea ipsum suscipit est et quam quos facere est corrupti minus
        non qui deleniti. Non quo libero numquam sit aut eius ab ullam aut dolor
        facilis magnam provident quo. Nesciunt omnis eum aliquid qui.
      </Text>
    </SheetScrollView>
  )
}

const KeyboardAvoidingScrollViewContent = () => {
  const inputRef = useRef<TextInput>(null)

  const keyboardAvoidingScrollViewContext = useContext(
    KeyboardAvoidingScrollViewContext,
  )
  const { focusElem } = keyboardAvoidingScrollViewContext || {}

  return (
    <SheetScrollView
      style={[styles.content, { flex: 1 }]}
      contentContainerStyle={{ rowGap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sheetTitle}>Sheet Title</Text>
      <Text style={styles.text}>
        Doloribus est excepturi ex voluptatem debitis sapiente ut. Quas nihil
        mollitia voluptatibus nihil nisi ut. Vitae dolor et perspiciatis est
        dolorem voluptas est nostrum ut. Ipsum in adipisci et. Est quia
        recusandae earum eaque illum. Maiores soluta magni qui perspiciatis.
        Nihil voluptatem ut dolores dolor ut nisi est officiis dicta iure
        reiciendis.
      </Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Placerholder</Text>
      </View>
      <View ref={inputRef} style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onFocus={() => focusElem?.(inputRef.current)}
          placeholder="Try to focus this input"
        />
      </View>
    </SheetScrollView>
  )
}

export const Sheet: React.FC = () => {
  const sheet = useSheet()

  const [type2SheetOnend, setType2SheetOpened] = useState(false)

  const type2SheetId = useRef(-1)

  const handleOpen = (type: number) => {
    switch (type) {
      case 0: {
        const sheetId = sheet.show(Content, {
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 1: {
        const sheetId = sheet.show(Content, {
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
            showMask: false,
          })
          setType2SheetOpened(true)
        }
        break
      }
      case 3: {
        const sheetId = sheet.show(Content, {
          useLinearAnim: true,
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 4: {
        const sheetId = sheet.show(Content, {
          onFlingClose: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 5: {
        const sheetId = sheet.show(Content, {
          type: 'Segment',
          segmentHeightList: [400, 550, 700],
          onFlingClose: () => {
            sheet.destroy(sheetId)
          },
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 6: {
        const sheetId = sheet.show(Content, {
          type: 'Segment',
          segmentHeightList: [500],
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 7: {
        const sheetId = sheet.show(ScrollableContent, {
          type: 'Segment',
          segmentHeightList: [400, 600],
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
        })
        break
      }
      case 8: {
        const sheetId = sheet.show(Content, {
          onPressMask: () => {
            sheet.destroy(sheetId)
          },
          springConfig: {
            bounciness: 6,
            speed: 16,
          },
        })
        break
      }
      case 9: {
        const sheetId = sheet.show(
          () => (
            <ExpandContent
              onPress={() => {
                const instance = sheet.getInstance(sheetId)
                instance?.expand()
              }}
            />
          ),
          {
            type: 'Expandable',
            expandThreshold: 400,
            expandTarget: 600,
            onPressMask: () => {
              sheet.destroy(sheetId)
            },
          },
        )
        break
      }
      case 10: {
        const sheetId = sheet.show(
          () => (
            <KeyboardAvoidingScrollView
              bottomOffset={12}
              renderScrollComponent={SheetScrollView}
            >
              <KeyboardAvoidingScrollViewContent />
            </KeyboardAvoidingScrollView>
          ),
          {
            onPressMask: () => {
              sheet.destroy(sheetId)
            },
          },
        )
        break
      }
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.rowTitle}>Basic Usage</Text>
        <Text style={styles.rowSubtitle}>
          A basic sheet that provides most flexibility.
        </Text>
        <View style={styles.row}>
          <Button title="Open Sheet" onPress={() => handleOpen(0)} />
          <Button
            title="Open Sheet Using Linear Anim"
            onPress={() => handleOpen(3)}
          />
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
            type={type2SheetOnend ? 'red' : undefined}
            onPress={() => handleOpen(2)}
          />
          <Button title="Custom Spring Anim" onPress={() => handleOpen(8)} />
        </View>
      </View>

      <View>
        <Text style={styles.rowTitle}>Different Height Strategy</Text>
        <Text style={styles.rowSubtitle}>
          Sheet supports segment height and fixed height.
        </Text>
        <View style={styles.row}>
          <Button title="Fixed Height" onPress={() => handleOpen(6)} />
          <Button title="Segment Height" onPress={() => handleOpen(5)} />
          <Button
            title="Segment with ScrollView"
            onPress={() => handleOpen(7)}
          />
          <Button title="Expanded Height" onPress={() => handleOpen(9)} />
        </View>
      </View>

      <View>
        <Text style={styles.rowTitle}>Sheet With Gesture</Text>
        <Text style={styles.rowSubtitle}>Using gesture to manipulate.</Text>
        <View style={styles.row}>
          <Button title="Fling to Close" onPress={() => handleOpen(4)} />
        </View>
      </View>

      <View>
        <Text style={styles.rowTitle}>Advanced Usage</Text>
        <Text style={styles.rowSubtitle}>Sheet with advanced usage.</Text>
        <View style={styles.row}>
          <Button title="Custom ScrollView" onPress={() => handleOpen(10)} />
        </View>
      </View>
    </View>
  )
}
