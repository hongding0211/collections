import React, { useContext, useRef } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import {
  KeyboardAvoidingScrollView,
  KeyboardAvoidingScrollViewContext,
} from 'react-native-collections/core'

const Child = () => {
  const inputRef = useRef<TextInput>(null)

  const keyboardAvoidingScrollViewContext = useContext(
    KeyboardAvoidingScrollViewContext,
  )
  const { focusElem } = keyboardAvoidingScrollViewContext || {}
  return (
    <>
      <View style={{ height: 400, backgroundColor: 'blue' }} />
      <TextInput
        ref={inputRef}
        style={{
          height: 200,
          backgroundColor: '#eee',
          borderWidth: 2,
          borderColor: 'green',
        }}
        onFocus={() => focusElem?.(inputRef.current)}
      />
    </>
  )
}

export function KeyboardAvoidingScrollViewPage() {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView
        enable
        style={{
          borderWidth: 2,
          borderColor: 'red',
        }}
      >
        <Child />
      </KeyboardAvoidingScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
