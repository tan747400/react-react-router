import { useState } from "react";
import axios from "axios";

function CreateProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const clean = type === "number" ? value.replace(/[^\d.]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: clean }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("กรุณากรอกชื่อสินค้า");
    if (formData.price === "" || Number.isNaN(Number(formData.price))) {
      return setError("กรุณากรอกราคาให้ถูกต้อง");
    }

    try {
      setSaving(true);
      await axios.post("http://localhost:4001/products", {
        name: formData.name.trim(),
        image: formData.image.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
      });
      onSuccess?.();
    } catch (e) {
      setError("สร้างสินค้าไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h1>Create Product Form</h1>

      {error && <div role="alert" style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      <div className="input-container">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" placeholder="Enter name here"
          value={formData.name} onChange={handleChange} required />
      </div>

      <div className="input-container">
        <label htmlFor="image">Image Url</label>
        <input id="image" name="image" type="text" placeholder="Enter image url here"
          value={formData.image} onChange={handleChange} />
      </div>

      <div className="input-container">
        <label htmlFor="price">Price</label>
        <input id="price" name="price" type="number" min="0" step="0.01"
          placeholder="Enter price here" value={formData.price} onChange={handleChange} required />
      </div>

      <div className="input-container">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" placeholder="Enter description here"
          value={formData.description} onChange={handleChange} rows={4} cols={30} />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Create"}</button>
      </div>
    </form>
  );
}

export default CreateProductForm;
