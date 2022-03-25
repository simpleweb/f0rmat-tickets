import { FormProvider, useForm } from "react-hook-form";
import { Field, Input, TextArea, Button } from "../components";

interface CreateTicketsFormProps {
  isLoading: boolean;
  onCreateTickets: (data: TicketData) => void;
  requiredFilesAdded: boolean;
}

export default function CreateTicketsForm({
  isLoading,
  onCreateTickets,
  requiredFilesAdded = false,
}: CreateTicketsFormProps) {
  const form = useForm<TicketData>({
    defaultValues: {
      //Title: "Painting with Bob Ross",
      //   track_name: "Builder",
      //   track_description: "Can you fix it?",
      //   symbol: "BOB",
      //   salePrice: 0.002,
      //   quantity: 123,
      //   royalitiesPercentage: 100
    },
  });
  const {
    reset,
    formState: { errors },
    watch,
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onCreateTickets)}>
        <div className="bg-slate-400 p-2">
          <div className="grid grid-cols-2 gap-2">
            <Field helpText="Add a title for the event.">
              <Input
                name="title"
                label="Event Title"
                placeholder="Painting with Bob Ross"
                error={errors.title?.message}
              />
            </Field>
            <Field helpText="Add a venue name for the event.">
              <Input
                name="Venue"
                label="Venue Name"
                placeholder="Bobs gaff"
                error={errors.title?.message}
              />
            </Field>
            <Field helpText="Add a title for the event.">
              <TextArea
                name="description"
                label="Event Description"
                placeholder="A follow along painting session with Bob Ross..."
                error={errors.title?.message}
              />
            </Field>
            <Field helpText="Add the venues address.">
              <TextArea
                name="address"
                label="Venue Address"
                placeholder="1 Bob street"
                error={errors.title?.message}
              />
            </Field>
            <Field helpText="Add the price of a ticket.">
              <Input
                type="number"
                min="0"
                name="price"
                label="Ticket Price"
                placeholder="0.75"
                error={errors.title?.message}
              />
            </Field>
            <Field helpText="Add the number of tickets for sale.">
              <Input
                type="number"
                min="1"
                name="ticketNo"
                label="Tickets for sale"
                placeholder="250"
                error={errors.title?.message}
              />
            </Field>
            <Field helpText="Add the date of the event.">
              <Input
                type="date"
                name="eventDate"
                label="Date of the event"
                error={errors.title?.message}
              />
            </Field>
            <div className="flex gap-3">
              <Field helpText="Add the start time of the event.">
                <Input
                  type="time"
                  name="eventStartTime"
                  label="Start time"
                  error={errors.title?.message}
                />
              </Field>
              <Field helpText="Add the end time of the event.">
                <Input
                  type="time"
                  name="eventEndTime"
                  label="End time"
                  error={errors.title?.message}
                />
              </Field>
            </div>
          </div>
        </div>
        <br></br>
        <Field>
          <Button isLoading={isLoading} disabled={!requiredFilesAdded}>
            Create Tickets
          </Button>
        </Field>
      </form>
    </FormProvider>
  );
}
