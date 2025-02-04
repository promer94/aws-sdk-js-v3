import { checkExceptions, createWaiter, WaiterConfiguration, WaiterResult, WaiterState } from "@aws-sdk/util-waiter";

import { DescribeAssetCommand, DescribeAssetCommandInput } from "../commands/DescribeAssetCommand";
import { IoTSiteWiseClient } from "../IoTSiteWiseClient";

const checkState = async (client: IoTSiteWiseClient, input: DescribeAssetCommandInput): Promise<WaiterResult> => {
  let reason;
  try {
    const result: any = await client.send(new DescribeAssetCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.assetStatus.state;
      };
      if (returnComparator() === "ACTIVE") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e) {}
    try {
      const returnComparator = () => {
        return result.assetStatus.state;
      };
      if (returnComparator() === "FAILED") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e) {}
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
};
/**
 *
 *  @deprecated Use waitUntilAssetActive instead. waitForAssetActive does not throw error in non-success cases.
 */
export const waitForAssetActive = async (
  params: WaiterConfiguration<IoTSiteWiseClient>,
  input: DescribeAssetCommandInput
): Promise<WaiterResult> => {
  const serviceDefaults = { minDelay: 3, maxDelay: 120 };
  return createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
/**
 *
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeAssetCommand for polling.
 */
export const waitUntilAssetActive = async (
  params: WaiterConfiguration<IoTSiteWiseClient>,
  input: DescribeAssetCommandInput
): Promise<WaiterResult> => {
  const serviceDefaults = { minDelay: 3, maxDelay: 120 };
  const result = await createWaiter({ ...serviceDefaults, ...params }, input, checkState);
  return checkExceptions(result);
};
