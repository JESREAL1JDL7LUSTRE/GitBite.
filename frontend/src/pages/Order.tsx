import { useEffect, useState } from "react";
import api from "../api/api";

interface OrderItem {
  id: number;
  name: string;
  description: string;
  recipes: number;
  category: string;
  available: boolean;
  image?: string; // Optional
}

const Order = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]); // Correctly typed state

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    try {
      const res = await api.get<OrderItem[]>("/api/order/"); // Ensure correct response type
      setOrders(res.data);
      console.log(res.data);
    } catch (err) {
      alert("Failed to fetch orders");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Order List</h2>
      <ul>
        {orders.length > 0 ? (
          orders.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Recipes: {item.recipes}</p>
              <p>Category: {item.category}</p>
              <p>Available: {item.available ? "Yes" : "No"}</p>
              {item.image && <img src={item.image} alt={item.name} width="100" />}
            </li>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </ul>
    </div>
  );
};

export default Order;
