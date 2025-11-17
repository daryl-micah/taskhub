import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Text, View } from "react-native";

export default function TasksScreen() {
  return (
    <ParallaxScrollView
      headerImage={
        <IconSymbol name="checkmark.circle.fill" size={300} color={"#FFA500"} />
      }
      headerBackgroundColor={{ light: "#FFA500", dark: "#663300" }}
    >
      <View>
        <Text>Tasks Screen</Text>
      </View>
    </ParallaxScrollView>
  );
}
