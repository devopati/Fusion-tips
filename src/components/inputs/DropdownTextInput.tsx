import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { PrimaryColor, whitecolor, yellowColor } from "@/src/constants/Colors";

type PropTypes = {
  value?: string;
  setValue: (a: any) => void;
  dropDownData?: any[];
  labelText?: string;
  guideText?: string;
  onValueChange?: (a: { label: string; value: string; id: number }) => void;
  error?: boolean;
  onBlur?: () => void;
};

const DropdownTextInput: React.FC<PropTypes> = ({
  value = "",
  setValue = (a: string) => {},
  dropDownData = [],
  labelText = "",
  guideText = "",
  onValueChange = () => {},
  error = false,
  onBlur,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          key={labelText}
          style={[styles.label, isFocus && { color: "blue" }]}
        >
          Select {labelText}
        </Text>
      );
    }
    return null;
  };
  return (
    <View style={styles.container}>
      {/* {renderLabel()} */}
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: PrimaryColor },
          error && { borderColor: "rgba(0,0,0,0.05)" },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          error && { color: PrimaryColor },
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={[styles.iconStyle, error && { tintColor: PrimaryColor }]}
        data={dropDownData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? guideText : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
          onBlur && onBlur();
        }}
        onChange={(item: any) => {
          setValue(item?.value);
          setIsFocus(false);
          onValueChange(item);
        }}
        containerStyle={{ backgroundColor: PrimaryColor }}
        itemTextStyle={{ color: whitecolor, fontWeight: "bold" }}
      />
    </View>
  );
};

export default DropdownTextInput;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 10,
    width: "100%",
  },
  dropdown: {
    height: 57.5,
    borderColor: "#f4f4f4",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: PrimaryColor,
    color: whitecolor,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 0,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#D9D9D9",
    fontWeight: "bold",
  },
  selectedTextStyle: {
    fontWeight: "bold",
    color: whitecolor,
    textTransform: "uppercase",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontSize: 16,
    color: whitecolor,
  },
  headingtext: {
    fontSize: 17,
  },
});
