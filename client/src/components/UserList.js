import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import { Redirect } from "react-router";

const UserList = (props) => {
    const [list, setList] = useState([]);
    const [listLoaded, setListLoaded] = useState(false);

    const fetchUsers = () => {
        axios.get('http://localhost/react-1/server/public/api/users/get/'+props.limit, {
            withCredentials: true
        }).then((response) => {
            setList(response.data);
            setListLoaded(true);
        }).catch((response) => {
            if (response.status == 401) {
            }
        });
    }

    useEffect(() => {
        fetchUsers();
    }, [])
        


    return ( <ul className="noListStyle">{
            listLoaded ?
            list.map(user => {
                return <li key={user.userID}>{user.username}</li>
            })
            :
            <li className="fadeoutFast">Wait...</li>
        }
       
    </ul>);
}

export default UserList;