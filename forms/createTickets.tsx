import { FormProvider, useForm, useFieldArray } from "react-hook-form";
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
    // @dev Used for testing
    defaultValues: {
      address: "1 Bob street",
      description: "A follow along painting session with Bob Ross",
      eventDate: "2022-03-17",
      eventEndTime: "16:16",
      eventStartTime: "14:18",
      price: "2",
      quantity: "200",
      title: "Painting With Bob Ross",
      venue: "Bobs Gaff",
      category: "Talk",
      genre: "Instructional Painting",
      blockChainId: "BBRS",
      stakeholders: ["0x19EBCB3E13501B8850f3A5f9904B6A6008Bd75E2"],
      stake: ["100"],
    },
  });

  const {
    reset,
    formState: { errors },
    watch,
  } = form;

  const {
    remove: removeStakeholder,
    fields: stakeholderFields,
    append: appendStakeholder,
  } = useFieldArray({
    control: form.control,
    name: "stakeholders",
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onCreateTickets)}>
        <div className="rounded-md bg-slate-400 p-5">
          <div className="grid grid-cols-2 flex-wrap gap-2">
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
                name="venue"
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
            <div className="flex gap-2">
              <div className="w-1/2">
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
              </div>
              <div className="w-1/2">
                <Field helpText="Add the number of tickets for sale.">
                  <Input
                    type="number"
                    min="1"
                    name="quantity"
                    label="Tickets for sale"
                    placeholder="250"
                    error={errors.title?.message}
                  />
                </Field>
              </div>
            </div>
            <Field helpText="Add the date and time of the event.">
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Input
                    type="date"
                    name="eventDate"
                    label="Event Date"
                    error={errors.title?.message}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    type="time"
                    name="eventStartTime"
                    label="Start time"
                    error={errors.title?.message}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    type="time"
                    name="eventEndTime"
                    label="End time"
                    error={errors.title?.message}
                  />
                </div>
              </div>
            </Field>
            <div>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <Field helpText="e.g gig, talk, festival, clubnight, arts">
                    <Input
                      name="category"
                      label="Category"
                      placeholder="Talk"
                      error={errors.title?.message}
                    />
                  </Field>
                </div>
                <div className="w-1/3">
                  <Field helpText="e.g rock, history, painting, cinema">
                    <Input
                      name="genre"
                      label="Genre"
                      placeholder="Instructional"
                      error={errors.title?.message}
                    />
                  </Field>
                </div>
                <div className="w-1/3">
                  <Field helpText="Add a 4 character ID for the event.">
                    <Input
                      name="blockChainId"
                      label="Identifier"
                      placeholder="EVNT"
                      error={errors.title?.message}
                      maxLength={4}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-4/5">
                <Field helpText="Add stakeholders in the event eg. artist, venue, promoter">
                  <Input
                    name="stakeholders"
                    label="Add Stakeholders"
                    placeholder="0x19EBCB3E13501B8850f3A5f9904B6A6008Bd75E2"
                    error={errors.title?.message}
                  />
                </Field>
              </div>
              <div className="w-1/5">
                <Field helpText="Add the share percentage.">
                  <Input
                    type="number"
                    min="0"
                    name="stake"
                    label="Stake"
                    placeholder="100"
                    error={errors.title?.message}
                  />
                </Field>
              </div>
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
