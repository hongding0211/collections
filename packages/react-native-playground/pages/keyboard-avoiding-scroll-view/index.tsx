import {
  KeyboardAvoidingScrollView,
  KeyboardAvoidingScrollViewContext,
} from '@hong97/collections-react-native'
import React, { useContext, useRef } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    rowGap: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    color: '#333333',
  },
  placeholder: {
    backgroundColor: '#dedede',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#969696',
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

const Child = () => {
  const inputRef = useRef<TextInput>(null)

  const keyboardAvoidingScrollViewContext = useContext(
    KeyboardAvoidingScrollViewContext,
  )
  const { focusElem } = keyboardAvoidingScrollViewContext || {}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Keyboard avoiding scroll view is a enhanced ScrollView that
        automatically adjust scroll offsets to ensure that the focused text
        input is not covered by the keyboard.
      </Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Placeholder</Text>
      </View>
      <View ref={inputRef} style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onFocus={() => focusElem?.(inputRef.current)}
          placeholder="Try to focus this input"
        />
      </View>
    </View>
  )
}

export function KeyboardAvoidingScrollViewPage() {
  return (
    <KeyboardAvoidingScrollView bottomOffset={12}>
      <Child />
    </KeyboardAvoidingScrollView>
  )
}
