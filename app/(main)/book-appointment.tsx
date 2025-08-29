import { createAppoinment } from "@/api/appointment";
import { fetchDoctorById } from "@/api/doctors";
import AppointmentSlot from "@/components/appointments/AppointmentSlot";
import Button from "@/components/button/Button";
import DoctorCard from "@/components/doctors/DoctorCard";
import BackHeader from "@/components/header/BackHeader";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import {
  ShowMessage as ToastComponent,
  useShowMessage,
} from "@/components/showMessage";
import { COLORS } from "@/constants/Colors";
import { setAppointment } from "@/store/screens/appointment";
import { usePreventRemove } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

type PatientField = "name" | "phoneNumber" | "age";

const BookAppointment = () => {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [,/* formError removed: using toast messages */] = useState("");
  const [isPatientDetail, setIsPatientDetail] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  // removed unused selectedSlot/selectedRemindTime state

  const [appointmentDetails, setAppointmentDetails] = useState({
    patient: { name: "", phoneNumber: "", age: "" },
    slot: { time: "", date: "", reminder: "" },
    doctor: "",
  });

  useEffect(() => {
    if (doctorId) {
      setAppointmentDetails((prev) => ({ ...prev, doctor: doctorId }));
    }
  }, [doctorId]);

  // Toast hook
  const {
    visible,
    toastData,
    showSuccess,
    showError,
    showWarning,
    hideMessage,
  } = useShowMessage();

  const mutation = useMutation({
    mutationFn: createAppoinment,
    onSuccess: (data) => {
      dispatch(setAppointment(data));
      setDisplayModal(true);
    },
    onError: (err: any) => {
      console.log(err);
      showError(err?.message || "Failed to create appointment", "Error");
    },
  });

  usePreventRemove(isPatientDetail, ({ data }) => {
    if (isPatientDetail) {
      setIsPatientDetail(false);
    } else {
      navigation.dispatch(data.action);
    }
  });

  const onPressNext = useCallback(() => {
    const { name, age, phoneNumber } = appointmentDetails.patient;

    if (isPatientDetail) {
      // setDisplayModal(true);
      mutation.mutate(appointmentDetails);
    } else {
      // Validate patient details with specific error messages
      const errors = [];

      if (!name.trim()) {
        errors.push("Patient name is required");
      }

      if (!phoneNumber.trim()) {
        errors.push("Contact number is required");
      } else if (phoneNumber.length !== 10) {
        errors.push("Contact number must be exactly 10 digits");
      } else if (!/^\d+$/.test(phoneNumber)) {
        errors.push("Contact number must contain only numbers");
      }

      if (!age.trim()) {
        errors.push("Patient age is required");
      } else if (isNaN(Number(age)) || Number(age) <= 0) {
        errors.push("Please enter a valid age");
      } else if (Number(age) > 120) {
        errors.push("Please enter a realistic age");
      }

      if (errors.length > 0) {
        showWarning(errors.join("\n"), "Validation Error");
      } else {
        setIsPatientDetail(true);
      }
    }
  }, [isPatientDetail, appointmentDetails, mutation, showWarning]);

  const isMutating =
    (mutation as any)?.isLoading ?? (mutation as any)?.status === "loading";

  const onChangeTextField = useCallback((name: PatientField, value: string) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        [name]: value,
      },
    }));
  }, []);

  const onChangeHandler = useCallback((name: string, value: string) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        [name]: value,
      },
    }));
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["doctorById", doctorId],
    queryFn: () => fetchDoctorById(doctorId as string),
    enabled: !!doctorId,
  });

  const patientFields: {
    name: PatientField;
    placeholder: string;
    keyboardType?: "default" | "numeric";
    maxLength?: number;
  }[] = useMemo(
    () => [
      { name: "name", placeholder: "Patient Name" },
      {
        name: "phoneNumber",
        placeholder: "Contact Number",
        keyboardType: "numeric",
        maxLength: 10,
      },
      {
        name: "age",
        placeholder: "Age",
        keyboardType: "numeric",
        maxLength: 2,
      },
    ],
    []
  );

  return (
    <View style={styles.container}>
      {!isPatientDetail && (
        <View style={styles.content}>
          <BackHeader />
          <Text style={styles.doctorHeading}>Doctor</Text>
          {isLoading ? (
            <View
              style={[
                styles.doctorCard,
                { alignItems: "center", justifyContent: "center", height: 120 },
              ]}
            >
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            </View>
          ) : (
            <DoctorCard
              {...data}
              style={styles.doctorCard}
              imageStyle={styles.doctorImage}
              contentStyle={styles.contentStyle}
            />
          )}

          <View>
            <Text style={[styles.doctorHeading, styles.appointmentLabel]}>
              Appointment For
            </Text>
            {patientFields.map(
              ({ name, placeholder, keyboardType, maxLength }) => (
                <TextInput
                  key={name}
                  value={appointmentDetails.patient[name]}
                  onChangeText={(text) => onChangeTextField(name, text)}
                  style={styles.input}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  maxLength={maxLength}
                />
              )
            )}
          </View>
        </View>
      )}

      {isPatientDetail && <AppointmentSlot onChangeHandler={onChangeHandler} />}

      <View style={styles.footer}>
        <Button
          onPress={isMutating ? undefined : onPressNext}
          style={{ backgroundColor: isMutating ? "#BDBDBD" : COLORS.PRIMARY }}
          label={
            isPatientDetail
              ? isMutating
                ? "Setting..."
                : "Set Appointment"
              : isMutating
              ? "Please wait"
              : "Next"
          }
        />
      </View>

      <ConfirmationModal
        modalText={`You booked an appointment with ${data?.name} on ${appointmentDetails?.slot?.date}, at ${appointmentDetails?.slot?.time}.`}
        onClose={() => setDisplayModal(false)}
        visible={displayModal}
      />
      {/* Toast message component */}
      <ToastComponent
        visible={visible}
        type={toastData?.type}
        title={toastData?.title}
        message={toastData?.message || ""}
        duration={toastData?.duration}
        onHide={hideMessage}
        onPress={toastData?.onPress}
      />
    </View>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  content: {
    padding: 20,
  },
  doctorHeading: {
    fontSize: 18,
    fontWeight: "500",
  },
  appointmentLabel: {
    marginTop: 10,
  },
  doctorCard: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    flex: 0,
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
    borderColor: "#EDEDFC",
    marginTop: 10,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  contentStyle: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    gap: 50,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#76809F",
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  errorText: {
    marginBottom: 20,
    color: "red",
    alignSelf: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
  },
});
