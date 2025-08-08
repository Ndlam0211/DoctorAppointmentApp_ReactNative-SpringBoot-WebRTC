import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useCallback, useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDoctorById } from "@/api/doctors";
import { COLORS } from "@/constants/Colors";
import BackHeader from "@/components/header/BackHeader";
import DoctorCard from "@/components/doctors/DoctorCard";
import Button from "@/components/button/Button";
import AppointmentSlot from "@/components/appointments/AppointmentSlot";
import { usePreventRemove } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { useDispatch } from "react-redux";
import { createAppoinment } from "@/api/appointment";
import { setAppointment } from "@/store/screens/appointment";

interface AppointmentProps {
  doctorId?: string;
}

type PatientField = "name" | "phoneNumber" | "age";

const BookAppointment: React.FC<AppointmentProps> = ({ doctorId }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [formError, setFormError] = useState("");
  const [isPatientDetail, setIsPatientDetail] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedRemindTime, setSelectedRemindTime] = useState(0);

  const [appointmentDetails, setAppointmentDetails] = useState({
    patient: { name: "", phoneNumber: "", age: "" },
    slot: { 'time': "", 'date': "", 'reminder':"" },
  });

  const mutation = useMutation({
    mutationFn: createAppoinment,
    onSuccess:(data) => {
      dispatch(setAppointment(data));
      setDisplayModal(true);
    },
    onError:(err) => {
      console.log(err);
    }
  })

  usePreventRemove(isPatientDetail, ({ data }) => {
    if (isPatientDetail) {
      setIsPatientDetail(false);
    } else {
      navigation.dispatch(data.action);
    }
  });

  const onPressNext = useCallback(() => {
    const { name, age, phoneNumber } = appointmentDetails.patient;

    if(isPatientDetail) {
      // setDisplayModal(true);
      mutation.mutate(appointmentDetails);
    }else {
      if (name && age && phoneNumber.length === 10) {
        setFormError("");
        setIsPatientDetail(true);
      } else {
        setFormError("Please fill out the above fields.");
      }
    }

  }, [appointmentDetails?.patient, isPatientDetail ]);

  const onChangeTextField = useCallback(
    (name: PatientField, value: string) => {
      if (formError) setFormError("");
      setAppointmentDetails((prev) => ({
        ...prev,
        patient: {
          ...prev.patient,
          [name]: value,
        },
      }));
    },
    [formError]
  );

  const onChangeHandler = useCallback((name, value) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        [name]: value,
      },
    }));
  },[])

  const { data } = useQuery({
    queryKey: ["doctorById"],
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
          <DoctorCard
            {...data}
            style={styles.doctorCard}
            imageStyle={styles.doctorImage}
            contentStyle={styles.contentStyle}
          />

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
        {formError !== "" && <Text style={styles.errorText}>{formError}</Text>}
        <Button
          onPress={onPressNext}
          style={{ backgroundColor: COLORS.PRIMARY }}
          label={isPatientDetail ? "Set Appointment" : "Next"}
        />
      </View>

      <ConfirmationModal
        modalText={`You booked an appointment with ${data?.name} on ${appointmentDetails?.slot?.date}, at ${appointmentDetails?.slot?.time}.`}
        onClose={() => setDisplayModal(false)}
        visible={displayModal}
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
    flex:0,
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
