"use client";
import React, {
  startTransition,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import { getUpcomingAppointment } from "@/actions/dashboard/getUpcomingAppointment";
import { Appointment } from "@prisma/client";

interface ProfileProps {
  id: string | undefined;
}
const UpcomingAppointments = ({ id }: ProfileProps) => {
  const [data, setData] = useState<Appointment[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchAppointment = () => {
    startTransition(() => {
      getUpcomingAppointment(id || "")
        .then((appointments) => {
          if (appointments) {
            setData(appointments);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    });
  };

  useEffect(() => handleFetchAppointment(), []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Card className="col-span-6  lg:col-span-2">
      <CardHeader className="p-3">
        <div className="flex justify-between">
          <h1 className="text-lg lg:text-[1.4vw] font-semibold">
            Upcoming Appointments
          </h1>
          <Link
            className=" text-sm text-primary font-medium gap-1 flex items-center hover:underline"
            href={"#"}
          >
            View all
            <FaAngleRight />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className=" flex flex-col gap-4">
            {data.map((appointment,index) => (
              <div key={appointment.id} className="flex items-center gap-2">
                <span className=" font-bold">{++index}.</span>
                  <div className="h-10 w-10 bg-primary rounded-full" />
                  <div>
                    <div className="text-sm font-medium">
                      {appointment?.email}
                    </div>
                    <div className="text-[10px] text-primary">
                      {formatDate(appointment.date)}
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-primary">
              You have no upcoming appointments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
