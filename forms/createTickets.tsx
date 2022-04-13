import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Field, Input, TextArea, Button, Select } from "../components";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { WalletState } from "@web3-onboard/core";
import { categories, genres } from "../constants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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
  const StakeholderSchema = {
    address: yup.string().required("Address is required"),
    stake: yup
      .number()
      .required("Stake is required")
      .typeError("Stake must be a number"),
  };

  const TicketSchema = yup.object().shape({
    title: yup.string().required(),
    venue: yup.string().required(),
    address: yup.string().required(),
    blockChainId: yup.string().required(),
    eventDate: yup.string().required("Enter the event date."),
    eventStartTime: yup.string().required("Start time cannot be empty"),
    eventEndTime: yup
      .string()
      .required("End time cannot be empty")
      .test("is-greater", "end time should be greater", function (value) {
        const { eventStartTime } = this.parent;
        return dayjs(value, "HH:mm").isAfter(dayjs(eventStartTime, "HH:mm"));
      }),
    price: yup.number().required().typeError("Sale price is required"),
    quantity: yup.number().required().typeError("quantity price is required"),
    stakeholders: yup
      .array()
      .of(yup.object().shape(StakeholderSchema))
      .required("Must have fields")
      .min(1, "Minimum of 1 stakeholder")
      .test("sum", "You must allocate 100%", (rows = []) => {
        const total = rows.reduce((total, row) => {
          return total + (row.stake || 0);
        }, 0);
        return total === 100;
      }),
  });
  const form = useForm<TicketData>({
    resolver: yupResolver(TicketSchema),
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

  if (genreFields.length == 0) {
    appendGenre("");
  }
  if (categoryFields.length == 0) {
    appendCategory("");
  }

  if (stakeholderFields.length == 0) {
    appendStakeholder({
      address: [wallet?.accounts[0].address],
      stake: ["100"],
    });
  }

  const {
    reset,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    const address = wallet?.accounts[0].address;
    if (address) {
      reset({
        stakeholders: [{ address, stake: 100 }],
      });
    }
  }, [wallet?.accounts[0].address]);

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onCreateTickets)}>
          <div className="border-t-2 border-b-2 border-slate-400 p-3">
            <p className="pb-3 text-2xl">Event Information</p>
            <div className="flex-wrap gap-2 lg:grid lg:grid-cols-2">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <Field
                    helpText="Add a title for the event."
                    error={errors.title?.message}
                  >
                    <Input
                      name="title"
                      label="Event Title"
                      placeholder="Painting with Bob Ross"
                    />
                  </Field>
                </div>
                <Field
                  helpText="Add a 4 character identifier for the event."
                  error={errors.blockChainId?.message}
                  className="col-span-1"
                >
                  <Input
                    name="blockChainId"
                    label="Identifier"
                    placeholder="EVNT"
                    maxLength={4}
                  />
                </Field>
              </div>
              <Field
                helpText="Add a venue name for the event."
                error={errors.venue?.message}
              >
                <Input
                  name="venue"
                  label="Venue Name"
                  placeholder="Bobs gaff"
                />
              </Field>
              <Field
                helpText="Add a description for the event."
                error={errors.description?.message}
              >
                <TextArea
                  name="description"
                  label="Event Description"
                  placeholder="A follow along painting session with Bob Ross..."
                />
              </Field>
              <Field
                helpText="Add the venues address."
                error={errors.address?.message}
              >
                <TextArea
                  name="address"
                  label="Venue Address"
                  placeholder="1 Bob street"
                />
              </Field>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <Field
                    helpText="Add the price of a ticket."
                    error={errors.price?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      label="Ticket Price"
                      placeholder="0.75"
                    />
                  </Field>
                </div>
                <div className="w-1/2">
                  <Field
                    helpText="Add the number of tickets for sale."
                    error={errors.quantity?.message}
                  >
                    <Input
                      type="number"
                      min="1"
                      name="quantity"
                      label="Tickets for sale"
                      placeholder="250"
                    />
                  </Field>
                </div>
              </div>
              <Field
                helpText="Add the date and time of the event."
                error={
                  errors.eventDate?.message ||
                  errors.eventStartTime?.message ||
                  errors.eventEndTime?.message
                }
              >
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="date"
                      name="eventDate"
                      min={dayjs().format("YYYY-MM-DD")}
                      label="Event Date"
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </div>
                  <div>
                    <Input
                      type="time"
                      name="eventStartTime"
                      label="Start time"
                    />
                  </div>
                  <div>
                    <Input type="time" name="eventEndTime" label="End time" />
                  </div>
                </div>
              </Field>
              <div className="mt-2 grid-cols-2 border-t-2 border-slate-400 pt-3 md:col-span-2 md:grid">
                <p className="pb-2 text-2xl">Tag the event</p>
                <div className="md:col-start-1">
                  {categoryFields.map((item, index) => {
                    return (
                      <div className="grid grid-cols-6 items-center">
                        <div className="col-span-5">
                          <Field>
                            <Select
                              name={`categories.${index}`}
                              label="Category"
                              placeholder="Talk"
                            >
                              <option>Select a Category</option>
                              {categories.map((category) => (
                                <option value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </Select>
                          </Field>
                        </div>
                        <div className="flex space-x-2 px-2 pt-5">
                          <div onClick={() => removeCategory(index)}>
                            <MinusCircleIcon className="h-6 w-6" />
                          </div>
                          <div onClick={() => appendCategory("")}>
                            <PlusCircleIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <br></br>

                <div className="pt-2 md:pt-5">
                  {genreFields.map((item, index) => {
                    return (
                      <div className="grid grid-cols-6 items-center">
                        <div className="col-span-5">
                          <Field>
                            <Select
                              name={`genres.${index}`}
                              label="Genre"
                              placeholder="Talk"
                            >
                              <option>Select Genre</option>
                              {genres.map((genre) => (
                                <option value={genre.value}>
                                  {genre.label}
                                </option>
                              ))}
                            </Select>
                          </Field>
                        </div>
                        <div className="flex space-x-2 px-2 pt-5">
                          <div onClick={() => removeGenre(index)}>
                            <MinusCircleIcon className="h-6 w-6" />
                          </div>
                          <div onClick={() => appendGenre("")}>
                            <PlusCircleIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <br></br>
              </div>
              <br></br>

              <div className="md:col-span-2">
                <p className="border-t-2 border-slate-400 pb-2 pt-3 text-2xl">
                  Split ticket revenue.
                </p>
                {stakeholderFields.map((item, index) => {
                  return (
                    <div key={index} className="mb-2 grid grid-cols-6 gap-2">
                      <div className="col-span-3 md:col-span-5">
                        <Field
                          error={
                            errors["stakeholders"]?.[index]?.address?.message
                          }
                          helpText="Add an ethereum address."
                        >
                          <Input
                            name={`stakeholders.${index}.address`}
                            label="Stakeholder wallet"
                            placeholder={wallet?.accounts[0].address}
                          />
                        </Field>
                      </div>
                      <div>
                        <div className="flex gap-2">
                          <div>
                            <Field
                              helpText="Add the stake percentage."
                              error={
                                errors["stakeholders"]?.[index]?.stake
                                  ?.message || errors?.stakeholders?.message
                              }
                            >
                              <Input
                                type="number"
                                min="1"
                                name={`stakeholders.${index}.stake`}
                                label="Stake"
                                placeholder="100"
                              />
                            </Field>
                          </div>
                          <div className="flex justify-center gap-2 ">
                            <div
                              className="pt-8"
                              onClick={() => {
                                if (stakeholderFields.length > 1)
                                  removeStakeholder(index);
                              }}
                            >
                              <MinusCircleIcon className="h-6 w-6" />
                            </div>
                            <div
                              className="pt-8"
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
            </div>
          </div>
          <br></br>
          <Field className="border-b-2 border-slate-400">
            <Button
              isLoading={isLoading}
              disabled={!requiredFilesAdded || isLoading}
            >
              Create Tickets
            </Button>
          </Field>
        </form>
        <br></br>
      </FormProvider>
    </div>
  );
}
