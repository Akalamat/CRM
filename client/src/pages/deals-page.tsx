import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import DealForm from "@/components/deals/deal-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

export default function DealsPage() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const { toast } = useToast();

  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/deals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Success",
        description: "Deal created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/deals/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      setSelectedDeal(null);
      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/deals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Success",
        description: "Deal deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePositionsMutation = useMutation({
    mutationFn: async (updates: { id: number; position: number }[]) => {
      await apiRequest("PATCH", "/api/deals/positions", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
    },
  });

  const onDragEnd = (result: any) => {
    if (!result.destination || !deals) return;

    const items = Array.from(deals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    updatePositionsMutation.mutate(updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deals</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <DealForm onSubmit={(data) => createDealMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Deal Name</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Quarter</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Droppable droppableId="deals">
            {(provided) => (
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {deals?.map((deal, index) => (
                  <Draggable
                    key={deal.id}
                    draggableId={deal.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <TableCell>
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>{deal.dealName}</TableCell>
                        <TableCell>{deal.accountName}</TableCell>
                        <TableCell>
                          <span className={statusColors[deal.status as keyof typeof statusColors]}>
                            {deal.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={priorityColors[deal.priority as keyof typeof priorityColors]}>
                            {deal.priority}
                          </span>
                        </TableCell>
                        <TableCell>{deal.quarter}</TableCell>
                        <TableCell>{deal.area}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Deal</DialogTitle>
                                </DialogHeader>
                                <DealForm
                                  defaultValues={deal}
                                  onSubmit={(data) =>
                                    updateDealMutation.mutate({ id: deal.id, data })
                                  }
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this deal?")) {
                                  deleteDealMutation.mutate(deal.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </div>
  );
}