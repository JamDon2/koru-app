import { useCreateUser } from "api-client/react-query";
import { Button, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

export default function AboutScreen() {
  const createUser = useCreateUser();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleCreateUser = () => {
    createUser.mutate(
      { data: { email: email, name: name } },
      {
        onSuccess: (data) => {
          setApiResponse(data.message);
          setShowForm(false);
        },
        onError: (error) => {
          const errorMessage =
            (error as any)?.response?.data?.detail ||
            (error as Error).message ||
            "An unknown error occurred";
          setApiResponse(`Error: ${errorMessage}`);
          setShowForm(false);
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      {showForm ? (
        <>
          <Text className="text-xl mb-4">Create User</Text>
          <TextInput
            placeholder="Email"
            className="border p-2 mb-2 w-full"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Name"
            className="border p-2 mb-4 w-full"
            value={name}
            onChangeText={setName}
          />
          <Button title="Create User" onPress={handleCreateUser} />
        </>
      ) : (
        <Text className="text-lg">API Response: {apiResponse}</Text>
      )}
      {createUser.isPending && <Text>Creating user...</Text>}
    </View>
  );
}
