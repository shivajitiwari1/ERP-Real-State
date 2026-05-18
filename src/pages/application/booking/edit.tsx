import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditBookingFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const qc = useQueryClient();
  const { data: booking, isLoading } = useQuery({ queryKey: ["booking-edit", id], queryFn: () => axios.get("/api/application/bookings/" + id).then(r => r.data.data), enabled: !!id });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { register, handleSubmit, reset } = useForm<any>();
  useEffect(() => { if (booking) reset({ bookingDate: booking.bookingDate, formNo: booking.formNo, remarks: booking.remarks, basicPrice: booking.basicPrice, perSqft: booking.perSqft, inauguralDiscount: booking.inauguralDiscount, companyDiscount: booking.companyDiscount }); }, [booking]);
  const save = useMutation({
    mutationFn: (d: any) => axios.put("/api/application/bookings", { id: Number(id), ...d }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["booking-edit"] }); alert("Booking updated!"); router.push("/application/booking/" + id); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!booking) return <div className="p-8 text-center text-gray-400">Booking not found.</div>;
  const primary = booking.Applicants?.find((a: any) => a.applicantType === "primary");
  return (
    <div>
      <PageHeader title={"Edit Booking: " + booking.registrationNo} subtitle={booking.Project?.name + " · " + (primary?.firstName || "") + " " + (primary?.lastName || "")} />
      <div className="max-w-2xl">
        <div className="bg-white p-4 rounded border shadow-sm">
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Booking Date</Label><Input type="date" {...register("bookingDate")} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Form No.</Label><Input {...register("formNo")} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Basic Price (Rs.)</Label><Input type="number" step="0.01" {...register("basicPrice")} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Per Sq.ft (Rs.)</Label><Input type="number" step="0.01" {...register("perSqft")} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Inaugural Discount</Label><Input type="number" step="0.01" {...register("inauguralDiscount")} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Company Discount</Label><Input type="number" step="0.01" {...register("companyDiscount")} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div><Label className="text-xs">Remarks</Label><Input {...register("remarks")} className="mt-1 h-9 text-sm" /></div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Update Booking</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
