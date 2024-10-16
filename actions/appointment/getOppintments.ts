"use server"
import { db } from "@/lib/db";

export const getAllAppointment = async (id: string, role: string) => {
  try {
    if (typeof id !== 'string' || !id.trim()) {
      return { success: false, message: 'Invalid ID format' };
    }

    const appointments = await db.bookedAppointment.findMany({
      where: role === 'DOCTOR' ? { doctor_id: id } : { userId: id },
    });

    if (!appointments || appointments.length === 0) {
      return { success: true, message: "No appointments found for this user.", data: [] };
    }

    const uniqueAppointmentsMap = new Map();
    const statusPriority = { CONFIRMED: 1, COMPLETED: 2, NOT_CONFIRMED: 3, CANCELED: 4 };

    for (const appointment of appointments) {
      // Create a unique key using both doctor_id and userId
      const uniqueKey = `${appointment.doctor_id}-${appointment.userId}`;
      
      const existingAppointment = uniqueAppointmentsMap.get(uniqueKey);
      const currentPriority = statusPriority[appointment.status.toUpperCase()] || Infinity;
      const existingPriority = existingAppointment 
        ? (statusPriority[existingAppointment.status.toUpperCase()] || Infinity) 
        : Infinity;

      if (!existingAppointment || currentPriority < existingPriority) {
        uniqueAppointmentsMap.set(uniqueKey, appointment);
      }
    }

    const uniqueAppointments = Array.from(uniqueAppointmentsMap.values());
console.log("uniqueAppointments",uniqueAppointments);
console.log("ALLAppointments",appointments);

    return { 
      success: true, 
      data: appointments, 
      updatedData: uniqueAppointments 
    };

  } catch (err) {
    console.error("Error fetching appointments:", err);
    return { success: false, message: "Internal server error" };
  }
}; 