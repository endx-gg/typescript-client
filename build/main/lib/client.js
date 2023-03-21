"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable functional/no-return-void */
const ably_1 = require("ably");
const node_fetch_1 = __importDefault(require("node-fetch"));
const createTradingClient = async (env, apiKey) => {
    const slug = env === 'production' ? '' : env === 'staging' ? 'staging.' : 'sb.';
    // grab the token from endx
    const response = await (0, node_fetch_1.default)(`https://auth.${slug}endx.gg/details`, {
        headers: { 'Api-Key': apiKey },
    });
    const data = (await response.json());
    const ably = new ably_1.Realtime({
        token: data.token,
        authCallback: (_, callback) => {
            (0, node_fetch_1.default)(`https://auth.${slug}endx.gg/Details`, {
                headers: { 'Api-Key': apiKey },
            })
                .then((response) => response.json())
                .then((token) => callback(null, token))
                .catch((error) => callback(error, null));
        },
    });
    const subscribeToOrders = async (listener) => {
        const channel = ably.channels.get('[?rewind=1]orders:' + data.clientId);
        channel.subscribe((message) => {
            listener(message.data);
        });
    };
    const subscribeToPortfolio = async (listener) => {
        const channel = ably.channels.get('[?rewind=1]portfolio:' + data.clientId);
        channel.subscribe((message) => {
            listener(message.data);
        });
    };
    const subscribeToOrderBook = async (id, listener) => {
        const channel = ably.channels.get('[?rewind=1]orderbook:instrument-' + id);
        channel.subscribe((message) => {
            listener(message.data);
        });
    };
    const instruments = async () => {
        const response = await (0, node_fetch_1.default)(`https://auth.${slug}endx.gg/api/markets`);
        return response.json();
    };
    const makeOrder = async (r) => {
        const response = await (0, node_fetch_1.default)(`https://auth.${slug}endx.gg/order`, {
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
    };
};
exports.default = createTradingClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBOEM7QUFDOUMsK0JBQXVDO0FBQ3ZDLDREQUErQjtBQTJHL0IsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQy9CLEdBQXlDLEVBQ3pDLE1BQWMsRUFjYixFQUFFO0lBQ0gsTUFBTSxJQUFJLEdBQ1IsR0FBRyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNyRSwyQkFBMkI7SUFDM0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLG9CQUFLLEVBQUMsZ0JBQWdCLElBQUksaUJBQWlCLEVBQUU7UUFDbEUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtLQUMvQixDQUFDLENBQUM7SUFDSCxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFZLENBQUM7SUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFRLENBQUM7UUFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1FBQ2pCLFlBQVksRUFBRSxDQUNaLENBQW9CLEVBQ3BCLFFBT1MsRUFDVCxFQUFFO1lBQ0YsSUFBQSxvQkFBSyxFQUFDLGdCQUFnQixJQUFJLGlCQUFpQixFQUFFO2dCQUMzQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO2FBQy9CLENBQUM7aUJBQ0MsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ25DLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUM3QixRQUEwQyxFQUMzQixFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4RSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBc0IsRUFBRSxFQUFFO1lBQzNDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFRixNQUFNLG9CQUFvQixHQUFHLEtBQUssRUFDaEMsUUFBbUMsRUFDcEIsRUFBRTtRQUNqQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQXNCLEVBQUUsRUFBRTtZQUMzQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLEVBQ2hDLEVBQVUsRUFDVixRQUFtQyxFQUNwQixFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTNFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFzQixFQUFFLEVBQUU7WUFDM0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFpQixDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRyxLQUFLLElBQW9DLEVBQUU7UUFDN0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLG9CQUFLLEVBQUMsZ0JBQWdCLElBQUkscUJBQXFCLENBQUMsQ0FBQztRQUN4RSxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQUUsQ0FBZSxFQUEwQixFQUFFO1FBQ2xFLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxvQkFBSyxFQUFDLGdCQUFnQixJQUFJLGVBQWUsRUFBRTtZQUNoRSxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO1lBQ2xFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUN4QixDQUFDLENBQUM7UUFDSCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDLENBQUM7SUFFRixPQUFPO1FBQ0wsb0JBQW9CO1FBQ3BCLG9CQUFvQjtRQUNwQixpQkFBaUI7UUFDakIsV0FBVztRQUNYLFNBQVM7S0FDVixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsa0JBQWUsbUJBQW1CLENBQUMifQ==