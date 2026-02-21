import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Button } from "react-native-paper";
import { whitecolor, yellowColor } from "@/src/constants/Colors";

interface PrimaryButtonProps {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  btnStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  buttonColor?: string;
  loading?: boolean;
  disabled?: boolean;
}

const PrimaryButton = ({
  title,
  onPress,
  btnStyle,
  buttonColor,
  titleStyle,
  loading,
  disabled,
}: PrimaryButtonProps) => {
  return (
    <Button
      onPress={onPress}
      buttonColor={buttonColor ? buttonColor : yellowColor}
      style={[styles.button, btnStyle]}
      loading={loading}
      disabled={disabled}
    >
      <Text allowFontScaling={false} style={[styles.title, titleStyle]}>
        {" "}
        {title}
      </Text>
    </Button>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 2,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 15,
    color: whitecolor,
    fontWeight: "500",
  },
});
