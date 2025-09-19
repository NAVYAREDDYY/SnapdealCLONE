import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

const getAuth = () => {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return { token: null, id: null, role: null };
    const parsed = JSON.parse(raw);
    return { token: parsed.token, id: parsed.user?.id || parsed.user?._id || parsed.id, role: parsed.user?.role || parsed.role };
  } catch {
    return { token: null, id: null, role: null };
  }
};

export default function VendorDashboard() {
  const [{ token, id, role }, setAuth] = useState(getAuth());
  const [activeTab, setActiveTab] = useState("orders"); // orders | products
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState("desc"); // asc|desc
  const [search, setSearch] = useState("");

  // Product form/edit state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    stock: "",
    image: ""
  });

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadProducts = useCallback(async () => {
    // If admin, fetch all products via public products API; else vendor scope
    if (role === 'admin') {
      const res = await axios.get(`http://localhost:5000/products`, { headers });
      setProducts(Array.isArray(res.data) ? res.data : (res.data.products || []));
    } else {
      const pRes = await axios.get(`http://localhost:5000/api/vendor/${id}/products`, { headers });
      setProducts(pRes.data.products || []);
    }
  }, [headers, id, role]);

  const loadOrders = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (search) params.append('q', search);
    if (sortDir) params.append('sort', sortDir);
    if (role === 'admin') {
      // Admin: reuse vendor endpoint by passing own id, which is allowed; or optionally use admin route if exists
      const adminUrl = `http://localhost:5000/api/vendor/${id}/orders?${params.toString()}`;
      const oRes = await axios.get(adminUrl, { headers });
      setOrders(oRes.data.orders || []);
    } else {
      const url = `http://localhost:5000/api/vendor/${id}/orders?${params.toString()}`;
      const oRes = await axios.get(url, { headers });
      setOrders(oRes.data.orders || []);
    }
  }, [headers, id, statusFilter, search, sortDir, role]);

  useEffect(() => {
    if (!token || role !== 'vendor' || !id) return;
    setLoading(true);
    Promise.all([loadProducts(), loadOrders()])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, id, role, loadProducts, loadOrders]);

  const updateItemStatus = async (orderId, itemId, status) => {
    await axios.patch(`http://localhost:5000/api/vendor/orders/${orderId}/status`, { itemId, status }, { headers });
    await loadOrders();
  };

  const refreshAll = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadOrders()]);
    } finally { setLoading(false); }
  };

  if (!token || role !== 'vendor') return <div style={{ padding: 24 }}>Vendor login required.</div>;

  return (
    <div className="min-h-[80vh] flex">
      <aside className="w-60 border-r border-gray-200 p-4 bg-white">
        <button className="mb-4 px-3 py-2 rounded bg-red-600 text-white" onClick={()=>{
          localStorage.removeItem('currentUser');
          window.location.href = '/vendor';
        }}>Logout</button>
        <h3 className="text-xl font-semibold mb-4">Vendor Dashboard</h3>
        <nav className="flex flex-col gap-2">
          <button className={`px-3 py-2 rounded text-left ${activeTab==='orders'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setActiveTab('orders')}>Orders</button>
          <button className={`px-3 py-2 rounded text-left ${activeTab==='products'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setActiveTab('products')}>Products</button>
          <button className="px-3 py-2 rounded text-left bg-gray-50" onClick={refreshAll} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
        </nav>
      </aside>

      <main className="flex-1 p-4">
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Orders</h2>
              <div className="flex items-center gap-2">
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search order ID or customer" className="border rounded px-3 py-2 w-64" />
                <select value={sortDir} onChange={(e)=>setSortDir(e.target.value)} className="border rounded px-2 py-2">
                  <option value="desc">Latest</option>
                  <option value="asc">Oldest</option>
                </select>
                <button onClick={loadOrders} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
              </div>
            </div>

            <div className="flex gap-2">
              {['all','pending','processing','shipped','delivered','cancelled'].map(s => (
                <button key={s} onClick={()=>{setStatusFilter(s);}} className={`px-3 py-1 rounded-full border ${statusFilter===s?'bg-gray-900 text-white':'bg-white'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
              ))}
            </div>

            <div className="overflow-auto rounded border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Order ID</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Items</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length===0 && (
                    <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>No orders found.</td></tr>
                  )}
                  {orders.map(o => {
                    const orderTotal = (o.items||[]).reduce((sum,it)=>sum + (Number(it.price)||0)*(Number(it.quantity)||0), 0);
                    const shortId = String(o._id).slice(-8).toUpperCase();
                    return (
                      <tr key={o._id} className="border-t">
                        <td className="px-4 py-3 font-mono">{shortId}</td>
                        <td className="px-4 py-3">{o.userId?.name || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="space-y-2">
                            {(o.items||[]).map(it => (
                              <div key={it._id} className="flex items-center gap-3">
                                <img className="w-10 h-10 rounded object-cover" src={it.productId?.image || 'https://via.placeholder.com/48'} alt={it.name} />
                                <div className="flex-1">
                                  <div className="font-medium">{it.productId?.name || it.name}</div>
                                  <div className="text-xs text-gray-500">x{it.quantity} • ₹{it.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {(o.items||[]).map(it => (
                            <div key={it._id} className="mb-2">
                              <select value={it.itemStatus} onChange={(e)=>updateItemStatus(o._id, it._id, e.target.value)} className="border rounded px-2 py-1">
                                {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3 font-medium">₹{orderTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Products</h2>
              <div className="flex gap-2">
                <button onClick={()=>{setEditingProductId(null); setProductForm({ name:'', price:'', description:'', category:'', subcategory:'', stock:'', image:'' }); setShowProductForm(true);}} className="px-3 py-2 bg-gray-900 text-white rounded">Add Product</button>
                <button onClick={loadProducts} className="px-3 py-2 bg-gray-100 rounded border">Refresh</button>
              </div>
            </div>

            {showProductForm && (
              <div className="border rounded p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['name','price','category','subcategory','stock','image'].map(f => (
                    <div key={f} className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                      <input value={productForm[f]||''} onChange={(e)=>setProductForm(prev=>({...prev,[f]:e.target.value}))} type={(f==='price'||f==='stock')?'number':'text'} className="border rounded px-3 py-2" />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 mb-1">Description</label>
                    <textarea value={productForm.description} onChange={(e)=>setProductForm(prev=>({...prev, description:e.target.value}))} className="border rounded px-3 py-2 w-full" rows={3} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={async ()=>{
                    if (editingProductId) {
                      await axios.put(`http://localhost:5000/products/${editingProductId}`,{...productForm, subCategory: productForm.subcategory, price: Number(productForm.price), stock: Number(productForm.stock)}, { headers });
                    } else {
                      await axios.post(`http://localhost:5000/products/add`,{...productForm, subCategory: productForm.subcategory, price: Number(productForm.price), stock: Number(productForm.stock)}, { headers });
                    }
                    setShowProductForm(false);
                    await loadProducts();
                  }} className="px-3 py-2 bg-blue-600 text-white rounded">{editingProductId?'Update':'Create'}</button>
                  <button onClick={()=>setShowProductForm(false)} className="px-3 py-2 bg-gray-100 rounded border">Cancel</button>
                </div>
              </div>
            )}

            <div className="overflow-auto rounded border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Stock</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length===0 && (
                    <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>No products yet.</td></tr>
                  )}
                  {products.map(p => (
                    <tr key={p._id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img className="w-10 h-10 rounded object-cover" src={p.image || 'https://via.placeholder.com/48'} alt={p.name} />
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.subcategory || p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">₹{p.price}</td>
                      <td className="px-4 py-3">{typeof p.stock==='number'?p.stock:'-'}</td>
                      <td className="px-4 py-3">{p.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded border" onClick={()=>{setEditingProductId(p._id); setProductForm({ name:p.name||'', price:p.price||'', description:p.description||'', category:p.category||'', subcategory:p.subcategory||'', stock:p.stock||'', image:p.image||'' }); setShowProductForm(true);}}>Edit</button>
                          <button className="px-3 py-1 rounded border text-red-600" onClick={async ()=>{ await axios.delete(`http://localhost:5000/products/${p._id}`, { headers }); await loadProducts(); }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


