import { Request, Response } from "express";
import { PUBLIC_KEY } from "../config/index.js";
import {
  burnToken,
  mintTokens,
  sendNativeToken,
} from "../services/token.service.js";

const RESPONSE_HELIUS = {
  description:
    "CaHfSLGKiGhV7Yy1HEiPHS4iaXYdcZhnUXFPaw2fUZKN transferred 0.1 SOL to CSPoJGos3ueoi31tovEbTADcMceVgpGPmh4it2ts2GeA.",
  nativeTransfers: [
    {
      amount: 100000000,
      fromUserAccount: "CaHfSLGKiGhV7Yy1HEiPHS4iaXYdcZhnUXFPaw2fUZKN",
      toUserAccount: "CSPoJGos3ueoi31tovEbTADcMceVgpGPmh4it2ts2GeA",
    },
  ],
  signature:
    "5rQotsmeUUKcYL1yNXFu43TQv6GMo5QcKm6KeVmK4TY5VXBcG6UzXCMWHiJVSsTWfTwkH1NVZT55iCymdmaMtJfv",
};

export const helius = async (req: Request, res: Response): Promise<void> => {
  const helius_response = req.body;

  const incomingTransaction = helius_response.nativeTransfers.find(
    (t: any) => t.toUserAccount === PUBLIC_KEY
  );

  if (!incomingTransaction) {
    res.json({
      success: false,
      data: null,
      message: "No matching transfer",
    });
    return;
  }

  const fromAddress = incomingTransaction.fromUserAccount;
  const toAddress = incomingTransaction.toUserAccount;
  const amount = incomingTransaction.amount;

  const type = "received_native_sol";
  try {
    if (type === "received_native_sol") {
      await mintTokens(fromAddress, amount);
    } else {
      await burnToken(fromAddress, amount);
      await sendNativeToken(toAddress, amount);
    }
    res.send("Transaction successful");
  } catch (error) {
    console.error("Error processing transaction:", error);

    res.status(500).json({
      success: false,
      data: null,
      message: "Internal Server Error",
    });
  }
};
