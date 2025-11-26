import { ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="p-5 pt-15">
        {/* Header Section */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary mb-2">TaskHub</Text>
          <Text className="text-base text-secondary-foreground mb-5">
            Welcome back! Here's your day at a glance
          </Text>

          <View className="bg-secondary p-4 rounded-xl border border-muted">
            <Text className="text-primary text-base text-center font-medium">
              🤖 Generate AI Summary of My Day
            </Text>
          </View>
        </View>

        {/* Top 5 Due Tasks Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-primary mb-4">
            📋 Top 5 Due Tasks
          </Text>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center border border-muted">
            <View className="flex-1">
              <Text className="text-base font-medium text-white mb-1">
                Review project proposal
              </Text>
              <Text className="text-sm text-secondary-foreground">Today</Text>
            </View>
            <View className="bg-task-high px-2 py-1 rounded mx-3">
              <Text className="text-white text-xs font-medium">High</Text>
            </View>
            <Text className="text-secondary-foreground text-sm min-w-15 text-right">
              Work
            </Text>
          </View>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center border border-muted">
            <View className="flex-1">
              <Text className="text-base font-medium text-white mb-1">
                Grocery shopping
              </Text>
              <Text className="text-sm text-secondary-foreground">Today</Text>
            </View>
            <View className="bg-task-medium px-2 py-1 rounded mx-3">
              <Text className="text-white text-xs font-medium">Medium</Text>
            </View>
            <Text className="text-secondary-foreground text-sm min-w-15 text-right">
              Personal
            </Text>
          </View>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center border border-muted">
            <View className="flex-1">
              <Text className="text-base font-medium text-white mb-1">
                Team meeting prep
              </Text>
              <Text className="text-sm text-secondary-foreground">
                Tomorrow
              </Text>
            </View>
            <View className="bg-task-high px-2 py-1 rounded mx-3">
              <Text className="text-white text-xs font-medium">High</Text>
            </View>
            <Text className="text-secondary-foreground text-sm min-w-15 text-right">
              Work
            </Text>
          </View>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center border border-muted">
            <View className="flex-1">
              <Text className="text-base font-medium text-white mb-1">
                Call dentist
              </Text>
              <Text className="text-sm text-secondary-foreground">
                Tomorrow
              </Text>
            </View>
            <View className="bg-task-low px-2 py-1 rounded mx-3">
              <Text className="text-white text-xs font-medium">Low</Text>
            </View>
            <Text className="text-secondary-foreground text-sm min-w-15 text-right">
              Personal
            </Text>
          </View>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center border border-muted">
            <View className="flex-1">
              <Text className="text-base font-medium text-white mb-1">
                Update documentation
              </Text>
              <Text className="text-sm text-secondary-foreground">
                In 2 days
              </Text>
            </View>
            <View className="bg-task-medium px-2 py-1 rounded mx-3">
              <Text className="text-white text-xs font-medium">Medium</Text>
            </View>
            <Text className="text-secondary-foreground text-sm min-w-15 text-right">
              Work
            </Text>
          </View>
        </View>

        {/* Groups Overview Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-primary mb-4">
            👥 Groups Overview
          </Text>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center justify-between border border-muted">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-group-work mr-3" />
              <Text className="text-base font-medium text-white">Work</Text>
            </View>
            <Text className="text-secondary-foreground text-sm">12 tasks</Text>
          </View>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center justify-between border border-muted">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-group-personal mr-3" />
              <Text className="text-base font-medium text-white">Personal</Text>
            </View>
            <Text className="text-secondary-foreground text-sm">8 tasks</Text>
          </View>

          <View className="bg-secondary p-4 rounded-xl mb-3 flex-row items-center justify-between border border-muted">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-group-shopping mr-3" />
              <Text className="text-base font-medium text-white">Shopping</Text>
            </View>
            <Text className="text-secondary-foreground text-sm">3 tasks</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
