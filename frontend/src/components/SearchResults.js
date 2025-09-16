import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./SearchResults.css";
import FiltersSidebar from "./FiltersSidebar";

function SearchResults() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 0, brands: new Set(), categories: new Set(), minRating: 0 });
    const location = useLocation();
    const navigate = useNavigate();
    const searchQuery = new URLSearchParams(location.search).get('q');
    const [allBrands, setAllBrands] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const priceOk = (Number(p.price) || 0) >= (filters.minPrice || 0) && (Number(p.price) || 0) <= (filters.maxPrice || Infinity);
            const brandOk = (filters.brands?.size || 0) === 0 || filters.brands.has(p.brand);
            const categoryOk = (filters.categories?.size || 0) === 0 || filters.categories.has(p.category);
            const rating = Number(p.rating) || Number(p.ratingsAverage) || 0;
            const ratingOk = (filters.minRating || 0) === 0 || rating >= filters.minRating;
            return priceOk && brandOk && categoryOk && ratingOk;
        });
    }, [products, filters]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery) return;
            setLoading(true);
            setError(null);

            try {
                // First try searching by name
                const response = await axios.get(`http://localhost:5000/products?search=${encodeURIComponent(searchQuery)}`);
                const items = response.data || [];
                setProducts(items);
                if (items.length) {
                    const prices = items.map(p => Number(p.price) || 0);
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    setPriceBounds({ min, max });
                    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max }));
                    const brandSet = Array.from(new Set(items.map(p => p.brand).filter(Boolean)));
                    setAllBrands(brandSet);
                    const catSet = Array.from(new Set(items.map(p => p.category).filter(Boolean)));
                    setAllCategories(catSet);
                } else {
                    setPriceBounds({ min: 0, max: 0 });
                    setAllBrands([]);
                    setAllCategories([]);
                    setFilters({ minPrice: 0, maxPrice: 0, brands: new Set(), categories: new Set(), minRating: 0 });
                }
            } catch (err) {
                console.error('Error searching products:', err);
                setError('Failed to fetch search results. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]);

    if (!searchQuery) {
        return <div className="search-results-container">Please enter a search term</div>;
    }

    if (loading) {
        return (
            <div className="search-results-container">
                <div className="loading">Searching products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-results-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="search-results-container">
            <h2>Search Results for "{searchQuery}"</h2>

            {products.length === 0 ? (
                <div className="no-results">
                    <h3>No products found</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            ) : (
                <div className="results-layout">
                    <FiltersSidebar
                        brands={allBrands}
                        categories={allCategories}
                        initialMinPrice={priceBounds.min}
                        initialMaxPrice={priceBounds.max}
                        filters={filters}
                        onChange={setFilters}
                    />
                    <div className="search-results-grid">
                    {filteredProducts.map(product => (
                        <div 
                            key={product._id} 
                            className="product-card"
                            onClick={() => navigate(`/product/${product._id}`)}
                            role="button"
                            tabIndex="0"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/product/${product._id}`);
                                }
                            }}
                        >
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="product-image"
                            />
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                <p className="product-price">₹{product.price}</p>
                                {product.originalPrice && (
                                    <p className="product-original-price">
                                        <span>₹{product.originalPrice}</span>
                                        <span className="discount">
                                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </p>
                                )}
                                {product.stock > 0 ? (
                                    <span className="in-stock">In Stock</span>
                                ) : (
                                    <span className="out-of-stock">Out of Stock</span>
                                )}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchResults;