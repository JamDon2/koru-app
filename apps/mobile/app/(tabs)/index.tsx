import { Text, View } from "react-native";
import { useHelloWorld } from "api-client/react-query";

export default function Index() {
  const helloWorld = useHelloWorld();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">
        Edit app/index.tsx to edit this screen.
      </Text>
      {helloWorld.data ? (
        <Text>{helloWorld.data.message}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
