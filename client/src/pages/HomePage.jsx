import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getProducts = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:4001/products");
      const list = res?.data?.data ?? res?.data ?? [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Delete failed: " + (error?.message || "unknown error"));
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const placeholder = "https://via.placeholder.com/250/250";

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button onClick={() => navigate("/product/create")}>Create Product</button>
      </div>

      {isLoading && <h2>Loading ...</h2>}
      {isError && <h2>Request failed</h2>}

      {!isLoading && !isError && products.length === 0 && (
        <p>No products yet. Try creating one.</p>
      )}

      <div className="product-list">
        {products.map((product) => (
          <div className="product" key={product.id}>
            <div className="product-preview">
              <img
                src={product.image || placeholder}
                alt={product.name || "product image"}
                width="250"
                height="250"
              />
            </div>
            <div className="product-detail">
              <h2>Product name: {product.name}</h2>
              <h3>
                Product price:{" "}
                {typeof product.price === "number"
                  ? product.price.toLocaleString()
                  : product.price}
              </h3>
              <p>Product description: {product.description}</p>
              <div className="product-actions">
                <button onClick={() => navigate(`/product/view/${product.id}`)} className="view-button">View</button>
                <button onClick={() => navigate(`/product/edit/${product.id}`)} className="edit-button">Edit</button>
              </div>
            </div>
            <button onClick={() => deleteProduct(product.id)} className="delete-button" title="Delete" aria-label={`Delete ${product.name}`}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
