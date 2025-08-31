import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default NotFoundPage;
