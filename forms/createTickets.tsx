import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Field, Input, TextArea, Button, Select } from "../components";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { WalletState } from "@web3-onboard/core";
import { categories, genres } from "../constants";

interface CreateTicketsFormProps {
  isLoading: boolean;
  onCreateTickets: (data: TicketData) => void;
  requiredFilesAdded: boolean;
  wallet: WalletState;
}

export default function CreateTicketsForm({
  isLoading,
  onCreateTickets,
  requiredFilesAdded = false,
  wallet,
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
      genre: "Instructional Painting",
      blockChainId: "BBRS",
      stakeholders: [
        { address: "0x19EBCB3E13501B8850f3A5f9904B6A6008Bd75E2", stake: "100" },
      ],
      categories: ["Gig"],
      genres: ["Rock"],
    },
  });

  const {
    remove: removeStakeholder,
    fields: stakeholderFields,
    append: appendStakeholder,
  } = useFieldArray({
    control: form.control,
    name: "stakeholders",
  });

  const {
    remove: removeCategory,
    fields: categoryFields,
    append: appendCategory,
  } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const {
    remove: removeGenre,
    fields: genreFields,
    append: appendGenre,
  } = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const {
    reset,
    formState: { errors },
    watch,
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onCreateTickets)}>
        <div className="rounded-md bg-slate-400 p-5">
          <div className="grid flex-wrap gap-2">
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
            <Field helpText="Add a 4 character identifier for the event.">
              <Input
                name="blockChainId"
                label="Blockchain Identifier"
                placeholder="EVNT"
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
              <div className="flex-wrap gap-3 md:flex lg:flex">
                <div className="grid grid-cols-2 gap-3">
                  {categoryFields.map((item, index) => {
                    return (
                      <div className="col-span-2 flex gap-2">
                        <Field>
                          <Select
                            name={`categorys.${index}`}
                            label="Category"
                            placeholder="Talk"
                            error={
                              errors["categorys"]?.[index]?.trait_type?.message
                            }
                          >
                            {categories.map((category) => (
                              <option value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <div className="grid grid-cols-2 gap-2">
                          {index != 0 && (
                            <div
                              className="span-col-1 pt-8"
                              onClick={() => removeCategory(index)}
                            >
                              <MinusCircleIcon className="h-6 w-6" />
                            </div>
                          )}
                          <div
                            className="col-start-2 pt-8"
                            onClick={() => appendCategory(index)}
                          >
                            <PlusCircleIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="gap-3">
                  {genreFields.map((item, index) => {
                    return (
                      <div className="col-span-2 flex gap-2">
                        <Field>
                          <Select
                            name={`genres.${index}`}
                            label="Genre"
                            placeholder="Talk"
                            error={
                              errors["genres"]?.[index]?.trait_type?.message
                            }
                          >
                            {genres.map((genre) => (
                              <option value={genre.value}>{genre.label}</option>
                            ))}
                          </Select>
                        </Field>
                        <div className="grid grid-cols-2 gap-2">
                          {index != 0 && (
                            <div
                              className="span-col-1 pt-8"
                              onClick={() => removeGenre(index)}
                            >
                              <MinusCircleIcon className="h-6 w-6" />
                            </div>
                          )}
                          <div
                            className="col-start-2 pt-8"
                            onClick={() => appendGenre(index)}
                          >
                            <PlusCircleIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <br></br>
              <div>
                {stakeholderFields.length != 0 ? (
                  <div>
                    {stakeholderFields.map((item, index) => {
                      return (
                        <div key={index} className="flex gap-2">
                          <div className="w-4/6">
                            <Field>
                              <Input
                                name={`stakeholders.${index}.address`}
                                label="Add Stakeholders"
                                placeholder={wallet?.accounts[0].address}
                                error={
                                  errors["stakeholders"]?.[index]?.value
                                    ?.message
                                }
                              />
                            </Field>
                          </div>
                          <div className="w-2/6">
                            <div className="flex gap-2">
                              <div className="w-4/5">
                                <Field helpText="Add the share percentage.">
                                  <Input
                                    type="number"
                                    min="1"
                                    name={`stakeholders.${index}.stake`}
                                    label="Stake"
                                    placeholder="100"
                                    error={
                                      errors["stakeholders"]?.[index]?.value
                                        ?.message
                                    }
                                  />
                                </Field>
                              </div>
                              <div className="flex w-1/5 gap-2 ">
                                <div
                                  className="w-1/2 pt-8"
                                  onClick={() => removeStakeholder(index)}
                                >
                                  <MinusCircleIcon className="h-6 w-6" />
                                </div>
                                <div
                                  className="w-1/2 pt-8"
                                  onClick={() => appendStakeholder(index)}
                                >
                                  <PlusCircleIcon className="h-6 w-6" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Button
                    onClick={() =>
                      appendStakeholder({
                        address: "",
                        stake: undefined,
                      })
                    }
                  >
                    Add Stakeholders
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <Field>
          <Button
            isLoading={isLoading}
            disabled={!requiredFilesAdded || isLoading}
          >
            Create Tickets
          </Button>
        </Field>
      </form>
    </FormProvider>
  );
}
