/* eslint-disable functional/no-return-void */
import { Realtime, Types } from 'ably';
import fetch from 'node-fetch';

type Asset = {
  readonly player: {
    readonly firstName: string;
    readonly lastName: string;
    readonly name: string;
    readonly id: string;
    readonly ticker: string;
  };
  readonly ownedQuantity: number;
  readonly meanPrice: number;
  readonly invested: number;
  readonly divested: number;
  readonly freeShareValue: number;
  readonly currentValue: number;
  readonly lifetimePercentageGain: number;
  readonly lifetimeAbsoluteGain: number;
  readonly inTransitValue: number;
  readonly inTransitQuantity: number;
};

type Portfolio = {
  readonly userId: string;
  readonly invested: number;
  readonly divested: number;
  readonly currentValue: number;
  readonly freeShareValue: number;
  readonly lifetimePercentageGain: number;
  readonly lifetimeAbsoluteGain: number;
  readonly assets: readonly Asset[];
};

type Trade = {
  readonly timestamp: number;
  readonly quantity: number;
  readonly side: string;
  readonly price: number;
  readonly filledQuantity: number;
  readonly stringMpOrderId: string;
  readonly instrument: string;
};

type OrderBook = {
  readonly price: number;
  readonly buySide: readonly (readonly [number, number, number])[];
  readonly sellSide: readonly (readonly [number, number, number])[];
};

type PlayerInfo = {
  readonly firstName: string;
  readonly lastName: string;
  readonly name: string;
  readonly slug: string;
  readonly nationality: string;
  readonly id: string;
  readonly imageUrl: string;
  readonly currentTeam: {
    readonly id: number;
    readonly imageUrl: string;
    readonly modifiedAt: string;
    readonly name: string;
  };
  readonly ticker: string;
  readonly worldRanking: number;
  readonly releaseStatus: string;
  readonly tradingStartDate: string;
};

type OrderType = 'Limit' | 'Market';
type Side = 'Buy' | 'Sell';

type OrderRequest = {
  readonly orderType: OrderType; // Limit or Market
  readonly side: Side;
  readonly instrument: string;
  readonly quantity: number;
  readonly price: number; // Price always get sent to FE for order confirmation
};

type OrderResponse = {
  readonly createdAt: Date;
  readonly mpOrderId: number;
  readonly userId: string;
  readonly orderType: OrderType; // Limit or Market
  readonly side: Side;
  readonly instrument: string;
  readonly quantity: number;
  readonly price: number; // Price always get sent to FE for order confirmation
  readonly timeInForce: string;
  readonly expiryDate?: number;
  readonly accountId?: number;
  readonly commission: number;
  readonly filledQuantity: number;

  readonly meanPrice: number;
  readonly filled: boolean;
  readonly stringMpOrderId?: string;
  readonly ticker?: string;
  readonly reasonFailed?: string;
};

type CancelOrderRequest = {
  readonly Instrument: string      ;
	readonly StringMpOrderId: string ;
}

type Details = {
  readonly token: string;
  readonly clientId: string;
};

const createTradingClient = async (
  env: 'staging' | 'production' | 'sandbox',
  apiKey: string
): Promise<{
  readonly subscribeToPortfolio: (
    listener: (data: Portfolio) => void
  ) => Promise<void>;
  readonly subscribeToOrderBook: (
    id: string,
    listener: (data: OrderBook) => void
  ) => Promise<void>;
  readonly subscribeToOrders: (
    listener: (data: readonly Trade[]) => void
  ) => Promise<void>;
  readonly instruments: () => Promise<readonly PlayerInfo[]>;
  readonly makeOrder: (r: OrderRequest) => Promise<OrderResponse>;
  readonly cancelOrder: (r: CancelOrderRequest) => Promise<OrderResponse>;
}> => {
  const slug =
    env === 'production' ? '' : env === 'staging' ? 'staging.' : 'sb.';
  // grab the token from endx
  const response = await fetch(`https://auth.${slug}endx.gg/details`, {
    headers: { 'Api-Key': apiKey },
  });
  const data = (await response.json()) as Details;
  const ably = new Realtime({
    token: data.token,
    authCallback: (
      _: Types.TokenParams,
      callback: (
        error: Types.ErrorInfo | string | null,
        tokenRequestOrDetails:
          | Types.TokenDetails
          | Types.TokenRequest
          | string
          | null
      ) => void
    ) => {
      fetch(`https://auth.${slug}endx.gg/Details`, {
        headers: { 'Api-Key': apiKey },
      })
        .then((response) => response.json())
        .then((token) => callback(null, token))
        .catch((error) => callback(error, null));
    },
  });

  const subscribeToOrders = async (
    listener: (data: readonly Trade[]) => void
  ): Promise<void> => {
    const channel = ably.channels.get('[?rewind=1]orders:' + data.clientId);

    channel.subscribe((message: Types.Message) => {
      listener(message.data);
    });
  };

  const subscribeToPortfolio = async (
    listener: (data: Portfolio) => void
  ): Promise<void> => {
    const channel = ably.channels.get('[?rewind=1]portfolio:' + data.clientId);

    channel.subscribe((message: Types.Message) => {
      listener(message.data);
    });
  };

  const subscribeToOrderBook = async (
    id: string,
    listener: (data: OrderBook) => void
  ): Promise<void> => {
    const channel = ably.channels.get('[?rewind=1]orderbook:instrument-' + id);

    channel.subscribe((message: Types.Message) => {
      listener(message.data as OrderBook);
    });
  };

  const instruments = async (): Promise<readonly PlayerInfo[]> => {
    const response = await fetch(`https://auth.${slug}endx.gg/api/markets`);
    return response.json();
  };

  const makeOrder = async (r: OrderRequest): Promise<OrderResponse> => {
    const response = await fetch(`https://auth.${slug}endx.gg/order`, {
      method: 'POST',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    return response.json();
  };

  const cancelOrder = async (r: CancelOrderRequest): Promise<OrderResponse> => {
    const response = await fetch(`https://auth.${slug}endx.gg/cancelOrder`, {
      method: 'POST',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    return response.json();
  };

  return {
    subscribeToPortfolio,
    subscribeToOrderBook,
    subscribeToOrders,
    instruments,
    makeOrder,
    cancelOrder,
  };
};

export { createTradingClient };
