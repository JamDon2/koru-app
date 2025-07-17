import useAuthStore from "@/stores/auth.store";
import { passwordLogin } from "api-client";
import { useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import parseCookie from "@/lib/cookie";
import { z } from "zod";
import { getHcaptchaSitekeyOptions } from "api-client/react-query";
import { useQuery } from "@tanstack/react-query";

const emailSchema = z
  .string({ required_error: "Email is required" })
  .email({ message: "Invalid email address" });

const passwordSchema = z.string({ required_error: "Password is required" });

export default function SignIn() {
  const { setAccessToken } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const captchaForm = useRef<ConfirmHcaptcha>(null);
  const hcaptchaSitekey = useQuery({
    ...getHcaptchaSitekeyOptions(),
    staleTime: Infinity,
  });

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);

    if (!emailResult.success) {
      setEmailError(emailResult.error.format()._errors[0] ?? "");
      isValid = false;
    }

    if (!passwordResult.success) {
      setPasswordError(passwordResult.error.format()._errors[0] ?? "");
      isValid = false;
    }

    return isValid;
  };

  const handleMessage = async (event: any) => {
    if (event.nativeEvent.data !== "open") {
      captchaForm.current?.hide();
    }

    if (event.success && event.nativeEvent.data !== "open") {
      await handleSubmit(event.nativeEvent.data);
      event.markUsed();
    }
  };

  const handleSubmit = async (hcaptchaToken: string) => {
    try {
      if (!validateForm()) return;

      setIsLoading(true);
      setIsError(false);

      const { error, response } = await passwordLogin({
        body: {
          username: email,
          password: password,
        },
        headers: {
          "hcaptcha-token": hcaptchaToken,
        },
      });

      if (error) {
        setIsError(true);
      } else {
        const cookieHeader = response.headers.get("set-cookie") ?? "";

        const cookies = parseCookie(cookieHeader);

        if (cookies.access_token && cookies.access_token_expiration) {
          if (cookies.refresh_token) {
            await SecureStore.setItemAsync(
              "refreshToken",
              cookies.refresh_token
            );
          }

          if (cookies.access_token_expiration) {
            setAccessToken(
              cookies.access_token,
              Number(cookies.access_token_expiration)
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="mb-2 text-center text-3xl font-bold text-white">
                Welcome Back
              </Text>
              <Text className="text-center text-base text-gray-400">
                Sign in to continue to your account
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email Field */}
              <View>
                <Text className="mb-2 text-sm font-medium text-gray-300">
                  Email
                </Text>
                <TextInput
                  className={`rounded-lg bg-gray-800 px-4 py-3 text-white ${
                    emailError ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? (
                  <Text className="mt-1 text-xs text-red-500">
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Password Field */}
              <View>
                <Text className="mb-2 text-sm font-medium text-gray-300">
                  Password
                </Text>
                <TextInput
                  className={`rounded-lg bg-gray-800 px-4 py-3 text-white ${
                    passwordError ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {passwordError ? (
                  <Text className="mt-1 text-xs text-red-500">
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Error Message */}
              {isError && (
                <View className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <Text className="text-center text-sm text-red-400">
                    Invalid credentials or captcha verification failed. Please
                    try again.
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <Pressable
                onPress={() => captchaForm.current?.show()}
                disabled={isLoading}
                className={`mt-6 rounded-lg py-4 ${
                  isLoading
                    ? "bg-indigo-700"
                    : "bg-indigo-600 active:bg-indigo-700"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-base font-semibold text-white">
                    Sign In
                  </Text>
                )}
              </Pressable>

              {/* Register Link */}
              {/* <View className="mt-6">
                <Text className="text-center text-gray-400">
                  Don't have an account?{" "}
                  <ExternalLink
                    href="https://koru.cash/sign-up"
                    className="text-indigo-400 font-medium"
                  >
                    Register
                  </ExternalLink>
                </Text>
              </View> */}

              {hcaptchaSitekey.data && (
                <View className="flex items-center justify-center">
                  <ConfirmHcaptcha
                    ref={captchaForm}
                    siteKey={hcaptchaSitekey.data.message}
                    size="invisible"
                    onMessage={handleMessage}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
