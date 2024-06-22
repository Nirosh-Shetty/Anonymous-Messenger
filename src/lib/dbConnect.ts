import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export const dbConect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("alredy connnected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("database connected");
  } catch (error: any) {
    console.log("failed to connect Datbase", error.message);
    process.exit(1); //TODO: try 0,2
  }
};
