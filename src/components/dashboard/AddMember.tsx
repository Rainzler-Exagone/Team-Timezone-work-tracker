import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useTeamStore from "@/store/teamStore";
import { MemberType } from "@/types/teamTypes";
import { displayRealTimeTime, getLocalWorkHours, getWorkStatus } from "@/utils/timeUtils";
import { v4 as uuidv4 } from 'uuid';

const generateUUID = () => uuidv4();

// Form validation schema
const memberSchema = z.object({
  id: z.string().default(generateUUID),
  name: z.string().min(2, "Name is required"),
  timezone: z.string().min(1, "Select a timezone"),
  contractType: z.enum(["full_time", "part_time"]),
  workingHours: z.object({
    From: z.string().min(1, "Start time is required"),
    To: z.string().min(1, "End time is required"),
  }),
  LocalWorkHours: z.object({
    From: z.string().min(1, "Start time is required"),
    To: z.string().min(1, "End time is required"),
  }),
    // Status: z.string(),
    currentTime: z.string(),
});

export default function AddMember() {
  const [open, setOpen] = useState(false);
   const {addMember} = useTeamStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      contractType: "full_time",
      workingHours: { From: "09:00", To: "17:00" },
    },
  });

  const selectedContract = watch("contractType");
  const selectedTimezone = watch("timezone");
 console.log(selectedTimezone)
  useEffect(() => {
    if (selectedTimezone) {
      const workingHours = watch("workingHours");
      const { startTime, endTime } = getLocalWorkHours(  workingHours.From,workingHours.To, selectedTimezone);
      setValue("LocalWorkHours", { From: startTime, To: endTime });
      // setValue("currentTime", displayRealTimeTime(selectedTimezone));
    }
    
  }, [selectedTimezone,setValue,watch]);
  // Automatically set working hours based on contract type
  useEffect(() => {
    if (selectedContract === "full_time") {
      setValue("workingHours", { From: "09:00", To: "17:00" });
    } else {
      setValue("workingHours", { From: "", To: "" });
    }
  }, [selectedContract, setValue]);

  const onSubmit = (data:MemberType) => {
    setOpen(false);
    addMember(data) // Close dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <Label>Name</Label>
            <Input {...register("name")} placeholder="Enter member name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Timezone Select */}
          <div>
            <Label>Timezone</Label>
            <Select onValueChange={(value) => setValue("timezone", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">New York (EST)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
            {errors.timezone && <p className="text-red-500 text-sm">{errors.timezone.message}</p>}
          </div>

          {/* Contract Type Select */}
          <div>
            <Label>Contract Type</Label>
            <Select onValueChange={(value:any) => setValue("contractType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
              </SelectContent>
            </Select>
            {errors.contractType && <p className="text-red-500 text-sm">{errors.contractType.message}</p>}
          </div>

          {/* Working Hours */}
          <div>
            <Label>Working Hours</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>From</Label>
                <Input type="time" {...register("workingHours.From")} />
                {errors.workingHours?.From && (
                  <p className="text-red-500 text-sm">{errors.workingHours.From.message}</p>
                )}
              </div>
              <div>
                <Label>To</Label>
                <Input type="time" {...register("workingHours.To")} />
                {errors.workingHours?.To && (
                  <p className="text-red-500 text-sm">{errors.workingHours.To.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">Add Member</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
