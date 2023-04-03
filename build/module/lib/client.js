/* eslint-disable functional/no-return-void */
import { Realtime } from 'ably';
import fetch from 'node-fetch';
const createTradingClient = async (env, apiKey) => {
    const slug = env === 'production' ? '' : env === 'staging' ? 'staging.' : 'sb.';
    // grab the token from endx
    const response = await fetch(`https://auth.${slug}endx.gg/details`, {
        headers: { 'Api-Key': apiKey },
    });
    const data = (await response.json());
    const ably = new Realtime({
        token: data.token,
        authCallback: (_, callback) => {
            fetch(`https://auth.${slug}endx.gg/Details`, {
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
        const response = await fetch(`https://auth.${slug}endx.gg/api/markets`);
        return response.json();
    };
    const makeOrder = async (r) => {
        const response = await fetch(`https://auth.${slug}endx.gg/order`, {
            method: 'POST',
            headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(r),
        });
        return response.json();
    };
    const cancelOrder = async (r) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOENBQThDO0FBQzlDLE9BQU8sRUFBRSxRQUFRLEVBQVMsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxLQUFLLE1BQU0sWUFBWSxDQUFDO0FBZ0gvQixNQUFNLG1CQUFtQixHQUFHLEtBQUssRUFDL0IsR0FBeUMsRUFDekMsTUFBYyxFQWViLEVBQUU7SUFDSCxNQUFNLElBQUksR0FDUixHQUFHLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3JFLDJCQUEyQjtJQUMzQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxpQkFBaUIsRUFBRTtRQUNsRSxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0tBQy9CLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQVksQ0FBQztJQUNoRCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7UUFDakIsWUFBWSxFQUFFLENBQ1osQ0FBb0IsRUFDcEIsUUFPUyxFQUNULEVBQUU7WUFDRixLQUFLLENBQUMsZ0JBQWdCLElBQUksaUJBQWlCLEVBQUU7Z0JBQzNDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7YUFDL0IsQ0FBQztpQkFDQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbkMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENB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