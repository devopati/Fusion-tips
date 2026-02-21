import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import {
  darkblack,
  whitecolor,
  lightGreen,
  yellowColor,
} from "@/src/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import PrimaryButton from "@/src/components/button/PrimaryButton";
import DropdownTextInput from "@/src/components/inputs/DropdownTextInput";
import DateTimeInput from "@/src/components/inputs/DateTimeInput";
import useFirebaseFirestore from "../hooks/useFirebaseFirestore";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType, OddsType } from "@/src/types/types";
import { OddsTypesData } from "@/src/data/odds-type-data";

const PostOdd = () => {
  const navigation = useNavigation<NavigationPropType>();

  const [dateTime, setDateTime] = useState<Date | undefined>();
  const [timeOfPlay, setTimeOfPlay] = useState<Date | undefined>();
  const [plan, setPlan] = useState<string>("");
  const [leagueName, setLeagueName] = useState<string>("");
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");
  const [tip1, setTip1] = useState<string>("");
  const [tip2, setTip2] = useState<string>("");
  const [odds, setOdds] = useState<string>("");

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { loading, createOddHandler, setSuccess, success } =
    useFirebaseFirestore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!plan) newErrors.plan = "Please select an odd type";
    if (!leagueName.trim()) newErrors.leagueName = "League name is required";
    if (!team1.trim()) newErrors.team1 = "Home team name is required";
    if (!team2.trim()) newErrors.team2 = "Away team name is required";
    if (!tip1.trim()) newErrors.tip1 = "Tip 1 is required";
    if (!odds.trim()) newErrors.odds = "Odds value is required";
    if (!dateTime) newErrors.dateTime = "Match date and time is required";

    // Validate odds format (should be a number)
    if (odds && isNaN(parseFloat(odds))) {
      newErrors.odds = "Please enter a valid odds number";
    }

    // Check if match is not in the past
    // if (dateTime && dateTime < new Date()) {
    //   newErrors.dateTime = "Match date cannot be in the past";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitOddHandler = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly"
      );
      return;
    }

    const data = {
      date_of_play: new Date(dateTime!).getTime(),
      time_of_play: new Date(timeOfPlay || dateTime!).getTime(),
      expires_at: "",
      league_name: leagueName.trim(),
      odd_type: plan,
      posted_at: `${Date.now()}`,
      status: "pending",
      team1_name: team1.trim(),
      team2_name: team2.trim(),
      tip1: tip1.trim(),
      tip2: tip2.trim(),
      odds: odds.trim(),
    };
    await createOddHandler(data as OddsType);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (success) {
      navigation.goBack();
      setSuccess(false);
    }
  }, [success]);

  const isFormValid =
    plan &&
    leagueName.trim() &&
    team1.trim() &&
    team2.trim() &&
    tip1.trim() &&
    odds.trim() &&
    dateTime;

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
              Create New Odd
            </Text>
            <Text allowFontScaling={false} style={styles.headerSubtitle}>
              Fill in the details to post a new betting odd
            </Text>
          </View>

          {/* Odd Type Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                Odd Configuration
              </Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.inputContainer}>
              <DropdownTextInput
                setValue={(value) => {
                  setPlan(value);
                  clearError("plan");
                }}
                dropDownData={OddsTypesData}
                guideText="Select Odd Type/Plan *"
                value={plan}
              />
              {errors.plan && (
                <Text style={styles.errorText}>{errors.plan}</Text>
              )}
            </View>
          </View>

          {/* Game Details Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                Match Information
              </Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.inputsGrid}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>League Name *</Text>
                <TextInput
                  mode="outlined"
                  outlineStyle={[
                    styles.inputOutline,
                    errors.leagueName && styles.inputError,
                  ]}
                  style={styles.input}
                  placeholder="e.g. Premier League, Champions League"
                  placeholderTextColor="#999"
                  contentStyle={styles.inputContent}
                  autoCapitalize="words"
                  value={leagueName}
                  onChangeText={(text) => {
                    setLeagueName(text);
                    clearError("leagueName");
                  }}
                />
                {errors.leagueName && (
                  <Text style={styles.errorText}>{errors.leagueName}</Text>
                )}
              </View>

              <View style={styles.teamsContainer}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Home Team *</Text>
                  <TextInput
                    mode="outlined"
                    outlineStyle={[
                      styles.inputOutline,
                      errors.team1 && styles.inputError,
                    ]}
                    style={styles.input}
                    placeholder="Home team name"
                    placeholderTextColor="#999"
                    contentStyle={styles.inputContent}
                    autoCapitalize="words"
                    value={team1}
                    onChangeText={(text) => {
                      setTeam1(text);
                      clearError("team1");
                    }}
                  />
                  {errors.team1 && (
                    <Text style={styles.errorText}>{errors.team1}</Text>
                  )}
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.vsText}>VS</Text>
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Away Team *</Text>
                  <TextInput
                    mode="outlined"
                    outlineStyle={[
                      styles.inputOutline,
                      errors.team2 && styles.inputError,
                    ]}
                    style={styles.input}
                    placeholder="Away team name"
                    placeholderTextColor="#999"
                    contentStyle={styles.inputContent}
                    autoCapitalize="words"
                    value={team2}
                    onChangeText={(text) => {
                      setTeam2(text);
                      clearError("team2");
                    }}
                  />
                  {errors.team2 && (
                    <Text style={styles.errorText}>{errors.team2}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Tips & Betting Details Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                Betting Details
              </Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.inputsGrid}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Main Tip/Prediction *</Text>
                <TextInput
                  mode="outlined"
                  outlineStyle={[
                    styles.inputOutline,
                    errors.tip1 && styles.inputError,
                  ]}
                  style={styles.input}
                  placeholder="e.g. Over 2.5 Goals, Home Win, BTTS"
                  placeholderTextColor="#999"
                  contentStyle={styles.inputContent}
                  autoCapitalize="sentences"
                  value={tip1}
                  onChangeText={(text) => {
                    setTip1(text);
                    clearError("tip1");
                  }}
                />
                {errors.tip1 && (
                  <Text style={styles.errorText}>{errors.tip1}</Text>
                )}
              </View>

              <View style={styles.oddsContainer}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Total Odds *</Text>
                  <TextInput
                    mode="outlined"
                    outlineStyle={[
                      styles.inputOutline,
                      errors.odds && styles.inputError,
                    ]}
                    style={styles.input}
                    placeholder="e.g. 1.85"
                    placeholderTextColor="#999"
                    contentStyle={styles.inputContent}
                    keyboardType="decimal-pad"
                    value={odds}
                    onChangeText={(text) => {
                      // Allow only numbers and decimal point
                      const formattedText = text.replace(/[^0-9.]/g, "");
                      setOdds(formattedText);
                      clearError("odds");
                    }}
                  />
                  {errors.odds && (
                    <Text style={styles.errorText}>{errors.odds}</Text>
                  )}
                </View>

                <View style={styles.oddsPreview}>
                  <Text style={styles.oddsPreviewLabel}>Potential Return</Text>
                  <Text style={styles.oddsPreviewValue}>
                    {odds && !isNaN(parseFloat(odds))
                      ? `${parseFloat(odds).toFixed(2)}x`
                      : "--"}
                  </Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>📅 Match Date & Time *</Text>
                <DateTimeInput
                  setTimeOfPlay={setTimeOfPlay}
                  label="Select match start time"
                  setDateValue={(date) => {
                    setDateTime(date);
                    clearError("dateTime");
                  }}
                />
                {errors.dateTime && (
                  <Text style={styles.errorText}>{errors.dateTime}</Text>
                )}
              </View>

              {/* Optional Tip 2 */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Additional Tip (Optional)</Text>
                <TextInput
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                  placeholder="e.g. Correct Score, Double Chance"
                  placeholderTextColor="#999"
                  contentStyle={styles.inputContent}
                  autoCapitalize="sentences"
                  value={tip2}
                  onChangeText={(text) => setTip2(text)}
                />
              </View>
            </View>
          </View>

          {/* Form Status Indicator */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                isFormValid ? styles.statusValid : styles.statusInvalid,
              ]}
            >
              <Text style={styles.statusText}>
                {isFormValid
                  ? "✅ Form is ready to submit"
                  : "⚠️ Please complete all required fields"}
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <PrimaryButton
              onPress={onSubmitOddHandler}
              loading={loading}
              title={loading ? "Creating Odd..." : "Submit Odd"}
              buttonColor={isFormValid ? lightGreen : "#666"}
              disabled={!isFormValid}
              btnStyle={[
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled,
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostOdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkblack,
    paddingBottom: 100,
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
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputLabel: {
    color: whitecolor,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingHorizontal: 5,
  },
  vsText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "800",
  },
  oddsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  oddsPreview: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
    minWidth: 100,
  },
  oddsPreviewLabel: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  oddsPreviewValue: {
    color: lightGreen,
    fontSize: 18,
    fontWeight: "800",
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    marginLeft: 4,
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
  submitButton: {
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: lightGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
