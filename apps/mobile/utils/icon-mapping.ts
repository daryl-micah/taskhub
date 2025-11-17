import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";

type IconMapping = Partial<
  Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>
>;
export type IconSymbolName = keyof typeof MAPPING;

export const MAPPING: IconMapping = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "checkmark.circle.fill": "check-circle",
  "person.2.circle": "group",
};
