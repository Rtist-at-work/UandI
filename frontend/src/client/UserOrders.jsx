// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000'); // Make sure this matches your backend URL

// const UserOrders = ({ orderId }) => {
//   const [order, setOrder] = useState(null);
//   const [orderStatus, setOrderStatus] = useState('Fetching order status...');
  
//   // Fetch the order details when the component mounts
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const response = await axios.get(`/api/orders/${orderId}`);
//         setOrder(response.data);
//         setOrderStatus(response.data.status); // Initial order status
//       } catch (error) {
//         console.error('Error fetching order details:', error);
//         setOrderStatus('Failed to fetch order details');
//       }
//     };

//     fetchOrderDetails();
//   }, [orderId]);

//   // WebSocket connection for real-time updates
//   useEffect(() => {
//     // Listen for real-time updates from the server
//     socket.on(`order-status-${orderId}`, (data) => {
//       setOrderStatus(data.status);
//     });

//     // Cleanup the WebSocket connection when the component unmounts
//     return () => socket.disconnect();
//   }, [orderId]);

//   // UI for order details and status tracking
//   return (
//     <div className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold mb-4">Order Tracking for Order #{orderId}</h2>

//       {/* Order Details */}
//       <div className="mb-6">
//         {order ? (
//           <>
//             <div className="mb-2">
//               <span className="font-semibold">Order Date: </span>
//               {new Date(order.orderDate).toLocaleDateString()}
//             </div>
//             <div className="mb-2">
//               <span className="font-semibold">Total Amount: </span>
//               ₹{order.totalAmount}
//             </div>
//             <div className="mb-2">
//               <span className="font-semibold">Shipping Address: </span>
//               {order.shippingAddress}
//             </div>
//           </>
//         ) : (
//           <p>Loading order details...</p>
//         )}
//       </div>

//       {/* Order Status */}
//       <div className="mb-4 p-4 bg-gray-100 rounded-lg">
//         <h3 className="text-xl font-semibold mb-2">Order Status</h3>
//         <p className="text-lg">
//           <span className={`font-semibold ${orderStatus === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
//             {orderStatus}
//           </span>
//         </p>
//       </div>

//       {/* Order Items */}
//       {order ? (
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Items in Your Order</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {order.items.map((item) => (
//               <div key={item._id} className="p-4 border rounded-lg shadow-sm">
//                 <div className="mb-2">
//                   <span className="font-semibold">Product: </span>
//                   {item.productName}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-semibold">Quantity: </span>
//                   {item.quantity}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-semibold">Price: </span>
//                   ₹{item.price}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p>Loading items...</p>
//       )}
//     </div>
//   );
// };

// export default UserOrders;

