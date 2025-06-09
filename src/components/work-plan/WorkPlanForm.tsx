"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  officeAssignment: z.string(),
  daysOfEngagement: z.number().min(1),
  schedule: z.string(),
  generalObjective: z.string().min(1),
});

type WorkPlanFormData = z.infer<typeof formSchema>;

export default function WorkPlanForm({isOpen}: {isOpen: boolean}) {
  const [isOpenForm, setIsOpenForm] = useState(isOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkPlanFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "DSWD",
      officeAssignment: "KALAHI-CIDSS",
      daysOfEngagement: 50,
      schedule: "8-12, 1-5PM",
      generalObjective: "",
    },
  });

  const onSubmit = (data: WorkPlanFormData) => {
    console.log("Submitted Data:", data);
    // Send to API or trigger toast
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className={`shadow-lg bg-white dark:bg-gray-800 hidden sm:block`}>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input {...register("companyName")} />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">{errors.companyName.message}</p>
                )}
              </div>
              <div>
                <Label>Office Assignment</Label>
                <Input {...register("officeAssignment")} />
              </div>
              <div>
                <Label>Days of Engagement</Label>
                <Input type="number" {...register("daysOfEngagement", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Work Schedule</Label>
                <Input {...register("schedule")} />
              </div>
            </div>

            <div>
              <Label>General Objective</Label>
              <Textarea
                rows={4}
                placeholder="Describe the main goal of this work plan..."
                {...register("generalObjective")}
              />
              {errors.generalObjective && (
                <p className="text-red-500 text-sm">{errors.generalObjective.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Save Work Plan
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
