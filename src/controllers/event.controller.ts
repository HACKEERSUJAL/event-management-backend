import { Request, Response } from "express";
import { HttpStatus } from "../utils/http-status";
import { response } from "../utils/response";
import { cloudinary } from "../utils/cloudinary";
import {
  _addEvent,
  _deleteEventById,
  _getEventById,
  _getEvents,
  _updateEvent,
} from "../services/event.service";
import { Event } from "../models/event.model";

export const createEventController = async (req: Request, res: Response) => {
  console.log("test");
  try {
    const { title, description, categories } = req.body;

    console.log(req.body);
    if (!req.file || !req.file.path) {
      return response(res, HttpStatus.BAD_REQUEST, {
        message: "Banner image is required",
        data: null,
        success: false,
      });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
    let event;
    try {
      event = await _addEvent({
        title,
        description,
        categories,
        banner: cloudinaryResult.secure_url,
        bannerPublicId: cloudinaryResult.public_id,
      });
    } catch (error: any) {
      return response(res, HttpStatus.BAD_REQUEST, {
        message: "failed to create event",
        success: false,
        data: null,
      });
    }
    return response(res, HttpStatus.CREATED, {
      message: "Event created successfully",
      data: event,
      success: true,
    });
  } catch (error: any) {
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: error.err,
      success: false,
      data: null,
    });
  }
};

export const getAllEventController = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string)
    : 10;
  const categoriesString = req?.query?.categories as string | "";
  const start = req?.query?.startDate as string | "";
  const end = req?.query?.endDate as string | "";
  const categories = categoriesString ? categoriesString.split(",") : [];
  const startDate = start ? start : "";
  const endDate = end ? end : "";
  try {
    const totalEvents: any = await Event.countDocuments();

    const events = await _getEvents(
      categories,
      startDate,
      endDate,
      page,
      pageSize
    );

    const totalPages = Math.ceil(totalEvents / pageSize);

    return response(res, HttpStatus.OK, {
      message: "Events retrieved successfully",
      data: {
        Items: events,
        currentPage: page,
        totalItems: totalEvents,
        totalPages: totalPages,
      },
      success: true,
    });
  } catch (error: any) {
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: error.message,
      success: false,
      data: null,
    });
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, categories } = req.body;
 
    const existingEvent = await _getEventById(id);
    if (!existingEvent) {
      return response(res, HttpStatus.NOT_FOUND, {
        message: "Event not found",
        success: false,
        data: null,
      });
    }

    if (existingEvent.createdBy.toString() !== (req as any).user.id) {
      return response(res, HttpStatus.FORBIDDEN, {
        message: "You are not allowed to update this event",
        success: false,
        data: null,
      });
    }

    let banner = existingEvent.banner;
    let bannerPublicId = existingEvent.bannerPublicId;

    if (req.file && req.file.path) {
      if (bannerPublicId) {
        await cloudinary.uploader.destroy(bannerPublicId);
      }

      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
      banner = cloudinaryResult.secure_url;
      bannerPublicId = cloudinaryResult.public_id;
    }

    const updatedEvent = await _updateEvent(id, {
      title,
      description,
      categories,
      banner,
      bannerPublicId,
    });
    console.log("updatedEvent", updatedEvent);
    return response(res, HttpStatus.OK, {
      message: "Event updated successfully",
      data: updatedEvent,
      success: true,
    });
  } catch (error: any) {
    console.error("Error updating event:", error);
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Failed to update event",
      success: false,
      data: error.message || null,
    });
  }
};

export const _deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingEvent = await _getEventById(id);
    if (!existingEvent) {
      return response(res, HttpStatus.NOT_FOUND, {
        message: "Event not found",
        success: false,
        data: null,
      });
    }
    if (existingEvent.bannerPublicId) {
      try {
        await cloudinary.uploader.destroy(existingEvent.bannerPublicId);
      } catch (error: any) {
        console.error("Error deleting banner:", error);
        throw error;
      }
    }
    if (existingEvent.createdBy.toString() !== (req as any).user.id) {
      return response(res, HttpStatus.FORBIDDEN, {
        message: "You are not authorized to delete this event",
        success: false,
        data: null,
      });
    }

    const destroyEvent = await _deleteEventById(id);

    return response(res, HttpStatus.OK, {
      message: "Event deleted successfully",
      success: true,
      data: destroyEvent,
    });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Failed to delete event",
      success: false,
      data: error.message || null,
    });
  }
};
