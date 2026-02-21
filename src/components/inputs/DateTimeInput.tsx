import React, { useEffect, useState } from "react";
import { View, Platform, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import BlankTextInput from "./BlankTextInput";
import { getLocalizedDate } from "@/src/utils/get-localized-date";
import { getLocalizedTime } from "@/src/utils/get-localized-time";
const DateTimeInput = ({
  label,
  setDateValue,
  setTimeOfPlay,
  min = new Date(), // Default to today
  max = "", // Optional max date
}: {
  label: string;
  setDateValue: (arg: Date | undefined) => void;
  setTimeOfPlay: (arg: Date | undefined) => void;
  min?: string | Date;
  max?: string | Date;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<Date | undefined>(new Date());

  const launchDateTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, selectedDate) => {
        setDateValue(selectedDate);
        setDate(selectedDate);
      },
      mode: "date",
    });
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, selectedTime) => {
        setTimeOfPlay(selectedTime);
        setTime(selectedTime);
      },
      mode: "time",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={launchDateTimePicker}>
        <BlankTextInput
          label={label}
          editable={false}
          value={`${date && getLocalizedDate(new Date(date).getTime())}, ${
            time && getLocalizedTime(new Date(time).getTime())
          }`}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DateTimeInput;
