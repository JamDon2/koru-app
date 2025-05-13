import { View } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View>
        <Link href="/">Go back to Home screen!</Link>
      </View>
    </>
  );
}
