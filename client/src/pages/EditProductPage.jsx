import { useNavigate, useParams } from "react-router-dom";
import EditProductForm from "../components/EditProductForm";

function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  return (
    <div>
      <h1>Edit Product Page</h1>
      <EditProductForm
        productId={productId}
        onSuccess={() => navigate(`/product/view/${productId}`)}
        onCancel={() => navigate(-1)}
      />
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default EditProductPage;
