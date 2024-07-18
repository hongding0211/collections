import React from "react";
import { FlashList } from "@shopify/flash-list";
import { ListProps } from "./types";

export const List: React.FC<ListProps> = props => {
  return (
    <FlashList {...props} />
  )
}