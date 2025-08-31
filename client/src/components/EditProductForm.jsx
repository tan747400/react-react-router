import { useEffect, useState } from "react";
import axios from "axios";

function EditProductForm({ productId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`http://localhost:4001/products/${productId}`);
        const p = res?.data?.data ?? res?.data ?? {};
        if (!ignore) {
          setFormData({
            name: p.name ?? "",
            image: p.image ?? "",
            price: p.price !== undefined && p.price !== null ? String(p.price) : "",
            description: p.description ?? "",
          });
        }
      } catch (e) {
        if (!ignore) setError("โหลดข้อมูลสินค้าล้มเหลว");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (productId) fetchProduct();
    return () => { ignore = true; };
  }, [productId]);

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
      await axios.put(`http://localhost:4001/products/${productId}`, {
        name: formData.name.trim(),
        image: formData.image.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
      });
      onSuccess?.();
    } catch (e) {
      setError("บันทึกการแก้ไขไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h1>Edit Product Form</h1>

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

      <div className="form-actions" style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Update"}</button>
        {onCancel && <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>}
      </div>
    </form>
  );
}

export default EditProductForm;
