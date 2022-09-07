import {
  NotifiClient,
  NotifiEnvironment,
  createAxiosInstance,
} from "@notifi-network/notifi-node";
import axios from "axios";
import { config } from "dotenv";

config({ path: ".env" });

const { SID, SECRET, TOPIC, NODE_IP, POOL_ID } = process.env;

const env: NotifiEnvironment = "Development";
const axiosInstance = createAxiosInstance(axios, env);
const client = new NotifiClient(axiosInstance);

const getMyPoolData = (pool: any) => pool.account_id === POOL_ID;


function yoctoToNear(yoctoNear: number) {
  return Math.round(yoctoNear / 10e23) || "??";
}


async function checkAllValidator(nodeip?: string) {
  const url = "http://" + nodeip + ":3030"
  const data = {
    jsonrpc: "2.0",
    id: "dontcare",
    method: "validators",
    params: [null],
  };
  const response = await axios.post(url, data);
  return response.data;
}

async function bootstrap() {
  try {
    const { token } = await client.logIn({
      sid: SID as string,
      secret: SECRET as string,
    });

    const { result } = await checkAllValidator(NODE_IP);

    const myValidator = result.current_validators?.find(getMyPoolData);

    await client.sendBroadcastMessage(token, {
      topicName: TOPIC as string,
      variables: [
        {
          key: "subject",
          value: `The validator ${POOL_ID} current stake is: ${yoctoToNear(
            myValidator?.stake
          )} Near`,
        },
        {
          key: "message",
          value: "This is my first stake war!!!",
        },
      ],
    });
  } catch (error: any) {
  }
};

bootstrap();
