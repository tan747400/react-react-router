import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ViewProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function getProduct(id) {
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:4001/products/${id}`);
      const p = res?.data?.data ?? res?.data ?? null;
      setProduct(p);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (productId) getProduct(productId);
  }, [productId]);

  const placeholder = "https://via.placeholder.com/350/350";

  return (
    <div>
      <h1>View Product Page</h1>

      {isLoading && <h2>Loading...</h2>}
      {isError && <h2>Failed to load product.</h2>}

      {!isLoading && !isError && product && (
        <div className="view-product-container">
          <div className="product-preview">
            <img
              src={product.image || placeholder}
              alt={product.name || "product image"}
              width="350"
              height="350"
            />
          </div>
          <h2>{product.name}</h2>
          <h3>
            Price:{" "}
            {typeof product.price === "number"
              ? product.price.toLocaleString()
              : product.price}
          </h3>
          <p>{product.description}</p>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => navigate(`/product/edit/${product.id}`)}>Edit</button>
            <button onClick={() => navigate("/")}>Back to Home</button>
          </div>
        </div>
      )}

      {!isLoading && !isError && !product && <p>Product not found.</p>}
    </div>
  );
}

export default ViewProductPage;
