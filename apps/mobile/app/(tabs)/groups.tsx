import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Text, View } from "react-native";

export default function GroupsScreen() {
  return (
    <ParallaxScrollView
      headerImage={
        <IconSymbol name="person.2.circle" size={300} color={"#FFA500"} />
      }
      headerBackgroundColor={{ light: "#FFA500", dark: "#663300" }}
    >
      <View>
        <Text>Groups Screen</Text>
      </View>
    </ParallaxScrollView>
  );
}
