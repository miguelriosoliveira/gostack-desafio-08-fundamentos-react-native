import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import FloatingCart from '../../components/FloatingCart';
import { useCart } from '../../hooks/cart';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
	Container,
	ProductContainer,
	ProductImage,
	ProductList,
	Product,
	ProductTitle,
	PriceContainer,
	ProductPrice,
	ProductButton,
} from './styles';

interface Product {
	id: string;
	title: string;
	image_url: string;
	price: number;
}

const Dashboard: React.FC = () => {
	const { addToCart } = useCart();

	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		api.get('products').then(response => setProducts(response.data));
	}, []);

	function handleAddToCart(item: Product): void {
		addToCart(item);
	}

	return (
		<Container>
			<ProductContainer>
				<ProductList
					data={products}
					keyExtractor={item => item.id}
					ListFooterComponent={<View />}
					ListFooterComponentStyle={{ height: 80 }}
					renderItem={({ item }) => (
						<Product>
							<ProductImage source={{ uri: item.image_url }} />
							<ProductTitle>{item.title}</ProductTitle>
							<PriceContainer>
								<ProductPrice>{formatValue(item.price)}</ProductPrice>
								<ProductButton
									testID={`add-to-cart-${item.id}`}
									onPress={() => handleAddToCart(item)}
								>
									<FeatherIcon size={20} name="plus" color="#C4C4C4" />
								</ProductButton>
							</PriceContainer>
						</Product>
					)}
				/>
			</ProductContainer>
			<FloatingCart />
		</Container>
	);
};

export default Dashboard;
