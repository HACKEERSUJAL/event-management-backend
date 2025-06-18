import { FilterQuery } from "mongoose";
import { Event } from "../models/event.model";
import { EventType } from "../types/event.type";

export const _addEvent = async (data: Partial<EventType>) => {
  try {
    const addEvent = await Event.create(data);
    return await addEvent.save();
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const _getEvents = async (
  categories: string[] = [],
  startDate: string,
  endDate: string,
  page: number,
  pageSize: number
): Promise<EventType | {}> => {
  const validCategories = categories.filter((cat) => cat.length > 0);
  const filter: FilterQuery<EventType> = {};

  if (validCategories.length > 0) {
    filter.categories = { $in: validCategories };
  }
  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }
  try {
    const _getEvents = await Event.find(filter)
      .populate(["categories"])
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return _getEvents;
  } catch (error: any) {
    console.log("Error in getting events in service", error);
    throw error;
  }
};

export const _getEventById = async (id: string) => {
  try {
    const _getEventById = await Event.findById(id);
    return _getEventById;
  } catch (error: any) {
    console.log("Error in getting event by id in service", error);
    throw error;
  }
};

export const _updateEvent = async (id: string, data: Partial<EventType>) => {
  try {
    const updateEvent = await Event.findByIdAndUpdate(id, data, { new: true });
    return updateEvent;
  } catch (error: any) {
    console.log("Error in updating event in service", error);
    throw error;
  }
};

export const _deleteEventById = async (id: string) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    return deletedEvent;
  } catch (error: any) {
    console.log("Error in delete event service");
    throw error;
  }
};
