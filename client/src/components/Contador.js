import React, { useState, Fragment } from 'react';

const Contador = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count+1);
    }

    return ( <Fragment>
        <h3>Contador: {count}</h3>
        <button onClick={increment}>Increment</button>
    </Fragment> );
}
 
export default Contador;