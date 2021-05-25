import axios from "axios";
import { Fragment, useState } from "react";
import UserList from "../components/UserList";

const ProductRow = () => {
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        quantity: 0,
        tax: 0,
        total: 0
    });

    const handleChange = event => {
        const {name, value} = event.target;

        if (name === 'price' || name === 'quantity') {
            setProduct(prevProduct => ({
                ...prevProduct, 
                ['total']: value * (name === 'price' ? product.quantity : product.price),
                [name]: value,
            }));
        } else {
            setProduct(prevProduct => ({
                ...prevProduct, 
                [name]: value,
            }));
        }

    };
    const func = async () => {
       

        return {

        }
    };

    return ( <Fragment>
        <h1>{product.name}</h1>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td scope="row">
                        <input type="text" name="name" onChange={handleChange} />
                    </td>
                    <td>
                        <input type="number" name="price" min="0" onChange={handleChange} />
                    </td>
                    <td>
                        <input type="number" name="quantity" min="0" onChange={handleChange} />
                    </td>
                    <td>
                        <input type="number" min="0" readOnly={true} value={product.total}/>
                    </td>
                </tr>
            </tbody>
        </table>
    
    </Fragment> );
}
 
export default ProductRow;