import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<string, string> = { active: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700", transferred: "bg-blue-100 text-blue-700", surrendered: "bg-yellow-100 text-yellow-700" };

export default function BookingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: booking, isLoading } = useQuery({ queryKey: ["booking", id], queryFn: () => axios.get("/api/application/bookings/" + id).then(r => r.data.data), enabled: !!id });
  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading booking details...</div>;
  if (!booking) return <div className="p-8 text-center text-gray-400">Booking not found.</div>;
  const primary = booking.Applicants?.find((a: any) => a.applicantType === "primary");
  const co = booking.Applicants?.find((a: any) => a.applicantType === "co");
  const totalPaid = (booking.Receipts || []).reduce((s: number, r: any) => s + Number(r.totalAmount || 0), 0);
  const totalDemand = (booking.Demands || []).filter((d: any) => d.status === "pending").reduce((s: number, d: any) => s + Number(d.totalAmount || 0), 0);
  return (
    <div>
      <PageHeader title={"Booking: " + booking.registrationNo} subtitle={booking.Project?.name} actions={<Link href={"/application/booking/edit?id=" + id}><Button size="sm" className="bg-orange-500 hover:bg-orange-600">Edit Booking</Button></Link>} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-300">Booking Info</span>
              <span className={"px-2 py-0.5 rounded text-xs font-medium " + (STATUS_COLORS[booking.status] || "bg-gray-100")}>{booking.status}</span>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[["Registration No.", booking.registrationNo], ["Form No.", booking.formNo || "-"], ["Booking Date", booking.bookingDate], ["Unit", booking.Unit?.unitNo || "-"], ["Payment Plan", booking.PaymentPlan?.name || "-"], ["Basic Price", "Rs." + Number(booking.basicPrice || 0).toLocaleString("en-IN")], ["Per Sq.ft", "Rs." + Number(booking.perSqft || 0).toLocaleString("en-IN")], ["Total Cost", "Rs." + Number(booking.totalCost || 0).toLocaleString("en-IN")]].map(([l, v]) => <div key={l as string}><div className="text-gray-400 mb-0.5">{l}</div><div className="font-semibold text-slate-700">{v}</div></div>)}
            </div>
          </div>
          {primary && (
            <div className="bg-white rounded border shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">Primary Applicant</span></div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[["Name", (primary.salutation || "") + " " + primary.firstName + " " + (primary.lastName || "")], ["PAN", primary.panNo || "-"], ["Mobile", primary.ApplicantAddresses?.[0]?.mobile1 || "-"], ["Email", primary.email1 || "-"], ["DOB", primary.dob || "-"], ["Aadhaar", primary.aadhaarNo || "-"]].map(([l, v]) => <div key={l as string}><div className="text-gray-400 mb-0.5">{l}</div><div className="font-semibold text-slate-700">{v}</div></div>)}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[{ l: "Total Paid", v: "Rs." + totalPaid.toLocaleString("en-IN"), cls: "bg-green-50 border-green-200" }, { l: "Pending Demands", v: "Rs." + totalDemand.toLocaleString("en-IN"), cls: "bg-red-50 border-red-200" }].map(s => <div key={s.l} className={"rounded border p-3 text-center " + s.cls}><div className="text-base font-bold text-slate-700">{s.v}</div><div className="text-xs text-gray-400 mt-0.5">{s.l}</div></div>)}
          </div>
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">Recent Receipts</span></div>
            <div className="divide-y">{(booking.Receipts || []).slice(0, 6).map((r: any) => <div key={r.id} className="px-3 py-2 text-xs flex justify-between items-center"><span className="font-medium">{r.receiptNo}</span><span className="text-orange-600 font-semibold">Rs.{Number(r.totalAmount).toLocaleString("en-IN")}</span></div>)}</div>
          </div>
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">Pending Demands</span></div>
            <div className="divide-y">{(booking.Demands || []).filter((d: any) => d.status === "pending").slice(0, 6).map((d: any) => <div key={d.id} className="px-3 py-2 text-xs flex justify-between"><span>{d.dueDate || d.demandDate}</span><span className="text-red-500 font-semibold">Rs.{Number(d.totalAmount).toLocaleString("en-IN")}</span></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
