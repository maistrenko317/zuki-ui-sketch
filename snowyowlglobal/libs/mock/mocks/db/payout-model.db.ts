import {PayoutModel} from "@snowl/base-app/model";
import {randomInt} from "@snowl/base-app/util";

const payoutModels: PayoutModel[] = [
  {
    active: true,
    createDate: new Date("2018-06-21T20:36:04.000Z"),
    payoutModelRounds: [
      {
        description: "1st Place Winner",
        sortOrder: 0,
        payoutModelId: 8,
        startingPlayerCount: 1,
        eliminatedPlayerCount: 1,
        eliminatedPayoutAmount: 1000000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "2nd Place Winner",
        sortOrder: 1,
        payoutModelId: 8,
        startingPlayerCount: 2,
        eliminatedPlayerCount: 1,
        eliminatedPayoutAmount: 100000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 3 - 4",
        sortOrder: 2,
        payoutModelId: 8,
        startingPlayerCount: 4,
        eliminatedPlayerCount: 2,
        eliminatedPayoutAmount: 50000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 5 - 8",
        sortOrder: 3,
        payoutModelId: 8,
        startingPlayerCount: 8,
        eliminatedPlayerCount: 4,
        eliminatedPayoutAmount: 25000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 9 - 16",
        sortOrder: 4,
        payoutModelId: 8,
        startingPlayerCount: 16,
        eliminatedPlayerCount: 8,
        eliminatedPayoutAmount: 10000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 17 - 32",
        sortOrder: 5,
        payoutModelId: 8,
        startingPlayerCount: 32,
        eliminatedPlayerCount: 16,
        eliminatedPayoutAmount: 5000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 33 - 64",
        sortOrder: 6,
        payoutModelId: 8,
        startingPlayerCount: 64,
        eliminatedPlayerCount: 32,
        eliminatedPayoutAmount: 1000,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 65 - 128",
        sortOrder: 7,
        payoutModelId: 8,
        startingPlayerCount: 128,
        eliminatedPlayerCount: 64,
        eliminatedPayoutAmount: 500,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 129 - 256",
        sortOrder: 8,
        payoutModelId: 8,
        startingPlayerCount: 256,
        eliminatedPlayerCount: 128,
        eliminatedPayoutAmount: 100,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 257 - 512",
        sortOrder: 9,
        payoutModelId: 8,
        startingPlayerCount: 512,
        eliminatedPlayerCount: 256,
        eliminatedPayoutAmount: 50,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 513 - 1,024",
        sortOrder: 10,
        payoutModelId: 8,
        startingPlayerCount: 1024,
        eliminatedPlayerCount: 512,
        eliminatedPayoutAmount: 40,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 1,025 - 2,048",
        sortOrder: 11,
        payoutModelId: 8,
        startingPlayerCount: 2048,
        eliminatedPlayerCount: 1024,
        eliminatedPayoutAmount: 35,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 2,049 - 4,096",
        sortOrder: 12,
        payoutModelId: 8,
        startingPlayerCount: 4096,
        eliminatedPlayerCount: 2048,
        eliminatedPayoutAmount: 30,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 4,097 - 8,192",
        sortOrder: 13,
        payoutModelId: 8,
        startingPlayerCount: 8192,
        eliminatedPlayerCount: 4096,
        eliminatedPayoutAmount: 25,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 8,193 - 16,384",
        sortOrder: 14,
        payoutModelId: 8,
        startingPlayerCount: 16384,
        eliminatedPlayerCount: 8192,
        eliminatedPayoutAmount: 20,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 16,385 - 32,768",
        sortOrder: 15,
        payoutModelId: 8,
        startingPlayerCount: 32768,
        eliminatedPlayerCount: 16384,
        eliminatedPayoutAmount: 15,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 32,769 - 65,536",
        sortOrder: 16,
        payoutModelId: 8,
        startingPlayerCount: 65536,
        eliminatedPlayerCount: 32768,
        eliminatedPayoutAmount: 12,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 65,537 - 131,072",
        sortOrder: 17,
        payoutModelId: 8,
        startingPlayerCount: 131072,
        eliminatedPlayerCount: 65536,
        eliminatedPayoutAmount: 10,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 131,073 - 262,144",
        sortOrder: 18,
        payoutModelId: 8,
        startingPlayerCount: 262144,
        eliminatedPlayerCount: 131072,
        eliminatedPayoutAmount: 0,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 262,145 - 524,288",
        sortOrder: 19,
        payoutModelId: 8,
        startingPlayerCount: 524288,
        eliminatedPlayerCount: 262144,
        eliminatedPayoutAmount: 0,
        category: "PHYSICAL",
        type: "CASH"
      },
      {
        description: "Winners 524,289 - 1,048,576",
        sortOrder: 20,
        payoutModelId: 8,
        startingPlayerCount: 1048576,
        eliminatedPlayerCount: 524288,
        eliminatedPayoutAmount: 0,
        category: "PHYSICAL",
        type: "CASH"
      }
    ],
    payoutModelId: 8,
    basePlayerCount: 1048576,
    entranceFeeAmount: 10,
    creatorId: 19,
    deactivatorId: 0,
    name: "$10 Payout Model - Shout 100"
  }
];

export function getRandomDbPayoutModel(): PayoutModel {
  const idx = randomInt(0, payoutModels.length - 1);

  return payoutModels[idx];
}
