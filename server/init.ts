import {connectToDatabase, registerPlayer, getPlayer, registerMinion, getMinion} from "./db";

const init_accounts = [
"0xda4596337e991f4ab478203bf05ac1af1cb2281c",
"0x58f39d505332f10460679c045a98c260dd10e7cc",
"0x50376c25f27967b647a2a43df8e6ee999e54e18b",
"0x61852e5e244b0b3792fa7369d73606e4b21024e3",
"0x5f82f1573d9d454f02326c8281eb7f055e46fabd",
"0xf113bd97e9700ad736c080e3602f08f012233d79",
"0x69ee4a9a55d1a1db9a719bd2efaf12c823b08fea",
"0xba254baa3d421ab8cb1eed5608371198be7cb293",
"0x22fee137743a7a4666eb56ce926bd3ca57f643e0",
"0xa27f5da4f98402be464e4bbe6f7b431b4c332e45",
]


async function init() {
    try {
        await connectToDatabase(true);
        for(var account of init_accounts) {
          await registerPlayer(account);
          let mid = await registerMinion(account, 0);
          let player = await getPlayer(account);
          console.log("new player registered:", player);
          let minion = await getMinion(mid);
          console.log("new minion registed:", minion);
        }
    } catch(error) {
        console.error("Database operation failed", error);
        process.exit();
    }
}

init().then(() => {process.exit()});
