import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NotFound from '../../components/notfound';

const List = () => {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [userToDelete, setUserToDelete] = useState('');

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
 
    toast.configure()

    useEffect(() => {
        Axios.get(`http://localhost:2000/users/get`)
        .then(res => {
            setUsers(res.data);
            console.log("Usuários carregados.")
        })
    },[])

    const chooseUserToDelete = (id) => {
        toggle();
        setUserToDelete(`${id}`)
    }

    const deleteUser = () => {
        Axios.post(`http://localhost:2000/users/delete/${userToDelete}`)
        .then(res => {
            window.location.reload();
            toggle();
        }).catch(() => {
            toast('Não foi possível excluir o usuário.')
        })
    }
    
    const userList = users.map((user) => (
        <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{moment(user.birthday).utc().format('DD/MM/YYYY')}</td>
            <td className="text-center">
                <Link onClick={()=>history.push(`/view/${user.id}`)}>
                    <i className="fa fa-eye mr-2" aria-hidden="true" alt="Visualizar" title="Visualizar"></i>
                </Link>
                <Link onClick={()=>history.push(`/edit/${user.id}`)}>
                    <i className="fa fa-pencil mr-2" aria-hidden="true" alt="Editar" title="Editar"></i>    
                </Link>
                 <Link onClick={()=>chooseUserToDelete(user.id)}>
                    <i className="fa fa-trash" aria-hidden="true" alt="Excluir" title="Excluir"></i>
                </Link>
            </td>
        </tr>
    ));

  return (
    <>
    <div className="user__form">
        <div>
            <Modal isOpen={modal} toggle={toggle} className="">
                <ModalHeader toggle={toggle}></ModalHeader>
                <ModalBody>
                    Deseja realmente excluir o usuário?
                </ModalBody>
                <ModalFooter>
                <Button color="info" onClick={deleteUser}>Sim</Button>{' '}
                <Button color="warning" onClick={toggle}>Não</Button>
                </ModalFooter>
            </Modal>
        </div>

        <div className="float-right">
        <Link to="/create" className="btn btn-info mr-4 mb-2">Novo usuário</Link>
        </div>
        <div className="row col-12">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Nascimento</th>
                        <th>Ações</th>
                    </tr>
                    {users != "" ? (userList) : <NotFound/>}
                </thead>
            </Table>
        </div>
        </div>
        </>
  );
}

export default List;