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
    readonly orderType: OrderType;
    readonly side: Side;
    readonly instrument: string;
    readonly quantity: number;
    readonly price: number;
};
type OrderResponse = {
    readonly createdAt: Date;
    readonly mpOrderId: number;
    readonly userId: string;
    readonly orderType: OrderType;
    readonly side: Side;
    readonly instrument: string;
    readonly quantity: number;
    readonly price: number;
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
declare const createTradingClient: (env: 'staging' | 'production' | 'sandbox', apiKey: string) => Promise<{
    readonly subscribeToPortfolio: (listener: (data: Portfolio) => void) => Promise<void>;
    readonly subscribeToOrderBook: (id: string, listener: (data: OrderBook) => void) => Promise<void>;
    readonly subscribeToOrders: (listener: (data: readonly Trade[]) => void) => Promise<void>;
    readonly instruments: () => Promise<readonly PlayerInfo[]>;
    readonly makeOrder: (r: OrderRequest) => Promise<OrderResponse>;
}>;
export { createTradingClient };
