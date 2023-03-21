export { createTradingClient } from './lib/client';

// const f = async () => {
//   const endx = await createTradingClient(
//     'sandbox',
//     '21f7c1dea4e2a641f13b00f759fa8de5d26900469c46e16496f773032741491d'
//   );
//   // endx.subscribeToOrders((d) => {
//   //   console.log(d);
//   // });
//   // endx.subscribeToPortfolio((d) => {
//   //   console.log(d);
//   // });
//   endx.subscribeToOrderBook('25040', (d) => {
//     console.log(d);
//   });
//   console.log(await endx.instruments());
// };

// f();
