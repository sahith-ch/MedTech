"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import { ScrollArea } from "../ui/scroll-area";

interface ProfileProps {
  id: string | undefined;
}
const UpcomingAppointments = ({ id }: ProfileProps) => {
  const [data, setData] = useState<any>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchAppointment = () => {
    startTransition(async () => {
      try {
        const data = await fetch("/api/v1/patients/dashboard/upcomming-appoinments",{
          method:"POST",
          body:JSON.stringify({userId:id})
        });
        const result = await data.json();
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
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
            href={"/dashboard/appointment"}
          >
            View all
            <FaAngleRight />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
        {data?.length > 0 ? (
          <div className=" flex flex-col gap-4">
            {data?.map((appointment: any, index: number) => (
              <div key={appointment.id} className="flex items-center gap-2">
                <span className=" font-bold">{++index}.</span>
                <div className="h-10 w-10 bg-primary rounded-full" />
                <div>
                  <div className="text-sm font-medium">
                    {appointment?.doctorName}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
