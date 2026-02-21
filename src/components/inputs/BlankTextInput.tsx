import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { PrimaryColor, whitecolor } from "@/src/constants/Colors";

interface BlankTextInputProps {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  label?: string;
  editable?: boolean;
}

const BlankTextInput = ({
  value,
  onChangeText,
  placeholder,
  label,
  editable = true,
}: BlankTextInputProps) => {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontWeight: "500", marginLeft: 9, color: whitecolor }}>
        {label}
      </Text>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        style={styles.input}
        editable={editable}
      />
    </View>
  );
};

export default BlankTextInput;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 24,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderColor: "#D9D9D9",
    marginLeft: 4,
    color: whitecolor,
    fontWeight: "bold",
    backgroundColor: PrimaryColor,
  },
});
