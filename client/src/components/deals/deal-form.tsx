import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDealSchema, type InsertDeal } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DealFormProps = {
  onSubmit: (data: InsertDeal) => void;
  defaultValues?: Partial<InsertDeal>;
};

const QUARTERS = [
  "Q1/2023", "Q2/2023", "Q3/2023", "Q4/2023",
  "Q1/2024", "Q2/2024", "Q3/2024", "Q4/2024",
  "Q1/2025", "Q2/2025", "Q3/2025", "Q4/2025"
];

const STATUSES = ["Done", "Progress", "Stuck"];
const PRIORITIES = ["Low", "Medium", "High"];
const AREAS = [
  "Kon Tum", "Phú Yên", "Hồ Chí Minh", "Hà Nội", "Bình Định",
  "Kiên Giang", "Đồng Nai", "Vũng Tàu"
];

const statusColors = {
  Done: "text-green-600",
  Progress: "text-blue-600",
  Stuck: "text-red-600"
};

const priorityColors = {
  Low: "text-green-600",
  Medium: "text-yellow-600",
  High: "text-red-600"
};

export default function DealForm({ onSubmit, defaultValues }: DealFormProps) {
  const form = useForm<InsertDeal>({
    resolver: zodResolver(insertDealSchema),
    defaultValues: {
      accountName: defaultValues?.accountName || "",
      dealName: defaultValues?.dealName || "",
      status: defaultValues?.status || "Progress",
      priority: defaultValues?.priority || "Medium",
      quarter: defaultValues?.quarter || "Q1/2024",
      area: defaultValues?.area || "Hồ Chí Minh",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dealName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter deal name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className={statusColors[status as keyof typeof statusColors]}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem 
                      key={priority} 
                      value={priority}
                      className={priorityColors[priority as keyof typeof priorityColors]}
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quarter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quarter</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {QUARTERS.map((quarter) => (
                    <SelectItem key={quarter} value={quarter}>
                      {quarter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {defaultValues ? "Update Deal" : "Create Deal"}
        </Button>
      </form>
    </Form>
  );
}