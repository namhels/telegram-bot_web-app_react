import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Jeans', price: 5000, description: 'Blue, straight'},
    {id: '2', title: 'Jacket', price: 11800, description: 'Green color, warm'},
    {id: '3', title: 'Underpants', price: 1500, description: 'Black, stretch '},
    {id: '4', title: 'Hoodie with hood', price: 12200, description: 'Grey color, warm'},
    {id: '5', title: 'Cap', price: 3000, description: 'brown, warm'},
    {id: '6', title: 'Golf', price: 6000, description: 'Grey color, warm, stretch'},
    {id: '7', title: 'Trousers', price: 5500, description: 'Brown, stretch'},
    {id: '8', title: 'T-shirt', price: 4000, description: 'White color, tight'},
    {id: '9', title: 'Shorts', price: 3200, description: 'Black color, stretch'},
    {id: '10', title: 'Sneakers', price: 8200, description: 'Black color, soft'},
    {id: '11', title: 'Overalls', price: 12800, description: 'Blue color, functional and comfortable'},
    {id: '12', title: 'Thermal underwear', price: 10800, description: 'Black color,warm'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems, queryId])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData, tg])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;