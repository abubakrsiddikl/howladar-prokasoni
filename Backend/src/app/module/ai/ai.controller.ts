import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { GoogleGenAI } from "@google/genai";


const postAI = catchAsync(async (req: Request, res: Response) => {
 const ai = new GoogleGenAI({});

 const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "AI post created successfully",
    data: {},
  });
});

export const AIController = {
  postAI,
};
