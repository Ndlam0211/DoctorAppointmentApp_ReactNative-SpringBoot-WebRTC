const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    appointments: []
}

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        setAppointment: (state, action) => {
            const data = [...state.appointments,action.payload];
            return {
                ...state,
                appointments: data
            }
        },
        resetAppointment: (state,action) => {
            state.appointments = initialState.appointments;
        },
        updateAppointment: (state, action) => {
            return {
                ...state,
                appointments: state.appointments.map((appointment) => {
                    if(appointment.id === action?.payload.id){
                        return action.payload;
                    } else {
                        return appointment;
                    }
                })
            }
        }
    }
})

export const { setAppointment, resetAppointment, updateAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;