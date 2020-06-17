import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
	id: string;
	title: string;
	image_url: string;
	price: number;
	quantity: number;
}

interface CartContext {
	products: Product[];
	addToCart(item: Omit<Product, 'quantity'>): void;
	increment(id: string): void;
	decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		AsyncStorage.getItem('@GoMarketplace-products').then(storedProducts => {
			if (storedProducts) {
				setProducts(JSON.parse(storedProducts));
			}
		});
	}, []);

	const addToCart = useCallback(
		async product => {
			// console.log(products);
			setProducts([...products, product]);
		},
		[products],
	);

	const increment = useCallback(
		async id => {
			const product = products.find(prod => prod.id === id);
			if (product) {
				product.quantity += 1;
				setProducts([...products.filter(prod => prod.id !== id), product]);
			}
		},
		[products],
	);

	const decrement = useCallback(
		async id => {
			const product = products.find(prod => prod.id === id);
			if (product) {
				product.quantity -= 1;
				if (product.quantity === 0) {
					setProducts([...products.filter(prod => prod.id !== id)]);
				} else {
					setProducts([...products.filter(prod => prod.id !== id), product]);
				}
			}
		},
		[products],
	);

	const value = React.useMemo(() => ({ addToCart, increment, decrement, products }), [
		products,
		addToCart,
		increment,
		decrement,
	]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
	const context = useContext(CartContext);

	if (!context) {
		throw new Error(`useCart must be used within a CartProvider`);
	}

	return context;
}

export { CartProvider, useCart };
