import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import DropdownTextInput from "@/src/components/inputs/DropdownTextInput";
import { ScrollView } from "react-native-gesture-handler";
import {
  darkblack,
  PrimaryColor,
  whitecolor,
  lightGreen,
  yellowColor,
  lightRed,
} from "@/src/constants/Colors";
import { TextInput } from "react-native-paper";
import PrimaryButton from "@/src/components/button/PrimaryButton";
import useFirebaseFirestore from "../hooks/useFirebaseFirestore";
import { sendPushNotification } from "@/src/components/containers/NotificationContainer";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";

const { width } = Dimensions.get("window");

const NotifyUsers = () => {
  const navigation = useNavigation<NavigationPropType>();

  const [userType, setUserType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [estimatedUsers, setEstimatedUsers] = useState<number>(0);

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { fetchAllNotificationTokens } = useFirebaseFirestore();

  // Get estimated user count when userType changes
  useEffect(() => {
    const getEstimatedUsers = async () => {
      if (!userType) {
        setEstimatedUsers(0);
        return;
      }

      try {
        const tokens = await fetchAllNotificationTokens(
          userType === "vip" ? true : userType === "free" ? false : undefined
        );
        setEstimatedUsers(tokens.length);
      } catch (error) {
        setEstimatedUsers(0);
      }
    };

    getEstimatedUsers();
  }, [userType]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!userType) newErrors.userType = "Please select a user type";
    if (!title.trim()) newErrors.title = "Title is required";
    if (!body.trim()) newErrors.body = "Message body is required";
    if (title.length > 50)
      newErrors.title = "Title should be 50 characters or less";
    if (body.length > 200)
      newErrors.body = "Message should be 200 characters or less";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onSendNotificationHandler = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix the form errors before sending"
      );
      return;
    }

    // Confirmation dialog
    const userTypeText =
      userType === "vip"
        ? "VIP users"
        : userType === "free"
        ? "Free users"
        : "All users";

    Alert.alert(
      "Send Notification",
      `Send notification to ${estimatedUsers} ${userTypeText}?\n\nTitle: "${title}"\nMessage: "${body}"`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          style: "default",
          onPress: async () => {
            setLoading(true);
            try {
              const allTokens = await fetchAllNotificationTokens(
                userType === "vip"
                  ? true
                  : userType === "free"
                  ? false
                  : undefined
              );
              const tokens = allTokens.map((token) => token.token);

              if (tokens.length > 0) {
                await sendPushNotification({
                  title: title.trim(),
                  body: body.trim(),
                  tokens,
                });

                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    "Notification sent successfully!",
                    ToastAndroid.SHORT
                  );
                }
                navigation.goBack();
              } else {
                Alert.alert(
                  "No Recipients",
                  "No users found for the selected user type"
                );
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to send notification. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const isFormValid =
    userType &&
    title.trim() &&
    body.trim() &&
    title.length <= 50 &&
    body.length <= 200;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text allowFontScaling={false} style={styles.headerTitle}>
              Send Notification
            </Text>
            <Text allowFontScaling={false} style={styles.headerSubtitle}>
              Broadcast messages to your users instantly
            </Text>
          </View>

          {/* User Type Selection */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                Target Audience
              </Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.inputContainer}>
              <DropdownTextInput
                setValue={(value) => {
                  setUserType(value);
                  clearError("userType");
                }}
                dropDownData={[
                  { label: "VIP Users", value: "vip" },
                  { label: "Free Plan Users", value: "free" }, // Fixed typo from "fress"
                  { label: "All Users", value: "all" },
                ]}
                guideText="Select User Type *"
                value={userType}
              />
              {errors.userType && (
                <Text style={styles.errorText}>{errors.userType}</Text>
              )}
            </View>
          </View>

          {/* Notification Content */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                Message Content
              </Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.inputsGrid}>
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputLabel}>Notification Title *</Text>
                  <Text
                    style={[
                      styles.charCounter,
                      title.length > 50 && styles.charCounterError,
                    ]}
                  >
                    {title.length}/50
                  </Text>
                </View>
                <TextInput
                  mode="outlined"
                  outlineStyle={[
                    styles.inputOutline,
                    errors.title && styles.inputError,
                  ]}
                  style={styles.input}
                  placeholder="e.g. New VIP Tips Available!"
                  placeholderTextColor="#999"
                  contentStyle={styles.inputContent}
                  autoCapitalize="sentences"
                  maxLength={60}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    clearError("title");
                  }}
                />
                {errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputLabel}>Message Body *</Text>
                  <Text
                    style={[
                      styles.charCounter,
                      body.length > 200 && styles.charCounterError,
                    ]}
                  >
                    {body.length}/200
                  </Text>
                </View>
                <TextInput
                  mode="outlined"
                  outlineStyle={[
                    styles.inputOutline,
                    errors.body && styles.inputError,
                  ]}
                  style={[styles.input, styles.textAreaInput]}
                  placeholder="Write your message here..."
                  placeholderTextColor="#999"
                  contentStyle={styles.textAreaContent}
                  autoCapitalize="sentences"
                  multiline
                  numberOfLines={6}
                  maxLength={220}
                  textAlignVertical="top"
                  value={body}
                  onChangeText={(text) => {
                    setBody(text);
                    clearError("body");
                  }}
                />
                {errors.body && (
                  <Text style={styles.errorText}>{errors.body}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Form Status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                isFormValid ? styles.statusValid : styles.statusInvalid,
              ]}
            >
              <Text style={styles.statusText}>
                {isFormValid
                  ? `Ready to send to users`
                  : "Complete the form to send notification"}
              </Text>
            </View>
          </View>

          {/* Send Button */}
          <View style={styles.submitContainer}>
            <PrimaryButton
              onPress={onSendNotificationHandler}
              loading={loading}
              title={loading ? "Sending..." : "Send Notification"}
              disabled={!isFormValid}
              btnStyle={[
                styles.sendButton,
                !isFormValid && styles.sendButtonDisabled,
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NotifyUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkblack,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    color: whitecolor,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#B0B0B0",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: whitecolor,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 15,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  inputsGrid: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    color: whitecolor,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  charCounter: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "500",
  },
  charCounterError: {
    color: lightRed,
  },
  userCountContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  userCountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userCountIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  userCountLabel: {
    color: "#B0B0B0",
    fontSize: 14,
    fontWeight: "600",
  },
  userCountNumber: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  userCountSubtext: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  inputOutline: {
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    fontSize: 16,
  },
  inputContent: {
    color: whitecolor,
    fontWeight: "600",
    fontSize: 16,
  },
  textAreaInput: {
    minHeight: 120,
  },
  textAreaContent: {
    color: whitecolor,
    fontWeight: "600",
    fontSize: 16,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    marginLeft: 4,
  },
  previewContainer: {
    alignItems: "center",
  },
  previewPhone: {
    width: width * 0.8,
    maxWidth: 300,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  previewNotification: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: lightGreen,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  previewIconText: {
    fontSize: 20,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    color: whitecolor,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  previewBody: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    marginBottom: 4,
  },
  previewTime: {
    color: "#666",
    fontSize: 10,
    fontWeight: "500",
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statusValid: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  statusInvalid: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  statusText: {
    color: whitecolor,
    fontSize: 14,
    fontWeight: "600",
  },
  submitContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sendButton: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  sendButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noUsersWarning: {
    color: yellowColor,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
});
