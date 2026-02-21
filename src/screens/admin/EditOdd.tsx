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
  PrimaryColor,
  whitecolor,
  lightGreen,
  yellowColor,
  lightRed,
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

const EditOdd = ({ route }: { route: { params: { odd: OddsType } } }) => {
  const data = route.params.odd;
  const navigation = useNavigation<NavigationPropType>();

  const [dateTime, setDateTime] = useState<Date | undefined>(
    data.date_of_play ? new Date(data.date_of_play) : undefined
  );
  const [timeOfPlay, setTimeOfPlay] = useState<Date | undefined>(
    data.time_of_play ? new Date(data.time_of_play) : undefined
  );
  const [plan, setPlan] = useState<string>(data.odd_type || "");
  const [leagueName, setLeagueName] = useState<string>(data.league_name || "");
  const [team1, setTeam1] = useState<string>(data.team1_name || "");
  const [team2, setTeam2] = useState<string>(data.team2_name || "");
  const [tip1, setTip1] = useState<string>(data.tip1 || "");
  const [tip2, setTip2] = useState<string>(data.tip2 || "");
  const [odds, setOdds] = useState<string>(String(data.odds || ""));

  // Track changes for unsaved changes warning
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { loading, updateOddHandler, setSuccess, success } =
    useFirebaseFirestore();

  // Check if form has changes
  useEffect(() => {
    const currentDateTime = dateTime ? new Date(dateTime).getTime() : undefined;
    const originalDateTime = data.date_of_play;

    const formHasChanges =
      plan !== (data.odd_type || "") ||
      leagueName !== (data.league_name || "") ||
      team1 !== (data.team1_name || "") ||
      team2 !== (data.team2_name || "") ||
      tip1 !== (data.tip1 || "") ||
      tip2 !== (data.tip2 || "") ||
      odds !== String(data.odds || "") ||
      currentDateTime !== originalDateTime;

    setHasChanges(formHasChanges);
  }, [plan, leagueName, team1, team2, tip1, tip2, odds, dateTime, data]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!plan) newErrors.plan = "Please select an odd type";
    if (!leagueName.trim()) newErrors.leagueName = "League name is required";
    if (!team1.trim()) newErrors.team1 = "Home team name is required";
    if (!team2.trim()) newErrors.team2 = "Away team name is required";
    if (!tip1.trim()) newErrors.tip1 = "Tip 1 is required";
    if (!odds.trim()) newErrors.odds = "Odds value is required";

    // Validate odds format
    if (odds && isNaN(parseFloat(odds))) {
      newErrors.odds = "Please enter a valid odds number";
    }

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

    const newData = {
      ...data,
      id: data.id,
      date_of_play: dateTime ? new Date(dateTime).getTime() : data.date_of_play,
      time_of_play: timeOfPlay
        ? new Date(timeOfPlay).getTime()
        : data.time_of_play,
      league_name: leagueName.trim(),
      odd_type: plan,
      team1_name: team1.trim(),
      team2_name: team2.trim(),
      tip1: tip1.trim(),
      tip2: tip2.trim(),
      odds: odds.trim(),
      updated_at: Date.now(),
    };

    await updateOddHandler(newData);
  };

  const onCancelEdit = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const resetForm = () => {
    Alert.alert(
      "Reset Form",
      "This will restore all fields to their original values. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setPlan(data.odd_type || "");
            setLeagueName(data.league_name || "");
            setTeam1(data.team1_name || "");
            setTeam2(data.team2_name || "");
            setTip1(data.tip1 || "");
            setTip2(data.tip2 || "");
            setOdds(String(data.odds || ""));
            setDateTime(
              data.date_of_play ? new Date(data.date_of_play) : undefined
            );
            setTimeOfPlay(
              data.time_of_play ? new Date(data.time_of_play) : undefined
            );
            setErrors({});
          },
        },
      ]
    );
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
    odds.trim();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return lightGreen;
      case "lost":
        return lightRed;
      case "canceled":
        return yellowColor;
      default:
        return "#666";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "won":
        return "✅";
      case "lost":
        return "❌";
      case "canceled":
        return "⚪";
      case "pending":
        return "⏳";
      default:
        return "❓";
    }
  };

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
              ✏️ Edit Odd
            </Text>
            <Text allowFontScaling={false} style={styles.headerSubtitle}>
              Modify the betting odd details below
            </Text>

            {/* Current Status Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(data.status) },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {getStatusEmoji(data.status)}{" "}
                {data.status?.toUpperCase() || "UNKNOWN"}
              </Text>
            </View>
          </View>

          {/* Changes Indicator */}
          {hasChanges && (
            <View style={styles.changesIndicator}>
              <Text style={styles.changesText}>
                ⚠️ You have unsaved changes
              </Text>
            </View>
          )}

          {/* Original Match Info */}
          <View style={styles.originalInfoContainer}>
            <Text style={styles.originalInfoTitle}>Original Match</Text>
            <Text style={styles.originalInfoText}>
              {data.team1_name} vs {data.team2_name}
            </Text>
            <Text style={styles.originalInfoSubtext}>
              {data.league_name} • Created{" "}
              {new Date(parseInt(data.posted_at || "0")).toLocaleDateString()}
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
                <Text style={styles.inputLabel}>📅 Match Date & Time</Text>
                <DateTimeInput
                  setTimeOfPlay={setTimeOfPlay}
                  label="Update match start time"
                  setDateValue={setDateTime}
                />
              </View>

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

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {hasChanges && (
              <View style={styles.secondaryButtonsContainer}>
                <PrimaryButton
                  onPress={resetForm}
                  title="Reset"
                  buttonColor="#666"
                  btnStyle={styles.secondaryButton}
                />
                <PrimaryButton
                  onPress={onCancelEdit}
                  title="Cancel"
                  buttonColor={lightRed}
                  btnStyle={styles.secondaryButton}
                />
              </View>
            )}

            <PrimaryButton
              onPress={onSubmitOddHandler}
              loading={loading}
              title={loading ? "Updating..." : "Save Changes"}
              disabled={!hasChanges || !isFormValid}
              btnStyle={[
                styles.saveButton,
                (!hasChanges || !isFormValid) && styles.saveButtonDisabled,
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditOdd;

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
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  statusBadgeText: {
    color: whitecolor,
    fontSize: 14,
    fontWeight: "700",
  },
  changesIndicator: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.4)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  changesText: {
    color: yellowColor,
    fontSize: 14,
    fontWeight: "600",
  },
  originalInfoContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  originalInfoTitle: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  originalInfoText: {
    color: whitecolor,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  originalInfoSubtext: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
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
  actionButtonsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  secondaryButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: lightGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
