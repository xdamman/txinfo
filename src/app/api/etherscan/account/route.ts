import chains from "@/chains.json";
import type { ChainConfig } from "@/types/index.d.ts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain");
  const chainConfig: ChainConfig = chains[chain as keyof typeof chains];
  const apikey = process.env[`${chain?.toUpperCase()}_ETHERSCAN_API_KEY`];

  if (!apikey) {
    console.error("No API key found for", chainConfig.explorer_api);
    console.error(
      "Please set the API key in the .env file",
      `${chain?.toUpperCase()}_ETHERSCAN_API_KEY`
    );
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const apicall = `${chainConfig.explorer_api}/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apikey}`;
  const response = await fetch(apicall);
  const data = await response.json();
  if (data.status === "1") {
    return Response.json(data);
  }
  return Response.json(
    { error: "Failed to fetch contract info" },
    { status: 500 }
  );
}
