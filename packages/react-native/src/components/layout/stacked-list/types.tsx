import React from 'react'
import { FlashListProps } from '@shopify/flash-list'

export interface StackedListProps {
  children?: React.ReactNode
}

export interface ListProps extends FlashListProps<any> {}