import { useState, useEffect } from "react";
import "./FiltersSidebar.css";

function FiltersSidebar({
	brands = [],
	categories = [],
	initialMinPrice = 0,
	initialMaxPrice = 0,
	filters,
	onChange,
}) {
	const [localMin, setLocalMin] = useState(filters.minPrice ?? initialMinPrice);
	const [localMax, setLocalMax] = useState(filters.maxPrice ?? initialMaxPrice);

	useEffect(() => {
		setLocalMin(filters.minPrice ?? initialMinPrice);
		setLocalMax(filters.maxPrice ?? initialMaxPrice);
	}, [filters.minPrice, filters.maxPrice, initialMinPrice, initialMaxPrice]);

	const handlePriceApply = () => {
		if (Number.isNaN(Number(localMin)) || Number.isNaN(Number(localMax))) return;
		onChange({ ...filters, minPrice: Number(localMin), maxPrice: Number(localMax) });
	};

	const toggleSetValue = (set, value) => {
		const next = new Set(set);
		if (next.has(value)) next.delete(value);
		else next.add(value);
		return next;
	};

	return (
		<aside className="filters-sidebar">
			<h3 className="filters-title">Filters</h3>

			<section className="filter-block">
				<h4>Price</h4>
				<div className="price-inputs">
					<input
						type="number"
						min={0}
						value={localMin}
						onChange={(e) => setLocalMin(e.target.value)}
						placeholder="Min"
					/>
					<span className="range-sep">-</span>
					<input
						type="number"
						min={0}
						value={localMax}
						onChange={(e) => setLocalMax(e.target.value)}
						placeholder="Max"
					/>
					<button className="apply-btn" onClick={handlePriceApply}>Go</button>
				</div>
				<input
					className="range"
					type="range"
					min={initialMinPrice}
					max={initialMaxPrice}
					value={Math.min(Number(localMax), Number(initialMaxPrice))}
					onChange={(e) => setLocalMax(Number(e.target.value))}
				/>
				<div className="range-values">
					<span>Rs. {initialMinPrice}</span>
					<span>Rs. {initialMaxPrice}</span>
				</div>
			</section>

			<section className="filter-block">
				<h4>Brand</h4>
				<div className="options-list">
					{brands.map((b) => (
						<label key={b} className="option-item">
							<input
								type="checkbox"
								checked={filters.brands?.has(b) || false}
								onChange={() => onChange({ ...filters, brands: toggleSetValue(filters.brands || new Set(), b) })}
							/>
							<span>{b}</span>
						</label>
					))}
				</div>
			</section>

			<section className="filter-block">
				<h4>Category</h4>
				<div className="options-list">
					{categories.map((c) => (
						<label key={c} className="option-item">
							<input
								type="checkbox"
								checked={filters.categories?.has(c) || false}
								onChange={() => onChange({ ...filters, categories: toggleSetValue(filters.categories || new Set(), c) })}
							/>
							<span>{c}</span>
						</label>
					))}
				</div>
			</section>

			<section className="filter-block">
				<h4>Ratings</h4>
				<div className="options-list">
					{[4, 3, 2, 1].map((r) => (
						<label key={r} className="option-item">
							<input
								type="radio"
								name="rating"
								checked={(filters.minRating || 0) === r}
								onChange={() => onChange({ ...filters, minRating: r })}
							/>
							<span>&amp; Up</span>
							<span className="stars">{"★".repeat(r)}{"☆".repeat(5 - r)}</span>
						</label>
					))}
				</div>
			</section>

			<button className="clear-btn" onClick={() => onChange({ minPrice: initialMinPrice, maxPrice: initialMaxPrice, brands: new Set(), categories: new Set(), minRating: 0 })}>
				Clear All
			</button>
		</aside>
	);
}

export default FiltersSidebar;


