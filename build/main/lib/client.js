"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTradingClient = void 0;
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
    const cancelOrder = async (r) => {
        const response = await (0, node_fetch_1.default)(`https://auth.${slug}endx.gg/cancelOrder`, {
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
exports.createTradingClient = createTradingClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQThDO0FBQzlDLCtCQUF1QztBQUN2Qyw0REFBK0I7QUFnSC9CLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUMvQixHQUF5QyxFQUN6QyxNQUFjLEVBZWIsRUFBRTtJQUNILE1BQU0sSUFBSSxHQUNSLEdBQUcsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDckUsMkJBQTJCO0lBQzNCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxvQkFBSyxFQUFDLGdCQUFnQixJQUFJLGlCQUFpQixFQUFFO1FBQ2xFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBWSxDQUFDO0lBQ2hELE1BQU0sSUFBSSxHQUFHLElBQUksZUFBUSxDQUFDO1FBQ3hCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztRQUNqQixZQUFZLEVBQUUsQ0FDWixDQUFvQixFQUNwQixRQU9TLEVBQ1QsRUFBRTtZQUNGLElBQUEsb0JBQUssRUFBQyxnQkFBZ0IsSUFBSSxpQkFBaUIsRUFBRTtnQkFDM0MsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTthQUMvQixDQUFDO2lCQUNDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNuQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7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